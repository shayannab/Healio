from fastapi import APIRouter, Depends, status, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.sos.service import trigger_sos_escalation
from app.mental_insights import service, schemas, models

router = APIRouter()

# ------------------------------------------------------------------
# INGESTION ENDPOINT (TEXT + VOICE BOTH COME HERE)
# ------------------------------------------------------------------
@router.post(
    "/push",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.MLInsightResponse
)
def push_ml_analysis(
    insight: schemas.MLInsightCreate,
    background_tasks: BackgroundTasks,   # ✅ ADD THIS
    db: Session = Depends(get_db)
):
    """
    Ingests AI / User journal.
    Saves immediately.
    Heavy tasks run in background.
    """

    # ✅ FAST DB SAVE
    saved_insight = service.save_ml_insight(
        db=db,
        insight_data=insight,
        background_tasks=background_tasks
    )

    # ✅ SOS SHOULD NOT BLOCK RESPONSE
    if insight.risk_level and insight.risk_level.lower() == "high":
        background_tasks.add_task(
            trigger_sos_escalation,
            db,
            insight.guest_id,
            f"AI AUTO-ESCALATION: {insight.clinical_summary}"
        )

    return saved_insight


# ------------------------------------------------------------------
# JOURNAL FEED (USED BY FRONTEND)
# ------------------------------------------------------------------
@router.get("/journal/recent")
def get_journal_feed(db: Session = Depends(get_db)):
    """
    Formats insights for the Journal UI.
    """
    raw_insights = (
        db.query(models.MLInsight)
        .order_by(models.MLInsight.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "entries": [
            {
                "id": entry.id,
                "date": entry.created_at.isoformat(),
                "preview": entry.clinical_summary or "No summary available",
                "content": entry.clinical_summary,
                "mood": entry.dominant_emotion.lower(),
                "tags": entry.themes or ["Check-in"],
                "hasDistress": entry.risk_level == "high",
            }
            for entry in raw_insights
        ]
    }


# ------------------------------------------------------------------
# ANALYTICS / ADMIN ENDPOINTS (UNCHANGED)
# ------------------------------------------------------------------
@router.get("/all", response_model=List[schemas.MLInsightResponse])
def get_all_vault_insights(limit: int = 100, db: Session = Depends(get_db)):
    return service.get_all_insights(db, limit=limit)


@router.get("/session/{guest_id}", response_model=List[schemas.MLInsightResponse])
def get_session_insights(guest_id: str, db: Session = Depends(get_db)):
    insights = service.get_insights_by_guest(db, guest_id=guest_id)
    if not insights:
        raise HTTPException(status_code=404, detail="No insights found for this guest")
    return insights


# ------------------------------------------------------------------
# CONTEXTUAL MICRO-INTERVENTIONS
# ------------------------------------------------------------------

from pydantic import BaseModel
class EnergyLogCreate(BaseModel):
    level: int
    action: str
    change: int

@router.post("/energy")
def log_energy(
    log: EnergyLogCreate,
    db: Session = Depends(get_db)
):
    """Logs a user's energy level update from the Battery Game."""
    # TODO: Get actual user_id from auth. Using 1 for demo.
    user_id = 1 
    
    db_log = models.EnergyLog(
        user_id=user_id,
        level=log.level,
        action=log.action,
        change=log.change
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {"status": "energy logged", "level": db_log.level}

@router.get("/interventions")
def get_interventions(db: Session = Depends(get_db)):
    """
    Runs the Rules Engine against the user's data to suggest interventions.
    """
    # TODO: Get actual user_id from auth. Using 1 for demo.
    user_id = 1
    
    from app.mental_insights.rules_engine import InterventionEngine
    engine = InterventionEngine(db, user_id)
    recommendations = engine.run_all_checks()
    
    return recommendations

