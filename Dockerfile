FROM python:3.11-slim as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VERSION=1.7.1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    tesseract-ocr \
    poppler-utils \
    curl \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml poetry.lock* setup.py* ./
RUN pip install poetry==$POETRY_VERSION && poetry config virtualenvs.create false
RUN poetry install --no-root --no-interaction

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000 8000 8501

CMD ["npm", "start"]
