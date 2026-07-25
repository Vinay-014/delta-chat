.PHONY: help install dev test lint docker-build docker-up run-api run-web eval clean

help:
	@echo "PathNovo Delta Chat Makefile"
	@echo "----------------------------"
	@echo "make install      - Install poetry dependencies"
	@echo "make dev          - Run development servers"
	@echo "make run-api      - Launch FastAPI backend"
	@echo "make run-web      - Launch Streamlit frontend"
	@echo "make test         - Run pytest suite with coverage"
	@echo "make eval         - Execute precision/recall/chat evaluation pipeline"
	@echo "make lint         - Run black, isort, and flake8"
	@echo "make docker-build - Build Docker container image"
	@echo "make docker-up    - Run multi-container docker-compose setup"

install:
	poetry install

run-api:
	poetry run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

run-web:
	poetry run streamlit run web/app.py --server.port 8501

test:
	poetry run pytest --cov=src --cov-report=term-missing tests/

eval:
	poetry run python -m eval.run_eval

lint:
	poetry run black src tests web eval
	poetry run isort src tests web eval

docker-build:
	docker build -t pathnovo-delta-chat:latest .

docker-up:
	docker-compose up -d --build

clean:
	rm -rf .pytest_cache .coverage htmlcov cache/* data/reports/* logs/*
