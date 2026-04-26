import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function VerifyEmailPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { verifyEmail, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await verifyEmail(code.toUpperCase());
            if (result.verified) {
                setSuccess(true);
                setTimeout(() => navigate('/my-diary'), 1500);
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const { authAPI } = await import('../services/api');
            await authAPI.resendVerification();
            setError('');
            alert('New verification code sent! Check your email (or console in dev mode).');
        } catch (err) {
            setError('Failed to resend code');
        }
    };

    if (user?.emailVerified) {
        navigate('/my-diary');
        return null;
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-logo">📧</div>
                        <h1 className="auth-title">{success ? 'Verified!' : 'Verify Your Email'}</h1>
                        <p className="auth-subtitle">
                            {success
                                ? 'Your email has been verified. Redirecting...'
                                : 'Enter the 6-character code sent to your email'}
                        </p>
                    </div>

                    {!success && (
                        <>
                            {error && <div className="auth-error">{error}</div>}

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label htmlFor="verify-code">Verification Code</label>
                                    <input
                                        id="verify-code"
                                        className="input"
                                        type="text"
                                        placeholder="Enter 6-character code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                        style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.5rem', fontWeight: 700 }}
                                        autoFocus
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading || code.length !== 6}>
                                    {loading ? '⏳ Verifying...' : '✅ Verify Email'}
                                </button>
                            </form>

                            <div className="auth-footer">
                                Didn't receive the code?{' '}
                                <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)', fontSize: 'inherit' }}>
                                    Resend
                                </button>
                            </div>

                            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                💡 Dev mode: Check server console for the verification code
                            </div>
                        </>
                    )}

                    {success && (
                        <div style={{ textAlign: 'center', fontSize: '3rem', animation: 'float 1s ease-in-out infinite' }}>
                            ✅
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
