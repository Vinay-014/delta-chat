from typing import Dict, Any, List

class PrometheusMetrics:
    """Prometheus metrics registry and accumulator."""

    def __init__(self):
        self.request_count = 0
        self.total_tokens = 0
        self.estimated_cost_usd = 0.0
        self.latencies: List[float] = []
        self.deltas_computed = 0

    def record_request(self, endpoint: str, duration_sec: float) -> None:
        self.request_count += 1
        self.latencies.append(duration_sec)

    def record_llm_usage(self, prompt_tokens: int, completion_tokens: int) -> None:
        tokens = prompt_tokens + completion_tokens
        self.total_tokens += tokens
        # Gemini 3.6 Flash free tier rate or $0.000075 / 1k tokens
        self.estimated_cost_usd += (tokens / 1000.0) * 0.000075

    def record_delta(self, change_count: int) -> None:
        self.deltas_computed += 1

    def get_summary(self) -> Dict[str, Any]:
        avg_latency = (sum(self.latencies) / len(self.latencies)) if self.latencies else 0.0
        return {
            "total_requests": self.request_count,
            "average_latency_sec": round(avg_latency, 3),
            "total_tokens_used": self.total_tokens,
            "estimated_cost_usd": round(self.estimated_cost_usd, 6),
            "deltas_computed": self.deltas_computed,
        }

metrics = PrometheusMetrics()
