```python
"""
Health-check API routes.

Provides application health and database readiness endpoints.
"""

from fastapi import APIRouter, HTTPException, status

from bugdiag.core.config import get_settings
from bugdiag.db.session import check_database_connection


router = APIRouter(
    tags=["Health"],
)

settings = get_settings()


@router.get(
    "/health",
    summary="Application health check",
)
def health_check() -> dict[str, str]:
    """Check whether the application process is running."""

    return {
        "status": "ok",
        "application": settings.app_name,
    }


@router.get(
    "/ready",
    summary="Application readiness check",
)
def readiness_check() -> dict[str, str]:
    """Check whether PostgreSQL is available."""

    if not check_database_connection():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection is unavailable.",
        )

    return {
        "status": "ready",
        "database": "connected",
    }
```
