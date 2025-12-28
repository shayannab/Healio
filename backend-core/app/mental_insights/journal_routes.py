from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.mental_insights.models import MLInsight

router = APIRouter()

@router.get("/recent")
def get_recent_journals(db: Session = Depends(get_db)):
    """
    Fetches recent AI-generated mental insights
    and formats them as Journal Entries for the frontend.
    """

    insights = (
        db.query(MLInsight)
        .order_by(MLInsight.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "entries": [
            {
                "id": insight.id,
                "date": insight.created_at.isoformat(),
                "preview": (
                    insight.clinical_summary[:80] + "..."
                    if insight.clinical_summary
                    else ""
                ),
                "content": insight.clinical_summary,
                "mood": insight.dominant_emotion,
                "tags": insight.themes or [],
                "hasDistress": insight.risk_level == "high"
            }
            for insight in insights
        ]
    }
