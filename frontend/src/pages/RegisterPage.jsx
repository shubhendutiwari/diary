import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleIcon, FacebookIcon, InstagramIcon } from '../components/SocialIcons';

const SOCIAL_PROVIDERS = [
    { id: 'google', name: 'Google', Icon: GoogleIcon, className: 'social-btn-google' },
    { id: 'facebook', name: 'Facebook', Icon: FacebookIcon, className: 'social-btn-facebook' },
    { id: 'instagram', name: 'Instagram', Icon: InstagramIcon, className: 'social-btn-instagram' },
];

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
            navigate('/verify-email');
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'object' && !data.error) {
                setError(Object.values(data).join('. '));
            } else {
                setError(data?.error || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`To enable ${provider.name} signup:\n\n1. Create a ${provider.name} Developer App\n2. Add your Client ID and Secret to application.properties\n3. Configure the redirect URI\n\nSee the project README for setup instructions.`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-logo">✨</div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Start your daily journaling journey</p>
                    </div>

                    {/* Social Signup Buttons with real logos */}
                    <div className="social-login-section">
                        {SOCIAL_PROVIDERS.map((provider) => (
                            <button
                                key={provider.id}
                                className={`social-login-btn ${provider.className}`}
                                onClick={() => handleSocialLogin(provider)}
                                id={`register-${provider.id}`}
                            >
                                <span className="social-login-icon"><provider.Icon /></span>
                                Sign up with {provider.name}
                            </button>
                        ))}
                    </div>

                    <div className="auth-divider">
                        <span>or register with email</span>
                    </div>

                    {error && <div className="auth-error" id="register-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit} id="register-form">
                        <div className="input-group">
                            <label htmlFor="register-username">Username</label>
                            <input id="register-username" className="input" type="text" placeholder="Choose a username"
                                value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={50} autoFocus />
                        </div>

                        <div className="input-group">
                            <label htmlFor="register-email">Email</label>
                            <input id="register-email" className="input" type="email" placeholder="your@email.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="register-password">Password</label>
                            <input id="register-password" className="input" type="password" placeholder="At least 6 characters"
                                value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-submit">
                            {loading ? '⏳ Creating account...' : '🚀 Get Started'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
