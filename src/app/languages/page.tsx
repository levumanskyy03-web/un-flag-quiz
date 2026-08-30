import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'
import { languageName, languagePath, languagesIndex } from '../../data/languages'

export const metadata: Metadata = {
  title: 'Языки — Паспорт страны',
  description: 'Языки государств ООН: ареал говорящих и страны, где доля не меньше 1 % населения.',
}

export default function LanguagesPage() {
  const items = languagesIndex()

  return (
    <LegalShell title="Языки">
      <p>
        Карточка языка — карта ареала и список стран, где этим языком говорит не меньше 1 % населения. В паспорте
        страны национальные языки отдельно, а по звезде — на каких языках там говорят.
      </p>
      <ul className="lang-index">
        {items.map((item) => (
          <li key={item.id}>
            <a href={languagePath(item.id)}>
              <span>{languageName(item.id, 'ru')}</span>
              <span className="lang-index-count">{item.countries.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </LegalShell>
  )
}
