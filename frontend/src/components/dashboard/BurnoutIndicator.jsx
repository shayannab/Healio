/**
 * BurnoutIndicator Component
 * Circular progress indicator showing burnout risk level
 */
import { useEffect, useState } from 'react';
import '../../styles/components/BurnoutIndicator.css';

function BurnoutIndicator({ data }) {
    const [animatedOffset, setAnimatedOffset] = useState(377);

    const riskLevel = data?.riskLevel || 'low';
    const riskPercentage = data?.riskPercentage || 23;
    const trend = data?.trend || 'stable';
    const factors = data?.factors || [];

    // Calculate stroke offset based on percentage
    const circumference = 377; // 2 * PI * 60 (radius)
    const targetOffset = circumference - (riskPercentage / 100) * circumference;

    useEffect(() => {
        // Animate the ring on mount
        const timer = setTimeout(() => {
            setAnimatedOffset(targetOffset);
        }, 300);
        return () => clearTimeout(timer);
    }, [targetOffset]);

    const getMessage = () => {
        switch (riskLevel) {
            case 'low':
                return "Great! Your burnout risk is low.";
            case 'medium':
                return "Moderate risk. Consider taking breaks.";
            case 'high':
                return "High risk detected. Please take care.";
            case 'critical':
                return "Critical! Please seek support.";
            default:
                return "";
        }
    };

    const getBadgeText = () => {
        return riskLevel.toUpperCase();
    };

    return (
        <section className={`card burnout-card ${riskLevel}`}>
            <div className="burnout-header">
                <span className="burnout-title">Burnout Risk</span>
                <span className="burnout-badge">{getBadgeText()}</span>
            </div>

            <div className="burnout-content">
                <div className="burnout-ring">
                    <svg viewBox="0 0 140 140">
                        <circle
                            className="burnout-ring-bg"
                            cx="70"
                            cy="70"
                            r="60"
                        />
                        <circle
                            className="burnout-ring-progress"
                            cx="70"
                            cy="70"
                            r="60"
                            style={{ strokeDashoffset: animatedOffset }}
                        />
                    </svg>
                    <div className="burnout-ring-value">
                        <span className="burnout-percentage">
                            {riskPercentage}
                            <span className="burnout-percent-sign">%</span>
                        </span>
                    </div>
                </div>

                <p className="burnout-message">{getMessage()}</p>

                <span className={`burnout-trend ${trend}`}>
                    {trend === 'improving' && 'Improving'}
                    {trend === 'stable' && 'Stable'}
                    {trend === 'worsening' && 'Worsening'}
                </span>
            </div>

            {factors.length > 0 && (
                <div className="burnout-factors">
                    <h4>Contributing Factors</h4>
                    {factors.slice(0, 3).map((factor, index) => (
                        <div key={index} className="factor-item">
                            <span className="factor-name">{factor.name}</span>
                            <span className="factor-impact">{factor.impact}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BurnoutIndicator;
