# Milestone 1 progress

Date started: 5 November 2026 (client local date)  
Milestone window: 6–15 November 2026

## Implemented in this workspace

- Inspected supplied workspace: no pre-existing source repository, Git metadata, or local project instructions were present. Created a new Python/FastAPI baseline rather than modifying nonexistent files.
- Added direct text and UTF-8 text-file submission flow, upload size/type validation, normalization, basic email-pattern redaction, and an explicit transient-submission policy.
- Added live, paginated public source adapters for Mozilla Bugzilla, Apache Jira and Eclipse Bugzilla. They store external issue IDs, original source URLs and conservative license status; no historical issue fixture is shipped.
- Added bounded chunking, local sentence-transformer embeddings, PostgreSQL/pgvector schema, HNSW cosine index, idempotent source-key upsert, and top matching historical defect retrieval.
- Added frontend with service/index status, source counts, ranked results, similarity explanation and source links.
- Added API, architecture/data-model diagram, research notes, provenance/licensing limitations and test suite.
- Explicitly excluded automated code fixes, autonomous debugging and generated diagnosis.

## Verification and acceptance status

Verification completed: `python -m pytest -vv` (17 passed), `python -m compileall -q bugdiag tests`, and `node --check frontend/app.js`. Tests cover cleaning/chunking, vector validation, model-output validation, source input guards, empty-ingestion behavior, query-chunk sampling, OpenAPI inputs, and direct text/file handler handoff with an empty mocked index. They do not inject positive fake retrieval records.

The workspace currently has Python, FastAPI, Uvicorn, pytest and psycopg2 available, but no Docker, PostgreSQL client/server executable or installed `sentence-transformers` model package. A schema-init attempt confirmed that connecting to `localhost:5432` is denied by the environment. No real external source records have been fetched or embedded in this workspace. Therefore the end-to-end acceptance criterion (real historical indexing and a successful source-linked query) remains pending a reachable PostgreSQL+pgvector service, installed/downloaded sentence-transformer model, and successful live-source ingestion. Route tests invoke the handler directly because the environment also blocks local socket setup. The app reports unavailable services or empty results rather than manufacturing matches.
