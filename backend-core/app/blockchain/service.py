import hashlib
import json
import time
from .models import Block

class BlockchainService:
    def __init__(self):
        self.chain = []
        # Create the Genesis Block (The very first block)
        self._create_block(student_id=0, counselor_id=0, action="GENESIS_BLOCK", previous_hash="0")

    def _generate_hash(self, block_dict: dict) -> str:
        """Creates a SHA-256 hash of a block."""
        # Ensure the dictionary is sorted for consistent hashing
        block_string = json.dumps(block_dict, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def _create_block(self, student_id: int, counselor_id: int, action: str, previous_hash: str) -> Block:
        block_data = {
            "index": len(self.chain) + 1,
            "timestamp": time.time(),
            "student_id": student_id,
            "counselor_id": counselor_id,
            "action": action,
            "previous_hash": previous_hash,
        }
        block_data["hash"] = self._generate_hash(block_data)
        
        new_block = Block(**block_data)
        self.chain.append(new_block)
        return new_block

    def log_consent(self, student_id: int, counselor_id: int, action: str):
        """Standard method to add a new consent transaction."""
        previous_block = self.chain[-1]
        return self._create_block(
            student_id=student_id,
            counselor_id=counselor_id,
            action=action,
            previous_hash=previous_block.hash
        )

    def is_chain_valid(self) -> bool:
        """Verifies that no blocks have been tampered with."""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]

            # Check 1: Does the current block's hash match its contents?
            block_content = current.dict()
            actual_hash = block_content.pop("hash")
            if actual_hash != self._generate_hash(block_content):
                return False

            # Check 2: Does the current block link correctly to the previous hash?
            if current.previous_hash != previous.hash:
                return False
        return True

# Initialize a global singleton instance
consent_blockchain = BlockchainService()