from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.sos.service import trigger_sos_escalation
from app.mental_insights import service, schemas

router = APIRouter()

@router.post("/push", status_code=status.HTTP_201_CREATED)
def push_ml_analysis(
    insight: schemas.MLInsightCreate,
    db: Session = Depends(get_db)
    # Removed get_current_user to allow the ML Service to push data via guest_id
):
    """
    Ingests AI Analysis. 
    Secured by guest_id linkage rather than User JWT to maintain anonymity.
    """
    # 1. Save the ML insight to the database
    saved_insight = service.save_ml_insight(db, insight)

    # 2. Automated Safety Governance: Bridge to SOS if Risk is 'High'
    if insight.risk_level.lower() == "high":
        sos_response = trigger_sos_escalation(
            db,
            guest_id=insight.guest_id,
            summary=f"AI AUTO-ESCALATION: {insight.clinical_summary}"
        )
        return {
            "success": True,
            "data": saved_insight,
            "emergency_alert": sos_response
        }

    return {
        "success": True, 
        "data": saved_insight
    }