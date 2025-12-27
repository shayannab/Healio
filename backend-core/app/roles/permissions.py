from fastapi import HTTPException, Depends
from app.auth.service import get_current_user
from app.users.models import User

def counselor_only(current_user: User = Depends(get_current_user)):
    if current_user.role != "counselor":
        raise HTTPException(status_code=403, detail="Access denied. Counselor role required.")
    return current_user

def student_only(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Access denied. Student role required.")
    return current_user