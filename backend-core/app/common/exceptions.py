from fastapi import HTTPException, status

class MoodFlowException(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)

class ConsentRequiredException(MoodFlowException):
    def __init__(self):
        super().__init__(
            detail="Access Denied: Student has not granted consent via Blockchain.",
            status_code=status.HTTP_403_FORBIDDEN
        )

class IdentityLeakException(MoodFlowException):
    def __init__(self):
        super().__init__(
            detail="Security Alert: Attempted to link PII to an anonymous session.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )