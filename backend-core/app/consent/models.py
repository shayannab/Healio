from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, String
from sqlalchemy.sql import func
from app.config.database import Base

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    counselor_id = Column(Integer, ForeignKey("users.id"))
    
    # Links to the specific session/guest_id being shared
    guest_id = Column(String, index=True) 
    
    is_active = Column(Boolean, default=True)
    
    # Stores the hash from the blockchain for cross-verification
    blockchain_reference_hash = Column(String, nullable=True)
    
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())