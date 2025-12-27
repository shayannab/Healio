/**
 * StressTracker Component
 * Displays current stress level, weekly trends, and detected triggers
 */
import '../../styles/components/StressTracker.css';

function StressTracker({ data }) {
    const getStressLevel = (value) => {
        if (value <= 3) return 'low';
        if (value <= 6) return 'medium';
        return 'high';
    };

    const getStressMessage = (level) => {
        switch (level) {
            case 'low':
                return "You're doing great! Keep up the good work.";
            case 'medium':
                return "Moderate stress detected. Consider taking a break.";
            case 'high':
                return "High stress levels. Try some relaxation techniques.";
            default:
                return "";
        }
    };

    const currentLevel = data?.currentLevel || 4;
    const stressLevel = getStressLevel(currentLevel);

    return (
        <section className="card stress-tracker-card">
            <div className="stress-header">
                <h2 className="card-title">Stress & Anxiety</h2>
                <span className="card-action">This Week</span>
            </div>

            <div className="stress-current">
                <div className="stress-value">
                    <div className={`stress-number ${stressLevel}`}>{currentLevel}</div>
                    <div className="stress-label">/ 10</div>
                </div>
                <div className="stress-info">
                    <h3>Current Stress Level</h3>
                    <p>{getStressMessage(stressLevel)}</p>
                </div>
            </div>

            {/* Weekly Bar Chart */}
            <div className="stress-weekly">
                <h4>Weekly Pattern</h4>
                <div className="stress-bars">
                    {data?.weeklyData?.map((day) => {
                        const height = (day.level / 10) * 60;
                        const level = getStressLevel(day.level);
                        return (
                            <div key={day.day} className="stress-bar-container">
                                <div
                                    className={`stress-bar ${level}`}
                                    style={{ height: `${height}px` }}
                                    title={`${day.day}: Level ${day.level}`}
                                />
                                <span className="stress-bar-label">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detected Triggers */}
            {data?.triggers?.length > 0 && (
                <div className="stress-triggers">
                    <h4>Detected Triggers</h4>
                    <div className="trigger-tags">
                        {data.triggers.map((trigger, index) => (
                            <span key={index} className="trigger-tag">{trigger}</span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default StressTracker;
