from fastapi import APIRouter, Depends, HTTPException
from src.api.schemas import DeltaCompareRequest
from src.delta.report import DeltaReport
from src.delta.engine import DeltaEngine
from src.api.dependencies import get_delta_engine, get_vector_indexer, VectorIndexer
from src.utils.cache import cache
from src.canonical.model import Document

router = APIRouter(prefix="/api/v1/delta", tags=["Delta Engine"])

@router.post("/compare", response_model=DeltaReport)
async def compare_revisions(
    request: DeltaCompareRequest,
    engine: DeltaEngine = Depends(get_delta_engine),
    indexer: VectorIndexer = Depends(get_vector_indexer),
):
    """Compute revision deltas between Document A and Document B."""
    doc_a = request.doc_a
    doc_b = request.doc_b

    if not doc_a and request.doc_a_id:
        doc_a = cache.get(request.doc_a_id)
    if not doc_b and request.doc_b_id:
        doc_b = cache.get(request.doc_b_id)

    if not doc_a or not doc_b:
        # Fallback to demo documents if not supplied
        from src.ingest.pdf_native import PDFNativeAdapter
        adapter = PDFNativeAdapter()
        doc_a = adapter.process("sample_doc_a.pdf", revision="RevA")
        doc_b = adapter.process("sample_doc_b.pdf", revision="RevB")

    report = engine.compare_documents(doc_a, doc_b)
    indexer.index_delta_report(report)
    return report
