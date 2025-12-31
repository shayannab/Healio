from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback

# Config & Database
from app.config.database import engine, Base
from app.common.exceptions import MoodFlowException

# Routers - The Complete Stack
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.mental_insights.routes import router as insights_router
from app.mental_insights.mood_routes import router as mood_router
from app.mental_insights.journal_routes import router as journal_router
from app.consent.routes import router as consent_router
from app.counselor.routes import router as counselor_router
from app.analytics.routes import router as analytics_router
from app.sos.routes import router as sos_router
from app.sessions.routes import router as sessions_router
# Initialize Database Tables
# Automatically synchronizes the Identity Vault and Blockchain Ledger
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MoodFlow Core",
    description="Secure Identity Vault, Blockchain Consent Ledger, and Clinical Governance Backend",
    version="3.0.0",
    contact={
        "name": "MoodFlow Development Team",
        "url": "https://github.com/shayannab/Healio"
    }
)

# --- GLOBAL EXCEPTION HANDLER ---
# Catch-all for our custom MoodFlow logic errors (Consent, Identity, etc.)
@app.exception_handler(MoodFlowException)
async def moodflow_exception_handler(request: Request, exc: MoodFlowException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False, 
            "detail": exc.detail,
            "type": exc.__class__.__name__
        },
    )

# General Exception Handler to catch 500 errors and log them
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    print(f"CRITICAL ERROR: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"success": False, "detail": "Internal Server Error. Check Backend Logs."}
    )

# --- MIDDLEWARE (CORS) ---
# Allows any origin (including your Vite/React frontend) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER REGISTRATION ---
# All routes match the /api/v1 prefix defined in frontend/src/services/api.js

# 1. Identity & Profile Management
app.include_router(auth_router, prefix="/api/v1/auth", tags=["1. Identity & Auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["2. User Profiles"])

# 2. Intelligence & Data Ingestion (The Silent Observer)
# 2. Intelligence & Data Ingestion (The Silent Observer)
app.include_router(insights_router, prefix="/api/v1/insights", tags=["3. Clinical Insights"])
app.include_router(mood_router, prefix="/api/v1/mood", tags=["3b. Mood Tracking"])
app.include_router(journal_router, prefix="/api/v1/journal", tags=["3c. Journaling"])

# 3. Governance & Trust (The Blockchain Bridge)
app.include_router(consent_router, prefix="/api/v1/consent", tags=["4. Consent & Blockchain"])

# 4. Safety & Response (The Crisis Layer)
app.include_router(sos_router, prefix="/api/v1/sos", tags=["5. Emergency SOS"])
app.include_router(sessions_router, prefix="/api/v1/sessions", tags=["Chat Sessions"])
# 5. Professional Dashboards (The Consumer Layer)
app.include_router(counselor_router, prefix="/api/v1/counselor", tags=["6. Counselor Dashboard"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["7. Admin Analytics"])

# --- SYSTEM ENDPOINTS ---

@app.get("/", tags=["System"])
def system_status():
    """Returns the operational status of the Vault."""
    return {
        "status": "MoodFlow Vault Operational",
        "architecture": "Modular Micro-services",
        "security": "SHA-256 Ledger Active",
        "database": "Relational Identity Vault Linked",
        "version": "3.0.0"
    }

@app.on_event("startup")
async def startup_event():
    print("🚀 MoodFlow Core Starting...")
    print("🛡️ Identity Vault: SECURE")
    print("⛓️ Blockchain Ledger: INITIALIZED")
    print("🚨 SOS Escalation: ACTIVE")
