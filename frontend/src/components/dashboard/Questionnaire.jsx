import React, { useState, useEffect } from 'react';

const Questionnaire = ({ onComplete, onCancel }) => {
    // 1. Digital Wellness Questions Logic
    const questions = [
        {
            id: "total_hours",
            question: "On an average day, how many total hours do you spend on digital devices outside of sleep?",
            category: "Usage Volume",
            options: ["0-2 hours", "3-5 hours", "6-8 hours", "9-12 hours", "12+ hours"]
        },
        {
            id: "content_category",
            question: "Which category best describes the majority of content you consumed today?",
            category: "Content Type",
            options: ["Social Media", "Short-form Videos", "News", "Entertainment", "Education", "Work/Professional", "Mixed"]
        },
        {
            id: "primary_intention",
            question: "What was your primary intention when you opened your most-used app today?",
            category: "Intent",
            options: ["To relax", "To learn", "To work", "To stay informed", "Habit/impulse", "Avoid boredom", "Emotional escape"]
        },
        {
            id: "time_slippage",
            question: "How often did your digital usage continue longer than you originally planned today?",
            category: "Behavioral Control",
            options: ["Never", "Once or twice", "Frequently", "Almost always"]
        },
        {
            id: "mental_engagement",
            question: "While consuming content, how mentally engaged were you most of the time?",
            category: "Cognitive Load",
            options: ["Highly focused", "Moderately engaged", "Passive scrolling", "Mentally exhausted/disengaged"]
        },
        {
            id: "emotional_state",
            question: "What emotional state best describes how you felt after extended screen use today?",
            category: "Emotional Outcome",
            options: ["Energized", "Neutral", "Slightly drained", "Anxious", "Low mood", "Overstimulated"]
        },
        {
            id: "goal_alignment",
            question: "Did the content you consumed today align with your personal or professional goals?",
            category: "Alignment",
            options: ["Strongly aligned", "Somewhat aligned", "Neutral", "Mostly misaligned", "Completely misaligned"]
        },
        {
            id: "switching_control",
            question: "How much control did you feel you had over stopping or switching apps when you wanted to?",
            category: "Agency",
            options: ["Complete control", "Mostly in control", "Some difficulty", "Very difficult", "No control"]
        },
        {
            id: "discomfort_scrolling",
            question: "Did you continue scrolling despite feeling tired, stressed, or emotionally uncomfortable?",
            category: "Compulsion",
            options: ["No", "Rarely", "Sometimes", "Often", "Almost always"]
        },
        {
            id: "usage_label",
            question: "If you had to classify today’s digital usage overall, how would you label it?",
            category: "Self-Reflection",
            options: ["Intentional and productive", "Balanced", "Mostly habitual", "Mostly escapist", "Doom-scrolling"]
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // 2. Interaction with Ollama (Direct local API call)
    const askOllama = async (transcript) => {
        const prompt = `
        Analyze this digital behavior log for Spandan: ${transcript}.
        Role: "Digital Psychology Expert".
        CRITICAL: Check for BIAS (e.g. Intended relaxation but felt anxious).
        Structure:
        1. **The Digital Mirror**: 2 sentences on state.
        2. **Intent vs. Outcome**: Identify bias/accidental stress.
        3. **The Balance Score**: Single number (X/10).
        4. **Actionable Recovery**: 3 specific steps.
        `;

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3',
                    prompt: prompt,
                    stream: false,
                    options: { temperature: 0.7 }
                })
            });
            const data = await response.json();
            return data.response;
        } catch (e) {
            return "Healio is offline. Ensure Ollama is running (ollama run llama3).";
        }
    };

    const handleOptionSelect = (option) => {
        const updatedResponses = { ...responses, [questions[currentIndex].id]: option };
        setResponses(updatedResponses);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitToAI(updatedResponses);
        }
    };

    const submitToAI = async (finalResponses) => {
        setLoading(true);
        const transcript = Object.entries(finalResponses)
            .map(([id, val]) => `${id.replace('_', ' ')}: ${val}`)
            .join(" | ");
        
        const aiResponse = await askOllama(transcript);
        setResult(aiResponse);
        setLoading(false);
        if (onComplete) onComplete(aiResponse); // Pass back to MoodDashboard
    };

    // 3. Inline Styles
    const styles = {
        container: {
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            fontFamily: "'Inter', sans-serif"
        },
        progressBar: {
            height: '8px',
            width: '100%',
            background: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '2rem',
            overflow: 'hidden'
        },
        progressFill: {
            height: '100%',
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            background: '#38ef7d',
            transition: 'width 0.4s ease'
        },
        category: {
            color: '#4F46E5',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        questionText: {
            fontSize: '1.5rem',
            margin: '1rem 0 2rem 0',
            color: '#1f2937'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
        },
        optionBtn: {
            padding: '1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: 'none'
        },
        loading: {
            textAlign: 'center',
            padding: '4rem'
        }
    };

    if (loading) return (
        <div style={styles.loading}>
            <h2>Analyzing your digital mindset...</h2>
            <p>Spandan, Healio AI is checking for behavioral patterns.</p>
        </div>
    );

    const currentQ = questions[currentIndex];

    return (
        <div style={styles.container}>
            <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
            </div>
            
            <span style={styles.category}>{currentQ.category}</span>
            <h2 style={styles.questionText}>{currentQ.question}</h2>

            <div style={styles.grid}>
                {currentQ.options.map((opt, i) => (
                    <button 
                        key={i} 
                        style={styles.optionBtn}
                        onClick={() => handleOptionSelect(opt)}
                        onMouseOver={(e) => e.target.style.borderColor = '#38ef7d'}
                        onMouseOut={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                    Previous
                </button>
                <span style={{ color: '#9ca3af' }}>{currentIndex + 1} of 10</span>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Questionnaire;