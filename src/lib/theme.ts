export type ThemePref = 'browser' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'whythisrole-theme'

export function readThemePref(): ThemePref {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'browser') return value
  } catch {
    /* private mode */
  }
  return 'browser'
}

export function resolvedTheme(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(pref: ThemePref) {
  const resolved = resolvedTheme(pref)
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

export function persistThemePref(pref: ThemePref) {
  try {
    if (pref === 'browser') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, pref)
  } catch {
    /* private mode */
  }
  applyTheme(pref)
}
