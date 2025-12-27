/**
 * Dashboard Layout Component (Floating Nav Version)
 * Wraps the main dashboard with top header and floating navigation
 */
import '../../styles/components/Dashboard.css';
import FloatingNav from './FloatingNav';

function DashboardLayout({ children, rightPanel, user, activeNav, onNavChange }) {
    return (
        <div className="app-container">
            {/* Top Header with Logo */}
            <header className="top-header">
                <div className="header-logo">
                    <div className="header-logo-icon">💚</div>
                    <span className="header-logo-text">Hea<span>lio</span></span>
                </div>
                <div className="header-user">
                    <div>
                        <div className="header-user-name">{user?.name || 'User'}</div>
                        <div className="header-user-status">{user?.status || 'Welcome!'}</div>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="main-layout">
                <main className="main-content">
                    {children}
                </main>

                {rightPanel && (
                    <aside className="insights-sidebar">
                        {rightPanel}
                    </aside>
                )}
            </div>

            {/* Floating Bottom Navigation */}
            <FloatingNav
                activeNav={activeNav}
                onNavChange={onNavChange}
                user={user}
            />
        </div>
    );
}

export default DashboardLayout;
