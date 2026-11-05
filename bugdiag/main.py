from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.datastructures import UploadFile as StarletteUploadFile

from bugdiag.cleaning import clean_text, value_to_text
from bugdiag.config import settings
from bugdiag.db import Database, database
from bugdiag.embeddings import EmbeddingUnavailable, get_embedder
from bugdiag.schemas import SubmissionResponse
from bugdiag.retrieval import query_chunks, retrieve_similar

BASE_DIR = Path(__file__).resolve().parent.parent
ALLOWED_EXTENSIONS = {".txt", ".log", ".md", ".json", ".xml", ".out", ".err", ".trace"}

app = FastAPI(
    title="Bug Diagnosis Platform API",
    version="0.1.0",
    description="Milestone 1 bug report intake and source-linked semantic retrieval over public historical defect records.",
)
app.mount("/static", StaticFiles(directory=BASE_DIR / "frontend"), name="static")


def _database() -> Database:
    return database


@app.get("/", include_in_schema=False)
def home() -> FileResponse:
    return FileResponse(BASE_DIR / "frontend" / "index.html")


@app.get("/docs/datasets.md", include_in_schema=False)
def dataset_notes() -> FileResponse:
    return FileResponse(BASE_DIR / "docs" / "datasets.md", media_type="text/markdown")


@app.get("/api/health", tags=["system"])
def health() -> dict[str, Any]:
    try:
        db_info = _database().health()
        db_ok = bool(db_info.get("pgvector_version"))
        return {
            "status": "ready" if db_ok else "degraded",
            "database": db_info,
            "embedding_model": settings.embedding_model,
            "embedding_dimensions": settings.embedding_dimensions,
            "note": None if db_ok else "pgvector extension is not installed; run the database initialization command.",
        }
    except Exception as exc:
        return {
            "status": "degraded",
            "database": None,
            "embedding_model": settings.embedding_model,
            "embedding_dimensions": settings.embedding_dimensions,
            "note": f"Database unavailable: {type(exc).__name__}",
        }


@app.get("/api/stats", tags=["history"])
def stats() -> dict[str, Any]:
    try:
        return {**_database().stats(), "sources": _database().source_counts()}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Historical index unavailable: {type(exc).__name__}") from exc


@app.post(
    "/api/submit",
    tags=["submission"],
    summary="Submit text or an uploaded bug report for similar-issue retrieval",
    response_model=SubmissionResponse,
    openapi_extra={
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "maxLength": 200},
                            "description": {"type": "string", "description": "Bug report, stack trace or error log text"},
                        },
                        "required": ["description"],
                    }
                },
                "multipart/form-data": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "file": {"type": "string", "format": "binary"},
                        },
                    }
                },
                "text/plain": {"schema": {"type": "string"}},
            },
        }
    },
)
async def submit(request: Request) -> dict[str, Any]:
    # Multipart framing adds a small envelope around a payload capped at 1 MiB.
    if int(request.headers.get("content-length", "0") or "0") > settings.max_upload_bytes + 32768:
        raise HTTPException(status_code=413, detail=f"Submission exceeds {settings.max_upload_bytes} byte content limit")

    title = ""
    raw_text = ""
    filename: str | None = None
    content_type = request.headers.get("content-type", "")
    try:
        if "application/json" in content_type:
            payload = await request.json()
            if not isinstance(payload, dict):
                raise HTTPException(status_code=400, detail="JSON submission must be an object")
            title = value_to_text(payload.get("title"))
            raw_text = value_to_text(payload.get("description") or payload.get("text") or payload.get("report"))
        elif content_type.startswith("text/"):
            raw_text = (await request.body()).decode("utf-8")
        else:
            form = await request.form()
            title = value_to_text(form.get("title"))
            raw_text = value_to_text(form.get("description") or form.get("bug_text"))
            uploaded = form.get("file")
            if isinstance(uploaded, StarletteUploadFile):
                filename = Path(uploaded.filename or "upload.txt").name
                suffix = Path(filename).suffix.lower()
                if suffix not in ALLOWED_EXTENSIONS:
                    raise HTTPException(status_code=415, detail=f"Unsupported file type '{suffix or 'unknown'}'")
                content = await uploaded.read(settings.max_upload_bytes + 1)
                if len(content) > settings.max_upload_bytes:
                    raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_bytes} byte limit")
                try:
                    decoded = content.decode("utf-8-sig")
                except UnicodeDecodeError as exc:
                    raise HTTPException(status_code=400, detail="Upload must be UTF-8 text") from exc
                if suffix == ".json":
                    try:
                        decoded = value_to_text(json.loads(decoded))
                    except json.JSONDecodeError:
                        pass
                raw_text = "\n\n".join(part for part in (raw_text, decoded) if part)
                title = title or filename
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not read submission payload") from exc

    description = clean_text(raw_text)
    title = clean_text(title) or "Submitted bug report"
    if len(title) > 200:
        raise HTTPException(status_code=422, detail="Issue title must be 200 characters or fewer")
    if not description:
        raise HTTPException(status_code=422, detail="Enter bug details or attach a supported text file")
    if len(description.encode("utf-8")) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail=f"Submission exceeds {settings.max_upload_bytes} byte limit")

    chunks = query_chunks(title, description)
    try:
        vectors = get_embedder().embed([chunk.text for chunk in chunks])
    except EmbeddingUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Embedding service unavailable: {type(exc).__name__}") from exc
    try:
        matches = retrieve_similar(_database(), vectors, settings.search_top_k)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Historical index unavailable: {type(exc).__name__}") from exc

    return {
        "query_title": title,
        "query_source": "uploaded file" if filename else "text input",
        "match_metric": "cosine similarity",
        "metric_note": "Similarity is a ranking signal, not a probability or a claim that issues are duplicates.",
        "indexed_matches": len(matches),
        "results": matches,
    }


@app.get("/api/sources", tags=["history"])
def sources() -> dict[str, Any]:
    try:
        return {"sources": _database().source_counts()}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Historical index unavailable: {type(exc).__name__}") from exc
