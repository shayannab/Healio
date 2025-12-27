/**
 * BreathBubble Game
 * A calming 4-7-8 or Box Breathing visualizer
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import { storageService } from '../../services/storage';
import { Flame } from 'lucide-react';

function BreathBubble() {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale
    const [time, setTime] = useState(0);
    const [sessionStart, setSessionStart] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Streak Updated!");

    // Box Breathing: 4s In, 4s Hold, 4s Out, 4s Hold
    const CYCLE_DURATION = 16000;

    useEffect(() => {
        let interval;
        if (isPlaying) {
            // Start tracking session
            if (!sessionStart) setSessionStart(Date.now());

            // Reset phase immediately on start
            if (phase === 'Ready') {
                setPhase('Inhale');
            }

            interval = setInterval(() => {
                setTime(t => {
                    const newTime = t + 100;
                    const cycleTime = newTime % CYCLE_DURATION;

                    if (cycleTime < 4000) setPhase('Inhale');
                    else if (cycleTime < 8000) setPhase('Hold');
                    else if (cycleTime < 12000) setPhase('Exhale');
                    else setPhase('Hold');

                    return newTime;
                });
            }, 100);
        } else {
            // STOPPED: Check duration
            // STOPPED: Check duration
            if (sessionStart) {
                const duration = (Date.now() - sessionStart) / 1000;
                // LOWERED THRESHOLD TO 10s FOR TESTING (User Request)
                if (duration > 10) {
                    const result = storageService.updateStreak();

                    if (result.updated) {
                        setSuccessMessage("Streak Increased! 🔥");
                    } else {
                        setSuccessMessage("Streak Maintained! 🔥");
                    }
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
                setSessionStart(null);
            }

            setPhase('Ready');
            setTime(0);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const getScale = () => {
        if (phase === 'Ready') return 1;
        const cycleTime = time % CYCLE_DURATION;

        if (phase === 'Inhale') {
            // 0 -> 4000ms: Scale 1 -> 2
            return 1 + (cycleTime / 4000);
        } else if (phase === 'Hold' && cycleTime < 8000) {
            // 4000 -> 8000ms: Scale 2
            return 2;
        } else if (phase === 'Exhale') {
            // 8000 -> 12000ms: Scale 2 -> 1
            return 2 - ((cycleTime - 8000) / 4000);
        } else {
            // 12000 -> 16000ms: Scale 1
            return 1;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-cream)',
            position: 'relative',
            padding: '20px'
        }}>
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    border: 'none',
                    background: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                }}
            >
                ← Back
            </button>

            <h1 style={{ marginBottom: '60px', color: 'var(--text-primary)' }}>Breath Bubble</h1>

            {/* Bubble Container */}
            <div style={{
                width: '300px',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {/* Visual Circle */}
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--sage-light), var(--sage))',
                    boxShadow: '0 0 40px var(--sage-soft)',
                    transform: `scale(${getScale()})`,
                    transition: isPlaying ? 'transform 0.1s linear' : 'transform 0.5s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                </div>

                {/* Text Overlay (doesn't scale) */}
                <div style={{
                    position: 'absolute',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: phase === 'Exhale' || phase === 'Inhale' ? 'var(--text-primary)' : 'var(--text-primary)',
                        textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                    }}>
                        {phase}
                    </h2>
                </div>
            </div>

            {/* Controls */}
            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                    {isPlaying ? "Focus on your breath..." : "Ready to relax?"}
                </p>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn-primary"
                    style={{
                        padding: '16px 48px',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: isPlaying ? 'var(--terracotta)' : 'var(--sage)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {isPlaying ? 'Stop' : 'Start Breathing'}
                </button>

                {showSuccess && (
                    <div style={{ marginTop: '20px', color: '#F59E0B', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'fadeIn 0.5s' }}>
                        <Flame size={20} fill="#F59E0B" /> {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BreathBubble;
