from fastapi import APIRouter
from src.observability.telemetry import telemetry_collector

router = APIRouter(prefix="/api/v1", tags=["System"])

@router.get("/health")
async def health_check():
    """Service liveness and readiness probe."""
    return {"status": "ok", "service": "pid-delta-chat", "version": "1.0.0"}

@router.get("/metrics")
async def get_metrics():
    """Prometheus telemetry & performance metrics."""
    return telemetry_collector.get_system_telemetry()
