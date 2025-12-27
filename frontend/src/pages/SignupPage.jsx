import { Link } from 'react-router-dom';
import '../styles/pages/Auth.css';

function SignupPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🌱</span>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Start your mental wellness journey today</p>
                </div>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                            minLength="8"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="form-input"
                            placeholder="••••••••"
                            minLength="8"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Create Account
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
