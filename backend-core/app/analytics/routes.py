from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.auth.service import get_current_user
from app.users.models import User
from app.roles.decorators import role_required
from . import service

router = APIRouter()

@router.get("/overview")
@role_required(["admin"]) # Using the new centralized security guard
async def get_university_dashboard(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Returns high-level population health stats.
    Strictly Anonymized: No PII (Personally Identifiable Information) is processed here.
    """
    stats = service.get_population_health_stats(db)
    return {
        "summary": stats,
        "metadata": {
            "scope": "University-Wide",
            "privacy_standard": "Differential Anonymization Applied",
            "authorized_by": current_user.full_name
        }
    }

@router.get("/trends/themes")
@role_required(["admin"])
async def get_top_mental_health_themes(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Advanced Analytics: Extracts the most common themes across all student insights
    to help the university allocate resources (e.g., more sleep workshops).
    """
    # This logic calls a helper in your service to aggregate JSON themes
    theme_trends = service.get_aggregated_theme_trends(db)
    return {
        "campus_trends": theme_trends,
        "recommendation": "Data-driven resource allocation enabled"
    }