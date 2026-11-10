"""
Bug submission database model.

Stores bug reports, reproduction details, error information,
severity, lifecycle status, and timestamps.
"""

import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Index,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from bugdiag.db.base import Base


class BugSubmission(Base):
    """Persistent representation of a submitted software bug."""

    __tablename__ = "bug_submissions"

    __table_args__ = (
        CheckConstraint(
            "severity IN ('low', 'medium', 'high', 'critical')",
            name="severity",
        ),
        CheckConstraint(
            "status IN ('submitted', 'pending', 'processing', 'completed', 'failed')",
            name="status",
        ),
        Index("ix_bug_submissions_status_created_at", "status", "created_at"),
        Index("ix_bug_submissions_severity", "severity"),
        Index("ix_bug_submissions_created_at", "created_at"),
    )

    # Primary identifier
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Bug report information
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    programming_language: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    framework: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    environment: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="medium",
        server_default="medium",
    )

    steps_to_reproduce: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    expected_behavior: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    actual_behavior: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    stack_trace: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    error_logs: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Processing lifecycle
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="submitted",
        server_default="submitted",
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
