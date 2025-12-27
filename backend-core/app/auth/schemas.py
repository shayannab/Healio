from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    temp_chat_id: str  # The Novelty: Ephemeral ID for ML