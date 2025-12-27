import hashlib
import json
from datetime import datetime

class ConsentBlock:
    def __init__(self, index, timestamp, student_id, action, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.student_id = student_id
        self.action = action  # "GRANTED" or "REVOKED"
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": str(self.timestamp),
            "student_id": self.student_id,
            "action": self.action,
            "previous_hash": self.previous_hash
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

class ConsentBlockchain:
    def __init__(self):
        # The Genesis Block (The first block in the chain)
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return ConsentBlock(0, datetime.utcnow(), "SYSTEM", "INIT_LEDGER", "0")

    def add_consent_event(self, student_id, action):
        """Adds a new privacy toggle to the blockchain."""
        prev_block = self.chain[-1]
        new_block = ConsentBlock(
            len(self.chain),
            datetime.utcnow(),
            student_id,
            action,
            prev_block.hash
        )
        self.chain.append(new_block)
        return new_block

# Initialize a global instance of the ledger
consent_ledger = ConsentBlockchain()