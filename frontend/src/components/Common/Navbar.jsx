import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccountSettings from '../Dashboard/AccountSettings';
import logoImg from '/logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const isLanding = location.pathname === '/';

  return (
    <>
      <nav className={`navbar${isLanding ? ' navbar-transparent' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon">
                <img
                  src={logoImg}
                  alt="ShortIQ Logo"
                  style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <span className="navbar-brand">ShortIQ</span>
            </Link>

            <div className="navbar-menu">
              {isAuthenticated ? (
                <div className="navbar-user">
                  <span className="navbar-email">{user?.email}</span>
                  <button onClick={() => setShowSettings(true)} className="btn-secondary" id="navbar-settings-btn">
                    Settings
                  </button>
                  <button onClick={logout} className="btn-secondary" id="navbar-logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="navbar-link" id="navbar-login-link">
                    Login
                  </Link>
                  <Link to="/signup" id="navbar-signup-link">
                    <button className="btn-primary">Get Started</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showSettings && <AccountSettings onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Navbar;
