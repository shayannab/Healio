/**
 * MoodDashboard Page
 * Main dashboard view combining all mood tracking components
 */
import { useState, useEffect } from 'react';
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
    mockCopingSuggestions,
    mockJournalEntries,
    mockUserData
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

function MoodDashboard() {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [moodData, setMoodData] = useState(mockMoodData);
    const [stressData, setStressData] = useState(mockStressData);
    const [burnoutData, setBurnoutData] = useState(mockBurnoutData);
    const [copingData, setCopingData] = useState(mockCopingSuggestions);
    const [journalEntries, setJournalEntries] = useState(mockJournalEntries);
    const [user] = useState(mockUserData);

    // Handle mood logging
    const handleMoodLogged = (moodEntry) => {
        console.log('Mood logged:', moodEntry);
        // In real app: update mood data, refresh dashboard
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
            <header className="greeting">
                <h1>
                    <span className="greeting-wave">👋</span>
                    {getGreeting()}, {user?.name || 'there'}
                </h1>
                <p>Let's check in on how you're feeling today.</p>
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
                onViewEntry={(entry) => console.log('View entry:', entry)}
                onViewAll={() => console.log('View all journals')}
            />

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
