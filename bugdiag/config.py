from dataclasses import dataclass
import os

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # pragma: no cover - optional in minimal test environments
    pass


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "postgresql://bugdiag:bugdiag@localhost:5432/bugdiag")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    # The SQL vector column is pinned to 384 dimensions for this milestone.
    embedding_dimensions: int = 384
    max_upload_bytes: int = int(os.getenv("MAX_UPLOAD_BYTES", "1048576"))
    search_top_k: int = int(os.getenv("SEARCH_TOP_K", "8"))
    min_cosine_similarity: float = float(os.getenv("MIN_COSINE_SIMILARITY", "0.20"))
    mozilla_bugzilla_url: str = os.getenv("MOZILLA_BUGZILLA_URL", "https://bugzilla.mozilla.org")
    eclipse_bugzilla_url: str = os.getenv("ECLIPSE_BUGZILLA_URL", "https://bugs.eclipse.org/bugs")
    apache_jira_url: str = os.getenv("APACHE_JIRA_URL", "https://issues.apache.org/jira")
    apache_jira_jql: str = os.getenv(
        "APACHE_JIRA_JQL",
        "project in (LUCENE,HADOOP,SPARK) AND resolution is not EMPTY ORDER BY updated DESC",
    )


settings = Settings()
