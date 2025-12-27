/**
 * ============================================================================
 * HEALIO MOCK DATA
 * ============================================================================
 * 
 * Realistic mock data for development and testing.
 * Remove this file when connecting to real backend.
 * 
 * ============================================================================
 */

// ============================================================================
// MOOD DATA
// ============================================================================
export const mockMoodData = {
    weeklyMood: [
        { day: 'Mon', mood: 'happy', score: 8, date: '2024-12-09' },
        { day: 'Tue', mood: 'good', score: 7, date: '2024-12-10' },
        { day: 'Wed', mood: 'sad', score: 3, date: '2024-12-11' },
        { day: 'Thu', mood: 'neutral', score: 5, date: '2024-12-12' },
        { day: 'Fri', mood: 'good', score: 7, date: '2024-12-13' },
        { day: 'Sat', mood: 'happy', score: 9, date: '2024-12-14' },
        { day: 'Sun', mood: 'good', score: 7, date: '2024-12-15' }
    ],
    averageMood: 'good',
    moodDistribution: {
        happy: 28,
        good: 43,
        neutral: 15,
        sad: 9,
        anxious: 5
    },
    trend: 'improving'
};

// ============================================================================
// STRESS DATA
// ============================================================================
export const mockStressData = {
    currentLevel: 4,
    weeklyAverage: 4.5,
    weeklyData: [
        { day: 'Mon', level: 5, anxiety: 4 },
        { day: 'Tue', level: 4, anxiety: 3 },
        { day: 'Wed', level: 7, anxiety: 6 },
        { day: 'Thu', level: 5, anxiety: 4 },
        { day: 'Fri', level: 4, anxiety: 3 },
        { day: 'Sat', level: 3, anxiety: 2 },
        { day: 'Sun', level: 3, anxiety: 2 }
    ],
    peakTime: 'Wednesday afternoon',
    triggers: ['Work deadlines', 'Meetings', 'Lack of sleep']
};

// ============================================================================
// BURNOUT DATA
// ============================================================================
export const mockBurnoutData = {
    riskLevel: 'low',
    riskPercentage: 23,
    factors: [
        { name: 'Work Hours', impact: 'low', score: 3 },
        { name: 'Sleep Quality', impact: 'medium', score: 5 },
        { name: 'Social Connection', impact: 'low', score: 2 },
        { name: 'Physical Activity', impact: 'low', score: 3 }
    ],
    trend: 'improving',
    lastUpdated: new Date().toISOString()
};

// ============================================================================
// COPING SUGGESTIONS
// ============================================================================
export const mockCopingSuggestions = {
    suggestions: [
        {
            id: '1',
            title: 'Take a 15-minute walk',
            description: 'A short walk can help clear your mind and boost your energy levels.',
            duration: '15 mins',
            type: 'activity',
            icon: '🚶'
        },
        {
            id: '2',
            title: 'Box Breathing Exercise',
            description: 'Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.',
            duration: '5 mins',
            type: 'breathing',
            icon: '🌬️'
        },
        {
            id: '3',
            title: '5-4-3-2-1 Grounding',
            description: 'Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.',
            duration: '3 mins',
            type: 'grounding',
            icon: '🌱'
        },
        {
            id: '4',
            title: 'Gratitude Reflection',
            description: 'Write down 3 things you are grateful for today.',
            duration: '5 mins',
            type: 'reflection',
            icon: '✨'
        },
        {
            id: '5',
            title: 'Worry Time Capsule',
            description: 'Seal a worry away and check back later. Prove your fears wrong.',
            duration: '2 mins',
            type: 'tool',
            icon: '💊'
        },
        {
            id: '6',
            title: 'Check Energy Battery',
            description: 'Visualize your daily load and prevent burnout before it happens.',
            duration: '1 min',
            type: 'tool',
            icon: '🔋'
        }
    ],
    reasoning: 'Based on your current mood and stress levels, these activities can help you feel more balanced.'
};

// ============================================================================
// WORRY CAPSULE DATA
// ============================================================================
export const mockWorries = [
    {
        id: '101',
        text: "I'm going to mess up the project demo in front of the judges.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        status: 'pending',
        didHappen: null
    },
    {
        id: '102',
        text: "I won't be able to finish the feature in time.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        status: 'resolved',
        didHappen: false,
        resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '103',
        text: "My laptop battery will die during the coding session.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        didHappen: false,
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// ============================================================================
// GRATITUDE GARDEN DATA
// ============================================================================
export const mockGardenFlowers = [
    {
        id: '201',
        text: "The smell of rain this morning.",
        type: 'A',
        color: '#F4D35E',
        x: 20,
        y: 80,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        scale: 1
    },
    {
        id: '202',
        text: "My partner made me coffee.",
        type: 'C',
        color: '#F27A5E',
        x: 50,
        y: 70,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        scale: 1
    },
    {
        id: '203',
        text: "Finished a difficult task at work.",
        type: 'B',
        color: '#B8A9C9',
        x: 80,
        y: 85,
        createdAt: new Date().toISOString(),
        scale: 1
    }
];

// ============================================================================
// CALENDAR MOOD DATA
// ============================================================================
export const mockCalendarData = {
    1: 'happy', 2: 'happy', 3: 'good', 4: 'neutral', 5: 'happy',
    6: 'sad', 7: 'anxious', 8: 'good', 9: 'happy', 10: 'happy',
    11: 'good', 12: 'neutral', 13: 'good', 14: 'happy'
};

// ============================================================================
// JOURNAL ENTRIES
// ============================================================================
export const mockJournalEntries = [
    {
        id: '1',
        date: new Date().toISOString(),
        time: '10:30 AM',
        preview: "I had a challenging day today, at work... It's fine I guess...",
        mood: 'sad',
        tags: ['Distress Detected'],
        hasDistress: true
    },
    {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString(),
        time: '8:45 PM',
        preview: 'Feeling neutral today. Nothing special happened but that\'s okay.',
        mood: 'neutral',
        tags: ['Routine Check-in'],
        hasDistress: false
    },
    {
        id: '3',
        date: new Date(Date.now() - 172800000).toISOString(),
        time: '3:15 PM',
        preview: 'Great day! Finally finished my project and got positive feedback.',
        mood: 'happy',
        tags: ['Achievement'],
        hasDistress: false
    }
];

// ============================================================================
// USER DATA
// ============================================================================
export const mockUserData = {
    name: 'Shinomiya',
    avatar: 'S',
    status: 'Feeling Good ✨',
    role: 'student',
    streakDays: 7
};

// ============================================================================
// AI MOOD PREDICTIONS
// ============================================================================
export const mockPredictions = [
    { day: 'Mon', mood: 'happy', emoji: '😊' },
    { day: 'Tue', mood: 'happy', emoji: '😊' },
    { day: 'Wed', mood: 'sad', emoji: '😢' },
    { day: 'Thu', mood: 'neutral', emoji: '😐' },
    { day: 'Fri', mood: 'good', emoji: '🙂' },
    { day: 'Sat', mood: 'happy', emoji: '😊' },
    { day: 'Sun', mood: 'sad', emoji: '😔' }
];
