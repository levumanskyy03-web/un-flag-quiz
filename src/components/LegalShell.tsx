import type { ReactNode } from 'react'

interface LegalShellProps {
  title: string
  children: ReactNode
}

export function LegalShell({ title, children }: LegalShellProps) {
  return (
    <div className="app legal-app">
      <nav className="legal-nav">
        <a href="/">Паспорт страны</a>
        <a href="/about">О проекте</a>
        <a href="/privacy">Политика</a>
        <a href="/contacts">Контакты</a>
      </nav>
      <article className="legal-article">
        <h1>{title}</h1>
        {children}
      </article>
    </div>
  )
}
