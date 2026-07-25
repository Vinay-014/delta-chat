from enum import Enum
from typing import Optional
from src.canonical.model import DocumentElement

class ChangeType(str, Enum):
    ADDED = "ADDED"
    REMOVED = "REMOVED"
    MODIFIED = "MODIFIED"
    MOVED = "MOVED"
    UNCHANGED = "UNCHANGED"

class DeltaClassifier:
    """Classifies aligned element pairs into granular change categories."""

    @staticmethod
    def classify(
        elem_a: Optional[DocumentElement],
        elem_b: Optional[DocumentElement],
        match_score: float,
        spatial_tolerance_px: float = 15.0,
    ) -> ChangeType:
        if elem_a is None and elem_b is not None:
            return ChangeType.ADDED
        if elem_a is not None and elem_b is None:
            return ChangeType.REMOVED

        if elem_a is not None and elem_b is not None:
            text_changed = elem_a.text.strip() != elem_b.text.strip()
            
            # Check spatial shift
            c1_x, c1_y = (elem_a.bbox.x1 + elem_a.bbox.x2) / 2.0, (elem_a.bbox.y1 + elem_a.bbox.y2) / 2.0
            c2_x, c2_y = (elem_b.bbox.x1 + elem_b.bbox.x2) / 2.0, (elem_b.bbox.y1 + elem_b.bbox.y2) / 2.0
            spatial_shifted = ((c1_x - c2_x) ** 2 + (c1_y - c2_y) ** 2) ** 0.5 > spatial_tolerance_px

            if text_changed and spatial_shifted:
                return ChangeType.MODIFIED
            elif text_changed:
                return ChangeType.MODIFIED
            elif spatial_shifted:
                return ChangeType.MOVED
            else:
                return ChangeType.UNCHANGED

        return ChangeType.UNCHANGED
