import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { urlAPI } from '../../services/api';
import CreateURL from '../URLShortener/CreateURL';
import URLCard from './URLCard';
import ScrollReveal from '../Common/ScrollReveal';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await urlAPI.getAll();
      setUrls(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load URLs');
      console.error('Error fetching URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUrlCreated = (newUrl) => {
    setUrls([newUrl, ...urls]);
  };

  const handleUrlDeleted = (urlId) => {
    setUrls(urls.filter(url => url.id !== urlId));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="container dashboard-container">
        <ScrollReveal animation="fade-up" duration={750}>
          <div className="dashboard-header">
            <div className="dashboard-greeting">{getGreeting()}</div>
            <h1 className="dashboard-title">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="dashboard-subtitle">
              Manage your shortened URLs and track their performance
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} duration={750}>
          <CreateURL onUrlCreated={handleUrlCreated} />
        </ScrollReveal>

        <div className="dashboard-grid">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-modern" style={{ width: '40px', height: '40px' }}></div>
            </div>
          ) : error ? (
            <div className="modern-card" style={{ padding: '30px' }}>
              <div className="alert alert-error">{error}</div>
            </div>
          ) : urls.length === 0 ? (
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="modern-card empty-state">
                <div className="empty-state-icon-svg">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="empty-state-title">No URLs Yet</h3>
                <p className="empty-state-text">
                  Create your first shortened URL using the form above
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="url-list">
              {urls.map((url, index) => (
                <ScrollReveal key={url.id} animation="fade-up" delay={index * 80} duration={600}>
                  <URLCard
                    url={url}
                    onDelete={handleUrlDeleted}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
