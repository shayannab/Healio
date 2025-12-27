/**
 * QuickCheckin Component
 * Emoji-based mood check-in with optional notes
 */
import { useState, useRef, useEffect } from 'react';
import { logMood } from '../../services/api';
import '../../styles/components/QuickCheckin.css';

const moodOptions = [
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'good', emoji: '🙂', label: 'Good' },
    { id: 'happy', emoji: '😊', label: 'Happy' }
];

function QuickCheckin({ onMoodLogged }) {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isExpanded && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 300);
        }
    }, [isExpanded]);

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        setIsExpanded(true);
    };

    const handleSubmit = async () => {
        if (!selectedMood) return;

        setIsSubmitting(true);
        try {
            const result = await logMood({
                mood: selectedMood,
                note: note,
                timestamp: new Date().toISOString()
            });

            setSubmitStatus('success');
            onMoodLogged?.({ mood: selectedMood, note, ...result });

            // Reset after success animation
            setTimeout(() => {
                setSelectedMood(null);
                setNote('');
                setIsExpanded(false);
                setSubmitStatus(null);
            }, 1500);
        } catch (error) {
            console.error('Failed to log mood:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="card checkin-card">
            <h2 className="checkin-question">How are you feeling right now?</h2>

            <div className="emoji-selector">
                {moodOptions.map((option) => (
                    <button
                        key={option.id}
                        className={`emoji-option ${selectedMood === option.id ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(option.id)}
                        aria-label={`Select ${option.label} mood`}
                    >
                        <div className={`emoji-face ${option.id}`}>
                            {option.emoji}
                        </div>
                        <span className="emoji-label">{option.label}</span>
                    </button>
                ))}
            </div>

            <div className={`checkin-expand ${isExpanded ? 'open' : ''}`}>
                <textarea
                    ref={textareaRef}
                    className="checkin-textarea"
                    rows="4"
                    placeholder="Tell us more about how you're feeling... (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <button
                    className={`checkin-submit ${submitStatus === 'success' ? 'success' : ''}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedMood}
                >
                    {isSubmitting ? 'Logging...' : submitStatus === 'success' ? 'Logged! ✓' : 'Log Mood ✓'}
                </button>
            </div>
        </section>
    );
}

export default QuickCheckin;
