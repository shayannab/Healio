import httpx
from sqlalchemy.orm import Session
from app.mental_insights import models, schemas
import os

# --- INTEGRATION CONFIGURATION ---
# Points to the Flask AI Backend (port 5001)
AI_BACKEND_URL = os.getenv("AI_BACKEND_URL", "http://localhost:5001/chat")

async def get_ai_chat_response(message: str):
    """
    SERVER-TO-SERVER BRIDGE:
    Calls the Flask AI engine to get RAG-based response and NLP analysis.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Send message to Spandan's Flask server
            response = await client.post(
                AI_BACKEND_URL,
                json={"message": message},
                timeout=30.0  # RAG over 420k entries takes time
            )
            
            if response.status_code == 200:
                return response.json() 
            
    except Exception as e:
        print(f"DEBUG ERROR: Connection to Backend-AI failed: {str(e)}")
    
    # Fallback if AI server is down
    return {
        "response": "I'm here for you, but I'm having trouble processing right now.",
        "emotion": "neutral",
        "risk": "low",
        "summary": "AI Engine Offline",
        "themes": []
    }

def save_ml_insight(db: Session, insight_data: schemas.MLInsightCreate):
    """
    Persists AI-generated analysis into the Silent Observer vault.
    """
    db_insight = models.MLInsight(
        guest_id=insight_data.guest_id,
        dominant_emotion=insight_data.dominant_emotion,
        risk_level=insight_data.risk_level,
        clinical_summary=insight_data.clinical_summary,
        themes=insight_data.themes
    )
    
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight

def get_insights_by_guest(db: Session, guest_id: str):
    """
    Fetches all historical AI insights for a specific anonymous session.
    """
    return db.query(models.MLInsight).filter(models.MLInsight.guest_id == guest_id).all()

def get_all_insights(db: Session, limit: int = 100):
    """
    Used for the Admin Analytics dashboard to see system-wide trends.
    """
    return db.query(models.MLInsight).limit(limit).all()

def create_mood_log(db: Session, user_id: int, log_data: schemas.MoodLogCreate):
    """
    Saves a user's self-reported mood log.
    """
    db_log = models.MoodLog(
        user_id=user_id,
        mood=log_data.mood,
        note=log_data.note,
        transcript=log_data.transcript,
        acoustic_signals=log_data.acoustic_signals
        # created_at is automatic
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_user_moods(db: Session, user_id: int, limit: int = 7):
    """
    Get recent mood logs for a user (default 7 for weekly view).
    """
    return db.query(models.MoodLog)\
             .filter(models.MoodLog.user_id == user_id)\
             .order_by(models.MoodLog.created_at.desc())\
             .limit(limit)\
             .all()