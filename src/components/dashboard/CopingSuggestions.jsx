/**
 * CopingSuggestions Component
 * Displays personalized coping strategies based on mood and stress
 */
import '../../styles/components/CopingSuggestions.css';

function CopingSuggestions({ data, onSelectActivity }) {
    const suggestions = data?.suggestions || [];

    return (
        <section className="card coping-card">
            <div className="coping-header">
                <h2 className="coping-title">Recommended Activities</h2>
            </div>
            <p className="coping-subtitle">{data?.reasoning || 'Based on your current mood'}</p>

            <div className="coping-list">
                {suggestions.slice(0, 3).map((suggestion) => (
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

            <button className="coping-view-all">
                View All Activities
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </section>
    );
}

export default CopingSuggestions;
