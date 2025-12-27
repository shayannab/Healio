/**
 * ============================================================================
 * MOODFLOW UNIFIED API SERVICE (v3.1.0 - Hybrid)
 * ============================================================================
 */
import { storageService } from './storage';
import { mockMoodData, mockStressData, mockBurnoutData, mockCopingSuggestions } from '../data/mockData';

// 1. Port Configuration
const CORE_BASE = 'http://localhost:8000/api/v1'; // FastAPI Identity Vault
const AI_BASE = 'http://localhost:5000';         // Flask NLP Engine

/**
 * CORE FETCH WRAPPER
 * Automatically injects JWT and handles FastAPI's error formats.
 */
async function fetchCore(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) //
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
// 🛡️ IDENTITY VAULT (FASTAPI)
// ============================================================================

export const authAPI = {
    /**
     * FastAPI OAuth2 requires 'username' (not email) and URLSearchParams.
     */
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
    }),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
    }
};

// ============================================================================
// 🧠 NLP & CHAT ENGINE (FLASK)
// ============================================================================

export const chatAPI = {
    sendChatMessage: async (message) => {
        try {
            const response = await fetch(`${AI_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "AI Brain Offline");

            // Adapt to expected format if needed
            return {
                response: data.response || data.message,
                emotionAnalysis: data.emotionAnalysis || { emotion: 'neutral' }
            };
        } catch (error) {
            console.warn("AI Chat Backend Offline, using fallback");
            return {
                response: "I'm having trouble connecting to my brain right now.",
                emotionAnalysis: { emotion: 'neutral' }
            };
        }
    },

    sendMessage: async (message) => {
        // Alias for compatibility
        return chatAPI.sendChatMessage(message);
    }
};

// ============================================================================
// 📊 CLINICAL INSIGHTS & ANALYTICS
// ============================================================================

export const insightAPI = {
    fetchAllInsights: () => fetchCore('/insights/all'),
    getMoodHistory: () => fetchCore('/insights/history'),
    getStressTrends: () => fetchCore('/insights/stress-trends'),
    getBurnoutRisk: () => fetchCore('/analytics/burnout-assessment')
};

// ============================================================================
// 🚨 EMERGENCY & SOS
// ============================================================================

export const sosAPI = {
    trigger: (data) => fetchCore('/sos/trigger', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    triggerSOS: (data) => sosAPI.trigger(data) // Alias
};

// ============================================================================
// 📝 LEGACY / HYBRID ADAPTERS (RESTORED FOR DASHBOARD)
// ============================================================================

// Restore: Mood API (Uses LocalStorage + Streaks)
export const moodAPI = {
    getMoodAnalytics: async () => {
        // Return mock data for the graph for now
        return mockMoodData;
    },
    logMood: async (moodData) => {
        console.log("Logging mood to LocalStorage:", moodData);
        await new Promise(r => setTimeout(r, 300));

        // Update Streak (Gamification)
        storageService.updateStreak();

        // Save to Browser Storage
        return storageService.saveMoodLog(moodData);
    }
};

// Restore: Journal API (Uses LocalStorage)
export const journalAPI = {
    getRecentJournals: async () => {
        const recent = storageService.getRecentJournals(10);
        return { entries: recent };
    },
    saveJournalEntry: async (entry) => {
        // Redirect to mood log logic for now
        return storageService.saveMoodLog(entry);
    }
};

// Restore: Voice Service (Port 8001)
export async function analyzeVoiceLog(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_log.wav');

    const response = await fetch('http://localhost:8001/analyze', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Voice Service Error: ${response.status}`);
    }

    return await response.json();
}

export const voiceAPI = { analyzeVoiceLog };

// Restore: Mocks for other widgets
export const stressAPI = {
    getStressLevels: async () => mockStressData,
    logStress: async () => ({ success: true })
};

export const burnoutAPI = {
    getBurnoutRisk: async () => mockBurnoutData
};

export const copingAPI = {
    getCopingSuggestions: async () => mockCopingSuggestions
};

// Top-level Named Exports for Compatibility
export const logMood = moodAPI.logMood;
export const getRecentJournals = journalAPI.getRecentJournals;
export const getMoodAnalytics = moodAPI.getMoodAnalytics;
export const getStressLevels = stressAPI.getStressLevels;
export const getBurnoutRisk = burnoutAPI.getBurnoutRisk;
export const getCopingSuggestions = copingAPI.getCopingSuggestions;
export const triggerSOS = sosAPI.triggerSOS;
export const login = authAPI.login;
export const signup = authAPI.signup;

// ============================================================================
// UNIFIED EXPORT
// ============================================================================
export const api = {
    auth: authAPI,
    chat: chatAPI,
    insights: insightAPI,
    sos: sosAPI,
    mood: moodAPI,
    journal: journalAPI,
    voice: voiceAPI,
    stress: stressAPI,
    burnout: burnoutAPI,
    coping: copingAPI
};

export default api;