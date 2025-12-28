/**
 * QuickCheckin Component
 * Emoji-based mood check-in with optional notes
 */
import { useState, useRef, useEffect } from 'react';
import { logMood } from '../../services/api';
import { Frown, Meh, Smile, Laugh, AlertCircle, Mic } from 'lucide-react';
import '../../styles/components/QuickCheckin.css';

const moodOptions = [
    { id: 'sad', icon: <Frown size={28} />, label: 'Sad' },
    { id: 'anxious', icon: <AlertCircle size={28} />, label: 'Anxious' },
    { id: 'neutral', icon: <Meh size={28} />, label: 'Neutral' },
    { id: 'good', icon: <Smile size={28} />, label: 'Good' },
    { id: 'happy', icon: <Laugh size={28} />, label: 'Happy' }
];

import VoiceRecorder from '../common/VoiceRecorder';

function QuickCheckin({ onMoodLogged }) {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
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

    const handleVoiceAnalysis = (data) => {
        // Auto-expand
        setIsExpanded(true);
        // Append transcript and insight to note
        const voiceNote = `${data.transcript}\n\n[Voice Signal: ${data.insight}]`;
        setNote(prev => prev ? `${prev}\n\n${voiceNote}` : voiceNote);
        setShowVoiceRecorder(false);
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
            alert("Check-in Failed! 🛑\n\nIs the Backend Server running on Port 8000?\nCode: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="card checkin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="checkin-question" style={{ margin: 0 }}>How are you feeling right now?</h2>
                <button
                    onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                    className="icon-btn"
                    title="Log with Voice"
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                    }}
                >
                    <Mic size={24} />
                </button>
            </div>

            {showVoiceRecorder && (
                <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--bg-cream)', borderRadius: '12px', border: '1px solid var(--sage-soft)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--sage)' }}>Record a short voice note (30s)</h4>
                    <VoiceRecorder onAnalysisComplete={handleVoiceAnalysis} />
                </div>
            )}

            <div className="emoji-selector">
                {moodOptions.map((option) => (
                    <button
                        key={option.id}
                        className={`emoji-option ${selectedMood === option.id ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(option.id)}
                        aria-label={`Select ${option.label} mood`}
                    >
                        <div className={`emoji-face ${option.id}`}>
                            {option.icon}
                        </div>
                        <span className="emoji-label">{option.label}</span>
                    </button>
                ))}
            </div>

            <div className={`checkin-expand ${isExpanded ? 'open' : ''}`}>
                <textarea
                    ref={textareaRef}
                    id="mood-note"
                    name="mood-note"
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