import { useState } from 'react';
import { urlAPI } from '../../services/api';

const EXPIRY_OPTIONS = [
  { label: '5 min',   value: '5m'   },
  { label: '1 hour',  value: '1h'   },
  { label: '1 day',   value: '1d'   },
  { label: '7 days',  value: '7d'   },
  { label: '1 month', value: '1mo'  },
  { label: '3 months',value: '3mo'  },
  { label: '6 months',value: '6mo'  },
  { label: 'Never',   value: 'never'},
];

const CreateURL = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiry, setExpiry]           = useState('never');
  const [showExpiry, setShowExpiry]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await urlAPI.create({ originalUrl, expiry });
      setSuccess('Short URL created successfully!');
      setOriginalUrl('');
      setExpiry('never');
      setShowExpiry(false);
      if (onUrlCreated) onUrlCreated(response.data.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const selectedLabel = EXPIRY_OPTIONS.find(o => o.value === expiry)?.label || 'Never';

  return (
    <div className="url-shortener-card fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="url-shortener-title" style={{ margin: 0 }}>Create Short Link</h2>
        <button
          type="button"
          onClick={() => setShowExpiry(!showExpiry)}
          style={{
            background: showExpiry ? 'rgba(49,120,115,0.2)' : 'rgba(49,120,115,0.08)',
            border: `1px solid ${showExpiry ? 'rgba(76,210,204,0.5)' : 'rgba(49,120,115,0.25)'}`,
            borderRadius: '8px',
            color: '#4cd2cc',
            fontSize: '13px',
            fontWeight: 600,
            padding: '7px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          id="expiry-toggle-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Expiry: {selectedLabel}
        </button>
      </div>

      {/* Expiry picker */}
      {showExpiry && (
        <div className="slide-in-right" style={{ marginBottom: '16px', padding: '16px', background: 'rgba(49,120,115,0.06)', borderRadius: '12px', border: '1px solid rgba(49,120,115,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#99cccc', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Link Expiry Timer
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EXPIRY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setExpiry(opt.value)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${expiry === opt.value ? 'rgba(76,210,204,0.7)' : 'rgba(49,120,115,0.25)'}`,
                  background: expiry === opt.value ? 'rgba(76,210,204,0.15)' : 'rgba(49,120,115,0.06)',
                  color: expiry === opt.value ? '#4cd2cc' : '#99cccc',
                  fontSize: '13px',
                  fontWeight: expiry === opt.value ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                id={`expiry-opt-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {expiry !== 'never' && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#669999' }}>
              ⏱ This link will stop working after {selectedLabel}.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="alert alert-error slide-in-right" style={{ marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success slide-in-right" style={{ marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="url-form">
        <div className="url-input-wrapper">
          <input
            type="url"
            className="modern-input"
            placeholder="Paste your long URL here..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            disabled={loading}
            id="url-input"
          />
        </div>
        <button
          type="submit"
          className="btn-primary url-submit-button"
          id="url-shorten-btn"
          disabled={loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div className="spinner-modern" />
              <span>Creating...</span>
            </div>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateURL;
