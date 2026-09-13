import type { ReactNode } from 'react'

type CalloutProps = {
  variant: 'tip' | 'info'
  label: string
  children: ReactNode
}

export function Callout({ variant, label, children }: CalloutProps) {
  return (
    <aside className={`callout callout-${variant}`} role="note">
      <p className="callout-label">{label}</p>
      {children}
    </aside>
  )
}
