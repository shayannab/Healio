from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

# Internal Imports
from app.config.database import get_db
from app.auth import schemas, service
from app.users.models import User

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user in the Identity Vault.
    Matched to Frontend: api.auth.signup()
    """
    # Loud Logging for Hackathon Debugging
    print(f"DEBUG: 📥 Signup Request Received for: {user.email}")
    
    # 1. Identity Vault Check: Ensure user does not already exist
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        print(f"DEBUG: ❌ Registration Failed - {user.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # 2. Persist to Identity Vault with hashed password
    try:
        new_user = service.register_user(db, user)
        print(f"DEBUG: ✅ Identity Vault Created for {new_user.email}")
        
        return {
            "success": True,
            "user": {
                "email": new_user.email,
                "full_name": new_user.full_name,
                "role": new_user.role
            }
        }
    except Exception as e:
        print(f"DEBUG: 💥 Registration Engine Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error during registration"
        )

@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Standard OAuth2 Login returning a JWT and an anonymous Guest ID.
    Matched to Frontend: api.auth.login() using URLSearchParams
    """
    # Loud Logging: Tracks attempts from the frontend api.js
    print(f"DEBUG: 🔑 Login Attempt for Identity: {form_data.username}")

    # Authenticate via service layer: Verifies hash and initializes session
    auth_data = service.authenticate_and_initialize_session(
        db, form_data.username, form_data.password
    )
    
    if not auth_data:
        # Returns 401 to trigger the error handling in api.js
        print(f"DEBUG: ❌ Authentication Failed for: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"DEBUG: 🔓 Authentication Successful. JWT and GuestID issued.")
    return auth_data