from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from src.api.schemas import IngestRequest
from src.canonical.model import Document
from src.api.dependencies import get_adapter_registry, AdapterRegistry, get_vector_indexer, VectorIndexer
from src.utils.cache import cache

router = APIRouter(prefix="/api/v1/ingest", tags=["Ingestion"])

@router.post("", response_model=Document)
async def ingest_document(
    request: IngestRequest,
    registry: AdapterRegistry = Depends(get_adapter_registry),
    indexer: VectorIndexer = Depends(get_vector_indexer),
):
    """Ingest a P&ID document file into canonical Document representation."""
    try:
        adapter = registry.get_adapter(request.file_path)
        doc = adapter.process_with_retry(request.file_path, revision=request.revision)
        cache.set(doc.doc_id, doc)
        indexer.index_document(doc)
        return doc
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ingestion failed: {str(e)}")
