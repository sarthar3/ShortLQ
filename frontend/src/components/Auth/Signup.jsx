import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '/logo.png';

const inputStyle = {
  background: 'rgba(6, 21, 20, 0.7)',
  border: '1px solid rgba(49,120,115,0.4)',
  borderRadius: '12px',
  padding: '13px 16px',
  fontSize: '14px',
  color: '#e6f4f3',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(49,120,115,0.85)';
    e.target.style.boxShadow = '0 0 0 3px rgba(49,120,115,0.2)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(49,120,115,0.4)';
    e.target.style.boxShadow = 'none';
  };

  return (
    /* Full-page centering — sits above the global water ripple canvas */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      {/* Glass signup card */}
      <div
        className="fade-in-up"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(4, 15, 14, 0.78)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid rgba(49, 120, 115, 0.35)',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(49,120,115,0.12), inset 0 1px 0 rgba(76,210,204,0.08)',
          margin: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logoImg} alt="ShortLQ" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(49,120,115,0.6))' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e6f4f3', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Create Account
          </h1>
          <p style={{ color: '#99cccc', fontSize: '14px' }}>Start shortening URLs with ShortLQ</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error slide-in-right" style={{ marginBottom: '20px' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ color: '#99cccc', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              style={inputStyle}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ color: '#99cccc', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              style={inputStyle}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {password && password.length < 6 && (
              <small style={{ color: '#f87171', fontSize: '12px' }}>Password must be at least 6 characters</small>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="confirmPassword" style={{ color: '#99cccc', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              style={inputStyle}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {confirmPassword && password !== confirmPassword && (
              <small style={{ color: '#f87171', fontSize: '12px' }}>Passwords do not match</small>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit-btn"
            disabled={loading}
            style={{
              marginTop: '4px',
              padding: '14px',
              background: loading
                ? 'rgba(49,120,115,0.35)'
                : 'linear-gradient(135deg, #317873 0%, #1d4845 100%)',
              color: '#ffffff',
              border: '1px solid rgba(49,120,115,0.4)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(49,120,115,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(49,120,115,0.55)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(49,120,115,0.4)'; }}
          >
            {loading ? (
              <>
                <div className="spinner-modern" style={{ width: '18px', height: '18px', borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff' }} />
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', color: '#669999', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4cd2cc', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
