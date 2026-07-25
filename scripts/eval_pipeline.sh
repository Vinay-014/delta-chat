#!/bin/bash
set -e

echo "=== Running PathNovo System Evaluation ==="
poetry run python -m eval.run_eval
