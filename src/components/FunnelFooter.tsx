import { Lock } from 'lucide-react'
import { ThemePicker } from './ThemePicker'

export function FunnelFooter() {
  return (
    <footer className="footer">
      <p className="footer-trust">
        <Lock size={18} strokeWidth={2} aria-hidden="true" />
        Video never leaves this browser tab. No account.
      </p>
      <ThemePicker />
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
