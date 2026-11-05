from __future__ import annotations

from pathlib import Path
from typing import Any, Iterable

import psycopg2
from psycopg2.extras import RealDictCursor

from bugdiag.cleaning import DefectChunk, content_hash
from bugdiag.config import settings

SCHEMA_PATH = Path(__file__).resolve().parent.parent / "db" / "schema.sql"


class Database:
    def __init__(self, database_url: str = settings.database_url):
        self.database_url = database_url

    def connect(self):
        return psycopg2.connect(self.database_url, connect_timeout=4)

    def initialize(self) -> None:
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute(SCHEMA_PATH.read_text(encoding="utf-8"))

    def health(self) -> dict[str, Any]:
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute("SELECT current_database(), current_setting('server_version')")
            database, version = cur.fetchone()
            cur.execute("SELECT extversion FROM pg_extension WHERE extname = 'vector'")
            extension = cur.fetchone()
            return {"database": database, "postgres_version": version, "pgvector_version": extension[0] if extension else None}

    def upsert_defect(self, record: dict[str, Any], chunks: list[DefectChunk], vectors: list[list[float]]) -> str:
        digest = content_hash(record["summary"], record["description"])
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute(
                "SELECT content_hash FROM defects WHERE source = %s AND external_id = %s FOR UPDATE",
                (record["source"], record["external_id"]),
            )
            prior = cur.fetchone()
            if prior and prior[0] == digest:
                # Refresh public metadata (status/date/title link/license) without re-embedding unchanged text.
                cur.execute(
                    """UPDATE defects SET source_url = %s, summary = %s, description = %s,
                       product = %s, component = %s, status = %s, resolution = %s,
                       created_at = %s, updated_at = %s, dataset_name = %s,
                       license_status = %s, ingested_at = now()
                       WHERE source = %s AND external_id = %s""",
                    (record["source_url"], record["summary"], record["description"], record.get("product"),
                     record.get("component"), record.get("status"), record.get("resolution"),
                     record.get("created_at"), record.get("updated_at"), record.get("dataset_name"),
                     record.get("license_status"), record["source"], record["external_id"]),
                )
                return "unchanged"
            cur.execute(
                """INSERT INTO defects
                (source, external_id, source_url, summary, description, product, component,
                 status, resolution, created_at, updated_at, dataset_name, license_status, content_hash)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (source, external_id) DO UPDATE SET
                  source_url = EXCLUDED.source_url, summary = EXCLUDED.summary,
                  description = EXCLUDED.description, product = EXCLUDED.product,
                  component = EXCLUDED.component, status = EXCLUDED.status,
                  resolution = EXCLUDED.resolution, created_at = EXCLUDED.created_at,
                  updated_at = EXCLUDED.updated_at, dataset_name = EXCLUDED.dataset_name,
                  license_status = EXCLUDED.license_status, content_hash = EXCLUDED.content_hash,
                  ingested_at = now()
                RETURNING id""",
                (record["source"], record["external_id"], record["source_url"], record["summary"],
                 record["description"], record.get("product"), record.get("component"), record.get("status"),
                 record.get("resolution"), record.get("created_at"), record.get("updated_at"),
                 record.get("dataset_name"), record.get("license_status"), digest),
            )
            updated = cur.fetchone()
            if updated is None:
                return "skipped"
            defect_id = updated[0]
            cur.execute("DELETE FROM defect_chunks WHERE defect_id = %s", (defect_id,))
            for chunk, vector in zip(chunks, vectors, strict=True):
                cur.execute(
                    """INSERT INTO defect_chunks
                    (defect_id, chunk_index, section, chunk_text, embedding, embedding_model)
                    VALUES (%s, %s, %s, %s, %s::vector, %s)""",
                    (defect_id, chunk.index, chunk.section, chunk.text, _vector_literal(vector), settings.embedding_model),
                )
            return "indexed"

    def search(self, vector: list[float], top_k: int = settings.search_top_k) -> list[dict[str, Any]]:
        with self.connect() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
            candidate_limit = min(max(top_k * 20, 64), 1000)
            cur.execute("SELECT set_config('hnsw.ef_search', %s, true)", (str(candidate_limit),))
            cur.execute(
                """WITH nearest_chunks AS MATERIALIZED (
                    SELECT c.defect_id, c.chunk_text, c.embedding <=> %s::vector AS cosine_distance
                    FROM defect_chunks c
                    ORDER BY c.embedding <=> %s::vector
                    LIMIT %s
                ), nearest AS (
                    SELECT d.id, d.source, d.external_id, d.source_url, d.summary,
                           d.product, d.component, d.status, d.resolution, d.created_at,
                           d.updated_at, d.license_status,
                           1 - nc.cosine_distance AS cosine_similarity,
                           nc.chunk_text AS matched_excerpt,
                           row_number() OVER (PARTITION BY d.id ORDER BY nc.cosine_distance) AS match_rank
                    FROM nearest_chunks nc JOIN defects d ON d.id = nc.defect_id
                )
                SELECT * FROM nearest
                WHERE match_rank = 1 AND cosine_similarity >= %s
                ORDER BY cosine_similarity DESC
                LIMIT %s""",
                (_vector_literal(vector), _vector_literal(vector), candidate_limit, settings.min_cosine_similarity, top_k),
            )
            return [dict(row) for row in cur.fetchall()]

    def source_counts(self) -> list[dict[str, Any]]:
        with self.connect() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT source, count(*) AS defects, max(ingested_at) AS last_ingested FROM defects GROUP BY source ORDER BY source")
            return [dict(row) for row in cur.fetchall()]

    def stats(self) -> dict[str, Any]:
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM defects")
            defects = cur.fetchone()[0]
            cur.execute("SELECT count(*) FROM defect_chunks")
            chunks = cur.fetchone()[0]
            return {"defects": defects, "chunks": chunks}


def _vector_literal(vector: Iterable[float], expected_dimensions: int = settings.embedding_dimensions) -> str:
    values = list(vector)
    if not values or not all(abs(float(value)) < float("inf") for value in values):
        raise ValueError("Vector must be non-empty and finite")
    if len(values) != expected_dimensions:
        raise ValueError(f"Expected {expected_dimensions} dimensions, received {len(values)}")
    return "[" + ",".join(format(float(value), ".9g") for value in values) + "]"


database = Database()
