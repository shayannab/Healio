import os
from dotenv import load_dotenv

# Load variables from the .env file in the root directory
load_dotenv()

# --- Identity Vault Security ---
# Uses .env value or falls back to the secure default for hackathon
SECRET_KEY = os.getenv("SECRET_KEY", "BLOCKCHAIN_MOOD_VAULT_2025_SECURE")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 Hour tokens for Hackathon ease

# --- Database Connection ---
# Default to a local SQLite file named 'moodflow_vault.db'
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./moodflow_vault.db")

# --- Clinical & Governance Constants ---
# Tele-MANAS (India) emergency helpline
SOS_HELPLINE = os.getenv("SOS_EMERGENCY_CONTACT", "14416")

# Threshold for triggering automatic SOS escalation
# (Scale of 0 to 1, where 0.85 indicates high clinical risk)
CRITICAL_RISK_THRESHOLD = 0.85

# --- Blockchain Configuration ---
# Genesis Block data for the Consent Ledger
BLOCKCHAIN_GENESIS_MSG = "MoodFlow Privacy Genesis - Zero Trust Enabled"

# --- CORS Settings ---
# URL of your React + Vite frontend
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]