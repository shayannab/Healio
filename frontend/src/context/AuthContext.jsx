import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await api.auth.login(credentials);
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: data.error || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            const data = await api.auth.signup(userData);
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: data.error || 'Signup failed' };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
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
