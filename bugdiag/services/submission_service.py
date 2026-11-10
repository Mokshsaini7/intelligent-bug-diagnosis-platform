```python
"""
Bug submission service.

Implements business logic and transaction management
for creating, retrieving, and listing bug submissions.
"""

from math import ceil
from uuid import UUID

from sqlalchemy.orm import Session

from bugdiag.repositories.submission_repository import SubmissionRepository
from bugdiag.schemas.common import PaginationMeta
from bugdiag.schemas.submission import (
    BugSubmissionCreate,
    BugSubmissionListParams,
)


class SubmissionNotFoundError(Exception):
    """Raised when a requested bug submission does not exist."""


class SubmissionService:
    """Business logic for bug submission operations."""

    def __init__(self, db: Session) -> None:
        self.repository = SubmissionRepository(db)
        self.db = db

    def create_submission(self, data: BugSubmissionCreate):
        """Create and persist a new bug submission."""

        try:
            submission = self.repository.create(data)
            self.db.commit()
            self.db.refresh(submission)
            return submission
        except Exception:
            self.db.rollback()
            raise

    def get_submission(self, submission_id: UUID):
        """Retrieve a submission or raise a not-found error."""

        submission = self.repository.get_by_id(submission_id)

        if submission is None:
            raise SubmissionNotFoundError(
                f"Bug submission '{submission_id}' was not found."
            )

        return submission

    def list_submissions(
        self,
        params: BugSubmissionListParams,
    ) -> tuple[list, PaginationMeta]:
        """Return filtered submissions with pagination metadata."""

        submissions, total_items = self.repository.list_submissions(params)

        total_pages = ceil(total_items / params.page_size)

        pagination = PaginationMeta(
            page=params.page,
            page_size=params.page_size,
            total_items=total_items,
            total_pages=total_pages,
            has_next=params.page < total_pages,
            has_previous=params.page > 1 and total_items > 0,
        )

        return submissions, pagination
```
