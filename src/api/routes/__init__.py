from src.api.routes.ingest import router as ingest_router
from src.api.routes.delta import router as delta_router
from src.api.routes.chat import router as chat_router
from src.api.routes.health import router as health_router

__all__ = [
    "ingest_router",
    "delta_router",
    "chat_router",
    "health_router",
]
