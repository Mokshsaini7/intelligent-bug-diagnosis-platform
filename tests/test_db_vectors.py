import pytest

from bugdiag.db import _vector_literal


def test_vector_serialization_checks_dimension():
    assert _vector_literal([0.25, -1, 0], expected_dimensions=3) == "[0.25,-1,0]"


def test_vector_serialization_rejects_wrong_dimensions():
    with pytest.raises(ValueError, match="Expected 3 dimensions"):
        _vector_literal([1, 2], expected_dimensions=3)


def test_vector_serialization_rejects_non_finite_values():
    with pytest.raises(ValueError, match="finite"):
        _vector_literal([float("inf")], expected_dimensions=1)
