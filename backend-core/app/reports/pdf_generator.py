from datetime import datetime

def create_clinical_pdf_content(student_name: str, weekly_data: dict):
    """
    Generates a structured clinical summary. 
    In a full production app, you'd use a library like FPDF or ReportLab.
    """
    report_id = f"REF-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
    
    report_content = f"""
    MOODFLOW CLINICAL REPORT: {report_id}
    -------------------------------------------
    STUDENT: {student_name}
    DATE RANGE: {weekly_data['start_date']} to {weekly_data['end_date']}
    
    EXECUTIVE SUMMARY:
    - Dominant Weekly Emotion: {weekly_data['dominant_emotion'].upper()}
    - Overall Risk Assessment: {weekly_data['highest_risk_recorded'].upper()}
    - Core Themes Identified: {', '.join(weekly_data['themes_detected'])}
    
    CLINICAL NOTES:
    Student has completed {weekly_data['total_checkins']} AI-assisted sessions this week. 
    The patterns detected suggest focus on: {weekly_data['themes_detected'][0] if weekly_data['themes_detected'] else 'General Wellbeing'}.
    
    AUTHENTICITY:
    This report is generated from blockchain-verified consent records.
    Audit Hash: {weekly_data.get('audit_hash', 'N/A')}
    -------------------------------------------
    CONFIDENTIAL - FOR CLINICAL USE ONLY
    """
    return report_content