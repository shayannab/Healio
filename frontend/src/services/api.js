/**
 * ============================================================================
 * MOODFLOW API SERVICE
 * ============================================================================ * HEALIO API SERVICE
 * 
 * Mock API service for development without a backend.
 * This file contains all API endpoints for the Healio application.
 * Currently using mock data - switch to real endpoints by updating API_BASE.
 * 
 * BACKEND INTEGRATION GUIDE:
 * --------------------------
 * 1. Update API_BASE to your actual backend URL
 * 2. Each function has documented request/response formats
 * 3. All endpoints are designed to work with your ML/RAG backend
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THIS FOR PRODUCTION
// ============================================================================
const API_BASE = '/api';  // Change to your backend URL, e.g., 'http://localhost:8000/api'

// Toggle between mock and real data
const USE_MOCK_DATA = true;  // Set to false when backend is ready

// ============================================================================
// MOCK DATA IMPORT (Remove when connecting to real backend)
// ============================================================================
import { mockMoodData, mockStressData, mockBurnoutData, mockCopingSuggestions } from '../data/mockData';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response data
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add auth token here when implementing authentication
                // 'Authorization': `Bearer ${getAuthToken()}`
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
}

// ============================================================================
// MOOD TRACKING API
// ============================================================================

/**
 * GET /api/mood/analytics
 * 
 * Fetches mood analytics data for the dashboard
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   weeklyMood: [
 *     { day: 'Mon', mood: 'happy', score: 8, date: '2024-12-09' },
 *     { day: 'Tue', mood: 'good', score: 7, date: '2024-12-10' },
 *     ...
 *   ],
 *   averageMood: 'good',
 *   moodDistribution: { happy: 30, good: 40, neutral: 20, sad: 5, anxious: 5 },
 *   trend: 'improving' | 'stable' | 'declining'
 * }
 */
export async function getMoodAnalytics() {
    if (USE_MOCK_DATA) {
        return mockMoodData;
    }
    return fetchAPI('/mood/analytics');
}

/**
 * POST /api/mood/log
 * 
 * Logs a new mood entry
 * 
 * REQUEST BODY:
 * {
 *   mood: 'happy' | 'good' | 'neutral' | 'sad' | 'anxious',
 *   note: string (optional),
 *   timestamp: ISO date string
 * }
 * 
 * BACKEND RESPONSE:
 * {
 *   success: true,
 *   entryId: string,
 *   emotionAnalysis: {
 *     detectedEmotion: string,
 *     confidence: number (0-1),
 *     keywords: string[]
 *   }
 * }
 */
export async function logMood(moodData) {
    if (USE_MOCK_DATA) {
        console.log('Mock: Logging mood', moodData);
        return { success: true, entryId: 'mock-' + Date.now() };
    }
    return fetchAPI('/mood/log', {
        method: 'POST',
        body: JSON.stringify(moodData)
    });
}

// ============================================================================
// STRESS TRACKING API
// ============================================================================

/**
 * GET /api/stress
 * 
 * Fetches stress and anxiety level data
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   currentLevel: number (1-10),
 *   weeklyAverage: number,
 *   weeklyData: [
 *     { day: 'Mon', level: 5, anxiety: 4 },
 *     ...
 *   ],
 *   peakTime: string (e.g., 'Wednesday afternoon'),
 *   triggers: string[] (detected from journal/chat)
 * }
 */
export async function getStressLevels() {
    if (USE_MOCK_DATA) {
        return mockStressData;
    }
    return fetchAPI('/stress');
}

/**
 * POST /api/stress/log
 * 
 * Logs current stress level
 * 
 * REQUEST BODY:
 * {
 *   level: number (1-10),
 *   context: string (optional),
 *   timestamp: ISO date string
 * }
 */
export async function logStress(stressData) {
    if (USE_MOCK_DATA) {
        console.log('Mock: Logging stress', stressData);
        return { success: true };
    }
    return fetchAPI('/stress/log', {
        method: 'POST',
        body: JSON.stringify(stressData)
    });
}

// ============================================================================
// BURNOUT RISK API
// ============================================================================

