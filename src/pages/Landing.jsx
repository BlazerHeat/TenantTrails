import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <>
      <nav className="navbar" id="navbar">
        <Link to="/" className="navbar-logo">TenantTrails</Link>
        <div className="navbar-actions">
          <Link to="/signin" className="btn-text">Sign In</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero-section" id="hero">
        <span className="hero-badge">Launching in Halifax, Nova Scotia</span>
        <h1 className="hero-heading">
          Know what you&rsquo;re signing<br />before you sign it.
        </h1>
        <p className="hero-subtext">
          Read honest reviews from past tenants. See AI-generated<br />
          summaries. Make informed decisions about where you live.
        </p>
        <div className="hero-cta-group">
          <Link to="/signup" className="btn-cta-primary">Create Free Account</Link>
          <Link to="/signin" className="btn-cta-secondary">Sign In</Link>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="feature-title">Verified Reviews</div>
          <div className="feature-desc">Real ratings with photos and videos from past tenants.</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#3b5bdb">
              <path d="M12 2L8.5 9.5 2 12l6.5 2.5L12 22l3.5-7.5L22 12l-6.5-2.5z"/>
            </svg>
          </div>
          <div className="feature-title">AI Summaries</div>
          <div className="feature-desc">Key issues and sentiment extracted from every review.</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4" fill="#6b7280" stroke="none"/>
            </svg>
          </div>
          <div className="feature-title">Ask Questions</div>
          <div className="feature-desc">Comment on reviews and get answers from past tenants.</div>
        </div>
      </section>
    </>
  )
}
