import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  applyTheme,
  persistThemePref,
  readThemePref,
  type ThemePref,
} from '../lib/theme'

type ThemeContextValue = {
  pref: ThemePref
  choose: (pref: ThemePref) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<ThemePref>(() => readThemePref())

  useEffect(() => {
    applyTheme(pref)
    if (pref !== 'browser') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('browser')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [pref])

  const value = useMemo(
    () => ({
      pref,
      choose(next: ThemePref) {
        persistThemePref(next)
        setPref(next)
      },
    }),
    [pref],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function ThemePicker() {
  const theme = useContext(ThemeContext)
  if (!theme) return null

  return (
    <p className="footer-theme" role="group" aria-label="Appearance">
      <span className="footer-theme-label">Appearance</span>
      {(
        [
          ['browser', 'Browser'],
          ['light', 'Light'],
          ['dark', 'Dark'],
        ] as const
      ).map(([value, label], index) => (
        <span key={value}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {theme.pref === value ? (
            <span className="theme-opt is-current" aria-current="true">
              {label}
            </span>
          ) : (
            <button type="button" className="theme-opt" onClick={() => theme.choose(value)}>
              {label}
            </button>
          )}
        </span>
      ))}
    </p>
  )
}
