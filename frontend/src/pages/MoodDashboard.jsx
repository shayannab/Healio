/**
 * MoodDashboard Page
 * Main dashboard view combining all mood tracking components
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Hand, Flame } from 'lucide-react';
import { storageService } from '../services/storage';
import DashboardLayout from '../components/layout/DashboardLayout';
import MoodWaveGraph from '../components/dashboard/MoodWaveGraph';
import QuickCheckin from '../components/dashboard/QuickCheckin';
import StressTracker from '../components/dashboard/StressTracker';
import BurnoutIndicator from '../components/dashboard/BurnoutIndicator';
import CopingSuggestions from '../components/dashboard/CopingSuggestions';
import JournalEntries from '../components/dashboard/JournalEntries';

// Import mock data (will be replaced with API calls)
import {
    mockMoodData,
    mockStressData,
    mockBurnoutData,
    mockCopingSuggestions
} from '../data/mockData';

// Greeting helper
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

import { useNavigate } from 'react-router-dom';
// ... imports

import { moodAPI, journalAPI } from '../services/api';

// ... imports

function MoodDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [moodData, setMoodData] = useState(mockMoodData);
    const [stressData, setStressData] = useState(mockStressData);
    const [burnoutData, setBurnoutData] = useState(mockBurnoutData);
    const [copingData, setCopingData] = useState(mockCopingSuggestions);
    const [journalEntries, setJournalEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [streak, setStreak] = useState(0);

    // Fetch data on mount
    useEffect(() => {
        fetchRecentJournals();
        // Load Streak
        const streakData = storageService.getStreak();
        setStreak(streakData.currentStreak);
    }, []);

    const fetchRecentJournals = async () => {
        try {
            const result = await journalAPI.getRecentJournals();
            if (result && result.entries) {
                setJournalEntries(result.entries);
            }
        } catch (error) {
            console.error("Failed to load journals:", error);
        }
    };

    // Handle mood logging
    const handleMoodLogged = (moodEntry) => {
        console.log('Mood logged:', moodEntry);
        // Refresh dashboard data
        fetchRecentJournals();
        // Refresh Streak
        const streakData = storageService.getStreak();
        setStreak(streakData.currentStreak);
    };

    // Handle activity selection
    const handleSelectActivity = (activity) => {
        console.log('Activity selected:', activity);

        // Link "Box Breathing" (ID: 2) to the game
        if (activity.id === '2' || activity.title.includes('Breathing')) {
            navigate('/games/breath-bubble');
        }

        // Link "Worry Time Capsule" (ID: 5)
        if (activity.id === '5' || activity.title.includes('Capsule')) {
            navigate('/games/worry-capsule');
        }

        // Link "Energy Battery" (ID: 6)
        if (activity.id === '6' || activity.title.includes('Battery')) {
            navigate('/games/energy-battery');
        }

        // Link "Gratitude Garden" (ID: 4)
        if (activity.id === '4' || activity.title.includes('Gratitude')) {
            navigate('/games/gratitude-garden');
        }
    };

    // Render right sidebar content
    const RightPanelContent = () => (
        <>
            <BurnoutIndicator data={burnoutData} />
            <CopingSuggestions
                data={copingData}
                onSelectActivity={handleSelectActivity}
            />
        </>
    );

    return (
        <DashboardLayout
            user={user}
            activeNav={activeNav}
            onNavChange={setActiveNav}
            rightPanel={<RightPanelContent />}
        >
            {/* Greeting Header */}
            <header className="greeting" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1>
                        <span className="greeting-wave" style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '10px' }}>
                            <Hand size={32} color="#4F46E5" />
                        </span>
                        {getGreeting()}, {user?.name || 'there'}
                    </h1>
                    <p>Let's check in on how you're feeling today.</p>
                </div>

                {/* Streak Badge */}
                <div className="streak-badge" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'var(--bg-white)', padding: '8px 16px',
                    borderRadius: '20px', boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--sage-soft)'
                }}>
                    <Flame size={20} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                        {streak} Day Streak
                    </span>
                </div>
            </header>

            {/* Mood Wave Graph */}
            <MoodWaveGraph data={moodData} trend={moodData.trend} />

            {/* Quick Check-in */}
            <QuickCheckin onMoodLogged={handleMoodLogged} />

            {/* Stress Tracker */}
            <StressTracker data={stressData} />

            {/* Recent Journal Entries */}
            <JournalEntries
                entries={journalEntries}
                onViewEntry={(entry) => setSelectedEntry(entry)}
                onViewAll={() => console.log('View all journals')}
            />

            {/* Entry Detail Modal */}
            {selectedEntry && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }} onClick={() => setSelectedEntry(null)}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '16px',
                        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Journal Entry</h3>
                            <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
                            {new Date(selectedEntry.date).toLocaleString()} • <span style={{ textTransform: 'capitalize' }}>{selectedEntry.mood}</span>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {selectedEntry.content || selectedEntry.preview}
                        </div>
                    </div>
                </div>
            )}


            {/* Floating Action Button */}
            <button
                className="fab"
                title="Log new entry"
                onClick={() => {
                    const checkin = document.querySelector('.checkin-card');
                    checkin?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
            >
                +
            </button>
        </DashboardLayout>
    );
}

export default MoodDashboard;
