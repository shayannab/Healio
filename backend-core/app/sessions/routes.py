from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.sos.service import trigger_sos_escalation
from app.mental_insights import service, schemas

router = APIRouter()

# ------------------------------------------------------------------
# INGESTION ENDPOINT (AI Backend calls this)
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

    # 1. Save the ML insight to the Silent Observer vault
    saved_insight = service.save_ml_insight(db, insight)

    # 2. Automated Safety Governance: Bridge to SOS if Risk is 'High'
    if insight.risk_level.lower() == "high":
        trigger_sos_escalation(
            db,
            guest_id=insight.guest_id,
            summary=f"AI AUTO-ESCALATION: {insight.clinical_summary}"
        )

    # Return clean response (Pydantic handles serialization)
    return saved_insight


# ------------------------------------------------------------------
# TABLE DATA ENDPOINTS (Frontend / Analytics)
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
    """
    insights = service.get_insights_by_guest(db, guest_id=guest_id)

    if not insights:
        raise HTTPException(
            status_code=404,
            detail="No insights found for this guest"
        )

    return insights
