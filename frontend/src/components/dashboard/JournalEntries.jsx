/**
 * JournalEntries Component
 * Displays recent journal entries with mood indicators
 */
import '../../styles/components/JournalEntries.css';

const moodEmojis = {
    sad: '😔',
    anxious: '😰',
    neutral: '😐',
    good: '🙂',
    happy: '😊'
};

function JournalEntries({ entries = [], onViewEntry, onViewAll }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
                `, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        }
    };

    if (entries.length === 0) {
        return (
            <section className="card journal-card">
                <div className="card-header">
                    <h2 className="card-title">Recent Journal Entries</h2>
                </div>
                <div className="journal-empty">
                    <div className="journal-empty-icon">📝</div>
                    <p>No journal entries yet. Start writing to track your thoughts!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="card journal-card">
            <div className="card-header">
                <h2 className="card-title">Recent Journal Entries</h2>
                <button className="card-action" onClick={onViewAll}>
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="journal-entries">
                {entries.map((entry) => (
                    <article
                        key={entry.id}
                        className="journal-entry"
                        onClick={() => onViewEntry?.(entry)}
                    >
                        <div className={`entry-mood ${entry.mood}`}>
                            {moodEmojis[entry.mood] || '😐'}
                        </div>
                        <div className="entry-content">
                            <div className="entry-date">{formatDate(entry.date)}</div>
                            <p className="entry-preview">{entry.preview}</p>
                            <div className="entry-tags">
                                {entry.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`entry-tag ${entry.hasDistress ? 'distress' : ''}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default JournalEntries;
