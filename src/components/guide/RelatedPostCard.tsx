type RelatedPostCardProps = {
  title: string
  dek: string
  href?: string
}

export function RelatedPostCard({ title, dek, href = '#' }: RelatedPostCardProps) {
  return (
    <a className="related-card" href={href}>
      <h3>{title}</h3>
      <p>{dek}</p>
    </a>
  )
}
