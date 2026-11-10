```python
"""
FastAPI application entry point.

Initializes the application, registers API routes,
configures middleware, and exposes health endpoints.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from bugdiag.api.router import api_router
from bugdiag.core.config import get_settings
from bugdiag.core.logging import configure_logging, get_logger
from bugdiag.db.session import (
    check_database_connection,
    dispose_database_engine,
)


settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application startup and shutdown."""

    configure_logging()
    logger.info("Starting %s", settings.app_name)

    yield

    logger.info("Shutting down %s", settings.app_name)
    dispose_database_engine()


app = FastAPI(
    title=settings.app_name,
    description=(
        "An intelligent platform for software bug submission, "
        "diagnosis, and fix recommendation assistance."
    ),
    version="0.1.0",
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)


@app.get(
    "/health",
    tags=["Health"],
    summary="Application health check",
)
def health_check() -> dict[str, str]:
    """Check whether the application process is running."""

    return {
        "status": "ok",
        "application": settings.app_name,
    }


@app.get(
    "/ready",
    tags=["Health"],
    summary="Application readiness check",
)
def readiness_check() -> dict[str, str]:
    """Check whether the application can access PostgreSQL."""

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
