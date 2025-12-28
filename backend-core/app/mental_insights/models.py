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

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Linked to User.id
    mood = Column(String) # 'happy', 'sad', etc.
    note = Column(Text, nullable=True)
    
    # Optional: store voice analysis result here directly if part of the log
    transcript = Column(Text, nullable=True)
    acoustic_signals = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class EnergyLog(Base):
    __tablename__ = "energy_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    level = Column(Integer) # 0-100
    action = Column(String) # 'Meeting', 'Nap', etc.
    change = Column(Integer) # -15, +30
    created_at = Column(DateTime, default=datetime.utcnow)