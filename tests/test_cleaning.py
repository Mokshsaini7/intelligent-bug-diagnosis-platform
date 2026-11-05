from bugdiag.cleaning import chunk_defect, clean_text, content_hash


def test_clean_text_normalizes_markup_and_redacts_email():
    assert clean_text("<p>Crash\r\n\r\n at a@example.org</p>") == "Crash\n\n at [redacted email]" or clean_text("<p>Crash\r\n\r\n at a@example.org</p>") == "Crash\n\nat [redacted email]"


def test_chunking_keeps_summary_and_splits_long_description():
    chunks = chunk_defect("Export stalls", ("stack frame\n" * 500), max_chars=500, overlap=50)
    assert len(chunks) > 1
    assert chunks[0].section == "summary"
    assert all("Export stalls" in chunk.text for chunk in chunks)
    assert all(len(chunk.text) < 700 for chunk in chunks)


def test_content_hash_tracks_content_changes():
    assert content_hash("A", "one") != content_hash("A", "two")
