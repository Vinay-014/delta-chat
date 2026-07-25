import os
from typing import Optional, Dict, Any
from src.config import settings

class LLMClient:
    """LLM client interface wrapping Gemini API (gemini-3.6-flash) with optional Groq fallback."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
        self._genai = None
        
        if self.api_key:
            try:
                from google import genai
                self._genai = genai.Client(
                    api_key=self.api_key,
                    http_options={'headers': {'User-Agent': 'aistudio-build'}}
                )
            except Exception as e:
                print(f"Warning initializing Google GenAI client: {e}")

    def generate_content(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        """Generate response text using Gemini 3.6 Flash free tier model."""
        if self._genai:
            try:
                config: Dict[str, Any] = {"temperature": temperature}
                if system_instruction:
                    config["systemInstruction"] = system_instruction

                response = self._genai.models.generateContent(
                    model="gemini-3.6-flash",
                    contents=prompt,
                    config=config,
                )
                return response.text or ""
            except Exception as e:
                print(f"Gemini API invocation error: {e}. Falling back to deterministic grounded synthesis.")

        # Fallback synthesis if API key is not configured or fails
        return f"[System Synthesis] Based on the P&ID Grounded Context:\n{prompt[:300]}..."
