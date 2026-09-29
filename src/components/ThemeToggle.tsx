'use client'

import { useSyncExternalStore } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { readColorTheme, setColorTheme, subscribeColorTheme, type ColorTheme } from '../lib/colorTheme'

interface ThemeToggleProps {
  lang: Lang
  variant?: 'icon' | 'choices'
}

function themeSnapshot(): ColorTheme {
  return readColorTheme()
}

function themeServerSnapshot(): ColorTheme {
  return 'dark'
}

export function ThemeToggle({ lang, variant = 'icon' }: ThemeToggleProps) {
  const t = STRINGS[lang]
  const theme = useSyncExternalStore(subscribeColorTheme, themeSnapshot, themeServerSnapshot)

  if (variant === 'choices') {
    return (
      <div className="choice-grid" role="group" aria-label={t.colorTheme}>
        <button
          type="button"
          className={`choice ${theme === 'dark' ? 'is-active' : ''}`}
          aria-pressed={theme === 'dark'}
          onClick={() => setColorTheme('dark')}
        >
          {t.colorThemeDark}
        </button>
        <button
          type="button"
          className={`choice ${theme === 'light' ? 'is-active' : ''}`}
          aria-pressed={theme === 'light'}
          onClick={() => setColorTheme('light')}
        >
          {t.colorThemeLight}
        </button>
      </div>
    )
  }

  const label = `${t.colorTheme}: ${theme === 'light' ? t.colorThemeLight : t.colorThemeDark}`
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      aria-pressed={theme === 'light'}
      onClick={() => setColorTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 1.8v1.7M9 14.5v1.7M1.8 9h1.7M14.5 9h1.7M3.7 3.7l1.2 1.2M13.1 13.1l1.2 1.2M14.3 3.7l-1.2 1.2M4.9 13.1l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M14.2 11.4A6.2 6.2 0 0 1 6.6 3.8 6.2 6.2 0 1 0 14.2 11.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
