import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check for existing session on mount
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('user_role');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            // Re-hydrate the user state from local storage if a token exists
            setUser(JSON.parse(storedUser));
        } else if (token) {
            // Fallback to basic auth state if full user object is missing
            setUser({ role: role || 'student', authenticated: true });
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            // api.auth.login handles the Form Data and localStorage for tokens
            const data = await api.auth.login(credentials);
            
            // Validate that the backend returned a successful token
            if (data.access_token) {
                const loggedInUser = {
                    email: credentials.email,
                    role: data.role || 'student',
                    authenticated: true
                };
                
                // Update local and global state
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                
                return { success: true };
            }
            return { success: false, error: 'Login failed: No token received' };
        } catch (error) {
            console.error('Login error in Context:', error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            // signup calls /auth/register on port 8000
            const data = await api.auth.signup(userData);
            
            if (data) {
                // Return success so the SignupPage can redirect to Login
                return { success: true };
            }
            return { success: false, error: 'Signup failed' };
        } catch (error) {
            console.error('Signup error in Context:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        // Securely clear all session-related identifiers
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};