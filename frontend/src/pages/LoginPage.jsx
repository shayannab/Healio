import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Auth.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Accesses the login function from your context
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload
        setError(null);
        setLoading(true);

        try {
            // This calls the login function in AuthContext, which calls api.js
            const success = await login(formData);
            
            if (success) {
                console.log("Login verified. Redirecting...");
                // Standard redirect to user dashboard
                navigate('/dashboard'); 
            } else {
                // If the context returns false, it usually means credentials failed
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            // Catches network errors or specific backend error messages
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🌊</span>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your MoodFlow account</p>
                </div>

                {/* ERROR DISPLAY: Shows 401 Unauthorized or network errors */}
                {error && (
                    <div className="auth-error-box" style={{
                        backgroundColor: 'rgba(255, 77, 77, 0.1)',
                        color: '#ff4d4d',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Verifying Identity...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;