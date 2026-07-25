from typing import List, Optional
from src.ingest.base import FormatAdapter
from src.ingest.pdf_native import PDFNativeAdapter
from src.ingest.pdf_scanned import PDFScannedAdapter
from src.ingest.dwg import DWGAdapter
from src.exceptions import IngestionError

class AdapterRegistry:
    """Registry managing format adapters with automatic strategy resolution."""

    def __init__(self):
        self._adapters: List[FormatAdapter] = [
            PDFNativeAdapter(),
            PDFScannedAdapter(),
            DWGAdapter(),
        ]

    def register_adapter(self, adapter: FormatAdapter) -> None:
        """Register a custom format adapter."""
        self._adapters.insert(0, adapter)

    def get_adapter(self, file_path: str, mime_type: Optional[str] = None) -> FormatAdapter:
        """Select appropriate adapter based on file inspection."""
        for adapter in self._adapters:
            if adapter.supports(file_path, mime_type):
                return adapter
        # Fall back to default PDF native adapter if ambiguous
        return self._adapters[0]

default_registry = AdapterRegistry()
