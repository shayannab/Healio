from typing import Any, Optional
from pydantic import BaseModel

class StandardResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Any] = None
    audit_log: Optional[str] = None # Specifically for Blockchain Hashes

def success_response(message: str, data: Any = None, audit_hash: str = None):
    return {
        "success": True,
        "message": message,
        "data": data,
        "audit_log": audit_hash
    }