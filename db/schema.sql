CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS defects (
    id BIGSERIAL PRIMARY KEY,
    source TEXT NOT NULL CHECK (source IN ('mozilla', 'apache', 'eclipse')),
    external_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    product TEXT,
    component TEXT,
    status TEXT,
    resolution TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    dataset_name TEXT NOT NULL,
    license_status TEXT NOT NULL,
    content_hash CHAR(64) NOT NULL,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (source, external_id)
);

CREATE TABLE IF NOT EXISTS defect_chunks (
    id BIGSERIAL PRIMARY KEY,
    defect_id BIGINT NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    section TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(384) NOT NULL,
    embedding_model TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (defect_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS defect_chunks_embedding_hnsw
    ON defect_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS defects_source_idx ON defects (source);
CREATE INDEX IF NOT EXISTS defects_updated_at_idx ON defects (updated_at DESC);
