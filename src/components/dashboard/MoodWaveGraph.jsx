/**
 * MoodWaveGraph Component
 * Displays mood trends over time with interactive SVG visualization
 */
import { useState } from 'react';
import '../../styles/components/MoodWave.css';

const moodToY = {
    happy: 40,
    good: 70,
    neutral: 100,
    anxious: 130,
    sad: 160
};

const moodColors = {
    happy: '#F4D35E',
    good: '#7CB369',
    neutral: '#8D8276',
    anxious: '#a78bfa',
    sad: '#F27A5E'
};

function MoodWaveGraph({ data, trend = 'stable' }) {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Days', 'Weeks', 'Months'];

    // Generate smooth curve path from mood data
    const generatePath = () => {
        if (!data?.weeklyMood?.length) return '';

        const points = data.weeklyMood.map((item, index) => {
            const x = (index / (data.weeklyMood.length - 1)) * 800;
            const y = moodToY[item.mood] || 100;
            return { x, y, mood: item.mood };
        });

        // Create smooth bezier curve
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            path += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
        }

        return path;
    };

    const generateAreaPath = () => {
        const linePath = generatePath();
        if (!linePath) return '';
        return `${linePath} L800,200 L0,200 Z`;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // Add tab switching animation
    };

    return (
        <section className="card mood-wave-card">
            <div className="mood-wave-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h2 className="card-title">Your Mood Journey</h2>
                    <span className={`mood-trend-badge ${trend}`}>
                        {trend === 'improving' && '↑'}
                        {trend === 'stable' && '→'}
                        {trend === 'declining' && '↓'}
                        {trend.charAt(0).toUpperCase() + trend.slice(1)}
                    </span>
                </div>
                <div className="mood-wave-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`mood-wave-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mood-wave-graph">
                <svg className="mood-wave-svg" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#9ABF89', stopOpacity: 0.4 }} />
                            <stop offset="100%" style={{ stopColor: '#9ABF89', stopOpacity: 0.05 }} />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path d={generateAreaPath()} fill="url(#waveGradient)" />

                    {/* Main line */}
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="#9ABF89"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Data points */}
                    {data?.weeklyMood?.map((item, index) => {
                        const x = (index / (data.weeklyMood.length - 1)) * 800;
                        const y = moodToY[item.mood] || 100;
                        return (
                            <g key={index}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="8"
                                    fill={moodColors[item.mood]}
                                    stroke="white"
                                    strokeWidth="3"
                                    style={{ cursor: 'pointer' }}
                                />
                                {/* Label on hover - show for some key points */}
                                {(index === 0 || index === Math.floor(data.weeklyMood.length / 2) || index === data.weeklyMood.length - 1) && (
                                    <text
                                        x={x}
                                        y={y - 15}
                                        textAnchor="middle"
                                        fill={moodColors[item.mood]}
                                        fontSize="12"
                                        fontWeight="600"
                                    >
                                        {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mood-labels">
                {data?.weeklyMood?.map((item) => (
                    <span key={item.day} className="mood-label">{item.day}</span>
                ))}
            </div>
        </section>
    );
}

export default MoodWaveGraph;
