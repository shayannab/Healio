from sqlalchemy.orm import Session
from app.sessions.models import ChatSession
import uuid

def create_new_session(db: Session, user_id: int) -> ChatSession:
    """
    Generates an ephemeral Guest ID for a user.
    This ID is what gets passed to the ML model to ensure zero-linkage privacy.
    """
    # Deactivate any previous active sessions for this user to ensure fresh starts
    db.query(ChatSession).filter(
        ChatSession.user_id == user_id, 
        ChatSession.is_active == True
    ).update({"is_active": False})

    # Generate a unique, random Guest ID
    # Example format: guest_7f8e9a2b1c3d
    random_guest_id = f"guest_{uuid.uuid4().hex[:12]}"

    new_session = ChatSession(
        user_id=user_id,
        temp_chat_id=random_guest_id,
        is_active=True
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def get_user_id_from_guest(db: Session, guest_id: str) -> int:
    """
    The Identity Link: Resolves a Guest ID back to a User ID.
    Used internally by the Backend Core for Consent verification.
    """
    session = db.query(ChatSession).filter(
        ChatSession.temp_chat_id == guest_id,
        ChatSession.is_active == True
    ).first()
    
    return session.user_id if session else None

def deactivate_session(db: Session, guest_id: str):
    """Ends the session, effectively 'burning' the bridge between AI data and Identity."""
    session = db.query(ChatSession).filter(ChatSession.temp_chat_id == guest_id).first()
    if session:
        session.is_active = False
        db.commit()
    return True