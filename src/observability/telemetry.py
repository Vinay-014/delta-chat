from typing import Dict, Any
from src.observability.metrics import metrics
from src.observability.tracer import tracer_manager

class TelemetryCollector:
    """Central telemetry collector aggregating system performance metrics."""

    @staticmethod
    def get_system_telemetry() -> Dict[str, Any]:
        return {
            "metrics": metrics.get_summary(),
            "tracing_active": tracer_manager.get_tracer() is not None,
            "status": "healthy"
        }

telemetry_collector = TelemetryCollector()
