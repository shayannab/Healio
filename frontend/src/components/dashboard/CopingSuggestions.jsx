/**
 * CopingSuggestions Component
 * Displays personalized coping strategies based on mood and stress
 */
import { useState } from 'react';
import '../../styles/components/CopingSuggestions.css';

function CopingSuggestions({ data, onSelectActivity }) {
    const [showAll, setShowAll] = useState(false);
    const suggestions = data?.suggestions || [];
    const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, 3);

    return (
        <section className="card coping-card">
            <div className="coping-header">
                <h2 className="coping-title">Recommended Activities</h2>
            </div>
            <p className="coping-subtitle">{data?.reasoning || 'Based on your current mood'}</p>

            <div className="coping-list">
                {visibleSuggestions.map((suggestion) => (
                    <button
                        key={suggestion.id}
                        className="coping-item"
                        onClick={() => onSelectActivity?.(suggestion)}
                    >
                        <div className="coping-icon">{suggestion.icon}</div>
                        <div className="coping-content">
                            <div className="coping-item-title">
                                {suggestion.title}
                                <span className="coping-type">{suggestion.type}</span>
                            </div>
                            <div className="coping-item-duration">{suggestion.duration}</div>
                        </div>
                        <span className="coping-arrow">→</span>
                    </button>
                ))}
            </div>

            {suggestions.length > 3 && (
                <button
                    className="coping-view-all"
                    onClick={() => setShowAll(!showAll)}
                    style={{
                        marginTop: '16px',
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--sage)',
                        background: showAll ? 'var(--sage-soft)' : 'white',
                        color: 'var(--sage)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    {showAll ? 'Show Less' : 'View All Activities'}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </section>
    );
}

export default CopingSuggestions;
