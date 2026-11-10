"""
Bug submission repository.

Encapsulates SQLAlchemy database operations for bug submissions.
Transaction ownership remains with the service layer.
"""

from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from bugdiag.db.models.submission import BugSubmission
from bugdiag.schemas.submission import (
    BugSubmissionCreate,
    BugSubmissionListParams,
)


class SubmissionRepository:
    """Database access layer for bug submissions."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, submission_data: BugSubmissionCreate) -> BugSubmission:
        """Add a new bug submission to the current transaction."""

        submission = BugSubmission(
            **submission_data.model_dump(mode="json")
        )

        self.db.add(submission)
        self.db.flush()
        self.db.refresh(submission)

        return submission

    def get_by_id(self, submission_id: UUID) -> BugSubmission | None:
        """Retrieve a submission by its UUID."""

        statement = select(BugSubmission).where(
            BugSubmission.id == submission_id
        )

        return self.db.scalar(statement)

    def list_submissions(
        self,
        params: BugSubmissionListParams,
    ) -> tuple[list[BugSubmission], int]:
        """Retrieve filtered and paginated submissions with total count."""

        filters = []

        if params.severity is not None:
            filters.append(BugSubmission.severity == params.severity.value)

        if params.status is not None:
            filters.append(BugSubmission.status == params.status.value)

        if params.search:
            search_term = f"%{params.search}%"

            filters.append(
                or_(
                    BugSubmission.title.ilike(search_term),
                    BugSubmission.description.ilike(search_term),
                )
            )

        count_statement = (
            select(func.count())
            .select_from(BugSubmission)
            .where(*filters)
        )

        total_items = self.db.scalar(count_statement) or 0

        offset = (params.page - 1) * params.page_size

        statement = (
            select(BugSubmission)
            .where(*filters)
            .order_by(
                BugSubmission.created_at.desc(),
                BugSubmission.id.desc(),
            )
            .offset(offset)
            .limit(params.page_size)
        )

        submissions = list(self.db.scalars(statement).all())

        return submissions, total_items

    def exists(self, submission_id: UUID) -> bool:
        """Check whether a submission exists."""

        statement = select(
            select(BugSubmission.id)
            .where(BugSubmission.id == submission_id)
            .exists()
        )

        return bool(self.db.scalar(statement))
