import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'

export const metadata: Metadata = {
  title: 'Контакты — Паспорт страны',
  description: 'Связь с автором викторины Паспорт страны.',
}

export default function ContactsPage() {
  return (
    <LegalShell title="Контакты">
      <p>По вопросам сайта, ошибок и персональных данных:</p>
      <p>
        <a href="mailto:levumanskyy03@gmail.com">levumanskyy03@gmail.com</a>
      </p>
      <p>Автор: Лев Уманский.</p>
      <p lang="en">
        Contact: <a href="mailto:levumanskyy03@gmail.com">levumanskyy03@gmail.com</a>. Author: Lev Umansky.
      </p>
    </LegalShell>
  )
}
