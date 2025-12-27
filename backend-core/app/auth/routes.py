from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth import schemas, service
from app.users.models import User

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Registers a new user and returns a sanitized profile."""
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = service.register_user(db, user)
    
    # Return a safe dictionary to avoid ResponseValidationErrors
    return {
        "success": True,
        "user": {
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }

@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """Standard OAuth2 Login returning a JWT and an anonymous Guest ID."""
    auth_data = service.authenticate_and_initialize_session(
        db, form_data.username, form_data.password
    )
    if not auth_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return auth_data