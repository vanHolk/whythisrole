import { Lightbulb } from 'lucide-react'

type AppHeaderProps = {
  showGuide?: boolean
}

export function AppHeader({ showGuide = true }: AppHeaderProps) {
  function handleHome(event: { preventDefault: () => void }) {
    if (window.location.pathname === '/') event.preventDefault()
  }

  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={handleHome}>
        <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" />
        <span className="brand-name">whythisrole</span>
      </a>
      <div className="topbar-right">
        <p className="topbar-tag">Nail the video they asked for.</p>
        {showGuide ? (
          <a className="topbar-link" href="/guide">
            <Lightbulb size={18} strokeWidth={2} aria-hidden="true" />
            How to record it right
          </a>
        ) : (
          <a className="topbar-link" href="/">
            Back to whythisrole
          </a>
        )}
      </div>
    </header>
  )
}
