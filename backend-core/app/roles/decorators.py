from functools import wraps
from fastapi import HTTPException, status, Depends
from app.auth.service import get_current_user
from app.users.models import User

def role_required(allowed_roles: list):
    """
    Advanced RBAC Decorator:
    Checks if the authenticated user's role exists in the allowed list.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 1. Extract the current user from the kwargs 
            # (FastAPI passes the result of Depends() into the function)
            current_user: User = kwargs.get("current_user")
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required to access this resource."
                )

            # 2. Check if the user's role is authorized
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access Denied. Required roles: {allowed_roles}. Your role: {current_user.role}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator