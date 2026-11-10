```python
"""
Shared FastAPI dependencies.

Provides reusable dependencies for database sessions
and application services.
"""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from bugdiag.db.session import get_db
from bugdiag.services.submission_service import SubmissionService


DatabaseSession = Annotated[Session, Depends(get_db)]


def get_submission_service(
    db: DatabaseSession,
) -> SubmissionService:
    """Provide a submission service using the request database session."""

    return SubmissionService(db)


SubmissionServiceDependency = Annotated[
    SubmissionService,
    Depends(get_submission_service),
]
```
