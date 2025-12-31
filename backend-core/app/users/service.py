from sqlalchemy.orm import Session
from app.users.models import User
from app.sessions.models import ChatSession

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_identity_from_guest_id(db: Session, guest_id: str):
    """
    CRITICAL PRIVACY LOGIC: 
    Resolves an anonymous guest_id to a real User profile.
    Used ONLY by counselor/analytics services after consent is verified.
    """
    session = db.query(ChatSession).filter(ChatSession.temp_chat_id == guest_id).first()
    if session:
        return db.query(User).filter(User.id == session.user_id).first()
    return None

def update_user_profile(db: Session, user_id: int, updates: dict):
    db.query(User).filter(User.id == user_id).update(updates)
    db.commit()
    return get_user_by_id(db, user_id)