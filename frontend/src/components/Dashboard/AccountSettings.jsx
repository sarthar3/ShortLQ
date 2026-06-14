import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountSettings = ({ onClose }) => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]             = useState(1); // 1=info, 2=confirm-type, 3=password
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleDeleteRequest = () => setStep(2);

  const handleConfirmText = () => {
    if (confirmText.trim() !== 'DELETE') {
      setError('Please type DELETE exactly to confirm.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalDelete = async () => {
    if (!password) { setError('Password is required.'); return; }
    setLoading(true);
    setError('');
    const result = await deleteAccount(password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(4, 15, 14, 0.95)',
    backdropFilter: 'blur(32px)',
    borderRadius: '20px',
    padding: '36px',
    border: '1px solid rgba(49,120,115,0.35)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    animation: 'fadeInUp 0.3s ease',
  };

  const inputStyle = {
    background: 'rgba(10, 30, 28, 0.7)',
    border: '1px solid rgba(49,120,115,0.4)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#e6f4f3',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    marginTop: '8px',
  };

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={cardStyle} className="fade-in-up">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e6f4f3', margin: 0 }}>Account Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#669999', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>
        </div>

        {/* ── Step 1: Account Info ── */}
        {step === 1 && (
          <>
            {/* User info */}
            <div style={{ background: 'rgba(49,120,115,0.08)', border: '1px solid rgba(49,120,115,0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', color: '#669999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Signed in as</div>
              <div style={{ fontSize: '15px', color: '#4cd2cc', fontWeight: 600 }}>{user?.email}</div>
            </div>

            <div style={{ height: '1px', background: 'rgba(49,120,115,0.2)', margin: '0 0 24px' }} />

            {/* Danger zone */}
            <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '14px', padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ color: '#f87171' }}>
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f87171' }}>Danger Zone</span>
              </div>
              <p style={{ fontSize: '13px', color: '#99cccc', lineHeight: 1.6, margin: '0 0 16px' }}>
                Permanently delete your account, all shortened URLs, and all analytics data.
                <strong style={{ color: '#f87171' }}> This cannot be undone.</strong>
              </p>
              <button
                onClick={handleDeleteRequest}
                id="delete-account-btn"
                style={{
                  background: 'rgba(248,113,113,0.12)',
                  border: '1px solid rgba(248,113,113,0.35)',
                  borderRadius: '10px',
                  color: '#f87171',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '10px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete My Account
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Type DELETE ── */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ color: '#f87171', fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>Are you absolutely sure?</h3>
              <p style={{ color: '#99cccc', fontSize: '13px', lineHeight: 1.6 }}>
                This will permanently delete your account and <strong style={{ color: '#e6f4f3' }}>all your data</strong>.
                Type <strong style={{ color: '#f87171', fontFamily: 'monospace' }}>DELETE</strong> below to confirm.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#99cccc', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Type DELETE to confirm
              </label>
              <input
                style={{ ...inputStyle, letterSpacing: '2px', textAlign: 'center', borderColor: confirmText === 'DELETE' ? 'rgba(248,113,113,0.6)' : 'rgba(49,120,115,0.4)' }}
                placeholder="DELETE"
                value={confirmText}
                onChange={e => { setConfirmText(e.target.value); setError(''); }}
                id="delete-confirm-input"
                autoFocus
              />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '13px', marginTop: '10px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => { setStep(1); setConfirmText(''); setError(''); }}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(49,120,115,0.3)', background: 'transparent', color: '#99cccc', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmText}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                Continue
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Enter password ── */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
              <h3 style={{ color: '#f87171', fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>Confirm with Password</h3>
              <p style={{ color: '#99cccc', fontSize: '13px', lineHeight: 1.6 }}>
                Enter your current password to permanently delete your account.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#99cccc', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Your Password
              </label>
              <input
                type="password"
                style={inputStyle}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                id="delete-password-input"
                autoFocus
              />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '13px', marginTop: '10px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => { setStep(1); setPassword(''); setConfirmText(''); setError(''); }}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(49,120,115,0.3)', background: 'transparent', color: '#99cccc', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleFinalDelete} disabled={loading}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(248,113,113,0.4)', background: loading ? 'rgba(248,113,113,0.06)' : 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <><div className="spinner-modern" style={{ width: '16px', height: '16px', borderColor: 'rgba(248,113,113,0.3)', borderTopColor: '#f87171' }} /> Deleting...</>
                ) : 'Delete Forever'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AccountSettings;
