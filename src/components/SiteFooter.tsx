import { Globe, Lock } from 'lucide-react'
import { FaLinkedinIn } from 'react-icons/fa'
import { ThemePicker } from './ThemePicker'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/guide', label: 'Guide' },
  { href: '/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/', label: 'Try it' },
] as const

function isCurrent(label: string, href: string, pathname: string) {
  if (label === 'Try it') return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteFooter() {
  const pathname = window.location.pathname

  return (
    <footer className="footer">
      <a className="brand footer-brand" href="/">
        <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" />
        <span className="brand-name">whythisrole</span>
      </a>

      <nav className="footer-nav" aria-label="Footer">
        {NAV.map((item) => {
          const current = isCurrent(item.label, item.href, pathname)
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={current ? 'page' : undefined}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="footer-socials">
        <a
          className="footer-social"
          href="https://www.linkedin.com/in/michael-holker-ba3b507b/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn size={16} aria-hidden="true" />
        </a>
        <a
          className="footer-social"
          href="https://www.vanholker.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio"
        >
          <Globe size={18} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <div className="footer-meta">
        <p className="footer-trust">
          <Lock size={16} strokeWidth={2} aria-hidden="true" />
          Video never leaves this browser tab. No account.
        </p>
        <ThemePicker />
        <p>Not affiliated with LinkedIn.</p>
        <p>Made by Van Ho</p>
      </div>
    </footer>
  )
}
