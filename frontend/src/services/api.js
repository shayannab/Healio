/**
 * ============================================================================
 * MOODFLOW UNIFIED API SERVICE (v3.0.0)
 * ============================================================================
 */

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
    /**
     * Hits the Flask AI server directly for low-latency RAG response.
     */
    sendMessage: async (message) => {
        const response = await fetch(`${AI_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }) //
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "AI Brain Offline");
        return data; // Returns { response: "..." }
    }
};

// ============================================================================
// 📊 CLINICAL INSIGHTS & ANALYTICS (FASTAPI)
// ============================================================================

export const insightAPI = {
    // For your "Amazing Looking Table"
    fetchAllInsights: () => fetchCore('/insights/all'),
    
    // For historical charts
    getMoodHistory: () => fetchCore('/insights/history'),
    
    getStressTrends: () => fetchCore('/insights/stress-trends'),

    getBurnoutRisk: () => fetchCore('/analytics/burnout-assessment')
};

// ============================================================================
// 🚨 EMERGENCY & SOS (FASTAPI)
// ============================================================================

export const sosAPI = {
    trigger: (data) => fetchCore('/sos/trigger', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

// Unified Export
export const api = {
    auth: authAPI,
    chat: chatAPI,
    insights: insightAPI,
    sos: sosAPI
};

export default api;