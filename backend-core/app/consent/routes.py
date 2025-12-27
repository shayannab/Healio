from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.auth.service import get_current_user
from app.blockchain.service import consent_blockchain
from app.mental_insights.models import MLInsight
from app.sessions.models import ChatSession
from app.users.models import User
from app.consent import schemas  # We will create this below

router = APIRouter()

@router.post("/update", status_code=status.HTTP_201_CREATED)
def handle_consent_choice(
    payload: schemas.ConsentUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Advanced Consent Bridge:
    1. Validates that the GuestID belongs to the student.
    2. Mines a SHA-256 Block to record the GRANT or REVOKE action.
    """
    # --- 1. Security Validation ---
    session_check = db.query(ChatSession).filter(
        ChatSession.temp_chat_id == payload.guest_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not session_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security Violation: Guest ID does not match authenticated user."
        )

    # --- 2. SQL State Management ---
    insight = db.query(MLInsight).filter(MLInsight.guest_id == payload.guest_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="No ML analysis found for this session.")

    # Apply choice
    action_type = "GRANT_ACCESS" if payload.is_active else "REVOKE_ACCESS"
    insight.is_shared_with_doctor = payload.is_active

    # --- 3. Blockchain Ledger Entry ---
    block = consent_blockchain.log_consent(
        student_id=current_user.id,
        counselor_id=payload.counselor_id,
        action=action_type
    )

    db.commit()

    return {
        "status": "Success",
        "action": action_type,
        "is_shared": payload.is_active,
        "blockchain_block": {
            "index": block.index,
            "hash": block.hash,
            "timestamp": block.timestamp
        }
    }

@router.get("/verify-chain")
def verify_audit_integrity(current_user: User = Depends(get_current_user)):
    """Verifies blockchain integrity."""
    is_valid = consent_blockchain.is_chain_valid()
    return {"is_vault_integral": is_valid, "total_blocks": len(consent_blockchain.chain)}