import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from app.config.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # The unique ID used by the local ML model
    temp_chat_id = Column(String, unique=True, index=True, default=lambda: f"guest_{uuid.uuid4().hex[:12]}")
    
    is_active = Column(Boolean, default=True)