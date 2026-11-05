from __future__ import annotations

import argparse
from itertools import islice
import logging
import sys

import psycopg2

from bugdiag.cleaning import chunk_defect
from bugdiag.db import database
from bugdiag.embeddings import EmbeddingUnavailable, get_embedder
from bugdiag.sources import SourceError, iter_source_records

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def ingest(sources: list[str], limit: int) -> dict[str, dict[str, int]]:
    database.initialize()
    embedder = get_embedder()
    totals: dict[str, dict[str, int]] = {}
    for source in sources:
        counts = {"fetched": 0, "indexed": 0, "unchanged": 0, "skipped": 0}
        logger.info("Fetching up to %s resolved/closed public records from %s", limit, source)
        records = iter(iter_source_records(source, limit))
        while batch := list(islice(records, 25)):
            prepared = []
            texts = []
            for record in batch:
                counts["fetched"] += 1
                chunks = chunk_defect(record["summary"], record["description"])
                if not chunks:
                    counts["skipped"] += 1
                    continue
                prepared.append((record, chunks))
                texts.extend(chunk.text for chunk in chunks)
            if not texts:
                continue
            vectors = iter(embedder.embed(texts))
            for record, chunks in prepared:
                chunk_vectors = list(islice(vectors, len(chunks)))
                outcome = database.upsert_defect(record, chunks, chunk_vectors)
                counts[outcome] += 1
            logger.info("%s progress: %s", source, counts)
        totals[source] = counts
        logger.info("%s: %s", source, counts)
    return totals


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ingest real public defect records and index semantic chunks")
    parser.add_argument("--sources", default="mozilla,apache,eclipse", help="Comma-separated source names")
    parser.add_argument("--limit", type=int, default=100, help="Maximum number of issues per source")
    args = parser.parse_args(argv)
    try:
        totals = ingest([item.strip() for item in args.sources.split(",") if item.strip()], args.limit)
    except (SourceError, EmbeddingUnavailable, OSError, ValueError, psycopg2.Error) as exc:
        logger.error("Ingestion stopped: %s", exc)
        return 1
    logger.info("Ingestion completed: %s", totals)
    return 0


if __name__ == "__main__":
    sys.exit(main())
