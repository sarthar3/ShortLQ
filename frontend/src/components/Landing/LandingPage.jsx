import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '/logo.png';
import ScrollReveal from '../Common/ScrollReveal';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <ScrollReveal animation="fade-up" duration={900}>
            <div className="hero-content">
              <h1 className="hero-title">
                Shorten Links.<br />
                <span className="hero-title-accent">Track Everything.</span>
              </h1>
              <p className="hero-subtitle">
                Create smart, short URLs that work harder for you. 
                Get real-time analytics, track clicks, and understand your audience — all in one place.
              </p>
              <div className="hero-cta">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-hero-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-hero-primary">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn-hero-secondary">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">Fast</span>
                  <span className="hero-stat-label">Redirect Speed</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-value">Real-time</span>
                  <span className="hero-stat-label">Analytics</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-value">Secure</span>
                  <span className="hero-stat-label">Authentication</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Hero Visual */}
          <ScrollReveal animation="fade-up" delay={200} duration={900}>
            <div className="hero-visual">
              <div className="hero-card-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="mockup-title">shortiq.io / dashboard</span>
                </div>
                <div className="mockup-body">
                  <div className="mockup-input-row">
                    <div className="mockup-url-input">
                      <span>https://very-long-url-example.com/page/path?ref=...</span>
                    </div>
                    <div className="mockup-btn">Shorten</div>
                  </div>
                  <div className="mockup-result">
                    <div className="mockup-result-left">
                      <div className="mockup-short-url">shortiq.io / <strong>abc123</strong></div>
                      <div className="mockup-original-url">very-long-url-example.com/...</div>
                    </div>
                    <div className="mockup-clicks">
                      <span className="mockup-click-num">2,847</span>
                      <span className="mockup-click-lbl">Clicks</span>
                    </div>
                  </div>
                  <div className="mockup-result" style={{ opacity: 0.7 }}>
                    <div className="mockup-result-left">
                      <div className="mockup-short-url">shortiq.io / <strong>xyz789</strong></div>
                      <div className="mockup-original-url">another-website.com/article/...</div>
                    </div>
                    <div className="mockup-clicks">
                      <span className="mockup-click-num">1,203</span>
                      <span className="mockup-click-lbl">Clicks</span>
                    </div>
                  </div>
                  <div className="mockup-result" style={{ opacity: 0.4 }}>
                    <div className="mockup-result-left">
                      <div className="mockup-short-url">shortiq.io / <strong>lmn456</strong></div>
                      <div className="mockup-original-url">docs.example.com/guide/...</div>
                    </div>
                    <div className="mockup-clicks">
                      <span className="mockup-click-num">563</span>
                      <span className="mockup-click-lbl">Clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Everything you need</h2>
              <p className="section-subtitle">Powerful tools to manage and optimize every link you share</p>
            </div>
          </ScrollReveal>
          <div className="features-grid">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Instant Shortening</h3>
                <p className="feature-desc">Transform long, complex URLs into clean, memorable links in seconds. Share them anywhere with confidence.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Real-Time Analytics</h3>
                <p className="feature-desc">Track clicks, monitor traffic sources, and understand visitor patterns with detailed, live analytics dashboards.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Secure & Reliable</h3>
                <p className="feature-desc">Your links are protected with secure authentication and reliable infrastructure ensuring 99.9% uptime.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Visit History</h3>
                <p className="feature-desc">Review the last 10 visits per link, including timestamps, referrer sources, and device information.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={400}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">One-Click Copy</h3>
                <p className="feature-desc">Copy your shortened URLs to clipboard instantly. Seamless sharing across all your platforms and channels.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={500}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Link Management</h3>
                <p className="feature-desc">Organize, view, and manage all your shortened URLs from a single, clean dashboard interface.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <ScrollReveal animation="scale-up" duration={900}>
            <div className="cta-card">
              <img src={logoImg} alt="ShortIQ Logo" className="cta-logo" />
              <h2 className="cta-title">Start shortening links today</h2>
              <p className="cta-subtitle">Join thousands of users who trust ShortIQ to manage their links</p>
              <div className="cta-actions">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-hero-primary">
                    Open Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-hero-primary">
                      Create Free Account
                    </Link>
                    <Link to="/login" className="btn-cta-outline">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <ScrollReveal animation="fade-in">
            <div className="footer-content">
              <div className="footer-brand">
                <img src={logoImg} alt="ShortIQ" className="footer-logo" />
                <span className="footer-brand-name">ShortIQ</span>
              </div>
              <p className="footer-copy">© 2025 ShortIQ. Smarter links, deeper insights.</p>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
