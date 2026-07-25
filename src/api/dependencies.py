from src.ingest.registry import default_registry, AdapterRegistry
from src.delta.engine import DeltaEngine
from src.chat.llm_client import LLMClient
from src.chat.indexer import VectorIndexer
from src.chat.retriever import HybridRetriever
from src.chat.answer import AnswerGenerator

def get_adapter_registry() -> AdapterRegistry:
    return default_registry

def get_delta_engine() -> DeltaEngine:
    return DeltaEngine()

_vector_indexer = VectorIndexer()
_llm_client = LLMClient()
_retriever = HybridRetriever(_vector_indexer)
_answer_generator = AnswerGenerator(_retriever, _llm_client)

def get_vector_indexer() -> VectorIndexer:
    return _vector_indexer

def get_hybrid_retriever() -> HybridRetriever:
    return _retriever

def get_answer_generator() -> AnswerGenerator:
    return _answer_generator
