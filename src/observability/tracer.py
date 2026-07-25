import os
from typing import Optional

try:
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
    _OTEL_AVAILABLE = True
except ImportError:
    _OTEL_AVAILABLE = False

class TracerManager:
    """Manages OpenTelemetry tracing configuration."""

    def __init__(self, service_name: str = "pid-delta-chat"):
        self.service_name = service_name
        self.tracer = None
        if _OTEL_AVAILABLE:
            provider = TracerProvider()
            processor = BatchSpanProcessor(ConsoleSpanExporter())
            provider.add_span_processor(processor)
            trace.set_tracer_provider(provider)
            self.tracer = trace.get_tracer(service_name)

    def get_tracer(self):
        return self.tracer

tracer_manager = TracerManager()
