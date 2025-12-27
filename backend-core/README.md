# 🛡️ MoodFlow: Clinical-Grade Mental Health Backend

**MoodFlow** is a privacy-first mental health orchestration engine designed for universities. It bridges the gap between AI-driven emotional analysis and professional clinical intervention using a **"Safety-First, Privacy-Always"** architecture.

## 🌟 The "Wow" Factor: Privacy-Safety Paradox

MoodFlow solves the industry's biggest challenge: **Ensuring student anonymity while maintaining the ability to save lives during a crisis.**

* **The Identity Vault:** Uses a de-identification bridge to separate a student's real identity from their mental health insights.
* **The Blockchain Consent Ledger:** An immutable SHA-256 linked-list that logs every time a student grants or revokes data access.
* **The SOS Handshake:** An automated escalation system that "breaks the glass" during high-risk events (e.g., panic attacks) to notify counselors instantly.

---

## 🚀 Key Features

### 1. 🧠 AI Insight Ingestion (Silent Observer)

The backend features a secure endpoint for ML models to push emotional data (Dominant Emotion, Risk Level, and Thematic Analysis) without ever knowing the student's legal name.

### 2. 🚨 Automated SOS Escalation

When a "High" risk level is detected, the system:

* Activates an emergency state.
* Generates a clinical action plan.
* Routes the alert to the **Counselor Crisis Queue**.

### 3. ⛓️ Blockchain-Anchored Consent

Every privacy toggle (Grant/Revoke access) is mined into a local blockchain.

* **Immutability:** Prevents unauthorized data access.
* **Transparency:** Provides a verifiable audit trail for both students and university admins.

### 4. 👩‍⚕️ Counselor Resolution Workflow

Counselors don't just see alerts; they manage them.

* **Active Crisis Queue:** Real-time view of students in distress.
* **Clinical Resolution:** Counselors log intervention notes to "resolve" alerts, ensuring no student is left behind.

---

## 🛠️ Technical Stack

* **Framework:** FastAPI (Python 3.13)
* **Database:** SQLite (SQLAlchemy ORM)
* **Security:** JWT OAuth2 Authentication & SHA-256 Hashing
* **Architecture:** Micro-service ready "Identity Vault" pattern

---

## 🚦 Quick Start

1. **Activate Environment:**
```bash
venv\Scripts\activate

```


2. **Install Dependencies:**
```bash
pip install -r requirements.txt

```


3. **Run the Server:**
```bash
python -m uvicorn app.main:app --port 8001 --reload

```


4. **Run End-to-End Test:**
```bash
python test_api.py

```



---

## 🗺️ System Architecture

1. **Student** registers in the **Identity Vault**.
2. **AI Service** pushes anonymous insights to the **Silent Observer**.
3. **SOS System** monitors risk and alerts the **Counselor Dashboard**.
4. **Blockchain Ledger** verifies all data-sharing "handshakes."

---

### 🏁 Hackathon Demo Checklist

* [x] Register Student & Counselor
* [x] Push High-Risk AI Insight
* [x] Verify Counselor Crisis Alert
* [x] Mine Blockchain Consent Block
* [x] Resolve Crisis with Clinical Notes
