from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SOSCreate(BaseModel):
    guest_id: str
    reason: str

class SOSResponse(BaseModel):
    id: int
    guest_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True