/**
 * Energy Battery Game
 * Visualizes personal energy levels and teaches burnout prevention.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

function EnergyBattery() {
    const navigate = useNavigate();
    const [batteryLevel, setBatteryLevel] = useState(80); // Start at 80%
    const [history, setHistory] = useState([]); // Log of actions
    const [showWarning, setShowWarning] = useState(false);

    // Color logic
    const getBatteryColor = () => {
        if (batteryLevel > 60) return 'var(--sage)'; // Green
        if (batteryLevel > 30) return '#F4D35E'; // Yellow
        return 'var(--terracotta)'; // Red
    };

    // Handle energy changes
    const handleAction = (label, change) => {
        let newLevel = batteryLevel + change;
        if (newLevel > 100) newLevel = 100;
        if (newLevel < 0) newLevel = 0;

        setBatteryLevel(newLevel);
        setHistory(prev => [{ label, change, time: new Date() }, ...prev]);

        // Log to Backend
        import('../../services/api').then(({ moodAPI }) => {
            moodAPI.logEnergy({
                level: newLevel,
                action: label,
                change: change
            }).catch(err => console.error("Failed to log energy:", err));
        });

        // Trigger warning if low
        if (newLevel <= 30 && batteryLevel > 30) {
            setShowWarning(true);
        } else if (newLevel > 30) {
            setShowWarning(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '40px 20px',
            background: 'var(--bg-warm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Nav */}
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                >
                    ← Back
                </button>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '10px' }}>Energy Battery</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '60px' }}>Manage your daily energy to prevent burnout.</p>

            {/* BATTERY VISUAL */}
            <div style={{ position: 'relative', marginBottom: '80px' }}>
                {/* Battery Body */}
                <div style={{
                    width: '180px',
                    height: '320px',
                    border: '8px solid var(--text-primary)',
                    borderRadius: '24px',
                    padding: '8px',
                    position: 'relative',
                    background: 'white'
                }}>
                    {/* Fill */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '14px',
                        background: 'var(--bg-cream)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '100%',
                            height: `${batteryLevel}%`,
                            background: getBatteryColor(),
                            transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1), background 1s ease',
                            position: 'relative'
                        }}>
                            {/* Bubbles animation could go here */}
                        </div>
                    </div>
                </div>
                {/* Battery Cap */}
                <div style={{
                    width: '60px',
                    height: '16px',
                    background: 'var(--text-primary)',
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderRadius: '4px 4px 0 0'
                }}></div>

                {/* Percentage Text */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    textShadow: '0 0 20px white'
                }}>
                    {Math.round(batteryLevel)}%
                </div>
            </div>

            {/* Warning Message */}
            {showWarning && (
                <div className="animate-pulse" style={{
                    background: 'var(--terracotta-soft)',
                    color: 'var(--terracotta)',
                    padding: '16px 24px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '40px',
                    textAlign: 'center',
                    fontWeight: '600'
                }}>
                    ⚠️ Critical Energy Level! Time to recharge.
                </div>
            )}

            {/* CONTROLS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                maxWidth: '600px',
                width: '100%'
            }}>
                {/* Drainers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--terracotta)', textAlign: 'center' }}>Drain Energy</h3>
                    <button onClick={() => handleAction('Meeting', -15)} className="energy-btn drain">
                        📅 Meeting (-15%)
                    </button>
                    <button onClick={() => handleAction('Work Sprint', -25)} className="energy-btn drain">
                        💻 Coding Sprint (-25%)
                    </button>
                    <button onClick={() => handleAction('Stress', -10)} className="energy-btn drain">
                        😰 Stress (-10%)
                    </button>
                </div>

                {/* Chargers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--sage)', textAlign: 'center' }}>Recharge</h3>
                    <button onClick={() => handleAction('Quick Walk', 15)} className="energy-btn charge">
                        🚶 Quick Walk (+15%)
                    </button>
                    <button onClick={() => handleAction('Power Nap', 30)} className="energy-btn charge">
                        💤 Power Nap (+30%)
                    </button>
                    <button onClick={() => handleAction('Break', 10)} className="energy-btn charge">
                        ☕ Coffee Break (+10%)
                    </button>
                </div>
            </div>

            {/* History Log */}
            {history.length > 0 && (
                <div style={{ marginTop: '60px', width: '100%', maxWidth: '400px' }}>
                    <h4 style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '16px' }}>Activity Log</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {history.slice(0, 5).map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '12px',
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem'
                            }}>
                                <span>{item.label}</span>
                                <span style={{
                                    color: item.change > 0 ? 'var(--sage)' : 'var(--terracotta)',
                                    fontWeight: '600'
                                }}>
                                    {item.change > 0 ? '+' : ''}{item.change}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .energy-btn {
                    padding: 16px;
                    border: none;
                    border-radius: var(--radius-lg);
                    background: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.1s, box-shadow 0.1s;
                    box-shadow: var(--shadow-sm);
                    color: var(--text-primary);
                }
                .energy-btn:active {
                    transform: scale(0.98);
                }
                .energy-btn.drain:hover {
                    box-shadow: 0 4px 12px var(--terracotta-soft);
                    border: 1px solid var(--terracotta);
                }
                .energy-btn.charge:hover {
                    box-shadow: 0 4px 12px var(--sage-soft);
                    border: 1px solid var(--sage);
                }
            `}</style>
        </div>
    );
}

export default EnergyBattery;
