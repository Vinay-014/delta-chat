from src.canonical.model import Document
from src.exceptions import ValidationError

class CanonicalValidator:
    @staticmethod
    def validate_document(doc: Document) -> bool:
        """Validate integrity of canonical Document."""
        if not doc.doc_id:
            raise ValidationError("Document doc_id cannot be empty")
        if not doc.filename:
            raise ValidationError("Document filename cannot be empty")
        if doc.pages < 1:
            raise ValidationError("Document must have at least 1 page")
        
        for idx, elem in enumerate(doc.elements):
            if not elem.id:
                raise ValidationError(f"Element at index {idx} has missing id")
            if elem.bbox.page < 1 or elem.bbox.page > doc.pages:
                raise ValidationError(
                    f"Element {elem.id} page {elem.bbox.page} out of bounds [1, {doc.pages}]"
                )
            if elem.bbox.x2 < elem.bbox.x1 or elem.bbox.y2 < elem.bbox.y1:
                raise ValidationError(f"Element {elem.id} has invalid coordinates x2 < x1 or y2 < y1")
                
        return True
