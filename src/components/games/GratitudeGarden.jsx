/**
 * Gratitude Garden Game
 * A visual gratitude journal where entries grow as flowers.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import { mockGardenFlowers } from '../../data/mockData';

// Simple Flower SVGs
const FlowerSVG = ({ type, color, scale = 1 }) => {
    // Randomize slight sway
    const sway = Math.random() * 2 - 1;

    return (
        <svg
            width="60"
            height="100"
            viewBox="0 0 60 100"
            style={{
                overflow: 'visible',
                transform: `scale(${scale}) rotate(${sway}deg)`,
                transition: 'transform 0.5s ease-out',
                transformOrigin: 'bottom center'
            }}
        >
            {/* Stem */}
            <path d="M30 100 Q35 70 30 40" stroke="#7BA38E" strokeWidth="4" fill="none" />

            {/* Leaves */}
            <path d="M30 80 Q10 70 10 60 Q30 70 30 80" fill="#9FBFAB" />
            <path d="M30 90 Q50 80 50 70 Q30 80 30 90" fill="#9FBFAB" />

            {/* Bloom - Type A (Daisy-like) */}
            {type === 'A' && (
                <g transform="translate(30, 40)">
                    <circle cx="0" cy="0" r="15" fill={color} />
                    <circle cx="0" cy="-12" r="8" fill="white" opacity="0.8" />
                    <circle cx="10" cy="-6" r="8" fill="white" opacity="0.8" />
                    <circle cx="10" cy="6" r="8" fill="white" opacity="0.8" />
                    <circle cx="0" cy="12" r="8" fill="white" opacity="0.8" />
                    <circle cx="-10" cy="6" r="8" fill="white" opacity="0.8" />
                    <circle cx="-10" cy="-6" r="8" fill="white" opacity="0.8" />
                    <circle cx="0" cy="0" r="6" fill="#FFD700" />
                </g>
            )}

            {/* Bloom - Type B (Tulip-like) */}
            {type === 'B' && (
                <g transform="translate(30, 40)">
                    <path d="M-15 0 Q-15 -20 0 -30 Q15 -20 15 0 Q0 10 -15 0" fill={color} />
                    <path d="M-10 -5 Q0 -25 10 -5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>
            )}

            {/* Bloom - Type C (Rose-like) */}
            {type === 'C' && (
                <g transform="translate(30, 40)">
                    <circle cx="0" cy="0" r="18" fill={color} />
                    <path d="M-10 -5 Q0 -15 10 -5" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
                    <path d="M-8 2 Q0 12 8 2" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
                </g>
            )}
        </svg>
    );
};

function GratitudeGarden() {
    const navigate = useNavigate();
    const [entry, setEntry] = useState('');
    const [flowers, setFlowers] = useState([]);
    const [activeFlower, setActiveFlower] = useState(null);

    // Initial Load
    useEffect(() => {
        if (mockGardenFlowers) {
            setFlowers(mockGardenFlowers);
        }
    }, []);

    const plantFlower = (e) => {
        e.preventDefault();
        if (!entry.trim()) return;

        const colors = ['#F4D35E', '#C4866C', '#B8A9C9', '#F27A5E', '#D4A574'];
        const types = ['A', 'B', 'C'];

        const newFlower = {
            id: Date.now(),
            text: entry,
            type: types[Math.floor(Math.random() * types.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 30 + 60, // 60% to 90% (bottom area)
            createdAt: new Date(),
            scale: 0 // Start small for animation
        };

        // Add to state
        setFlowers(prev => [...prev, newFlower]);
        setEntry('');

        // Animate Growth
        setTimeout(() => {
            setFlowers(prev => prev.map(f => f.id === newFlower.id ? { ...f, scale: 1 } : f));
        }, 100);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #E6F3FF 0%, #BFE6FF 60%, #E8F5E9 60%, #C8E6C9 100%)', // Sky to Grass gradient
            fontFamily: 'var(--font-sans)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header / Nav */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '24px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}
                >
                    ← Dashboard
                </button>
                <div style={{ background: 'rgba(255,255,255,0.8)', padding: '8px 24px', borderRadius: '50px', backdropFilter: 'blur(4px)' }}>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Gratitude Garden</h1>
                </div>
                <div style={{ width: '100px' }}></div> {/* Spacer */}
            </div>

            {/* Input Area (Centered Top) */}
            <div style={{
                position: 'absolute',
                top: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '500px',
                zIndex: 20
            }}>
                <form
                    onSubmit={plantFlower}
                    style={{
                        background: 'white',
                        padding: '8px',
                        borderRadius: '50px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        display: 'flex',
                        gap: '8px'
                    }}
                >
                    <input
                        type="text"
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="I am grateful for..."
                        style={{
                            flex: 1,
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            outline: 'none',
                            background: 'transparent'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!entry.trim()}
                        style={{
                            background: entry.trim() ? 'var(--sage)' : '#ccc',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            fontWeight: '600',
                            cursor: entry.trim() ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                        }}
                    >
                        Plant 🌱
                    </button>
                </form>
            </div>

            {/* Clouds (Decoration) */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.6 }}>☁️</div>
            <div style={{ position: 'absolute', top: '15%', right: '20%', opacity: 0.8, fontSize: '2rem' }}>☁️</div>

            {/* Garden Area */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%', // Grass area
                zIndex: 5
            }}>
                {flowers.map(flower => (
                    <div
                        key={flower.id}
                        onClick={() => setActiveFlower(flower)}
                        style={{
                            position: 'absolute',
                            left: `${flower.x}%`,
                            bottom: `${Math.random() * 20 + 10}%`, // Random depth
                            cursor: 'pointer',
                            zIndex: Math.floor(flower.y) // Depth sorting
                        }}
                        title={flower.text}
                    >
                        {/* Tooltip on Hover/Click */}
                        {activeFlower?.id === flower.id && (
                            <div className="animate-fade-in" style={{
                                position: 'absolute',
                                bottom: '110%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'white',
                                padding: '12px 20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                width: '200px',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                zIndex: 100
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                                    "{flower.text}"
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                                    {new Date(flower.createdAt).toLocaleDateString()}
                                </span>
                                {/* Arrow */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-6px',
                                    left: '50%',
                                    transform: 'translateX(-50%) rotate(45deg)',
                                    width: '12px',
                                    height: '12px',
                                    background: 'white'
                                }}></div>
                            </div>
                        )}

                        <FlowerSVG type={flower.type} color={flower.color} scale={flower.scale} />
                    </div>
                ))}
            </div>

            {/* Instructions */}
            {flowers.length === 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    color: 'var(--sage)',
                    opacity: 0.7
                }}>
                    Plant your first seed of gratitude...
                </div>
            )}
        </div>
    );
}

export default GratitudeGarden;
