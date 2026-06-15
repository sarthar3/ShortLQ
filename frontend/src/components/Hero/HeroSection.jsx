import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/hero.css';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="hero-section" className="hero-ripple-section">

      {/* ── Main hero content ── */}
      <div className="hero-content">

        {/* Headline */}
        <h1 className="hero-title">
          Shorten Smart,<br />
          <span className="hero-title-accent">Share Faster</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          ShortLQ turns your long, messy URLs into sleek, trackable links —
          with real-time analytics, custom expiry, and full dashboard control.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-group">
          {isAuthenticated ? (
            <Link to="/dashboard" className="hero-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="hero-btn-primary">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Get Started Free
              </Link>
              <Link to="/login" className="hero-btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>


      </div>

      {/* ── Feature Cards ── */}
      <div className="hero-features">

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">Instant Shortening</div>
          <div className="hero-feature-desc">
            Paste any URL and get a compact, shareable link in milliseconds. No fluff, no redirects, just speed.
          </div>
        </div>

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">Click Analytics</div>
          <div className="hero-feature-desc">
            Track every click in real time — see timestamps, device info, referral sources, and visit history.
          </div>
        </div>

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">Link Expiry</div>
          <div className="hero-feature-desc">
            Set links to self-destruct — choose from 5 minutes to 6 months. Perfect for time-sensitive content.
          </div>
        </div>

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">Secure &amp; Reliable</div>
          <div className="hero-feature-desc">
            Every link is backed by JWT authentication, and inactive links auto-clean after 6 months to keep things fast.
          </div>
        </div>

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">One-Click Copy</div>
          <div className="hero-feature-desc">
            Copy shortened links to clipboard instantly from your dashboard. Share across any platform effortlessly.
          </div>
        </div>

        <div className="hero-feature-card">
          <div className="hero-feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-feature-title">Full Account Control</div>
          <div className="hero-feature-desc">
            Manage all your links in one dashboard. Delete individual links or your entire account — your data, your rules.
          </div>
        </div>

      </div>



      {/* WebGL fallback */}
      <div id="webgl-fallback" className="webgl-fallback">
        <p>For the full water ripple experience, please use a modern browser with WebGL support.</p>
      </div>

    </section>
  );
};

export default HeroSection;
