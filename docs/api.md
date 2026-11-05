# API reference

FastAPI serves interactive OpenAPI documentation at `/docs` and its schema at `/openapi.json`.

## `GET /api/health`

Returns readiness and configured embedding metadata. A degraded response means PostgreSQL/pgvector could not be confirmed. The health route does not force-load the embedding model.

## `GET /api/stats`

Returns `{ "defects": integer, "chunks": integer, "sources": [{ "source": string, "defects": integer, "last_ingested": timestamp|null }] }`. Returns 503 if the index is unavailable.

## `GET /api/sources`

Returns per-source historical issue counts and latest ingestion timestamps.

## `POST /api/submit`

Accepts either JSON or multipart form data. Submitted text is embedded for the query and is not persisted.

JSON body:

```json
{
  "title": "Optional summary",
  "description": "Expected and actual behavior, reproduction steps, stack trace"
}
```

Multipart fields: optional `title`, optional `description`, and optional `file`. Supported UTF-8 extensions: `.txt`, `.log`, `.md`, `.json`, `.xml`, `.out`, `.err`, `.trace`. Maximum combined submitted description is configured by `MAX_UPLOAD_BYTES` (default 1 MiB); multipart framing has an additional 32 KiB envelope allowance. File uploads are parsed as text only; binary PDFs and archives are not accepted.

Successful response:

```json
{
  "query_title": "Optional summary",
  "query_source": "text input",
  "match_metric": "cosine similarity",
  "metric_note": "Similarity is a ranking signal, not a probability or a claim that issues are duplicates.",
  "indexed_matches": 0,
  "results": []
}
```

Each returned historical result includes `source`, `external_id`, `source_url`, `summary`, available project/status metadata, `license_status`, `cosine_similarity`, and `matched_excerpt`. A zero-result response means no indexed issue passed the configured cutoff; it does not mean that no related bug exists.

Errors: `400` malformed payload, `413` over limit, `415` unsupported file type, `422` empty report, `503` database/model unavailable.

## Historical ingestion

Ingestion is deliberately an operator CLI rather than a public write endpoint:

```powershell
python -m bugdiag.db_cli init
python -m bugdiag.ingest --sources mozilla,apache,eclipse --limit 100
```

The CLI uses public tracker APIs and records source references; see [source provenance](datasets.md).
