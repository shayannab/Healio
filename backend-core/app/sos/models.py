from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.config.database import Base

class SOSEvent(Base):
    __tablename__ = "sos_events"

    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(String, index=True)  # Anonymous link to the session
    risk_level = Column(String)            # Always "High" for SOS
    trigger_message = Column(String)       # The summarized reason for alert
    timestamp = Column(DateTime, server_default=func.now())
    status = Column(String, default="pending") # pending, acknowledged, resolved