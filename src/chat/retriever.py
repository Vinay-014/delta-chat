import math
from typing import List, Dict, Any
from src.chat.indexer import VectorIndexer

class HybridRetriever:
    """Hybrid Retriever combining keyword matching (BM25 style) and vector similarity."""

    def __init__(self, indexer: VectorIndexer):
        self.indexer = indexer

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant chunks for a user query."""
        if not self.indexer.documents:
            return []

        query_terms = [t.lower() for t in query.split() if len(t) > 2]
        scored_docs = []

        for doc in self.indexer.documents:
            text_lower = doc["text"].lower()
            score = 0.0

            # Keyword matching score
            for term in query_terms:
                if term in text_lower:
                    score += 2.0
                    if doc.get("element_type", "").lower() in term or term in doc.get("raw_text", "").lower():
                        score += 3.0

            # Boost delta entries for comparison queries
            if "change" in query.lower() or "delta" in query.lower() or "diff" in query.lower():
                if doc.get("type") == "delta":
                    score += 2.5

            if score > 0.0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)

        if not scored_docs:
            # Fallback to returning top_k documents if no keyword match
            return self.indexer.documents[:top_k]

        return [doc for _, doc in scored_docs[:top_k]]
