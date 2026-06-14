import { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlAPI } from '../../services/api';

const URLCard = ({ url, onDelete }) => {
  const [copying,  setCopying]  = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isExpired = url.isExpired;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    setDeleting(true);
    try {
      await urlAPI.delete(url.id);
      if (onDelete) onDelete(url.id);
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete URL');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatLastVisited = (d) => {
    if (!d) return 'Never';
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatExpiry = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="url-card slide-in-right" style={isExpired ? { opacity: 0.7, borderColor: 'rgba(248,113,113,0.3)' } : {}}>
      <div className="url-card-header">
        <div className="url-info">
          <div className="url-original">{url.originalUrl}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {isExpired ? (
              <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 600 }}>
                {url.shortUrl} — <span style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px' }}>Expired</span>
              </span>
            ) : (
              <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="url-short">
                {url.shortUrl}
              </a>
            )}

            {/* Expiry badge */}
            {url.expiresAt && !isExpired && (
              <span style={{
                fontSize: '11px',
                color: '#fbbf24',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                ⏱ Expires {formatExpiry(url.expiresAt)}
              </span>
            )}
          </div>
        </div>

        <div className="url-actions">
          {/* Copy */}
          {!isExpired && (
            <button onClick={handleCopy} className="icon-btn" title="Copy to clipboard" id={`copy-btn-${url.id}`}>
              {copying ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}

          {/* Analytics */}
          <Link to={`/analytics/${url.id}`} className="icon-btn" title="View analytics" id={`analytics-btn-${url.id}`}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analytics
          </Link>

          {/* Delete */}
          <button onClick={handleDelete} className="icon-btn icon-btn-danger" title="Delete URL" id={`delete-btn-${url.id}`} disabled={deleting}>
            {deleting ? (
              <>
                <div className="spinner-modern" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                Deleting
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      <div className="url-stats">
        <div className="stat-item">
          <div className="stat-label">Clicks</div>
          <div className="stat-value">{url.clicks}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Created</div>
          <div className="stat-value">{formatDate(url.createdAt)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Last Visit</div>
          <div className="stat-value">{formatLastVisited(url.lastVisited)}</div>
        </div>
        {url.expiresAt && (
          <div className="stat-item">
            <div className="stat-label">Expires</div>
            <div className="stat-value" style={{ color: isExpired ? '#f87171' : '#fbbf24' }}>
              {isExpired ? 'Expired' : formatExpiry(url.expiresAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URLCard;
