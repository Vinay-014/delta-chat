from src.ingest.pdf_native import PDFNativeAdapter
from src.delta.engine import DeltaEngine
from src.chat.indexer import VectorIndexer

def seed():
    print("Seeding initial P&ID revision documents into vector database...")
    adapter = PDFNativeAdapter()
    doc_a = adapter.process("sample_a.pdf", revision="RevA")
    doc_b = adapter.process("sample_b.pdf", revision="RevB")

    report = DeltaEngine().compare_documents(doc_a, doc_b)

    indexer = VectorIndexer()
    indexer.index_document(doc_a)
    indexer.index_document(doc_b)
    indexer.index_delta_report(report)
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