/**
 * GET /api/burnout
 * 
 * Fetches burnout risk assessment
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   riskLevel: 'low' | 'medium' | 'high' | 'critical',
 *   riskPercentage: number (0-100),
 *   factors: [
 *     { name: 'Work Hours', impact: 'high' },
 *     { name: 'Sleep Quality', impact: 'medium' },
 *     ...
 *   ],
 *   trend: 'improving' | 'stable' | 'worsening',
 *   lastUpdated: ISO date string
 * }
 * 
 * ML MODEL INTEGRATION:
 * - Uses historical mood, stress, journal data
 * - Predicts burnout risk using trained model
 * - Updates weekly or when significant changes detected
 */
export async function getBurnoutRisk() {
    if (USE_MOCK_DATA) {
        return mockBurnoutData;
    }
    return fetchAPI('/burnout');
}

// ============================================================================
// COPING SUGGESTIONS API (RAG-POWERED)
// ============================================================================

/**
 * GET /api/coping?mood={mood}&stress={stressLevel}
 * 
 * Fetches personalized coping suggestions
 * 
 * QUERY PARAMS:
 * - mood: current mood state
 * - stress: current stress level (1-10)
 * 
 * BACKEND RESPONSE FORMAT (RAG-powered):
 * {
 *   suggestions: [
 *     {
 *       id: string,
 *       title: string,
 *       description: string,
 *       duration: string (e.g., '5 minutes'),
 *       type: 'breathing' | 'activity' | 'reflection' | 'grounding',
 *       icon: string
 *     }
 *   ],
 *   reasoning: string (why these suggestions were selected)
 * }
 * 
 * RAG INTEGRATION:
 * - Retrieves relevant coping strategies from knowledge base
 * - Personalizes based on user's mood patterns and preferences
 * - Uses vector similarity to find most relevant strategies
 */
export async function getCopingSuggestions(mood, stressLevel) {
    if (USE_MOCK_DATA) {
        return mockCopingSuggestions;
    }
    return fetchAPI(`/coping?mood=${mood}&stress=${stressLevel}`);
}

// ============================================================================
// CHAT API (AI ASSISTANT)
// ============================================================================

/**
 * POST /api/chat
 * 
 * Sends message to AI chat assistant
 * 
 * REQUEST BODY:
 * {
 *   message: string,
 *   conversationId: string (optional, for context)
 * }
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   response: string (AI-generated supportive message),
 *   emotionAnalysis: {
 *     emotion: string,
 *     confidence: number,
 *     stressIndicator: number (1-10)
 *   },
 *   triggerAlert: boolean (true if crisis keywords detected),
 *   suggestedResources: string[] (optional)
 * }
 * 
 * ML/RAG INTEGRATION:
 * - Emotion classification model analyzes message
 * - RAG retrieves relevant supportive content
 * - Crisis detection for SOS triggering
 */
export async function sendChatMessage(message, conversationId = null) {
    if (USE_MOCK_DATA) {
        return {
            response: "I hear you. It's okay to feel this way. Would you like to talk more about what's on your mind?",
            emotionAnalysis: { emotion: 'neutral', confidence: 0.75, stressIndicator: 4 },
            triggerAlert: false
        };
    }
    return fetchAPI('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversationId })
    });
}

// ============================================================================
// JOURNAL API
// ============================================================================

/**
 * GET /api/journal/recent
 * 
 * Fetches recent journal entries
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   entries: [
 *     {
 *       id: string,
 *       date: ISO date string,
 *       preview: string (first 100 chars),
 *       mood: string,
 *       tags: string[],
 *       hasDistress: boolean
 *     }
 *   ]
 * }
 */
export async function getRecentJournals() {
    if (USE_MOCK_DATA) {
        return {
            entries: [
                { id: '1', date: new Date().toISOString(), preview: 'Today was challenging but...', mood: 'neutral', tags: ['work'], hasDistress: false },
                { id: '2', date: new Date(Date.now() - 86400000).toISOString(), preview: 'Feeling better after...', mood: 'good', tags: ['self-care'], hasDistress: false }
            ]
        };
    }
    return fetchAPI('/journal/recent');
}

/**
 * POST /api/journal
 * 
 * Saves a new journal entry
 * 
 * REQUEST BODY:
 * {
 *   content: string,
 *   mood: string,
 *   timestamp: ISO date string
 * }
 * 
 * BACKEND PROCESSING:
 * - Emotion analysis on content
 * - Keyword extraction for triggers
 * - Distress detection
 * - Updates mood/stress patterns
 */
