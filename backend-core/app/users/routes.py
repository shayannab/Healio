from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.auth.service import get_current_user
from app.users.models import User
from app.roles.decorators import role_required
from . import service

router = APIRouter()

@router.get("/me")
@role_required(["student", "counselor", "admin"])
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently logged-in user."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role
    }

@router.get("/{user_id}")
@role_required(["admin"]) # Only Admins can look up users by ID
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
    user = service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user