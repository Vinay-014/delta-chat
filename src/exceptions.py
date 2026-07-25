class PIDDeltaException(Exception):
    """Base exception class for P&ID Delta system."""
    pass

class IngestionError(PIDDeltaException):
    """Raised when document parsing or ingestion fails."""
    pass

class ValidationError(PIDDeltaException):
    """Raised when document schema validation fails."""
    pass

class DeltaEngineError(PIDDeltaException):
    """Raised during revision delta alignment or classification."""
    pass

class RetrievalError(PIDDeltaException):
    """Raised when context retrieval or indexing fails."""
    pass

class LLMServiceError(PIDDeltaException):
    """Raised when LLM generation or grounding fails."""
    pass
