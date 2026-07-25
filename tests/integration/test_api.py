import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_metrics_endpoint():
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data

def test_delta_compare_endpoint():
    response = client.post("/api/v1/delta/compare", json={})
    assert response.status_code == 200
    data = response.json()
    assert "total_changes" in data
