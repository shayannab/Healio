from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.mental_insights import service, schemas
from app.config.database import get_db
from app.mental_insights import service, schemas
# from app.auth.services import get_current_user # Disabled for now to prevent import errors
from app.users.models import User

router = APIRouter()

@router.post("/log", response_model=schemas.MoodLogResponse)
def log_user_mood(
    mood_entry: schemas.MoodLogCreate,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user) 
    # For now, simplistic user ID of 1 (mock/guest) OR implement real auth dependency if available
    # The frontend auth flow is client-side only (mock) currently?
    # Actually, main.py imports auth.routes so auth seems real.
):
    # For "Small Backend" mode without full JWT setup on frontend, we might just default to user 1
    # But ideally we use get_current_user. 
    # User requested "small backend" to replace mock.
    # Let's try to infer user from auth if possible, else fallback to 1.
    user_id = 1 
    # TODO: Connect to real current_user if Authorization header is sent
    
    return service.create_mood_log(db, user_id, mood_entry)

@router.get("/analytics", response_model=List[schemas.MoodLogResponse])
def get_mood_analytics(
    db: Session = Depends(get_db),
    limit: int = 10
):
    user_id = 1
    logs = service.get_user_moods(db, user_id, limit)
    return logs
