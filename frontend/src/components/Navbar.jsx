import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span>📖</span> Innerflow
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        🌍 Feed
                    </Link>

                    {user ? (
                        <>
                            <Link to="/my-diary" className={`nav-link ${isActive('/my-diary')}`}>
                                📝 My Diary
                            </Link>
                            <Link to="/write" className={`nav-link ${isActive('/write')}`}>
                                ✨ Write
                            </Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                                👤 Profile
                            </Link>
                            <button onClick={handleLogout} className="nav-link" id="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
