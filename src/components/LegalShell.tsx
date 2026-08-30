import type { ReactNode } from 'react'

import { STRINGS } from '../i18n/strings'
import { WorldsBackLink } from './WorldsBack'

interface LegalShellProps {
  title?: string
  children: ReactNode
  catalogBack?: boolean
}

export function LegalShell({ title, children, catalogBack = false }: LegalShellProps) {
  const t = STRINGS.ru
  return (
    <div className="app legal-app">
      <nav className="legal-nav">
        <div className="legal-nav-back">
          <WorldsBackLink />
          {catalogBack ? (
            <a className="btn-ghost worlds-back" href="/countries">
              {t.back}
            </a>
          ) : null}
        </div>
        <div className="legal-nav-links">
          <a href="/countries">Страны</a>
          <a href="/languages">Языки</a>
          <a href="/today">Страна дня</a>
        </div>
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
