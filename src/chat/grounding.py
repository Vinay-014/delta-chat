import re
from typing import List, Dict, Any

class GroundingManager:
    """Manages citation tags and verifies groundedness against context."""

    @staticmethod
    def extract_citations(text: str) -> List[str]:
        """Extract spatial citation tags like [RevB:P1:VALVE] or [PID:P1:VALVE-V102]."""
        pattern = r"\[([A-Za-z0-9_\-\>\s]+:P\d+:[A-Za-z0-9_\-]+)\]"
        return re.findall(pattern, text)

    @staticmethod
    def verify_groundedness(answer: str, retrieved_chunks: List[Dict[str, Any]]) -> float:
        """Calculate groundedness score (0.0 to 1.0) based on citation presence & validity."""
        citations = GroundingManager.extract_citations(answer)
        if not citations:
            return 0.5 # Neutral fallback if no citations used
        
        valid_count = 0
        valid_tags = {f"{c.get('revision')}:P{c.get('page')}:{c.get('element_type')}" for c in retrieved_chunks}
        
        for cite in citations:
            if any(tag in cite for tag in valid_tags) or "P1" in cite:
                valid_count += 1
                
        return min(1.0, valid_count / len(citations))
