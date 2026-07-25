import pytest
from src.chat.indexer import VectorIndexer
from src.chat.retriever import HybridRetriever
from src.chat.context import ContextBuilder
from src.chat.grounding import GroundingManager

def test_chat_retrieval_and_citations(sample_doc_rev_a):
    indexer = VectorIndexer()
    indexer.index_document(sample_doc_rev_a)

    retriever = HybridRetriever(indexer)
    results = retriever.search("V-101")

    assert len(results) > 0
    context = ContextBuilder.build_context(results)
    assert "V-101" in context

    citations = GroundingManager.extract_citations("Answer based on [RevA:P1:VALVE]")
    assert len(citations) == 1
    assert citations[0] == "RevA:P1:VALVE"
