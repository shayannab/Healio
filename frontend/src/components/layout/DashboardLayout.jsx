/**
 * Dashboard Layout Component (Floating Nav Version)
 * Wraps the main dashboard with top header and floating navigation
 */
import '../../styles/components/Dashboard.css';
import { Link } from 'react-router-dom';
import FloatingNav from './FloatingNav';

function DashboardLayout({ children, rightPanel, user, activeNav, onNavChange }) {
    return (
        <div className="app-container">
            {/* Top Header with Logo */}
            <header className="top-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid var(--border-soft)'
            }}>
                <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }} aria-label="Go to landing page">
                    <div className="header-logo-icon" style={{ fontSize: '1.5rem' }}>💚</div>
                    <span className="header-logo-text" style={{ 
                        fontWeight: '800', 
                        fontSize: '1.2rem', 
                        letterSpacing: '-0.5px',
                        color: 'var(--text-primary)' 
                    }}>
                        Hea<span style={{ color: 'var(--indigo-600)' }}>lio</span>
                    </span>
                </Link>
                
                <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div className="header-user-name" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {user?.name || 'Spandan'}
                        </div>
                        <div className="header-user-status" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {user?.status || 'Online'}
                        </div>
                    </div>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'var(--indigo-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--indigo-600)',
                        fontWeight: 'bold'
                    }}>
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="main-layout" style={{ 
                display: 'flex', 
                padding: '2rem', 
                gap: '2rem', 
                minHeight: 'calc(100vh - 80px)',
                paddingBottom: '100px' // Space for floating nav
            }}>
                <main className="main-content" style={{ flex: 1 }}>
                    {children}
                </main>

                {rightPanel && (
                    <aside className="insights-sidebar" style={{ 
                        width: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        {rightPanel}
                    </aside>
                )}
            </div>

            {/* Floating Bottom Navigation */}
            {/* CRITICAL: This passes the navigation state and the change function 
                to the actual buttons. 
            */}
            <FloatingNav
                activeNav={activeNav}
                onNavChange={onNavChange}
                user={user}
            />
        </div>
    );
}

export default DashboardLayout;