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