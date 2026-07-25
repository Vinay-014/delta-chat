from typing import Optional
from src.canonical.model import DocumentElement
from src.delta.classifier import ChangeType

class ConfidenceScorer:
    """Calculates confidence scores for delta entries based on extraction quality & alignment metrics."""

    @staticmethod
    def calculate_confidence(
        change_type: ChangeType,
        elem_a: Optional[DocumentElement],
        elem_b: Optional[DocumentElement],
        match_score: float,
    ) -> float:
        if change_type in [ChangeType.ADDED, ChangeType.REMOVED]:
            target_elem = elem_b if change_type == ChangeType.ADDED else elem_a
            base_conf = target_elem.confidence if target_elem else 0.9
            return round(base_conf * 0.95, 2)

        if elem_a and elem_b:
            extraction_quality = (elem_a.confidence + elem_b.confidence) / 2.0
            alignment_quality = match_score
            combined = (extraction_quality * 0.4) + (alignment_quality * 0.6)
            return round(max(0.0, min(1.0, combined)), 2)

        return 0.85
