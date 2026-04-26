import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const setAuthData = (data) => {
        const { token, username, userId, emailVerified, authProvider } = data;
        localStorage.setItem('token', token);
        const userData = { id: userId, username, emailVerified, authProvider };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const login = async (username, password) => {
        const res = await authAPI.login({ username, password });
        setAuthData(res.data);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await authAPI.register({ username, email, password });
        setAuthData(res.data);
        return res.data;
    };

    const oauthLogin = async (provider, accessToken, email, name, providerId, avatarUrl) => {
        const res = await authAPI.oauthLogin({ provider, accessToken, email, name, providerId, avatarUrl });
        setAuthData(res.data);
        return res.data;
    };

    const verifyEmail = async (code) => {
        const res = await authAPI.verifyEmail(code);
        if (res.data.verified) {
            setUser((prev) => ({ ...prev, emailVerified: true }));
            const saved = JSON.parse(localStorage.getItem('user') || '{}');
            saved.emailVerified = true;
            localStorage.setItem('user', JSON.stringify(saved));
        }
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await userAPI.getMe();
            const userData = res.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (err) {
            // ignore
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, oauthLogin, verifyEmail, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
