import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import ScrollReveal from '../Common/ScrollReveal';

const AnalyticsPage = () => {
  const { urlId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getUrlAnalytics(urlId);
        setAnalytics(response.data.data);
        setError('');
      } catch (err) {
        setError('Failed to load analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <div className="container analytics-container">
          <div className="loading-container">
            <div className="spinner-modern" style={{ width: '40px', height: '40px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <div className="container analytics-container">
          <div className="modern-card" style={{ padding: '30px' }}>
            <div className="alert alert-error">{error || 'Analytics not found'}</div>
            <Link to="/dashboard" className="analytics-back-button" style={{ marginTop: '20px' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="container analytics-container">
        <ScrollReveal animation="fade-up" duration={750}>
          <div className="analytics-header">
            <Link to="/dashboard" className="analytics-back-button">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="dashboard-title">URL Analytics</h1>
            <p className="dashboard-subtitle">
              Detailed performance metrics for your shortened URL
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100} duration={750}>
          <div className="analytics-url-info">
            <div style={{ marginBottom: '20px' }}>
              <div className="stat-label" style={{ marginBottom: '8px' }}>
                ORIGINAL URL
              </div>
              <div style={{ fontSize: '15px', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: '500' }}>
                {analytics.originalUrl}
              </div>
            </div>
            <div className="divider"></div>
            <div style={{ marginTop: '20px' }}>
              <div className="stat-label" style={{ marginBottom: '8px' }}>
                SHORT URL
              </div>
              <a
                href={`${window.location.origin}/${analytics.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '18px', color: 'var(--accent-blue)', fontWeight: '600', textDecoration: 'none' }}
              >
                {window.location.origin}/{analytics.shortCode}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="analytics-stats-grid">
          <ScrollReveal animation="fade-up" delay={150} duration={650}>
            <div className="stat-card">
              <div className="stat-card-value">{analytics.totalClicks}</div>
              <div className="stat-card-label">Total Clicks</div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={230} duration={650}>
            <div className="stat-card">
              <div className="stat-card-value">
                {analytics.lastVisited ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36" style={{ display: 'block', margin: '0 auto' }}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : '—'}
              </div>
              <div className="stat-card-label">Status</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
                {analytics.lastVisited ? 'Active' : 'No visits yet'}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={310} duration={650}>
            <div className="stat-card">
              <div className="stat-card-value">{analytics.recentVisits.length}</div>
              <div className="stat-card-label">Recent Visits</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
                Last 10 visits
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up" delay={390} duration={800}>
          <div className="recent-visits-card">
            <h2 className="recent-visits-title">Visit History</h2>
            
            {analytics.recentVisits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon-svg">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="empty-state-title">No Visits Yet</h3>
                <p className="empty-state-text">
                  Share your short URL to start tracking visits and analytics
                </p>
              </div>
            ) : (
              <div className="visits-list">
                {analytics.recentVisits.map((visit, index) => (
                  <ScrollReveal key={index} animation="slide-left" delay={index * 50} duration={600}>
                    <div className="visit-item">
                      <div className="visit-time">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}>
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {formatDate(visit.timestamp)}
                      </div>
                      <div className="visit-details">
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Source:</strong> {visit.referer || 'Direct visit'}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          <strong>Device:</strong> {visit.userAgent.substring(0, 80)}
                          {visit.userAgent.length > 80 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AnalyticsPage;
