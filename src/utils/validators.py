import os
from src.exceptions import ValidationError

ALLOWED_EXTENSIONS = {".pdf", ".dwg", ".dxf", ".png", ".jpg"}

def validate_file_upload(filename: str, file_size: int = 0) -> bool:
    """Validate uploaded document file extension and size."""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"File extension '{ext}' not supported. Allowed: {ALLOWED_EXTENSIONS}")
    if file_size > 50 * 1024 * 1024: # 50MB
        raise ValidationError("File size exceeds 50MB limit.")
    return True
