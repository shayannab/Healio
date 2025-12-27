/**
 * ============================================================================
 * MOODFLOW API SERVICE - PRODUCTION INTEGRATED (v3.0.0)
 * ============================================================================
 */

// 1. Backend endpoint matching main.py prefixes
const API_BASE = 'http://localhost:8000/api/v1'; 

/**
 * Generic fetch wrapper with JWT support and error extraction
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers }
        });

        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
            // Extracts specific detail from FastAPI HTTPException
            throw new Error(data.detail || `API Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Backend call failed for ${endpoint}:`, error.message);
        throw error;
    }
}

// ============================================================================
// AUTH API (Identity Vault Integration)
// ============================================================================

/**
 * FIX: Login formatted for OAuth2PasswordRequestForm compatibility
 */
export async function login(credentials) {
    // Clear old session data to prevent role conflicts
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');

    const formData = new URLSearchParams();
    // Maps email to 'username' as required by standard OAuth2 forms
    formData.append('username', credentials.email); 
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
    }

    // Persist session tokens and user identity role
    if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        // Ensure role defaults to 'student' if backend doesn't provide one
        localStorage.setItem('user_role', data.role || 'student'); 
        return { success: true, role: data.role || 'student' };
    }
    
    return { success: false };
}

/**
 * Registers identity in the vault via JSON payload
 */
export async function signup(userData) {
    return fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData) // Matches UserCreate schema
    });
}

// ============================================================================
// MOOD & INTELLIGENCE API (Silent Observer)
// ============================================================================

export const getMoodAnalytics = () => fetchAPI('/insights/history');
export const logMood = (moodData) => fetchAPI('/insights/push', {
    method: 'POST',
    body: JSON.stringify(moodData)
});

// ============================================================================
// SOS / CRISIS API
// ============================================================================

export const triggerSOS = (data) => fetchAPI('/sos/trigger', {
    method: 'POST',
    body: JSON.stringify(data)
});

// ============================================================================
// EXPORT ALL APIs
// ============================================================================

export const authAPI = { login, signup };
export const moodAPI = { getMoodAnalytics, logMood };
export const sosAPI = { triggerSOS };

export const api = {
    auth: authAPI,
    mood: moodAPI,
    sos: sosAPI,
    analytics: {
        getStressLevels: () => fetchAPI('/insights/stress-trends'),
        getBurnoutRisk: () => fetchAPI('/analytics/burnout-assessment')
    },
    chat: {
        sendChatMessage: (message, cid) => fetchAPI('/chat', {
            method: 'POST',
            body: JSON.stringify({ message, conversationId: cid })
        })
    }
};