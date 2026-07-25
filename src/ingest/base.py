import abc
import time
from typing import Callable, Optional
from src.canonical.model import Document
from src.exceptions import IngestionError

class FormatAdapter(abc.ABC):
    """Abstract Strategy interface for document format adapters."""

    @abc.abstractmethod
    def supports(self, file_path: str, mime_type: Optional[str] = None) -> bool:
        """Check if adapter handles the target document format."""
        pass

    @abc.abstractmethod
    def process(
        self,
        file_path: str,
        revision: str = "RevA",
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> Document:
        """Process input file and return canonical Document object."""
        pass

    def process_with_retry(
        self,
        file_path: str,
        revision: str = "RevA",
        max_retries: int = 3,
        backoff_factor: float = 0.5,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> Document:
        """Execute ingestion strategy with exponential backoff retry logic."""
        last_err = None
        for attempt in range(1, max_retries + 1):
            try:
                if progress_callback:
                    progress_callback(0.1 * attempt / max_retries, f"Attempt {attempt}/{max_retries} parsing document")
                return self.process(file_path, revision=revision, progress_callback=progress_callback)
            except Exception as e:
                last_err = e
                if attempt < max_retries:
                    time.sleep(backoff_factor * (2 ** (attempt - 1)))
        raise IngestionError(f"Failed to process document after {max_retries} attempts: {last_err}") from last_err
