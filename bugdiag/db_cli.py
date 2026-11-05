import argparse

import psycopg2

from bugdiag.db import database


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize the Bug Diagnosis Platform PostgreSQL schema")
    parser.add_argument("action", choices=["init"])
    parser.parse_args()
    try:
        database.initialize()
    except psycopg2.Error as exc:
        print(f"Database initialization failed: {exc}")
        return 1
    print("Initialized PostgreSQL schema and pgvector index.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
