from pydantic import BaseModel
from typing import List, Optional
import datetime

class MLInsightCreate(BaseModel):
    # Make guest_id and clinical fields optional so simple UI check-ins work
    guest_id: Optional[str] = "guest_user"
    dominant_emotion: str
    risk_level: Optional[str] = "low"
    clinical_summary: Optional[str] = "Manual mood check-in"
    themes: Optional[List[str]] = ["daily_checkin"]
    transcript: Optional[str] = None
    acoustic_signals: Optional[dict] = None

class MLInsightResponse(MLInsightCreate):
    id: int
    # Change to datetime to match database objects easily
    created_at: datetime.datetime 

    class Config:
        from_attributes = True

# ... keep MoodLogCreate and MoodLogResponse as is
class MoodLogCreate(BaseModel):
    mood: str
    note: Optional[str] = None
    transcript: Optional[str] = None
    acoustic_signals: Optional[dict] = None
    timestamp: Optional[str] = None # Frontend sends ISO string

class MoodLogResponse(MoodLogCreate):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True