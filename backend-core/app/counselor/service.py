from sqlalchemy.orm import Session
from app.mental_insights.models import MLInsight
from app.users.models import User
from app.consent.models import ConsentRecord
from app.sos.models import SOSEvent
from app.sessions.models import ChatSession

def get_all_active_crises(db: Session):
    """Emergency Service: Fetches all unresolved SOS alerts."""
    return db.query(SOSEvent).filter(SOSEvent.status == "pending").all()

def resolve_crisis_alert(db: Session, alert_id: int, counselor_note: str):
    """
    Updates an SOS alert status to 'resolved' and logs clinical action notes.
    """
    alert = db.query(SOSEvent).filter(SOSEvent.id == alert_id).first()
    if alert:
        alert.status = "resolved"
        alert.resolution_note = counselor_note
        db.commit()
        db.refresh(alert)
    return alert

def get_consented_student_data(db: Session, counselor_id: int):
    """Privacy-First Service: Fetches clinical data ONLY if consent is active."""
    consented_records = db.query(ConsentRecord).filter(
        ConsentRecord.counselor_id == counselor_id,
        ConsentRecord.is_active == True
    ).all()
    
    results = []
    for record in consented_records:
        student = db.query(User).filter(User.id == record.student_id).first()
        if not student: continue

        session = db.query(ChatSession).filter(ChatSession.user_id == student.id).first()
        if not session: continue

        insight = db.query(MLInsight).filter(
            MLInsight.guest_id == session.temp_chat_id
        ).order_by(MLInsight.created_at.desc()).first()

        if insight:
            results.append({
                "student_name": student.full_name,
                "email": student.email,
                "guest_id": session.temp_chat_id,
                "clinical_data": {
                    "dominant_emotion": insight.dominant_emotion,
                    "risk_level": insight.risk_level,
                    "clinical_summary": insight.clinical_summary,
                    "themes": insight.themes
                },
                "last_updated": insight.created_at
            })
    return results

def get_student_clinical_history(db: Session, guest_id: str):
    """Provides history for a specific anonymous student ID."""
    return db.query(MLInsight).filter(MLInsight.guest_id == guest_id).order_by(MLInsight.created_at.desc()).all()