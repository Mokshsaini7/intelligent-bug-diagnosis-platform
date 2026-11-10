"""
Shared API schemas.

Defines reusable pagination metadata and standardized
API response structures.
"""

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field


T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard successful API response."""

    success: bool = True
    message: str = "Request completed successfully."
    data: T | None = None


class PaginationMeta(BaseModel):
    """Metadata describing a paginated response."""

    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
    total_items: int = Field(ge=0)
    total_pages: int = Field(ge=0)

    has_next: bool
    has_previous: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated API response."""

    success: bool = True
    message: str = "Records retrieved successfully."
    data: list[T]
    pagination: PaginationMeta


class ErrorDetail(BaseModel):
    """Structured API error information."""

    code: str
    message: str
    details: dict[str, object] | list[dict[str, object]] | None = None


class ErrorResponse(BaseModel):
    """Standardized API error response."""

    success: bool = False
    error: ErrorDetail


class ORMResponseModel(BaseModel):
    """Base schema for serializing SQLAlchemy ORM objects."""

    model_config = ConfigDict(from_attributes=True)
