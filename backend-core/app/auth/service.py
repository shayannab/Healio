from sqlalchemy.orm import Session
import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# Internal Imports
from app.users.models import User
from app.sessions.models import ChatSession
from app.auth import schemas  
from app.config.database import get_db
from app.config.settings import SECRET_KEY, ALGORITHM
from app.config.security import (
    hash_password,
    verify_password,
    create_access_token
)

# Define the OAuth2 scheme (where the token is sent)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# --- AUTHENTICATION LOGIC ---

def register_user(db: Session, user_data: schemas.UserCreate):
    hashed_pwd = hash_password(user_data.password)

    db_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        role=user_data.role or "student"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_and_initialize_session(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None

    # Privacy-First Guest ID generation
    guest_id = f"guest_{uuid.uuid4().hex[:12]}"
    new_session = ChatSession(
        user_id=user.id, 
        temp_chat_id=guest_id, 
        is_active=True
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "temp_chat_id": new_session.temp_chat_id
    }

# --- DEPENDENCY: GET CURRENT USER (REQUIRED BY ROUTES.PY) ---

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Decodes the JWT token and fetches the user from the database.
    This is what your app/users/routes.py was missing!
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user