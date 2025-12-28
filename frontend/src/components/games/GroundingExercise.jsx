import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Volume2, Hand, Wind, Coffee, ArrowRight, Check } from 'lucide-react';
import '../../styles/global.css';

function GroundingExercise() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const steps = [
        {
            count: 5,
            title: "Sight",
            instruction: "Look around and name 5 things you can see.",
            icon: <Eye size={48} />,
            color: "#EF4444", // Red
            items: ["", "", "", "", ""]
        },
        {
            count: 4,
            title: "Touch",
            instruction: "Notice 4 things you can feel or touch.",
            icon: <Hand size={48} />,
            color: "#F59E0B", // Orange
            items: ["", "", "", ""]
        },
        {
            count: 3,
            title: "Sound",
            instruction: "Listen for 3 distinct sounds.",
            icon: <Volume2 size={48} />,
            color: "#10B981", // Green
            items: ["", "", ""]
        },
        {
            count: 2,
            title: "Smell",
            instruction: "Identify 2 things you can smell (or favorite smells).",
            icon: <Wind size={48} />,
            color: "#3B82F6", // Blue
            items: ["", ""]
        },
        {
            count: 1,
            title: "Taste",
            instruction: "Name 1 thing you can taste right now.",
            icon: <Coffee size={48} />,
            color: "#8B5CF6", // Purple
            items: [""]
        }
    ];

    const handleNext = () => {
        if (step < steps.length) {
            setStep(step + 1);
        } else {
            navigate('/dashboard');
        }
    };

    const currentStep = step < steps.length ? steps[step] : null;

    return (
        <div style={{
            minHeight: '100vh',
            padding: '40px 20px',
            background: 'var(--bg-warm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                >
                    ← Back
                </button>
            </div>

            {step < steps.length ? (
                <div style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: 'white',
                    borderRadius: 'var(--radius-2xl)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-xl)',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `${currentStep.color}20`,
                        color: currentStep.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto'
                    }}>
                        {currentStep.icon}
                    </div>

                    <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 8px 0', color: currentStep.color }}>
                        {currentStep.count}
                    </h2>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                        {currentStep.title}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
                        {currentStep.instruction}
                    </p>

                    <button
                        onClick={handleNext}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: currentStep.color,
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'transform 0.1s'
                        }}
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--sage)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 40px auto',
                        boxShadow: 'var(--shadow-glow)'
                    }}>
                        <Check size={64} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>You're Grounded.</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                        Great job taking this moment for yourself. You are here, safe and present.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '16px 32px',
                            background: 'white',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default GroundingExercise;
