import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import '../../styles/global.css';

function WalkActivity() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsComplete(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(15 * 60);
        setIsComplete(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                >
                    ← Back
                </button>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '10px' }}>Mindful Walk</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center', maxWidth: '500px' }}>
                Take 15 minutes to step outside or walk around. Focus on the sensation of your feet touching the ground and the rhythm of your breath.
            </p>

            <div style={{
                background: 'white',
                padding: '60px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '40px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '700',
                    fontVariantNumeric: 'tabular-nums',
                    color: isActive ? 'var(--sage)' : 'var(--text-primary)',
                    marginBottom: '40px'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {!isComplete ? (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={toggleTimer}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: isActive ? 'var(--terracotta)' : 'var(--sage)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.1s',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            {isActive ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
                        </button>
                        <button
                            onClick={resetTimer}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'var(--bg-cream)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-medium)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={64} color="var(--sage)" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Well Done!</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>You've completed your mindful walk.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                background: 'var(--sage)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WalkActivity;
