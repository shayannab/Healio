import hashlib
import json
import time
from typing import List, Dict

class BlockchainLedger:
    def __init__(self):
        # In a real app, this would be stored in a DB or distributed network
        self.chain: List[Dict] = []
        self.create_genesis_block()

    def create_genesis_block(self):
        self.create_block(student_id=0, counselor_id=0, action="GENESIS")

    def create_block(self, student_id: int, counselor_id: int, action: str):
        """Action should be 'GRANT_ACCESS' or 'REVOKE_ACCESS'"""
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'student_id': student_id,
            'counselor_id': counselor_id,
            'action': action,
            'previous_hash': self.chain[-1]['hash'] if self.chain else "0"
        }
        
        # Standard SHA-256 Hashing
        block_string = json.dumps(block, sort_keys=True).encode()
        block['hash'] = hashlib.sha256(block_string).hexdigest()
        
        self.chain.append(block)
        return block

# Global instance
consent_ledger = BlockchainLedger()