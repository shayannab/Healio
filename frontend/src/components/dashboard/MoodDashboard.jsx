import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Hand, Flame, MonitorSmartphone, XCircle, Brain } from 'lucide-react';
import { storageService } from '../../services/storage';
import { useNavigate } from 'react-router-dom';

// Layout and Core Components
import DashboardLayout from '../layout/DashboardLayout';
import MoodWaveGraph from './MoodWaveGraph';
import QuickCheckin from './QuickCheckin';
import StressTracker from './StressTracker';
import BurnoutIndicator from './BurnoutIndicator';
import CopingSuggestions from './CopingSuggestions';
import JournalEntries from './JournalEntries';
import ChatAssistant from './ChatAssistant';
import Questionnaire from './Questionnaire'; // Integrated Questionnaire

// Data and API
import { mockMoodData, mockStressData, mockBurnoutData, mockCopingSuggestions } from '../../data/mockData';
import { moodAPI, journalAPI } from '../../services/api';

function MoodDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // activeNav controls which component is visible (dashboard, chat, or questionnaire)
    const [activeNav, setActiveNav] = useState('dashboard');
    const [aiReport, setAiReport] = useState(null);
    
    // Standard Dashboard States
    const [moodData, setMoodData] = useState(mockMoodData);
    const [stressData, setStressData] = useState(mockStressData);
    const [burnoutData, setBurnoutData] = useState(mockBurnoutData);
    const [copingData, setCopingData] = useState(mockCopingSuggestions);
    const [journalEntries, setJournalEntries] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetchRecentJournals();
        const streakData = storageService.getStreak();
        setStreak(streakData.currentStreak);

        // PERSISTENCE: Check for a previously generated AI report on load
        const savedReport = localStorage.getItem('latest_ai_reflection');
        if (savedReport) setAiReport(savedReport);
    }, []);

    const fetchRecentJournals = async () => {
        try {
            const result = await journalAPI.getRecentJournals();
            if (result?.entries) setJournalEntries(result.entries);
        } catch (error) { 
            console.error("Journal fetch error:", error); 
        }
    };

    const handleDigitalComplete = (report) => {
        setAiReport(report);
        // Save to localStorage so Spandan doesn't lose the result on refresh
        localStorage.setItem('latest_ai_reflection', report); 
        setActiveNav('dashboard'); // Redirect back to main dashboard to see stats
    };

    // Right panel content: Hidden in Chat mode to maximize space
    const RightPanelContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <BurnoutIndicator data={burnoutData} />
            <CopingSuggestions data={copingData} onSelectActivity={(a) => navigate(a.link)} />
        </div>
    );

    return (
        <DashboardLayout
            user={user}
            activeNav={activeNav}
            onNavChange={setActiveNav}
            rightPanel={activeNav === 'chat' ? null : <RightPanelContent />}
        >
            {/* Dynamic Header Section */}
            <header className="greeting" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                marginBottom: '30px' 
            }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <Hand size={32} color="#4F46E5" />
                        {activeNav === 'questionnaire' ? 'Digital Mindset Analysis' : 
                         activeNav === 'chat' ? 'Healio AI Companion' : 
                         `Good Day, ${user?.name || 'Spandan'}`}
                    </h1>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
                        {activeNav === 'dashboard' ? 'Track your digital habits to improve mental clarity.' : 'Reflecting on your digital intent.'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Check-in Toggle Button */}
                    <button 
                        onClick={() => setActiveNav(activeNav === 'questionnaire' ? 'dashboard' : 'questionnaire')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: activeNav === 'questionnaire' ? 'var(--terracotta)' : 'var(--indigo-600)',
                            color: 'white', padding: '10px 20px', borderRadius: '25px',
                            border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s'
                        }}
                    >
                        {activeNav === 'questionnaire' ? <XCircle size={18} /> : <MonitorSmartphone size={18} />}
                        {activeNav === 'questionnaire' ? 'Exit Analysis' : 'Digital Check-in'}
                    </button>
                    
                    <div className="streak-badge" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'white', padding: '10px 20px', borderRadius: '25px',
                        border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Flame size={20} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontWeight: '600' }}>{streak} Day Streak</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area: Conditional Switching */}
            <main className="dashboard-main-content">
                {(() => {
                    // VIEW 1: Questionaire Screen
                    if (activeNav === 'questionnaire') {
                        return (
                            <Questionnaire 
                                onComplete={handleDigitalComplete} 
                                onCancel={() => setActiveNav('dashboard')} 
                            />
                        );
                    }
                    
                    // VIEW 2: AI Chat Screen
                    if (activeNav === 'chat') {
                        return <ChatAssistant />;
                    }

                    // VIEW 3: Dashboard Stats (Default)
                    return (
                        <div className="fade-in">
                            {/* Top Insight: Mapped AI Digital Reflection Report */}
                            {aiReport && (
                                <div style={{ 
                                    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                                    padding: '24px', borderRadius: '16px', marginBottom: '32px',
                                    border: '1px solid #C7D2FE', boxShadow: 'var(--shadow-md)'
                                }}>
                                    <h3 style={{ color: '#3730A3', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                                        <Brain size={24} /> AI Digital Behavioral Insight
                                    </h3>
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br>') }} 
                                        style={{ color: '#1E1B4B', lineHeight: '1.6', fontSize: '1rem' }} 
                                    />
                                </div>
                            )}

                            {/* Core Graphs and Trackers */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <MoodWaveGraph data={moodData} trend={moodData.trend} />
                                <QuickCheckin onMoodLogged={fetchRecentJournals} />
                                <StressTracker data={stressData} />
                                <JournalEntries entries={journalEntries} />
                            </div>
                        </div>
                    );
                })()}
            </main>
        </DashboardLayout>
    );
}

export default MoodDashboard;