import difflib
import math
from typing import List, Tuple, Dict, Any, Optional
from src.canonical.model import Document, DocumentElement

class ElementAligner:
    """Aligns elements across document revisions using textual, spatial, and type signals."""

    def __init__(
        self,
        text_weight: float = 0.5,
        spatial_weight: float = 0.3,
        type_weight: float = 0.2,
        similarity_threshold: float = 0.45,
    ):
        self.text_weight = text_weight
        self.spatial_weight = spatial_weight
        self.type_weight = type_weight
        self.similarity_threshold = similarity_threshold

    def compute_text_similarity(self, text1: str, text2: str) -> float:
        """Compute textual similarity using SequenceMatcher."""
        if not text1 and not text2:
            return 1.0
        return difflib.SequenceMatcher(None, text1.lower(), text2.lower()).ratio()

    def compute_spatial_similarity(self, elem1: DocumentElement, elem2: DocumentElement) -> float:
        """Compute spatial similarity using BoundingBox IoU and normalized distance."""
        iou = elem1.bbox.intersection_over_union(elem2.bbox)
        if iou > 0.0:
            return iou

        # Distance between box centroids
        c1_x = (elem1.bbox.x1 + elem1.bbox.x2) / 2.0
        c1_y = (elem1.bbox.y1 + elem1.bbox.y2) / 2.0
        c2_x = (elem2.bbox.x1 + elem2.bbox.x2) / 2.0
        c2_y = (elem2.bbox.y1 + elem2.bbox.y2) / 2.0

        dist = math.sqrt((c1_x - c2_x) ** 2 + (c1_y - c2_y) ** 2)
        # Normalize distance decay (e.g. 1.0 at 0px, 0.0 at 500px)
        proximity = max(0.0, 1.0 - (dist / 500.0))
        return proximity

    def align(self, doc_a: Document, doc_b: Document) -> List[Tuple[Optional[DocumentElement], Optional[DocumentElement], float]]:
        """
        Align elements from doc_a (Rev A) to doc_b (Rev B).
        Returns list of tuples: (elem_a, elem_b, match_score).
        If elem_a is None -> ADDED in Rev B.
        If elem_b is None -> REMOVED in Rev A.
        """
        alignments = []
        unmatched_b = list(doc_b.elements)

        for elem_a in doc_a.elements:
            best_match: Optional[DocumentElement] = None
            best_score = 0.0

            for elem_b in unmatched_b:
                text_sim = self.compute_text_similarity(elem_a.text, elem_b.text)
                spatial_sim = self.compute_spatial_similarity(elem_a, elem_b)
                type_sim = 1.0 if elem_a.type == elem_b.type else 0.0

                combined_score = (
                    self.text_weight * text_sim
                    + self.spatial_weight * spatial_sim
                    + self.type_weight * type_sim
                )

                if combined_score > best_score:
                    best_score = combined_score
                    best_match = elem_b

            if best_match and best_score >= self.similarity_threshold:
                alignments.append((elem_a, best_match, best_score))
                unmatched_b.remove(best_match)
            else:
                alignments.append((elem_a, None, 0.0))

        # Remaining elements in doc_b are ADDED
        for elem_b in unmatched_b:
            alignments.append((None, elem_b, 0.0))

        return alignments
