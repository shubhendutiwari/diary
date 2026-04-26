import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleIcon, FacebookIcon, InstagramIcon } from '../components/SocialIcons';

const SOCIAL_PROVIDERS = [
    { id: 'google', name: 'Google', Icon: GoogleIcon, className: 'social-btn-google' },
    { id: 'facebook', name: 'Facebook', Icon: FacebookIcon, className: 'social-btn-facebook' },
    { id: 'instagram', name: 'Instagram', Icon: InstagramIcon, className: 'social-btn-instagram' },
];

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(username, password);
            if (!result.emailVerified && result.authProvider === 'local') {
                navigate('/verify-email');
            } else {
                navigate('/my-diary');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`To enable ${provider.name} login:\n\n1. Create a ${provider.name} Developer App\n2. Add your Client ID and Secret to application.properties\n3. Configure the redirect URI\n\nSee the project README for setup instructions.`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-logo">📖</div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue your journey</p>
                    </div>

                    {/* Social Login Buttons with real logos */}
                    <div className="social-login-section">
                        {SOCIAL_PROVIDERS.map((provider) => (
                            <button
                                key={provider.id}
                                className={`social-login-btn ${provider.className}`}
                                onClick={() => handleSocialLogin(provider)}
                                id={`login-${provider.id}`}
                            >
                                <span className="social-login-icon"><provider.Icon /></span>
                                Login with {provider.name}
                            </button>
                        ))}
                    </div>

                    <div className="auth-divider">
                        <span>or sign in with email</span>
                    </div>

                    {error && <div className="auth-error" id="login-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit} id="login-form">
                        <div className="input-group">
                            <label htmlFor="login-username">Username</label>
                            <input
                                id="login-username"
                                className="input"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="login-submit">
                            {loading ? '⏳ Signing in...' : '✨ Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </div>

                    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Demo: <strong>alice</strong> / <strong>password123</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
