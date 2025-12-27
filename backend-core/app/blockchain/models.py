from pydantic import BaseModel
from typing import Optional

class Block(BaseModel):
    index: int
    timestamp: float
    student_id: int
    counselor_id: int
    action: str  # e.g., "GRANT_ACCESS" or "REVOKE_ACCESS"
    previous_hash: str
    hash: str