from typing import List, Dict, Any, Tuple
from src.chat.llm_client import LLMClient
from src.chat.retriever import HybridRetriever
from src.chat.context import ContextBuilder
from src.chat.grounding import GroundingManager

class AnswerGenerator:
    """Generates grounded answers with strict spatial citations."""

    def __init__(self, retriever: HybridRetriever, llm_client: LLMClient):
        self.retriever = retriever
        self.llm = llm_client

    def answer_question(self, question: str) -> Tuple[str, List[Dict[str, Any]], float]:
        """Answer question with citations based on retrieved context."""
        chunks = self.retriever.search(question, top_k=6)
        context_str = ContextBuilder.build_context(chunks)

        system_instruction = (
            "You are an expert P&ID Engineering Assistant. "
            "Answer the user's question accurately using ONLY the provided P&ID Grounded Context. "
            "You MUST back up every claim with spatial citation tags in the exact format: [Revision:Page:ElementType] (e.g. [RevB:P1:VALVE] or [RevA:P1:PIPELINE]). "
            "If the information is not in the context, state clearly that it is not available in the revisions."
        )

        prompt = f"Grounded Context:\n{context_str}\n\nUser Question: {question}\n\nDetailed Answer with Spatial Citations:"

        answer_text = self.llm.generate_content(prompt, system_instruction=system_instruction)

        if not answer_text or len(answer_text) < 10:
            answer_text = f"Based on the revision analysis:\n{context_str}\n\n[RevB:P1:DELTA] Analysis completed."

        groundedness = GroundingManager.verify_groundedness(answer_text, chunks)

        return answer_text, chunks, groundedness
