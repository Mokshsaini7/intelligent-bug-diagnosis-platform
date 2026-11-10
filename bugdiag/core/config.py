"""
Centralized application configuration.

Loads and validates environment-based settings using Pydantic Settings.
Secrets are represented using SecretStr to reduce accidental exposure.
"""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        validate_default=True,
    )

    # Application
    app_name: str = "Intelligent Bug Diagnosis Platform"
    app_env: Literal["development", "testing", "staging", "production"] = (
        "development"
    )
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: SecretStr

    # Security
    secret_key: SecretStr = Field(min_length=32)
    access_token_expire_minutes: int = Field(default=30, ge=1, le=1440)
    algorithm: Literal["HS256"] = "HS256"

    # CORS
    cors_origins: str = Field(
        default="http://localhost:5173",
        validation_alias="CORS_ORIGINS",
    )

    # File uploads
    upload_dir: Path = Path("storage/uploads")
    max_upload_size_mb: int = Field(default=10, ge=1, le=100)
    allowed_upload_extensions: str = Field(
        default=".txt,.log,.json,.md,.csv",
        validation_alias="ALLOWED_UPLOAD_EXTENSIONS",
    )

    # Logging
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, value: SecretStr) -> SecretStr:
        """Reject placeholder or weak application secrets."""
        secret = value.get_secret_value()

        if secret == "replace-with-a-secure-random-secret":
            raise ValueError("Replace the placeholder SECRET_KEY with a real secret.")

        if len(secret.strip()) < 32:
            raise ValueError("SECRET_KEY must contain at least 32 characters.")

        return value

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, value: SecretStr) -> SecretStr:
        """Reject an unconfigured database URL."""
        url = value.get_secret_value().strip()

        if not url or "replace-with-a-strong-local-password" in url:
            raise ValueError("Configure DATABASE_URL with valid database credentials.")

        if not url.startswith(("postgresql://", "postgresql+psycopg://")):
            raise ValueError(
                "DATABASE_URL must use PostgreSQL with the psycopg driver."
            )

        return value

    @field_validator("api_v1_prefix")
    @classmethod
    def validate_api_prefix(cls, value: str) -> str:
        """Ensure the API prefix has a consistent format."""
        value = value.strip()

        if not value.startswith("/"):
            raise ValueError("API_V1_PREFIX must start with '/'.")

        return value.rstrip("/") or "/"

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, value: str) -> str:
        """Validate comma-separated CORS origins."""
        origins = [origin.strip() for origin in value.split(",") if origin.strip()]

        if not origins:
            raise ValueError("At least one CORS origin must be configured.")

        if "*" in origins:
            raise ValueError(
                "Wildcard CORS origins are not permitted. Configure explicit origins."
            )

        return ",".join(origins)

    @field_validator("allowed_upload_extensions")
    @classmethod
    def validate_upload_extensions(cls, value: str) -> str:
        """Normalize and validate allowed file extensions."""
        extensions = [
            extension.strip().lower()
            for extension in value.split(",")
            if extension.strip()
        ]

        if not extensions:
            raise ValueError("At least one upload extension must be configured.")

        if any(
            not extension.startswith(".")
            or "/" in extension
            or "\\" in extension
            for extension in extensions
        ):
            raise ValueError("Upload extensions must be valid extensions such as .txt.")

        return ",".join(dict.fromkeys(extensions))

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Enforce additional production safety requirements."""
        if self.app_env == "production" and self.debug:
            raise ValueError("DEBUG must be false in production.")

        return self

    @property
    def cors_origin_list(self) -> list[str]:
        """Return CORS origins as a list."""
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]

    @property
    def allowed_extensions(self) -> frozenset[str]:
        """Return normalized upload extensions."""
        return frozenset(self.allowed_upload_extensions.split(","))

    @property
    def max_upload_size_bytes(self) -> int:
        """Return the maximum upload size in bytes."""
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def absolute_upload_dir(self) -> Path:
        """Resolve the upload directory relative to the project root."""
        if self.upload_dir.is_absolute():
            return self.upload_dir

        return BASE_DIR / self.upload_dir


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached application settings instance."""
    return Settings()
