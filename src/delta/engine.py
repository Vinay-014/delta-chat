import uuid
from typing import List
from src.canonical.model import Document
from src.delta.aligner import ElementAligner
from src.delta.classifier import DeltaClassifier, ChangeType
from src.delta.confidence import ConfidenceScorer
from src.delta.report import DeltaReport, DeltaEntry
from src.exceptions import DeltaEngineError

class DeltaEngine:
    """Core Delta Engine that orchestrates alignment, classification, and report synthesis."""

    def __init__(self, aligner: ElementAligner = None):
        self.aligner = aligner or ElementAligner()
        self.classifier = DeltaClassifier()
        self.scorer = ConfidenceScorer()

    def compare_documents(self, doc_a: Document, doc_b: Document) -> DeltaReport:
        """Execute delta calculation between Revision A and Revision B."""
        if not doc_a or not doc_b:
            raise DeltaEngineError("Both Document A and Document B are required for delta computation")

        alignments = self.aligner.align(doc_a, doc_b)
        entries: List[DeltaEntry] = []

        added_cnt = 0
        removed_cnt = 0
        modified_cnt = 0
        moved_cnt = 0

        for elem_a, elem_b, match_score in alignments:
            change_type = self.classifier.classify(elem_a, elem_b, match_score)

            if change_type == ChangeType.UNCHANGED:
                continue

            conf = self.scorer.calculate_confidence(change_type, elem_a, elem_b, match_score)

            elem_type = elem_b.type.value if elem_b else (elem_a.type.value if elem_a else "UNKNOWN")

            if change_type == ChangeType.ADDED:
                added_cnt += 1
                desc = f"New {elem_type} '{elem_b.text}' added in {doc_b.revision}"
            elif change_type == ChangeType.REMOVED:
                removed_cnt += 1
                desc = f"{elem_type} '{elem_a.text}' removed from {doc_a.revision}"
            elif change_type == ChangeType.MODIFIED:
                modified_cnt += 1
                desc = f"{elem_type} value changed from '{elem_a.text}' to '{elem_b.text}'"
            elif change_type == ChangeType.MOVED:
                moved_cnt += 1
                desc = f"{elem_type} '{elem_b.text}' position shifted on page {elem_b.bbox.page}"
            else:
                desc = f"Change detected in {elem_type}"

            entry_id = f"delta_{uuid.uuid4().hex[:6]}"
            entries.append(
                DeltaEntry(
                    id=entry_id,
                    change_type=change_type,
                    element_type=elem_type,
                    rev_a_element=elem_a,
                    rev_b_element=elem_b,
                    confidence=conf,
                    description=desc,
                )
            )

        return DeltaReport(
            doc_a_id=doc_a.doc_id,
            doc_b_id=doc_b.doc_id,
            revision_a=doc_a.revision,
            revision_b=doc_b.revision,
            total_changes=len(entries),
            added_count=added_cnt,
            removed_count=removed_cnt,
            modified_count=modified_cnt,
            moved_count=moved_cnt,
            entries=entries,
        )
