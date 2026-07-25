import json
from typing import Dict, Any
from src.canonical.model import Document

class CanonicalSerializer:
    @staticmethod
    def to_json(doc: Document) -> str:
        """Serialize Document model to JSON string."""
        return doc.model_dump_json(indent=2)

    @staticmethod
    def from_json(json_str: str) -> Document:
        """Deserialize Document model from JSON string."""
        data = json.loads(json_str)
        return Document.model_validate(data)

    @staticmethod
    def to_dict(doc: Document) -> Dict[str, Any]:
        """Convert Document model to dictionary."""
        return doc.model_dump()

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Document:
        """Create Document model from dictionary."""
        return Document.model_validate(data)