export async function saveJournalEntry(entry) {
    if (USE_MOCK_DATA) {
        console.log('Mock: Saving journal', entry);
        return { success: true, entryId: 'mock-journal-' + Date.now() };
    }
    return fetchAPI('/journal', {
        method: 'POST',
        body: JSON.stringify(entry)
    });
}

// ============================================================================
// WEEKLY REPORT API
// ============================================================================

/**
 * GET /api/report/weekly
 * 
 * Fetches AI-generated weekly mental health report
 * 
 * BACKEND RESPONSE FORMAT:
 * {
 *   periodStart: ISO date string,
 *   periodEnd: ISO date string,
 *   summary: string (AI-generated narrative),
 *   moodSummary: {
 *     dominant: string,
 *     distribution: object,
 *     trend: string
 *   },
 *   stressSummary: {
 *     average: number,
 *     peak: string,
 *     triggers: string[]
 *   },
 *   burnoutRisk: object,
 *   recommendations: string[],
 *   downloadUrl: string (PDF link, optional)
 * }
 */
export async function getWeeklyReport() {
    if (USE_MOCK_DATA) {
        return {
            summary: "This week showed positive trends in your emotional well-being...",
            moodSummary: { dominant: 'good', trend: 'improving' },
            stressSummary: { average: 4.5, peak: 'Wednesday', triggers: ['work deadlines'] }
        };
    }
    return fetchAPI('/report/weekly');
}

// ============================================================================
// SOS / CRISIS API
// ============================================================================

/**
 * POST /api/sos/trigger
 * 
 * Triggered when crisis keywords detected or user requests help
 * 
 * REQUEST BODY:
 * {
 *   source: 'chat' | 'journal' | 'manual',
 *   severity: 'medium' | 'high' | 'critical',
 *   context: string
 * }
 * 
 * BACKEND RESPONSE:
 * {
 *   helplines: [
 *     { name: 'Tele-MANAS', number: '14416', available: '24/7' }
 *   ],
 *   counselors: [ // Only if user is logged in with university
 *     { name: 'Dr. Smith', available: true, waitTime: '~5 mins' }
 *   ],
 *   immediateResources: string[]
 * }
 */
export async function triggerSOS(data) {
    if (USE_MOCK_DATA) {
        return {
            helplines: [
                { name: 'Tele-MANAS', number: '14416', available: '24/7' },
                { name: 'iCall', number: '9152987821', available: '8am-10pm' }
            ],
            immediateResources: ['Take deep breaths', 'Ground yourself with 5-4-3-2-1 technique']
        };
    }
    return fetchAPI('/sos/trigger', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// ============================================================================
// AUTH API
// ============================================================================

export async function login(credentials) {
    if (USE_MOCK_DATA) {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: {
                        name: 'Demo User',
                        email: credentials.email,
                        avatar: 'D'
                    }
                });
            }, 500);
        });
    }
    return fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function signup(userData) {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: {
                        name: userData.name || 'New User',
                        email: userData.email,
                        avatar: userData.name ? userData.name[0].toUpperCase() : 'N'
                    }
                });
            }, 500);
        });
    }
    return fetchAPI('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

// ============================================================================
// EXPORT ALL APIs
// ============================================================================
export const moodAPI = {
    getMoodAnalytics,
    logMood
};

export const stressAPI = {
    getStressLevels,
    logStress
};

export const burnoutAPI = {
    getBurnoutRisk
};

export const copingAPI = {
    getCopingSuggestions
};

export const chatAPI = {
    sendChatMessage
};

export const journalAPI = {
    getRecentJournals,
    saveJournalEntry
};

export const reportAPI = {
    getWeeklyReport
};

export const sosAPI = {
    triggerSOS
};

// Default export for convenience
export const api = {
    mood: moodAPI,
    stress: stressAPI,
    burnout: burnoutAPI,
    coping: copingAPI,
    chat: chatAPI,
    journal: journalAPI,
    report: reportAPI,
    sos: sosAPI,
    auth: {
        login,
        signup
    }
};

