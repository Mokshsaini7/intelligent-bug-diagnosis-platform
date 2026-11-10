```python
"""
Bug submission API routes.

Provides endpoints for creating, retrieving,
and listing bug submissions.
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from bugdiag.api.deps import SubmissionServiceDependency
from bugdiag.schemas.common import APIResponse, PaginatedResponse
from bugdiag.schemas.submission import (
    BugSubmissionCreate,
    BugSubmissionListParams,
    BugSubmissionResponse,
    BugSubmissionSummary,
)
from bugdiag.services.submission_service import SubmissionNotFoundError


router = APIRouter(
    prefix="/submissions",
    tags=["Bug Submissions"],
)


@router.post(
    "",
    response_model=APIResponse[BugSubmissionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a bug submission",
)
def create_submission(
    submission_data: BugSubmissionCreate,
    service: SubmissionServiceDependency,
) -> APIResponse[BugSubmissionResponse]:
    """Accept and persist a new bug report."""

    submission = service.create_submission(submission_data)

    return APIResponse(
        message="Bug submission created successfully.",
        data=submission,
    )


@router.get(
    "",
    response_model=PaginatedResponse[BugSubmissionSummary],
    summary="List bug submissions",
)
def list_submissions(
    params: Annotated[BugSubmissionListParams, Query()],
    service: SubmissionServiceDependency,
) -> PaginatedResponse[BugSubmissionSummary]:
    """List bug reports with filtering and pagination."""

    submissions, pagination = service.list_submissions(params)

    return PaginatedResponse(
        message="Bug submissions retrieved successfully.",
        data=submissions,
        pagination=pagination,
    )


@router.get(
    "/{submission_id}",
    response_model=APIResponse[BugSubmissionResponse],
    summary="Get a bug submission",
)
def get_submission(
    submission_id: UUID,
    service: SubmissionServiceDependency,
) -> APIResponse[BugSubmissionResponse]:
    """Retrieve a bug report by its UUID."""

    try:
        submission = service.get_submission(submission_id)
    except SubmissionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return APIResponse(
        message="Bug submission retrieved successfully.",
        data=submission,
    )
```
