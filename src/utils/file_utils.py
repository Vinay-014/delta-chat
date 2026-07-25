import os
import hashlib

def compute_file_hash(file_path: str) -> str:
    """Compute SHA256 checksum of a file."""
    sha = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()

def ensure_dir(dir_path: str) -> None:
    """Ensure directory path exists."""
    os.makedirs(dir_path, exist_ok=True)
