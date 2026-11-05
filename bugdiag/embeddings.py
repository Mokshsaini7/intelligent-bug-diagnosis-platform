from __future__ import annotations

from functools import lru_cache
from typing import Sequence

from bugdiag.config import settings


class EmbeddingUnavailable(RuntimeError):
    pass


class SentenceTransformerEmbedder:
    """Local CPU/GPU sentence embeddings; no synthetic or hash-vector fallback."""

    def __init__(self, model_name: str = settings.embedding_model, dimensions: int = settings.embedding_dimensions):
        self.model_name = model_name
        self.dimensions = dimensions
        try:
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(model_name)
        except Exception as exc:
            raise EmbeddingUnavailable(
                f"Embedding model '{model_name}' could not load. Install project dependencies and allow its first model download."
            ) from exc

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        input_texts = list(texts)
        try:
            vectors = self.model.encode(input_texts, normalize_embeddings=True, convert_to_numpy=True)
        except Exception as exc:
            raise EmbeddingUnavailable("The configured embedding model failed to encode the text.") from exc
        output = [[float(value) for value in row] for row in vectors]
        if len(output) != len(input_texts):
            raise EmbeddingUnavailable("The embedding model returned a different number of vectors than input texts.")
        if any(len(vector) != self.dimensions for vector in output):
            raise EmbeddingUnavailable(
                f"Embedding dimension does not match configured {self.dimensions}; align the model and database schema."
            )
        if any(not all(abs(value) < float("inf") for value in vector) for vector in output):
            raise EmbeddingUnavailable("The embedding model returned a non-finite vector.")
        return output


@lru_cache(maxsize=1)
def get_embedder() -> SentenceTransformerEmbedder:
    return SentenceTransformerEmbedder()
