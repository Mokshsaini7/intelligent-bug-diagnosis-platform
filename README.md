# Bug Diagnosis Platform — Milestone 1

Milestone 1 provides bug report intake, historical defect ingestion, embedding/indexing and source-linked semantic retrieval. It does not generate patches, edit repositories or run autonomous debugging.

## Run locally

Requirements: Python 3.11+, PostgreSQL 15+ with pgvector, and network access on first model load. Docker Compose is included as an optional local database shortcut.

```powershell
Copy-Item .env.example .env
docker compose up -d db
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e .
python -m bugdiag.db_cli init
python -m bugdiag.ingest --sources mozilla,apache,eclipse --limit 100
uvicorn bugdiag.main:app --reload
```

Open http://127.0.0.1:8000. The first embedding request downloads `sentence-transformers/all-MiniLM-L6-v2` unless it is already cached. Model name and database URL can be changed in `.env`.

The ingestion command fetches real, publicly visible tracker records. It may take time, can be rate limited, and can fail if a source changes its API. It does not load a bundled sample dataset. The UI reports an empty result set when no matching historical records have been indexed.

## Project map

- `bugdiag/`: API, cleaning/chunking, embedding, retrieval and source adapters
- `db/schema.sql`: PostgreSQL/pgvector tables and index
- `frontend/`: same-origin browser client served by FastAPI
- `docs/`: research notes, architecture, data provenance/licensing, API reference and progress
- `tests/`: module tests that mock infrastructure; no sample defects are shipped as history

## Dataset and licensing note

This project queries public Mozilla Bugzilla, Apache Jira and Eclipse Bugzilla records at ingestion time. Public visibility is not treated as a blanket license to redistribute issue text. Source links and a conservative license-status field are retained; see [dataset provenance and licensing](docs/datasets.md) before using or redistributing indexed text. Eclipse's separate Scava dataset is CC BY-SA 4.0; that license does not automatically attach to records fetched from a different endpoint.

## Configuration

See `.env.example`. The application can serve its frontend while PostgreSQL or the embedding model is unavailable; API operations needing either dependency return a clear `503` rather than invented matches.
