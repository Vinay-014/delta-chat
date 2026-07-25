from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from src.canonical.model import Document
from src.delta.report import DeltaReport

class IngestRequest(BaseModel):
    file_path: str = Field(..., description="Path to P&ID document file")
    revision: str = Field(default="RevA", description="Revision identifier")
    adapter_override: Optional[str] = Field(default=None, description="Force specific adapter")

class DeltaCompareRequest(BaseModel):
    doc_a_id: Optional[str] = None
    doc_b_id: Optional[str] = None
    doc_a: Optional[Document] = None
    doc_b: Optional[Document] = None

class ChatQueryRequest(BaseModel):
    question: str = Field(..., description="User question regarding P&ID revisions")
    session_id: Optional[str] = None

class ChatQueryResponse(BaseModel):
    answer: str
    groundedness_score: float
    citations: List[str]
    retrieved_chunks: List[Dict[str, Any]]
