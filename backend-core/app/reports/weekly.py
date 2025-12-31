from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.mental_insights.models import MLInsight

def generate_weekly_summary(db: Session, guest_id: str):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Fetch insights from the last week
    insights = db.query(MLInsight).filter(
        MLInsight.guest_id == guest_id,
        MLInsight.created_at >= seven_days_ago
    ).all()

    if not insights:
        return {"message": "No data available for the past week."}

    # Aggregate Data
    emotions = [i.dominant_emotion for i in insights]
    dominant_weekly_emotion = max(set(emotions), key=emotions.count)
    
    all_themes = []
    for i in insights:
        all_themes.extend(i.themes)
    
    unique_themes = list(set(all_themes))
    risk_levels = [i.risk_level for i in insights]
    highest_risk = "High" if "High" in risk_levels else "Medium" if "Medium" in risk_levels else "Low"

    return {
        "start_date": seven_days_ago.strftime("%Y-%m-%d"),
        "end_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "dominant_emotion": dominant_weekly_emotion,
        "themes_detected": unique_themes,
        "highest_risk_recorded": highest_risk,
        "total_checkins": len(insights)
    }