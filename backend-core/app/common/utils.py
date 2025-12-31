from datetime import datetime
import uuid

def format_timestamp(dt: datetime) -> str:
    """Formats datetime for the Counselor Dashboard UI."""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def generate_internal_id(prefix: str = "MF") -> str:
    """Generates a unique internal reference ID."""
    uid = uuid.uuid4().hex[:8].upper()
    return f"{prefix}-{uid}"

def mask_email(email: str) -> str:
    """
    Partially masks an email for the Anonymized Analytics view.
    Example: student@univ.edu -> s***@univ.edu
    """
    parts = email.split("@")
    return f"{parts[0][0]}***@{parts[1]}"