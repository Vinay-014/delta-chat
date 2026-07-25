#!/bin/bash
set -e

echo "=== Running PathNovo Delta Engine Demo ==="
poetry run python -c "
from src.ingest.pdf_native import PDFNativeAdapter
from src.delta.engine import DeltaEngine

adapter = PDFNativeAdapter()
doc_a = adapter.process('sample_a.pdf', revision='RevA')
doc_b = adapter.process('sample_b.pdf', revision='RevB')

engine = DeltaEngine()
report = engine.compare_documents(doc_a, doc_b)
print(report.to_markdown())
"
