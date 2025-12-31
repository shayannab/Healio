/**
 * ============================================================================
 * HEALIO UNIFIED API SERVICE - FINAL STABLE VERSION
 * ============================================================================
 */

import { storageService } from './storage';
import {
  mockMoodData,
  mockStressData,
  mockBurnoutData,
  mockCopingSuggestions
} from '../data/mockData';

const CORE_BASE = 'http://localhost:8000/api/v1'; // FastAPI
const AI_BASE = 'http://localhost:5000/chat';// Flask NLP
const VOICE_BASE = 'http://localhost:8001';       // Voice Service

/**
 * 🧠 Parse FastAPI errors into human-readable messages
 */
function parseFastAPIError(errorData) {
  if (!errorData) return 'Unknown server error';

  if (Array.isArray(errorData.detail)) {
    return errorData.detail
      .map(err => `${err.loc?.join('.')} → ${err.msg}`)
      .join('\n');
  }

  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  return JSON.stringify(errorData);
}

/**
 * CORE FETCH WRAPPER
 * - Injects JWT
 * - Handles FastAPI validation errors
 */
async function fetchCore(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${CORE_BASE}${endpoint}`, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server error (${response.status})`);
  }

  if (!response.ok) {
    console.error('🚨 Backend error:', data);
    throw new Error(parseFastAPIError(data));
  }

  return data;
}

// ============================================================================
// 🛡️ AUTH & IDENTITY
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

    if (!response.ok) {
      throw new Error(data.detail || 'Invalid credentials');
    }

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_role', data.role || 'student');
    }

    return data;
  },

  signup: (userData) =>
    fetchCore('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};

// ============================================================================
// 📊 MOOD & INSIGHTS (MERGED + STABLE)
// ============================================================================
export const moodAPI = {
  // 📊 Analytics dashboard
  getMoodAnalytics: () => fetchCore('/insights/all'),

  // 🧠 Safe mood logger (frontend-friendly)
  logMood: ({ mood, note }) => {
    const emotion =
      typeof mood === 'string'
        ? mood
        : mood?.label || mood?.value || 'neutral';

    const summary =
      note && note.trim().length > 0
        ? note.trim()
        : `User is feeling ${emotion}`;

    const payload = {
      guest_id: 'local_user',
      dominant_emotion: emotion,
      risk_level: 'low',
      clinical_summary: summary,
      themes: ['manual_entry']
    };

    console.log('📤 Sending mood payload:', payload);

    return fetchCore('/insights/push', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // ⚡ Energy tracking
  logEnergy: (energyData) =>
    fetchCore('/insights/energy', {
      method: 'POST',
      body: JSON.stringify(energyData)
    }),

  // 🧩 Interventions & suggestions
  getInterventions: () => fetchCore('/insights/interventions'),

  // 📜 Mood history
  getMoodHistory: () => fetchCore('/insights/history')
};

export const logMood = moodAPI.logMood;

// ============================================================================
// 📝 JOURNAL
// ============================================================================
export const journalAPI = {
  getRecentJournals: () => fetchCore('/journal/recent'),

  saveJournalEntry: (entry) =>
    fetchCore('/journal', {
      method: 'POST',
      body: JSON.stringify(entry)
    })
};

// ============================================================================
// 🎙️ VOICE ANALYSIS
// ============================================================================
export const voiceAPI = {
  analyzeAudio: async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_note.wav');

    const response = await fetch(`${VOICE_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Voice analysis failed');
    }

    return data;
  }
};

// ============================================================================
// 🧠 CHAT API
// ============================================================================
export const chatAPI = {
  sendMessage: async (message) => {
    // This hits your Flask Backend-AI (routes.py)
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message }) // Matches Flask user_msg key
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI service unavailable');
    
    // Return formatted for ChatAssistant
    return { text: data.response }; 
  }
};
// ============================================================================
// 🔗 UNIFIED EXPORT
// ============================================================================
export const api = {
  auth: authAPI,
  mood: moodAPI,
  journal: journalAPI,
  voice: voiceAPI,
  chat: chatAPI
};

export default api;
