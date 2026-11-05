from __future__ import annotations

from dataclasses import dataclass
import hashlib
import html
import re
from typing import Any

_EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_SPACE_RE = re.compile(r"[\t\f\v ]+")
_BLANK_LINES_RE = re.compile(r"\n{3,}")


def value_to_text(value: Any) -> str:
    """Flatten plain text, Jira rich-text objects, and arrays without losing code text."""
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, (int, float, bool)):
        return str(value)
    if isinstance(value, list):
        return "\n".join(filter(None, (value_to_text(item) for item in value)))
    if isinstance(value, dict):
        if isinstance(value.get("text"), str):
            return value["text"]
        return "\n".join(filter(None, (value_to_text(item) for item in value.values())))
    return ""


def clean_text(raw: str, *, redact_emails: bool = True) -> str:
    text = html.unescape(raw.replace("\x00", " "))
    text = _HTML_TAG_RE.sub(" ", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = "\n".join(_SPACE_RE.sub(" ", line).strip() for line in text.split("\n"))
    text = _BLANK_LINES_RE.sub("\n\n", text).strip()
    if redact_emails:
        text = _EMAIL_RE.sub("[redacted email]", text)
    return text


def content_hash(summary: str, description: str) -> str:
    payload = f"{summary}\n\n{description}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


@dataclass(frozen=True)
class DefectChunk:
    index: int
    section: str
    text: str


def chunk_defect(summary: str, description: str, *, max_chars: int = 1200, overlap: int = 180) -> list[DefectChunk]:
    """Keep each summary intact and split long descriptions with a bounded overlap."""
    title = clean_text(summary)
    body = clean_text(description)
    chunks: list[DefectChunk] = []
    if title:
        chunks.append(DefectChunk(len(chunks), "summary", f"Summary: {title}"))
    if body:
        start = 0
        while start < len(body):
            end = min(start + max_chars, len(body))
            if end < len(body):
                boundary = body.rfind("\n", start + max_chars // 2, end)
                if boundary > start:
                    end = boundary
            excerpt = body[start:end].strip()
            if excerpt:
                text = f"Summary: {title}\nDescription: {excerpt}" if title else excerpt
                chunks.append(DefectChunk(len(chunks), "description", text))
            if end >= len(body):
                break
            start = max(start + 1, end - overlap)
    return chunks
