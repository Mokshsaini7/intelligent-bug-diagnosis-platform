import pytest

from bugdiag.sources import iter_source_records


def test_unknown_source_is_rejected_without_network_access():
    with pytest.raises(ValueError, match="Unknown source"):
        list(iter_source_records("not-a-source", 1))


def test_non_positive_source_limit_is_rejected():
    with pytest.raises(ValueError, match="positive"):
        list(iter_source_records("mozilla", 0))
