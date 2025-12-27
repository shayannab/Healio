/**
 * Worry Time Capsule
 * A tool to track worries and verify if they actually happened.
 * "70% of worries never happen. We prove it."
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

// Mock data will be passed or imported, but we'll default to some if missing
import { mockWorries } from '../../data/mockData';

function WorryTimeCapsule() {
    const navigate = useNavigate();
    const [worries, setWorries] = useState([]);
    const [view, setView] = useState('list'); // 'list', 'add', 'stats'
    const [newWorryText, setNewWorryText] = useState('');
    const [selectedWorry, setSelectedWorry] = useState(null);

    useEffect(() => {
        // In a real app, fetch from local storage or API
        // For demo, we load from mockData if available, or default
        if (mockWorries) {
            setWorries(mockWorries);
        }
    }, []);

    const handleAddWorry = (e) => {
        e.preventDefault();
        if (!newWorryText.trim()) return;

        const newWorry = {
            id: Date.now().toString(),
            text: newWorryText,
            createdAt: new Date().toISOString(),
            status: 'pending', // pending, resolved
            didHappen: null
        };

        setWorries([newWorry, ...worries]);
        setNewWorryText('');
        setView('list');
    };

    const handleresolveWorry = (worry, outcome) => {
        const updatedWorries = worries.map(w =>
            w.id === worry.id
                ? { ...w, status: 'resolved', didHappen: outcome, resolvedAt: new Date().toISOString() }
                : w
        );
        setWorries(updatedWorries);
        setSelectedWorry(null);
        setView('stats'); // Show stats immediately after resolving for gratification
    };

    // Stats Calculation
    const resolvedWorries = worries.filter(w => w.status === 'resolved');
    const totalResolved = resolvedWorries.length;
    const didNotHappenCount = resolvedWorries.filter(w => w.didHappen === false).length;
    const truthScore = totalResolved > 0 ? Math.round((didNotHappenCount / totalResolved) * 100) : 0;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getDaysAgo = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return `${diff} days ago`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-warm)',
            padding: '40px 20px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-primary)'
        }}>
            {/* Header */}
            <div style={{ maxWidth: '600px', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                >
                    ← Back
                </button>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>Worry Time Capsule</h1>
                <div style={{ width: '40px' }}></div> {/* Spacer */}
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* View Switcher */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'var(--bg-card)', padding: '6px', borderRadius: '50px', boxShadow: 'var(--shadow-sm)' }}>
                    <button
                        onClick={() => setView('list')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '25px',
                            border: 'none',
                            background: view === 'list' || view === 'add' ? 'var(--sage)' : 'transparent',
                            color: view === 'list' || view === 'add' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Capsule
                    </button>
                    <button
                        onClick={() => setView('stats')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '25px',
                            border: 'none',
                            background: view === 'stats' ? 'var(--sage)' : 'transparent',
                            color: view === 'stats' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Insight Stats
                    </button>
                </div>

                {/* CONTENT AREA */}

                {view === 'stats' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            boxShadow: 'var(--shadow-gleam)',
                            border: '8px solid var(--sage-soft)'
                        }}>
                            <span style={{ fontSize: '4rem', fontWeight: '700', color: 'var(--sage)' }}>{truthScore}%</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Never Happened</span>
                        </div>
                        <h2 style={{ marginBottom: '16px' }}>You are safer than you think.</h2>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            We realized that <strong>{didNotHappenCount}</strong> out of <strong>{totalResolved}</strong> worries you logged turned out to be false alarms.
                        </p>
                    </div>
                )}

                {(view === 'list' || view === 'add') && (
                    <div className="animate-fade-in">
                        {/* Add New Button */}
                        {view !== 'add' && (
                            <button
                                onClick={() => setView('add')}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    border: '2px dashed var(--border-medium)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'rgba(255,255,255,0.5)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    marginBottom: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem', fontWeight: '300' }}>+</span> Lock away a new worry
                            </button>
                        )}

                        {/* Add Form */}
                        {view === 'add' && (
                            <form onSubmit={handleAddWorry} style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '16px' }}>What's on your mind?</h3>
                                <textarea
                                    value={newWorryText}
                                    onChange={(e) => setNewWorryText(e.target.value)}
                                    placeholder="I'm worried that..."
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-medium)',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1rem',
                                        marginBottom: '20px',
                                        resize: 'none'
                                    }}
                                    autoFocus
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setView('list')}
                                        style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', background: 'transparent', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--text-primary)', color: 'white', cursor: 'pointer' }}
                                    >
                                        Seal in Capsule
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {worries.filter(w => w.status === 'pending').map(worry => (
                                <div key={worry.id} style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Time Capsule • {getDaysAgo(worry.createdAt)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.5' }}>"{worry.text}"</p>

                                    {selectedWorry === worry.id ? (
                                        <div className="animate-fade-in" style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '10px' }}>
                                            <p style={{ fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>Did this worry come true?</p>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleresolveWorry(worry, false)}
                                                    style={{ flex: 1, padding: '10px', border: '1px solid var(--sage)', background: 'var(--sage-soft)', color: 'var(--sage)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}
                                                >
                                                    No, didn't happen
                                                </button>
                                                <button
                                                    onClick={() => handleresolveWorry(worry, true)}
                                                    style={{ flex: 1, padding: '10px', border: '1px solid var(--border-medium)', background: 'white', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                                >
                                                    Yes, it did
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedWorry(worry.id)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: 'var(--bg-warm)',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                color: 'var(--text-primary)',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            Open Capsule & Check In
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Resolved History */}
                            {worries.filter(w => w.status === 'resolved').length > 0 && (
                                <div style={{ marginTop: '40px' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Resolved Worries</h4>
                                    <div style={{ opacity: 0.7 }}>
                                        {worries.filter(w => w.status === 'resolved').map(worry => (
                                            <div key={worry.id} style={{ padding: '16px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ textDecoration: 'line-through' }}>{worry.text}</span>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    padding: '4px 10px',
                                                    borderRadius: '10px',
                                                    background: worry.didHappen ? 'var(--terracotta-soft)' : 'var(--sage-soft)',
                                                    color: worry.didHappen ? 'var(--terracotta)' : 'var(--sage)',
                                                    fontWeight: '600'
                                                }}>
                                                    {worry.didHappen ? 'Happened' : 'False Alarm'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorryTimeCapsule;
