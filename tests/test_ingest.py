from bugdiag.ingest import ingest


class EmptyDatabase:
    def __init__(self):
        self.initialized = False

    def initialize(self):
        self.initialized = True


class UnusedEmbedder:
    def embed(self, texts):
        raise AssertionError("An empty source must not generate embeddings")


def test_empty_real_source_run_initializes_but_does_not_invent_history(monkeypatch):
    empty_database = EmptyDatabase()
    monkeypatch.setattr("bugdiag.ingest.database", empty_database)
    monkeypatch.setattr("bugdiag.ingest.get_embedder", lambda: UnusedEmbedder())
    monkeypatch.setattr("bugdiag.ingest.iter_source_records", lambda source, limit: iter(()))

    report = ingest(["mozilla"], 10)

    assert empty_database.initialized
    assert report["mozilla"] == {"fetched": 0, "indexed": 0, "unchanged": 0, "skipped": 0}
