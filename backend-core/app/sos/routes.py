from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.auth.service import get_current_user
from app.users.models import User
from app.sos import service, schemas  # ✅ Explicit package import

router = APIRouter()

@router.post("/trigger", status_code=status.HTTP_201_CREATED)
async def trigger_emergency_alert(
    sos_data: schemas.SOSCreate, 
    db: Session = Depends(get_db)
):
    """
    Emergency Escalation:
    1. Logs the event for clinical audit.
    2. Returns high-priority resources (Tele-MANAS, etc.)
    3. Bridges anonymous Guest ID to emergency protocol.
    """
    alert_response = service.trigger_sos_escalation(
        db, 
        guest_id=sos_data.guest_id, 
        summary=sos_data.reason
    )
    
    return {
        "status": "CRITICAL_ALERT_ACTIVATED",
        "timestamp": "immediate",
        "action_plan": alert_response
    }

@router.get("/active-alerts")
def get_all_unresolved_sos(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Clinical Safety View: 
    Allows Counselors/Admins to see students in crisis.
    """
    # Authorization Gate
    if current_user.role not in ["counselor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access Denied: High-level clinical clearance required."
        )
        
    # Query pending alerts via the service logic
    alerts = service.get_pending_alerts(db) 
    return {
        "active_crisis_count": len(alerts), 
        "alerts": alerts
    }