import './App.css'

function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar" id="navbar">
        <a href="/" className="navbar-logo">TenantTrails</a>
        <div className="navbar-actions">
          <button type="button" className="btn-text" id="nav-signin">Sign In</button>
          <button type="button" className="btn-primary" id="nav-get-started">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
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
          <button type="button" className="btn-cta-primary" id="cta-create-account">Create Free Account</button>
          <button type="button" className="btn-cta-secondary" id="cta-signin">Sign In</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="feature-title">Verified Reviews</div>
          <div className="feature-desc">
            Real ratings with photos and videos from past tenants.
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#3b5bdb">
              <path d="M12 2L8.5 9.5 2 12l6.5 2.5L12 22l3.5-7.5L22 12l-6.5-2.5z"/>
            </svg>
          </div>
          <div className="feature-title">AI Summaries</div>
          <div className="feature-desc">
            Key issues and sentiment extracted from every review.
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4" fill="#6b7280" stroke="none"/>
            </svg>
          </div>
          <div className="feature-title">Ask Questions</div>
          <div className="feature-desc">
            Comment on reviews and get answers from past tenants.
          </div>
        </div>
      </section>

    </>
  )
}

export default App
