```python
"""
Central API router.

Combines all resource-specific routers under
a single versioned API router.
"""

from fastapi import APIRouter

from bugdiag.api.routes import submissions


api_router = APIRouter()

api_router.include_router(submissions.router)
```
