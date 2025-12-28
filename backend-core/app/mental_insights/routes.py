from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.sos.service import trigger_sos_escalation
from app.mental_insights import service, schemas

router = APIRouter()

# ------------------------------------------------------------------
# INGESTION ENDPOINT (Called by Backend-AI / ML Service)
# ------------------------------------------------------------------

@router.post(
    "/push",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.MLInsightResponse
)
def push_ml_analysis(
    insight: schemas.MLInsightCreate,
    db: Session = Depends(get_db)
):
    """
    Ingests AI Analysis from the Backend-AI.
    Triggers automated SOS if the risk level is 'high'.
    """

    saved_insight = service.save_ml_insight(db, insight)

    # Automated Safety Governance
    if insight.risk_level.lower() == "high":
        trigger_sos_escalation(
            db,
            guest_id=insight.guest_id,
            summary=f"AI AUTO-ESCALATION: {insight.clinical_summary}"
        )

    # Return ONLY the persisted insight (clean API contract)
    return saved_insight


# ------------------------------------------------------------------
# TABLE / ANALYTICS ENDPOINTS (Frontend / Admin Dashboard)
# ------------------------------------------------------------------

@router.get(
    "/all",
    response_model=List[schemas.MLInsightResponse]
)
def get_all_vault_insights(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Fetches all clinical insights stored in the Identity Vault.
    Used for analytics tables and admin dashboards.
    """
    return service.get_all_insights(db, limit=limit)


@router.get(
    "/session/{guest_id}",
    response_model=List[schemas.MLInsightResponse]
)
def get_session_insights(
    guest_id: str,
    db: Session = Depends(get_db)
):
    """
    Fetches insights for a specific anonymous session.
    Used when expanding a row in the analytics table.
    """
    insights = service.get_insights_by_guest(db, guest_id=guest_id)

    if not insights:
        raise HTTPException(
            status_code=404,
            detail="No insights found for this guest"
        )

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

