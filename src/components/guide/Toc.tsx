export const GUIDE_SECTIONS = [
  { id: 'why-employers-ask', label: 'Why employers ask this' },
  { id: 'what-a-strong-answer-includes', label: 'What a strong answer includes' },
  { id: 'a-simple-answer-formula', label: 'A simple answer formula' },
  { id: 'example-answers', label: '3 example answers' },
  { id: 'common-mistakes', label: 'Common mistakes' },
  { id: 'final-tip', label: 'Final tip before recording' },
] as const

type TocProps = {
  variant?: 'sidebar' | 'mobile'
}

export function Toc({ variant = 'sidebar' }: TocProps) {
  const list = (
    <ol className="toc-list">
      {GUIDE_SECTIONS.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>{section.label}</a>
        </li>
      ))}
    </ol>
  )

  if (variant === 'mobile') {
    return (
      <details className="toc toc-mobile">
        <summary>In this article</summary>
        {list}
      </details>
    )
  }

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc-heading">In this article</p>
      {list}
    </nav>
  )
}
