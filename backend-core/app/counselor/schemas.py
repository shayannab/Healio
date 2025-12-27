from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StudentInsightSummary(BaseModel):
    student_name: str
    dominant_emotion: str
    risk_level: str
    clinical_summary: str
    themes: List[str]
    last_updated: datetime

class CounselorDashboardResponse(BaseModel):
    assigned_students: List[StudentInsightSummary]