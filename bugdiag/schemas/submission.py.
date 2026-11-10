"""
Bug submission Pydantic schemas.

Defines validated request and response contracts
for the bug submission API.
"""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SeverityLevel(StrEnum):
    """Supported bug severity levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SubmissionStatus(StrEnum):
    """Supported bug submission lifecycle states."""

    SUBMITTED = "submitted"
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class BugSubmissionCreate(BaseModel):
    """Validated input for creating a bug submission."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    title: str = Field(min_length=5, max_length=255)
    description: str = Field(min_length=10, max_length=20000)

    programming_language: str | None = Field(default=None, max_length=100)
    framework: str | None = Field(default=None, max_length=150)
    environment: str | None = Field(default=None, max_length=255)

    severity: SeverityLevel = SeverityLevel.MEDIUM

    steps_to_reproduce: str | None = Field(default=None, max_length=20000)
    expected_behavior: str | None = Field(default=None, max_length=10000)
    actual_behavior: str | None = Field(default=None, max_length=10000)

    stack_trace: str | None = Field(default=None, max_length=50000)
    error_logs: str | None = Field(default=None, max_length=50000)

    @field_validator(
        "programming_language",
        "framework",
        "environment",
        "steps_to_reproduce",
        "expected_behavior",
        "actual_behavior",
        "stack_trace",
        "error_logs",
        mode="before",
    )
    @classmethod
    def normalize_optional_strings(cls, value: object) -> object:
        """Convert empty optional strings into None."""
        if isinstance(value, str):
            value = value.strip()
            return value or None

        return value


class BugSubmissionResponse(BaseModel):
    """Public representation of a submitted bug report."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    programming_language: str | None
    framework: str | None
    environment: str | None
    severity: SeverityLevel
    steps_to_reproduce: str | None
    expected_behavior: str | None
    actual_behavior: str | None
    stack_trace: str | None
    error_logs: str | None
    status: SubmissionStatus
    created_at: datetime
    updated_at: datetime


class BugSubmissionSummary(BaseModel):
    """Compact representation for submission listings."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    programming_language: str | None
    severity: SeverityLevel
    status: SubmissionStatus
    created_at: datetime
    updated_at: datetime


class BugSubmissionListParams(BaseModel):
    """Validated query parameters for listing submissions."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    severity: SeverityLevel | None = None
    status: SubmissionStatus | None = None
    search: str | None = Field(default=None, min_length=1, max_length=255)

    @field_validator("search")
    @classmethod
    def normalize_search(cls, value: str | None) -> str | None:
        """Normalize optional search input."""
        if value is None:
            return None

        value = value.strip()
        return value or None
