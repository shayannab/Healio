import httpx
from sqlalchemy.orm import Session
from app.mental_insights import models, schemas
import os

# --- AI BACKEND CONFIG ---
AI_BACKEND_URL = os.getenv("AI_BACKEND_URL", "http://localhost:5001/chat")


async def get_ai_chat_response(message: str):
    """
    Server-to-server AI bridge.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                AI_BACKEND_URL,
                json={"message": message},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"AI BACKEND ERROR: {str(e)}")

    return {
        "response": "AI engine unavailable",
        "emotion": "neutral",
        "risk": "low",
        "summary": "AI offline",
        "themes": []
    }


def save_ml_insight(
    db: Session,
    insight_data: schemas.MLInsightCreate,
    background_tasks=None
):
    """
    SINGLE SOURCE OF TRUTH:
    1. Save journal immediately
    2. Background tasks handled separately
    """

    db_insight = models.MLInsight(
        guest_id=insight_data.guest_id,
        dominant_emotion=insight_data.dominant_emotion,
        risk_level=insight_data.risk_level,
        clinical_summary=insight_data.clinical_summary,
        themes=insight_data.themes,
        transcript=insight_data.transcript
    )

    # ✅ FAST DB WRITE
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)

    # 🚀 PLACEHOLDER FOR FUTURE BLOCKCHAIN / AI LOGGING
    # if background_tasks:
    #     background_tasks.add_task(log_to_blockchain, db_insight.id)

    return db_insight


def get_insights_by_guest(db: Session, guest_id: str):
    return (
        db.query(models.MLInsight)
        .filter(models.MLInsight.guest_id == guest_id)
        .all()
    )


def get_all_insights(db: Session, limit: int = 100):
    return db.query(models.MLInsight).limit(limit).all()
