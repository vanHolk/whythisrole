export const GUIDE_SECTIONS = [
  { id: 'what-employers-ask', label: 'What employers are actually asking' },
  { id: 'three-part-answer', label: 'A simple 3-part answer' },
  { id: 'how-long', label: 'How long should your video answer be?' },
  { id: 'example-1', label: 'Examples' },
  { id: 'need-a-job', label: 'What if you mostly applied because you need a job?' },
  { id: 'common-mistakes', label: 'Common mistakes' },
  { id: 'before-you-record', label: 'Before you record' },
  { id: 'bullet-points-or-script', label: 'Should you use bullet points or a full script?' },
  { id: 'turn-notes-into-answer', label: 'Turn your notes into a short video answer' },
] as const

export type TocSection = {
  id: string
  label: string
}

type TocProps = {
  variant?: 'sidebar' | 'mobile'
  sections?: readonly TocSection[]
}

export function Toc({ variant = 'sidebar', sections = GUIDE_SECTIONS }: TocProps) {
  const list = (
    <ol className="toc-list">
      {sections.map((section) => (
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
