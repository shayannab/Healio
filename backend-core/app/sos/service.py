from sqlalchemy.orm import Session
from .models import SOSEvent

def trigger_sos_escalation(db: Session, guest_id: str, summary: str):
    # 1. Log the event
    sos_log = SOSEvent(
        guest_id=guest_id,
        risk_level="High",
        trigger_message=summary
    )
    db.add(sos_log)
    db.commit()

    # 2. Return emergency resources
    # This is what the frontend will display immediately
    return {
        "alert": "CRITICAL_RISK_DETECTED",
        "message": "We are concerned about your wellbeing. Please reach out to these resources immediately.",
        "resources": {
            "Tele-MANAS": "14416",
            "Student_Support_Cell": "Ext 555",
            "Emergency": "112"
        }
    }