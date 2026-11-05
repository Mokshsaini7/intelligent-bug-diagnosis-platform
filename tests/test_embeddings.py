import pytest

from bugdiag.embeddings import EmbeddingUnavailable, SentenceTransformerEmbedder


class ModelStub:
    def __init__(self, vectors):
        self.vectors = vectors

    def encode(self, texts, **kwargs):
        assert kwargs["normalize_embeddings"] is True
        assert kwargs["convert_to_numpy"] is True
        return self.vectors


def test_embedder_checks_dimensions_and_returns_plain_floats():
    embedder = SentenceTransformerEmbedder.__new__(SentenceTransformerEmbedder)
    embedder.dimensions = 2
    embedder.model = ModelStub([[0.6, 0.8]])

    assert embedder.embed(["report"]) == [[0.6, 0.8]]


def test_embedder_rejects_dimension_mismatch():
    embedder = SentenceTransformerEmbedder.__new__(SentenceTransformerEmbedder)
    embedder.dimensions = 2
    embedder.model = ModelStub([[1.0]])

    with pytest.raises(EmbeddingUnavailable, match="dimension"):
        embedder.embed(["report"])
