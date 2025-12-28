import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api'; 
import '../styles/pages/Auth.css';

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        // id is used here to map the input to the state key
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authAPI.signup({
                email: formData.email,
                password: formData.password,
                full_name: formData.name
            });

            if (response) {
                alert("Account created successfully! Please sign in.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to connect to the Identity Vault");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🌱</span>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Healio and start your journey</p>
                </div>

                {error && <div className="auth-error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name" // Fix: Explicit name attribute
                            autoComplete="name" // Fix: Explicit autocomplete
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email" // Fix: Explicit name attribute
                            autoComplete="email" // Fix: Explicit autocomplete
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password" // Fix: Explicit name attribute
                            autoComplete="new-password" // Fix: Secure signup pattern
                            className="form-input"
                            placeholder="••••••••"
                            minLength="8"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword" // Fix: Explicit name attribute
                            autoComplete="new-password" // Fix: Matches password field hint
                            className="form-input"
                            placeholder="••••••••"
                            minLength="8"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Vault Identity...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?
                        <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;