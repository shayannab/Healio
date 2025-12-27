from pydantic import BaseModel
from typing import List, Optional

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