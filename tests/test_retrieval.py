from bugdiag.retrieval import MAX_QUERY_CHUNKS, query_chunks, retrieve_similar


def test_long_report_query_chunks_are_bounded_and_cover_beginning_and_end():
    chunks = query_chunks("Export failure", "frame\n" * 2000)

    assert len(chunks) <= MAX_QUERY_CHUNKS
    assert chunks[0].section == "summary"
    assert "frame" in chunks[-1].text


def test_empty_query_vectors_produce_no_matches():
    class NoSearch:
        def search(self, *_):
            raise AssertionError("Search should not run without query vectors")

    assert retrieve_similar(NoSearch(), [], 8) == []
