from datetime import datetime

def format_timestamp() -> str:
    """Return formatted ISO timestamp string."""
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
