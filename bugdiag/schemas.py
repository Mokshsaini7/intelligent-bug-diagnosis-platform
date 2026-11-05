from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class HistoricalMatch(BaseModel):
    source: Literal["mozilla", "apache", "eclipse"]
    external_id: str
    source_url: str
    summary: str
    product: str | None = None
    component: str | None = None
    status: str | None = None
    resolution: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    license_status: str
    cosine_similarity: float
    matched_excerpt: str


class SubmissionResponse(BaseModel):
    query_title: str
    query_source: Literal["uploaded file", "text input"]
    match_metric: Literal["cosine similarity"]
    metric_note: str
    indexed_matches: int
    results: list[HistoricalMatch]
