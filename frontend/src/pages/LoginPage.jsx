import { Link } from 'react-router-dom';
import '../styles/pages/Auth.css';

function LoginPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🌊</span>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your MoodFlow account</p>
                </div>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="you@example.com"
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
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Sign In
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
