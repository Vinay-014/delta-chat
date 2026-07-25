from typing import List, Dict, Any

class ContextBuilder:
    """Builds grounded context prompt from retrieved document & delta chunks."""

    @staticmethod
    def build_context(chunks: List[Dict[str, Any]]) -> str:
        if not chunks:
            return "No relevant P&ID elements found."

        context_lines = []
        for idx, chunk in enumerate(chunks, start=1):
            rev = chunk.get("revision", "N/A")
            page = chunk.get("page", 1)
            etype = chunk.get("element_type", "ELEMENT")
            text = chunk.get("text", "")
            citation_tag = f"[{rev}:P{page}:{etype}]"
            context_lines.append(f"{idx}. {citation_tag} - {text}")

        return "\n".join(context_lines)
