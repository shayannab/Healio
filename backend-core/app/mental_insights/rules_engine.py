from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta
from app.mental_insights import models

class InterventionEngine:
    """
    Contextual Micro-Intervention Rules Engine
    Cross-references Voice, Journal, and Energy data to suggest interventions.
    """

    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def run_all_checks(self):
        """Runs all heuristic checks and returns a list of interventions."""
        interventions = []
        
        # 1. Stress Check (Voice + Mood)
        stress_intervention = self.check_stress_triggers()
        if stress_intervention:
            interventions.append(stress_intervention)
            
        # 2. Worry/Anxiety Check (Journal + Recurring Patterns)
        worry_intervention = self.check_worry_patterns()
        if worry_intervention:
            interventions.append(worry_intervention)
            
        # 3. Burnout Check (Energy Battery)
        burnout_intervention = self.check_burnout_risk()
        if burnout_intervention:
            interventions.append(burnout_intervention)
            
        return interventions

    def check_stress_triggers(self):
        """
        Rule: If recent voice analysis (last 24h) detects 'High Intensity' or 'Rushed/Anxious'.
        Action: Suggest 'Breath Bubble'.
        """
        recent_log = self.db.query(models.MoodLog)\
            .filter(models.MoodLog.user_id == self.user_id)\
            .order_by(models.MoodLog.created_at.desc())\
            .first()
            
        if not recent_log:
            return None
            
        # Check explicit mood or voice signals
        is_stressed = False
        if recent_log.mood in ['stressed', 'anxious', 'overwhelmed']:
            is_stressed = True
            
        # Check acoustic signals if available
        if recent_log.acoustic_signals:
            signals = recent_log.acoustic_signals
            # High Pitch Mean often correlates with stress/intensity
            if signals.get('pitch_mean', 0) > 200 or signals.get('speed', 0) > 0.7:
                is_stressed = True
                
        if is_stressed:
            return {
                "type": "stress_relief",
                "title": "High Stress Detected",
                "message": "It sounds like you're carrying a lot of tension. Let's reset.",
                "action": "Play Breath Bubble",
                "link": "/games/breath-bubble",
                "priority": "high"
            }
        return None

    def check_worry_patterns(self):
        """
        Rule: If recent journal entries contain worry-related keywords.
        Action: Suggest 'Worry Time Capsule'.
        """
        # Fetch last 3 logs
        recent_logs = self.db.query(models.MoodLog)\
            .filter(models.MoodLog.user_id == self.user_id)\
            .order_by(models.MoodLog.created_at.desc())\
            .limit(3)\
            .all()
            
        worry_keywords = ['worry', 'afraid', 'scared', 'future', 'what if', 'anxious']
        worry_count = 0
        
        for log in recent_logs:
            content = (log.note or "") + (log.transcript or "")
            content = content.lower()
            if any(word in content for word in worry_keywords):
                worry_count += 1
                
        if worry_count >= 1: # Detected some worry recently
            return {
                "type": "anxiety_management",
                "title": "Racing Thoughts?",
                "message": "Don't carry that worry all day. Lock it away for later.",
                "action": "Open Time Capsule",
                "link": "/games/worry-capsule",
                "priority": "medium"
            }
        return None

    def check_burnout_risk(self):
        """
        Rule: If energy level is consistently low (< 30%) for past 3 days (simulated by last 5 logs).
        Action: Escalate to Counselor.
        """
        # Fetch last 5 energy logs
        energy_logs = self.db.query(models.EnergyLog)\
            .filter(models.EnergyLog.user_id == self.user_id)\
            .order_by(models.EnergyLog.created_at.desc())\
            .limit(5)\
            .all()
            
        if not energy_logs:
            return None
            
        # Check average level
        avg_energy = sum(log.level for log in energy_logs) / len(energy_logs)
        
        if avg_energy < 35:
            return {
                "type": "burnout_escalation",
                "title": "Burnout Risk Warning",
                "message": "Your energy has been critically low recently.",
                "action": "Connect with Counselor",
                "link": "/counselor-chat", # Placeholder
                "priority": "critical"
            }
        return None
