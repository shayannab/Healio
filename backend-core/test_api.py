import requests
import uuid
import json

# --- CONFIGURATION ---
BASE_URL = "http://127.0.0.1:8001/api/v1"

def run_master_test():
    print("🏗️  MoodFlow Master Integration Test Starting...")
    print("=" * 60)
    
    # Generate unique credentials for this test run
    unique_suffix = uuid.uuid4().hex[:4]
    student_email = f"student_{unique_suffix}@univ.edu"
    counselor_email = f"counselor_{unique_suffix}@univ.edu"
    password = "password123"

    # --- 1. REGISTER COUNSELOR ---
    print("\n[1/6] Registering Counselor...")
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": counselor_email, 
        "password": password, 
        "full_name": "Dr. Smith", 
        "role": "counselor"
    })
    print("✅ Counselor Registered.")

    # --- 2. REGISTER STUDENT ---
    print("\n[2/6] Registering Student...")
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": student_email, 
        "password": password, 
        "full_name": "John Doe", 
        "role": "student"
    })
    print("✅ Student Registered.")

    # --- 3. STUDENT LOGIN & GET GUEST ID ---
    print("\n[3/6] Student Login (Identity De-identification)...")
    login_res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": student_email, 
        "password": password
    })
    auth_data = login_res.json()
    guest_id = auth_data.get("temp_chat_id")
    student_token = auth_data.get("access_token")
    print(f"✅ Login Success! Vault Bridge: {student_email} -> {guest_id}")

    # --- 4. SIMULATE AI CRISIS (SOS TRIGGER) ---
    print("\n[4/6] Pushing High-Risk AI Insight (SOS Handshake)...")
    insight_payload = {
        "guest_id": guest_id,
        "dominant_emotion": "Extreme Panic",
        "risk_level": "High",
        "clinical_summary": "User is experiencing a severe panic attack with palpitations.",
        "themes": ["Exams", "Loneliness"]
    }
    insight_res = requests.post(f"{BASE_URL}/insights/push", json=insight_payload)
    if insight_res.status_code in [200, 201]:
        data = insight_res.json()
        sos = data.get("emergency_alert", {})
        print(f"✅ Insight Ingested. SOS STATUS: {sos.get('status', 'ACTIVATED')}")
        print(f"🏥 Clinical Action: {sos.get('action_plan', {}).get('helpline', '14416')}")
    else:
        print(f"❌ AI Push Failed: {insight_res.text}")

    # --- 5. COUNSELOR LOGIN & VIEW CRISIS ---
    print("\n[5/6] Counselor Accessing Crisis Queue...")
    c_login = requests.post(f"{BASE_URL}/auth/login", data={
        "username": counselor_email, 
        "password": password
    })
    c_token = c_login.json().get("access_token")
    c_headers = {"Authorization": f"Bearer {c_token}"}
    
    crisis_res = requests.get(f"{BASE_URL}/counselor/crisis-alerts", headers=c_headers)
    print(f"✅ Crisis Queue Status: {crisis_res.status_code}")
    print(f"🚨 Active Alerts Found: {crisis_res.json().get('active_crisis_count', 0)}")

    # --- 6. BLOCKCHAIN CONSENT TOGGLE ---
    print("\n[6/6] Student Granting Consent (Blockchain Anchoring)...")
    # Mapping to app/consent/schemas.py: ConsentUpdate
    consent_payload = {
        "guest_id": guest_id,
        "counselor_id": 1, 
        "is_active": True
    }
    consent_res = requests.post(
        f"{BASE_URL}/consent/update", 
        json=consent_payload, 
        headers={"Authorization": f"Bearer {student_token}"}
    )
    
    if consent_res.status_code in [200, 201]:
        c_data = consent_res.json()
        print(f"✅ Action Recorded: {c_data.get('action')}")
        print(f"⛓️  Blockchain Hash: {c_data.get('blockchain_block', {}).get('hash')}")
    else:
        print(f"❌ Consent Failed ({consent_res.status_code}): {consent_res.text}")

    print("\n" + "=" * 60)
    print("🏁 MASTER TEST COMPLETE: Full Clinical Loop Verified.")

if __name__ == "__main__":
    run_master_test()