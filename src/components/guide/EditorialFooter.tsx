export function EditorialFooter() {
  return (
    <footer className="editorial-footer">
      <nav className="editorial-footer-nav" aria-label="Footer">
        <a href="/">Home</a>
        <a href="/privacy">Privacy</a>
      </nav>
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
  )
}
