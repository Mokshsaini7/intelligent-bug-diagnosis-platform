"""
PostgreSQL database engine and session management.

Provides a cached SQLAlchemy engine, connection pooling,
session factory, and FastAPI database dependency.
"""

from collections.abc import Generator
from functools import lru_cache

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

from bugdiag.core.config import get_settings


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    """Create and cache the PostgreSQL SQLAlchemy engine."""

    settings = get_settings()

    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800,
        echo=settings.debug,
    )


@lru_cache(maxsize=1)
def get_session_factory() -> sessionmaker[Session]:
    """Create and cache the SQLAlchemy session factory."""

    return sessionmaker(
        bind=get_engine(),
        class_=Session,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )


def get_db() -> Generator[Session, None, None]:
    """
    Provide a database session to FastAPI endpoints.

    Rolls back unfinished transactions when an exception occurs
    and always closes the session.
    """

    session = get_session_factory()()

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def check_database_connection() -> bool:
    """Check PostgreSQL connectivity using a lightweight query."""

    try:
        with get_engine().connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    except SQLAlchemyError:
        return False


def dispose_database_engine() -> None:
    """Dispose the connection pool during application shutdown."""

    if get_engine.cache_info().currsize:
        get_engine().dispose()

    get_session_factory.cache_clear()
    get_engine.cache_clear()
