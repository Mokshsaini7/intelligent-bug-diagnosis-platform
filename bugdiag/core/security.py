"""
Security utilities for authentication.

Provides Argon2id password hashing and JWT access-token
creation and verification.
"""

from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

import jwt
from pwdlib import PasswordHash

from bugdiag.core.config import get_settings


password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a password using the recommended Argon2id configuration."""

    if not password:
        raise ValueError("Password cannot be empty.")

    if len(password) > 1024:
        raise ValueError("Password exceeds the maximum supported length.")

    return password_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its stored hash."""

    if not plain_password or not hashed_password:
        return False

    return password_hasher.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed JWT access token for a user."""

    if not subject or not subject.strip():
        raise ValueError("Token subject cannot be empty.")

    settings = get_settings()

    expiration = expires_delta or timedelta(
        minutes=settings.access_token_expire_minutes
    )

    if expiration.total_seconds() <= 0:
        raise ValueError("Token expiration must be positive.")

    now = datetime.now(timezone.utc)

    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": now + expiration,
        "jti": str(uuid4()),
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.secret_key.get_secret_value(),
        algorithm=settings.algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Raises jwt.InvalidTokenError when the token is invalid,
    expired, malformed, or not an access token.
    """

    if not token:
        raise jwt.InvalidTokenError("Token is missing.")

    settings = get_settings()

    payload = jwt.decode(
        token,
        settings.secret_key.get_secret_value(),
        algorithms=[settings.algorithm],
        options={
            "require": ["exp", "iat", "sub", "jti", "type"],
        },
    )

    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Invalid token type.")

    if not isinstance(payload.get("sub"), str) or not payload["sub"].strip():
        raise jwt.InvalidTokenError("Invalid token subject.")

    return payload
