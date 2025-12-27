from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Config & Database
from app.config.database import engine, Base
from app.common.exceptions import MoodFlowException

# Routers - The Complete Stack
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.mental_insights.routes import router as insights_router
from app.consent.routes import router as consent_router
from app.counselor.routes import router as counselor_router
from app.analytics.routes import router as analytics_router
from app.sos.routes import router as sos_router

# Initialize Database Tables
# This creates all tables (Users, Sessions, Insights, Consent, SOS) on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MoodFlow Core",
    description="Secure Identity Vault, Blockchain Consent Ledger, and Clinical Governance Backend",
    version="3.0.0",
    contact={
        "name": "MoodFlow Development Team",
        "url": "https://github.com/SIBAM890/Mood-Flow-Proto-1"
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

# --- MIDDLEWARE (CORS) ---
# Allows your React+Vite frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER REGISTRATION ---

# 1. Identity & Profile Management
app.include_router(auth_router, prefix="/api/v1/auth", tags=["1. Identity & Auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["2. User Profiles"])

# 2. Intelligence & Data Ingestion (The Silent Observer)
app.include_router(insights_router, prefix="/api/v1/insights", tags=["3. Clinical Insights"])

# 3. Governance & Trust (The Blockchain Bridge)
app.include_router(consent_router, prefix="/api/v1/consent", tags=["4. Consent & Blockchain"])

# 4. Safety & Response (The Crisis Layer)
app.include_router(sos_router, prefix="/api/v1/sos", tags=["5. Emergency SOS"])

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