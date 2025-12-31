import React, { useState } from 'react';
import '../../styles/components/Dashboard.css'; // Ensure styles are linked

const questions = [
    {
        id: "total_hours",
        question: "On an average day, how many total hours do you spend on digital devices?",
        category: "Usage Volume",
        options: ["0-2 hours", "3-5 hours", "6-8 hours", "9-12 hours", "12+ hours"]
    },
    // ... add the rest of the questions from your app.js here
];

const DigitalAssessment = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSelect = (option) => {
        const updatedResponses = { ...responses, [questions[step].id]: option };
        setResponses(updatedResponses);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            submitToAI(updatedResponses);
        }
    };

    const submitToAI = async (finalResponses) => {
        setLoading(true);
        const transcript = Object.entries(finalResponses)
            .map(([id, val]) => `${id}: ${val}`).join(" | ");
        
        // This calls your Ollama service
        try {
            const result = await askOllama(transcript); 
            onComplete(result);
        } catch (error) {
            onComplete("AI Analysis currently unavailable.");
        }
        setLoading(false);
    };

    if (loading) return <div className="loading-spinner">Analyzing...</div>;

    return (
        <div className="question-card">
            <span className="category-tag">{questions[step].category}</span>
            <h3>{questions[step].question}</h3>
            <div className="options-grid">
                {questions[step].options.map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)} className="option-btn">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DigitalAssessment;