from pydantic import BaseModel
from typing import List, Optional
import datetime

class MLInsightCreate(BaseModel):
    guest_id: str
    dominant_emotion: str
    risk_level: str
    clinical_summary: str
    themes: List[str]
    transcript: Optional[str] = None
    acoustic_signals: Optional[dict] = None

class MLInsightResponse(MLInsightCreate):
    id: int
    created_at: str

    class Config:
        from_attributes = True

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