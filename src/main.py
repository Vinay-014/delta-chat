from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.observability.middleware import ObservabilityMiddleware
from src.api.routes import ingest_router, delta_router, chat_router, health_router

app = FastAPI(
    title=settings.app_name,
    description="Production-Grade P&ID Document Revision Delta & Grounded Chat API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(ObservabilityMiddleware)

app.include_router(health_router)
app.include_router(ingest_router)
app.include_router(delta_router)
app.include_router(chat_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
