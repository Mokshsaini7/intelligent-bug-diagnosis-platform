import tempfile

import pytest
from fastapi import HTTPException

from starlette.datastructures import Headers, UploadFile as StarletteUploadFile

from bugdiag.main import submit


class EmptyIndex:
    def __init__(self):
        self.queries = []

    def search(self, vector, top_k):
        self.queries.append((vector, top_k))
        return []


class FixedEmbedder:
    def embed(self, texts):
        return [[0.0] * 384 for _ in texts]


class RequestStub:
    def __init__(self, *, content_type, json_data=None, form_data=None, body=b""):
        self.headers = {"content-type": content_type, "content-length": str(len(body))}
        self._json_data = json_data
        self._form_data = form_data or {}
        self._body = body

    async def json(self):
        return self._json_data

    async def form(self):
        return self._form_data

    async def body(self):
        return self._body


def call_route(coroutine):
    """Run this handler's immediate async steps without opening a restricted local socket."""
    try:
        return coroutine.send(None)
    except StopIteration as completed:
        return completed.value


def upload(filename, content):
    file = tempfile.SpooledTemporaryFile(max_size=1024 * 1024)
    file.write(content)
    file.seek(0)
    return StarletteUploadFile(filename=filename, file=file, headers=Headers({"content-type": "text/plain"}))


def test_direct_text_handoff_reports_empty_index_without_fake_matches(monkeypatch):
    empty_index = EmptyIndex()
    monkeypatch.setattr("bugdiag.main.get_embedder", lambda: FixedEmbedder())
    monkeypatch.setattr("bugdiag.main._database", lambda: empty_index)
    response = call_route(submit(RequestStub(
        content_type="application/json",
        json_data={"title": "Export crash", "description": "Null pointer during export"},
    )))

    assert response["results"] == []
    assert response["indexed_matches"] == 0
    assert "not a probability" in response["metric_note"]
    assert len(empty_index.queries) == 2


def test_supported_file_upload_reaches_retrieval(monkeypatch):
    empty_index = EmptyIndex()
    monkeypatch.setattr("bugdiag.main.get_embedder", lambda: FixedEmbedder())
    monkeypatch.setattr("bugdiag.main._database", lambda: empty_index)
    response = call_route(submit(RequestStub(
        content_type="multipart/form-data; boundary=unit-test",
        form_data={"title": "Log report", "file": upload("stack.log", b"RuntimeError: export failed")},
    )))

    assert response["query_source"] == "uploaded file"
    assert response["results"] == []


def test_upload_rejects_binary_pdf(monkeypatch):
    monkeypatch.setattr("bugdiag.main.get_embedder", lambda: FixedEmbedder())
    monkeypatch.setattr("bugdiag.main._database", lambda: EmptyIndex())
    with pytest.raises(HTTPException) as error:
        call_route(submit(RequestStub(
            content_type="multipart/form-data; boundary=unit-test",
            form_data={"file": upload("report.pdf", b"%PDF")},
        )))
    assert error.value.status_code == 415
