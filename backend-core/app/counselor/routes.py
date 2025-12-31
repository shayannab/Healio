from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.auth.service import get_current_user
from app.users.models import User
from app.mental_insights.models import MLInsight
from app.consent.service import verify_access
from app.reports.weekly import generate_weekly_summary
from app.roles.decorators import role_required
from app.counselor import service  # Ensure service is imported

router = APIRouter()

# --- 🚨 CRISIS MANAGEMENT ---

@router.get("/crisis-alerts")
@role_required(["counselor", "admin"])
async def view_active_crises(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Emergency View: Returns all students currently in crisis (Pending SOS)."""
    alerts = service.get_all_active_crises(db)
    return {"active_crisis_count": len(alerts), "alerts": alerts}

@router.post("/resolve-alert/{alert_id}")
@role_required(["counselor"])
async def mark_alert_resolved(
    alert_id: int, 
    note: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Mark an emergency alert as handled after clinical intervention."""
    updated_alert = service.resolve_crisis_alert(db, alert_id, note)
    if not updated_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True, "message": f"Alert {alert_id} resolved by {current_user.full_name}"}

# --- 📊 CLINICAL REPORTS ---

@router.get("/student-report/{guest_id}")
@role_required(["counselor"]) 
async def view_student_report(
    guest_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Verifies Consent and returns detailed clinical data."""
    has_access = verify_access(db, guest_id=guest_id, counselor_id=current_user.id) 
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access Denied: No blockchain-verified consent found."
        )
    
    insight = db.query(MLInsight).filter(MLInsight.guest_id == guest_id).order_by(MLInsight.created_at.desc()).first()
    if not insight:
        raise HTTPException(status_code=404, detail="No clinical insights found.")
    
    return {
        "report_metadata": {"guest_id": guest_id, "status": "Verified"},
        "clinical_data": {
            "dominant_emotion": insight.dominant_emotion,
            "risk_level": insight.risk_level,
            "clinical_summary": insight.clinical_summary,
            "themes": insight.themes
        },
        "weekly_trends": generate_weekly_summary(db, guest_id)
    }

@router.get("/my-students")
@role_required(["counselor"])
async def list_consented_students(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Returns all students who have currently granted access to this counselor."""
    data = service.get_consented_student_data(db, current_user.id)
    return {"consented_students": data}