import pytest
from src.ingest.pdf_native import PDFNativeAdapter
from src.delta.engine import DeltaEngine
from src.chat.indexer import VectorIndexer
from src.chat.retriever import HybridRetriever
from src.chat.llm_client import LLMClient
from src.chat.answer import AnswerGenerator

def test_full_end_to_end_pipeline():
    adapter = PDFNativeAdapter()
    doc_a = adapter.process("sample_a.pdf", revision="RevA")
    doc_b = adapter.process("sample_b.pdf", revision="RevB")

    engine = DeltaEngine()
    report = engine.compare_documents(doc_a, doc_b)

    indexer = VectorIndexer()
    indexer.index_document(doc_a)
    indexer.index_document(doc_b)
    indexer.index_delta_report(report)

    retriever = HybridRetriever(indexer)
    llm = LLMClient()
    answer_gen = AnswerGenerator(retriever, llm)

    ans, chunks, score = answer_gen.answer_question("What items were added?")
    assert len(chunks) > 0
    assert score >= 0.0
