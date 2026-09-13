type EditorialHeaderProps = {
  active?: 'home' | 'guide' | 'faq'
}

export function EditorialHeader({ active }: EditorialHeaderProps) {
  return (
    <header className="editorial-header">
      <div className="editorial-header-inner">
        <a className="brand" href="/">
          <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" />
          <span className="brand-name">whythisrole</span>
        </a>
        <nav className="editorial-nav" aria-label="Editorial">
          <a href="/" className={active === 'home' ? 'is-active' : undefined}>
            Home
          </a>
          <a
            href="/guide"
            className={active === 'guide' ? 'is-active' : undefined}
            aria-current={active === 'guide' ? 'page' : undefined}
          >
            Guide
          </a>
          <a
            href="/faq"
            className={active === 'faq' ? 'is-active' : undefined}
            aria-current={active === 'faq' ? 'page' : undefined}
          >
            FAQ
          </a>
          <a href="/">Try it</a>
        </nav>
        <a className="editorial-cta" href="/">
          Try the tool
        </a>
      </div>
    </header>
  )
}
