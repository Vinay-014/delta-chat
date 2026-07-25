import pytest
from src.ingest.pdf_native import PDFNativeAdapter
from src.ingest.pdf_scanned import PDFScannedAdapter
from src.ingest.dwg import DWGAdapter
from src.ingest.registry import AdapterRegistry

def test_pdf_native_adapter():
    adapter = PDFNativeAdapter()
    assert adapter.supports("drawing.pdf")
    doc = adapter.process("drawing.pdf", revision="RevA")
    assert doc.revision == "RevA"
    assert len(doc.elements) > 0

def test_dwg_adapter():
    adapter = DWGAdapter()
    assert adapter.supports("plant.dwg")
    doc = adapter.process("plant.dwg", revision="RevB")
    assert doc.format == "dwg"

def test_adapter_registry():
    registry = AdapterRegistry()
    adapter = registry.get_adapter("test.dwg")
    assert isinstance(adapter, DWGAdapter)
