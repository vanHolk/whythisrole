export function GuidePage() {
  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="/">
          <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" />
          <span className="brand-name">whythisrole</span>
        </a>
        <div className="topbar-right">
          <a className="topbar-link" href="/">
            Back to whythisrole
          </a>
        </div>
      </header>

      <main className="main">
        <section className="card guide-card">
          <p className="card-kicker">Guide</p>
          <h1>How to record it right</h1>
          <p className="card-lede">Coming soon.</p>
          <p className="guide-copy">
            This will be a short set of articles on eye contact, pacing, and
            what to say in a 45-second answer. Nothing here yet.
          </p>
          <a className="btn-primary" href="/">
            Back to recording
          </a>
        </section>
      </main>

      <footer className="footer">
        <p>
          Not affiliated with LinkedIn.{' '}
          <a className="footer-link" href="/privacy">
            Privacy & Terms.
          </a>
        </p>
        <p>
          Made by Van Ho ·{' '}
          <a
            className="footer-link"
            href="https://www.vanholker.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
          {' · '}
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/michael-holker-ba3b507b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  )
}
