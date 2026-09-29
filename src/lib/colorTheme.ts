export const COLOR_THEME_KEY = 'un-flag-quiz-theme'
export const COLOR_THEME_EVENT = 'un-flag-quiz-theme'

export type ColorTheme = 'dark' | 'light'

export function readColorTheme(): ColorTheme {
  if (typeof window === 'undefined') return 'dark'
  try {
    return window.localStorage.getItem(COLOR_THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyColorTheme(theme: ColorTheme) {
  document.documentElement.dataset.theme = theme
}

export function setColorTheme(theme: ColorTheme) {
  try {
    window.localStorage.setItem(COLOR_THEME_KEY, theme)
  } catch {
    /* private mode */
  }
  applyColorTheme(theme)
  window.dispatchEvent(new Event(COLOR_THEME_EVENT))
}

export function subscribeColorTheme(onChange: () => void) {
  window.addEventListener(COLOR_THEME_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(COLOR_THEME_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
