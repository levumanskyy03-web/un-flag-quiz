import type { ReactNode } from 'react'

import { WorldsBackLink } from './WorldsBack'

interface LegalShellProps {
  title?: string
  children: ReactNode
}

export function LegalShell({ title, children }: LegalShellProps) {
  return (
    <div className="app legal-app">
      <nav className="legal-nav">
        <WorldsBackLink />
        <a href="/countries">Страны</a>
        <a href="/today">Страна дня</a>
      </nav>
      <article className="legal-article">
        {title ? <h1>{title}</h1> : null}
        {children}
      </article>
      <footer className="legal-footer">
        <nav className="legal-links">
          <a href="/about">О проекте</a>
          <a href="/privacy">Политика</a>
          <a href="/contacts">Контакты</a>
        </nav>
      </footer>
    </div>
  )
}
