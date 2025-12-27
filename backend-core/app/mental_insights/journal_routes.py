from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging

from app.config.database import get_db
from app.mental_insights import models

router = APIRouter()

@router.get("/recent")
def get_recent_journals(db: Session = Depends(get_db)):
    """
    Fetches recent MoodLogs and formats them as Journal Entries.
    This unifies the Mood and Journal data sources.
    """
    # 1. Fetch recent logs (limit 10)
    # Filter for logs that actually have notes or transcripts (worth reading)
    logs = db.query(models.MoodLog)\
             .order_by(models.MoodLog.created_at.desc())\
             .limit(10)\
             .all()
             
    # 2. Transform to Frontend Journal Format
    journal_entries = []
    for log in logs:
        # Determine content for preview
        content = log.note or log.transcript or "No content"
        preview = (content[:50] + '...') if len(content) > 50 else content
        
        entry = {
            "id": str(log.id),
            "date": log.created_at.isoformat(),

            "preview": preview,
            "content": content, # Full text for expansion
            "mood": log.mood,
            "tags": ["Voice Log"] if log.transcript else ["Check-in"],
            "hasDistress": False # Placeholder: logic could check for 'sad'/'anxious'
        }
        journal_entries.append(entry)

    return {"entries": journal_entries}
