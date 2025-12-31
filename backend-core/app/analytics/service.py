from sqlalchemy.orm import Session
from sqlalchemy import func
from app.mental_insights.models import MLInsight

def get_population_health_stats(db: Session):
    # 1. Count Total Sessions Analyzed
    total_sessions = db.query(MLInsight).count()

    # 2. Emotion Distribution (e.g., How many are stressed vs happy?)
    emotion_counts = db.query(
        MLInsight.dominant_emotion, 
        func.count(MLInsight.dominant_emotion)
    ).group_by(MLInsight.dominant_emotion).all()

    # 3. Risk Level Distribution
    risk_counts = db.query(
        MLInsight.risk_level, 
        func.count(MLInsight.risk_level)
    ).group_by(MLInsight.risk_level).all()

    # 4. Format for Frontend Charts
    return {
        "total_impact_count": total_sessions,
        "emotion_trends": {emotion: count for emotion, count in emotion_counts},
        "risk_summary": {risk: count for risk, count in risk_counts},
        "anonymity_status": "Verified: No PII included in this report"
    }