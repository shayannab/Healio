from sqlalchemy.orm import Session
from app.consent import models, schemas
from app.consent.blockchain import consent_ledger  # Import our ledger
from fastapi import HTTPException

def update_consent(db: Session, student_id: int, counselor_id: int, is_active: bool):
    """
    Updates the Privacy Gate in SQL and anchors the event in the Blockchain.
    """
    # 1. Update/Create SQL Record
    record = db.query(models.ConsentRecord).filter(
        models.ConsentRecord.student_id == student_id,
        models.ConsentRecord.counselor_id == counselor_id
    ).first()

    if not record:
        record = models.ConsentRecord(
            student_id=student_id,
            counselor_id=counselor_id,
            is_active=is_active
        )
        db.add(record)
    else:
        record.is_active = is_active
    
    db.commit()
    db.refresh(record)

    # 2. Blockchain Anchoring
    action_type = "GRANTED" if is_active else "REVOKED"
    new_block = consent_ledger.add_consent_event(
        student_id=str(student_id), 
        action=action_type
    )

    return {
        "sql_record": record,
        "blockchain_block": {
            "index": new_block.index,
            "hash": new_block.hash,
            "action": action_type
        }
    }

def verify_access(db: Session, guest_id: str, counselor_id: int) -> bool:
    """
    The Clinical Gatekeeper: Checks if a counselor is allowed to see data.
    """
    # Find the user linked to this guest_id
    from app.sessions.models import ChatSession
    session = db.query(ChatSession).filter(ChatSession.temp_chat_id == guest_id).first()
    
    if not session:
        return False

    # Check SQL for active consent
    consent = db.query(models.ConsentRecord).filter(
        models.ConsentRecord.student_id == session.user_id,
        models.ConsentRecord.counselor_id == counselor_id,
        models.ConsentRecord.is_active == True
    ).first()

    return consent is not None