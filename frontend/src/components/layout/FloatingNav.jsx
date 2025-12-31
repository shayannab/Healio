/**
 * FloatingNav Component
 * Modern floating bottom tab bar navigation
 */
import '../../styles/components/FloatingNav.css';

const navItems = [
    {
        id: 'dashboard',
        label: 'Home',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        id: 'questionnaire', // Changed from 'journal' to match MoodDashboard logic
        label: 'Check-in',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        )
    },
    {
        id: 'chat',
        label: 'Healio AI',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )
    },
    {
        id: 'analytics',
        label: 'Stats',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    }
];

function FloatingNav({ activeNav, onNavChange, user }) {
    return (
        <nav className="floating-nav" style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(15px)',
            padding: '12px 24px',
            borderRadius: '40px',
            display: 'flex',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 1000,
            border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`nav-tab ${activeNav === item.id ? 'active' : ''}`}
                    onClick={() => onNavChange?.(item.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        color: activeNav === item.id ? '#4F46E5' : '#6B7280'
                    }}
                    title={item.label}
                >
                    <div style={{ width: '24px', height: '24px' }}>
                        {item.icon}
                    </div>
                    <span className="nav-tab-label" style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: activeNav === item.id ? '700' : '500' 
                    }}>
                        {item.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}

export default FloatingNav;