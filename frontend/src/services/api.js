/**
 * ============================================================================
 * MOODFLOW UNIFIED API SERVICE - FINAL PRODUCTION
 * ============================================================================
 */

const CORE_BASE = 'http://localhost:8000/api/v1'; // FastAPI Core
const AI_BASE = 'http://localhost:5000';         // Flask NLP Engine
const VOICE_BASE = 'http://localhost:8001';      // Voice Microservice

/**
 * CORE FETCH WRAPPER
 */
async function fetchCore(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${CORE_BASE}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `Vault Error: ${response.status}`);
    return data;
}

// ============================================================================
// 🛡️ AUTH & IDENTITY (FastAPI)
// ============================================================================
export const authAPI = {
    login: async (credentials) => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email); 
        formData.append('password', credentials.password);

        const response = await fetch(`${CORE_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Invalid credentials");
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_role', data.role || 'student');
        }
        return data;
    },
    signup: (userData) => fetchCore('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
};

// ============================================================================
// 📊 MOOD & INSIGHTS (FastAPI) - Fixes QuickCheckin.jsx and MoodDashboard.jsx
// ============================================================================
export const moodAPI = {
    getMoodAnalytics: () => fetchCore('/insights/history'),
    logMood: (moodData) => fetchCore('/insights/push', {
        method: 'POST',
        body: JSON.stringify(moodData)
    })
};

// Alias for components specifically importing { logMood }
export const logMood = moodAPI.logMood;

// ============================================================================
// 📝 JOURNAL API (FastAPI) - Fixes MoodDashboard.jsx
// ============================================================================
export const journalAPI = {
    getRecentJournals: () => fetchCore('/journal/recent'),
    saveJournalEntry: (entry) => fetchCore('/journal', {
        method: 'POST',
        body: JSON.stringify(entry)
    })
};

// ============================================================================
// 🎙️ VOICE ANALYSIS (FastAPI Port 8001) - Fixes VoiceRecorder.jsx
// ============================================================================
export const voiceAPI = {
    analyzeAudio: async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice_note.wav');

        const response = await fetch(`${VOICE_BASE}/analyze`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Voice analysis failed");
        return data;
    }
};

// ============================================================================
// 🧠 CHAT API (Flask Port 5000)
// ============================================================================
export const chatAPI = {
    sendMessage: async (message) => {
        const response = await fetch(`${AI_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data;
    }
};

// Default export for all-in-one access
export const api = {
    auth: authAPI,
    mood: moodAPI,
    journal: journalAPI,
    voice: voiceAPI,
    chat: chatAPI
};

export default api;