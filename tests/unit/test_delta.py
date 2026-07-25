import pytest
from src.delta.engine import DeltaEngine
from src.delta.classifier import ChangeType

def test_delta_engine_comparison(sample_doc_rev_a, sample_doc_rev_b):
    engine = DeltaEngine()
    report = engine.compare_documents(sample_doc_rev_a, sample_doc_rev_b)

    assert report.total_changes == 2
    assert report.added_count == 1
    assert report.modified_count == 1

    added_entry = next(e for e in report.entries if e.change_type == ChangeType.ADDED)
    assert "V-102" in added_entry.description
