import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    app_name: str = "P&ID Delta Chat"
    environment: str = Field(default="production", env="ENVIRONMENT")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=3000, env="PORT")
    
    gemini_api_key: str = Field(default="", env="GEMINI_API_KEY")
    groq_api_key: str = Field(default="", env="GROQ_API_KEY")
    
    vector_store_path: str = Field(default="./data/chroma_db", env="VECTOR_STORE_PATH")
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    otel_service_name: str = Field(default="pid-delta-chat", env="OTEL_SERVICE_NAME")
    enable_prometheus_metrics: bool = Field(default=True, env="ENABLE_PROMETHEUS_METRICS")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
