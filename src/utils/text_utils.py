import re

def normalize_text(text: str) -> str:
    """Normalize text whitespace and strip non-printable characters."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_pid_tags(text: str) -> list[str]:
    """Extract P&ID tags (valves, pumps, lines, instruments)."""
    pattern = r"\b(?:V|P|TK|PT|TT|LT|FIT|FE|CV|PL)-\d{3,4}[A-Z]?\b"
    return re.findall(pattern, text)
