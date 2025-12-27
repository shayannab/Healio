from sqlalchemy.orm import Session
from app.mental_insights import models, schemas

def save_ml_insight(db: Session, insight_data: schemas.MLInsightCreate):
    """
    Persists AI-generated analysis into the Silent Observer vault.
    This function is called by the /push route.
    """
    # Create the database object from the Pydantic schema
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
    Used by counselors to see trends.
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