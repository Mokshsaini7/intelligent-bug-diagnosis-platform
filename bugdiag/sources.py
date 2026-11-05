from __future__ import annotations

from dataclasses import dataclass
import json
import time
from typing import Any, Iterator
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from bugdiag.cleaning import clean_text, value_to_text
from bugdiag.config import settings

_USER_AGENT = "BugDiagnosisPlatform/0.1 (Milestone 1 public defect indexing; respectful paginated client)"


class SourceError(RuntimeError):
    pass


@dataclass(frozen=True)
class SourceSpec:
    key: str
    dataset_name: str
    license_status: str


MOZILLA = SourceSpec("mozilla", "Mozilla Bugzilla public resolved/closed issues", "Public tracker record; issue-text license not verified per item")
APACHE = SourceSpec("apache", "Apache Jira resolved issues (Lucene, Hadoop, Spark by default)", "Public tracker record; project issue-text license not verified per item")
ECLIPSE = SourceSpec("eclipse", "Eclipse Bugzilla public resolved/closed issues", "Public tracker record; issue-text license not verified per item")


def _get_json(url: str, params: dict[str, Any]) -> dict[str, Any]:
    query = urlencode(params, doseq=True)
    request = Request(f"{url}?{query}", headers={"Accept": "application/json", "User-Agent": _USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            with urlopen(request, timeout=30) as response:
                if response.status >= 400:
                    raise SourceError(f"Source returned HTTP {response.status}")
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            last_error = exc
            if exc.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise SourceError(f"Source returned HTTP {exc.code}: {url.split('/')[2]}") from exc
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt == 2:
                break
        time.sleep(1 + attempt)
    raise SourceError(f"Could not read JSON from {url.split('/')[2]}: {last_error}")


def _bugzilla_records(spec: SourceSpec, base_url: str, limit: int) -> Iterator[dict[str, Any]]:
    offset = 0
    fields = "id,summary,description,status,resolution,product,component,creation_time,last_change_time"
    while offset < limit:
        page_size = min(200, limit - offset)
        payload = _get_json(
            f"{base_url.rstrip('/')}/rest/bug",
            {
                "bug_status": ["RESOLVED", "CLOSED"],
                "limit": page_size,
                "offset": offset,
                "include_fields": fields,
            },
        )
        bugs = payload.get("bugs", [])
        if not bugs:
            return
        for bug in bugs:
            issue_id = str(bug.get("id", "")).strip()
            summary = clean_text(value_to_text(bug.get("summary")))
            description = clean_text(value_to_text(bug.get("description")))
            if not issue_id or not summary:
                continue
            if spec.key == "mozilla":
                issue_url = f"https://bugzilla.mozilla.org/show_bug.cgi?id={issue_id}"
            else:
                issue_url = f"https://bugs.eclipse.org/bugs/show_bug.cgi?id={issue_id}"
            yield {
                "source": spec.key,
                "external_id": issue_id,
                "source_url": issue_url,
                "summary": summary,
                "description": description,
                "product": bug.get("product"),
                "component": bug.get("component"),
                "status": bug.get("status"),
                "resolution": bug.get("resolution"),
                "created_at": bug.get("creation_time"),
                "updated_at": bug.get("last_change_time"),
                "dataset_name": spec.dataset_name,
                "license_status": spec.license_status,
            }
        offset += len(bugs)
        if len(bugs) < page_size:
            return


def _apache_records(limit: int) -> Iterator[dict[str, Any]]:
    offset = 0
    while offset < limit:
        page_size = min(100, limit - offset)
        payload = _get_json(
            f"{settings.apache_jira_url.rstrip('/')}/rest/api/2/search",
            {
                "jql": settings.apache_jira_jql,
                "startAt": offset,
                "maxResults": page_size,
                "fields": "summary,description,status,resolution,project,components,created,updated",
            },
        )
        issues = payload.get("issues", [])
        if not issues:
            return
        for issue in issues:
            fields = issue.get("fields", {})
            key = str(issue.get("key", "")).strip()
            summary = clean_text(value_to_text(fields.get("summary")))
            if not key or not summary:
                continue
            components = fields.get("components") or []
            yield {
                "source": APACHE.key,
                "external_id": key,
                "source_url": f"https://issues.apache.org/jira/browse/{key}",
                "summary": summary,
                "description": clean_text(value_to_text(fields.get("description"))),
                "product": (fields.get("project") or {}).get("name"),
                "component": ", ".join(str(item.get("name", "")) for item in components if item.get("name")) or None,
                "status": (fields.get("status") or {}).get("name"),
                "resolution": (fields.get("resolution") or {}).get("name"),
                "created_at": fields.get("created"),
                "updated_at": fields.get("updated"),
                "dataset_name": APACHE.dataset_name,
                "license_status": APACHE.license_status,
            }
        offset += len(issues)
        if len(issues) < page_size or offset >= payload.get("total", limit):
            return


def iter_source_records(source: str, limit: int) -> Iterator[dict[str, Any]]:
    """Fetch public records through the sources' live APIs; no bundled records or fallback fixtures."""
    if limit <= 0:
        raise ValueError("limit must be positive")
    if source == MOZILLA.key:
        yield from _bugzilla_records(MOZILLA, settings.mozilla_bugzilla_url, limit)
    elif source == ECLIPSE.key:
        yield from _bugzilla_records(ECLIPSE, settings.eclipse_bugzilla_url, limit)
    elif source == APACHE.key:
        yield from _apache_records(limit)
    else:
        raise ValueError(f"Unknown source '{source}'; choose mozilla, apache, eclipse")
