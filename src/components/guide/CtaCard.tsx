type CtaCardProps = {
  title: string
  body: string
  label: string
}

export function CtaCard({ title, body, label }: CtaCardProps) {
  return (
    <aside className="cta-card">
      <h2>{title}</h2>
      <p>{body}</p>
      <a className="editorial-cta" href="/">
        {label}
      </a>
    </aside>
  )
}
