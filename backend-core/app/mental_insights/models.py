from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from app.config.database import Base

class MLInsight(Base):
    __tablename__ = "ml_insights"

    id = Column(Integer, primary_key=True, index=True)
    # The guest_id is the bridge between the session and the clinical data
    guest_id = Column(String, index=True)
    dominant_emotion = Column(String)
    risk_level = Column(String)  # Expected: 'High', 'Medium', or 'Low'
    clinical_summary = Column(Text)
    # JSON type allows us to store the list of themes (e.g., ["Stress", "Exams"])
    themes = Column(JSON) 
    # Voice Analysis Data
    transcript = Column(Text, nullable=True)
    acoustic_signals = Column(JSON, nullable=True) # Stores {energy, speed, pitch}
    created_at = Column(DateTime, default=datetime.utcnow)