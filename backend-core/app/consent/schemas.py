from pydantic import BaseModel
from typing import Optional

# Rename this to ConsentUpdate so routes.py can find it
class ConsentUpdate(BaseModel):
    guest_id: str
    counselor_id: int
    is_active: bool  # Renamed 'choice' to 'is_active' to match your service logic

class BlockchainAudit(BaseModel):
    block_index: int
    hash: str
    timestamp: str

class ConsentResponse(BaseModel):
    status: str
    action: str
    is_shared: bool
    blockchain_audit: BlockchainAudit