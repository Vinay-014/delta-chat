import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from src.observability.metrics import metrics
from src.observability.logger import logger

class ObservabilityMiddleware(BaseHTTPMiddleware):
    """ASGI Middleware injecting correlation IDs and recording HTTP metrics."""

    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", f"corr_{uuid.uuid4().hex[:8]}")
        request.state.correlation_id = correlation_id

        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        metrics.record_request(request.url.path, duration)
        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Response-Time"] = f"{duration:.3f}s"

        logger.info(
            f"{request.method} {request.url.path} - Status {response.status_code} in {duration:.3f}s",
            extra={"correlation_id": correlation_id}
        )

        return response
