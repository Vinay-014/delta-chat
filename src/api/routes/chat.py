from fastapi import APIRouter, Depends, HTTPException
from src.api.schemas import ChatQueryRequest, ChatQueryResponse
from src.chat.answer import AnswerGenerator
from src.chat.grounding import GroundingManager
from src.api.dependencies import get_answer_generator

router = APIRouter(prefix="/api/v1/chat", tags=["Grounded Chat"])

@router.post("/query", response_model=ChatQueryResponse)
async def query_chat(
    request: ChatQueryRequest,
    generator: AnswerGenerator = Depends(get_answer_generator),
):
    """Execute grounded chat query over P&ID revisions with spatial citations."""
    try:
        answer_text, chunks, groundedness = generator.answer_question(request.question)
        citations = GroundingManager.extract_citations(answer_text)
        return ChatQueryResponse(
            answer=answer_text,
            groundedness_score=groundedness,
            citations=citations,
            retrieved_chunks=chunks,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat query processing failed: {str(e)}")
