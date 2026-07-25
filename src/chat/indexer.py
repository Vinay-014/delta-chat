import math
from typing import List, Dict, Any
from src.canonical.model import Document, DocumentElement
from src.delta.report import DeltaReport

class VectorIndexer:
    """Index canonical document elements and delta entries into in-memory vector store."""

    def __init__(self):
        self.documents: List[Dict[str, Any]] = []

    def index_document(self, doc: Document) -> None:
        """Index elements of a Document."""
        for elem in doc.elements:
            chunk_id = f"{doc.doc_id}_{elem.id}"
            text_payload = f"[{doc.revision}] [{elem.type.value}] {elem.text} (Page {elem.bbox.page}, BBox: x1={elem.bbox.x1:.1f}, y1={elem.bbox.y1:.1f})"
            self.documents.append({
                "id": chunk_id,
                "text": text_payload,
                "raw_text": elem.text,
                "doc_id": doc.doc_id,
                "revision": doc.revision,
                "page": elem.bbox.page,
                "element_type": elem.type.value,
                "bbox": [elem.bbox.x1, elem.bbox.y1, elem.bbox.x2, elem.bbox.y2],
                "type": "element"
            })

    def index_delta_report(self, report: DeltaReport) -> None:
        """Index delta entries of a DeltaReport."""
        for entry in report.entries:
            text_payload = f"[DELTA: {entry.change_type.value}] [{entry.element_type}] {entry.description} (Confidence: {entry.confidence})"
            page = entry.rev_b_element.bbox.page if entry.rev_b_element else (entry.rev_a_element.bbox.page if entry.rev_a_element else 1)
            self.documents.append({
                "id": entry.id,
                "text": text_payload,
                "raw_text": entry.description,
                "doc_id": "delta_report",
                "revision": f"{report.revision_a}->{report.revision_b}",
                "page": page,
                "element_type": entry.element_type,
                "change_type": entry.change_type.value,
                "type": "delta"
            })
