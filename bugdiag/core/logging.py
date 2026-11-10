"""
Centralized logging configuration.

Provides consistent application logging with configurable log levels.
Avoids logging credentials, tokens, and sensitive request payloads.
"""

import logging
import logging.config
from typing import Any

from bugdiag.core.config import get_settings


def configure_logging() -> None:
    """Configure application-wide logging."""

    settings = get_settings()

    logging_config: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": (
                    "%(asctime)s | %(levelname)s | "
                    "%(name)s | %(message)s"
                ),
                "datefmt": "%Y-%m-%dT%H:%M:%S%z",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": settings.log_level,
                "formatter": "standard",
                "stream": "ext://sys.stdout",
            },
        },
        "root": {
            "level": settings.log_level,
            "handlers": ["console"],
        },
        "loggers": {
            "uvicorn": {
                "level": settings.log_level,
                "propagate": True,
            },
            "uvicorn.error": {
                "level": settings.log_level,
                "propagate": True,
            },
            "uvicorn.access": {
                "level": "WARNING",
                "propagate": True,
            },
            "sqlalchemy.engine": {
                "level": "WARNING",
                "propagate": True,
            },
        },
    }

    logging.config.dictConfig(logging_config)


def get_logger(name: str) -> logging.Logger:
    """Return a named application logger."""

    return logging.getLogger(name)


logger = get_logger("bugdiag")
