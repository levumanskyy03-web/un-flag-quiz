import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'
import { CountryPassportView } from '../../components/CountryPassportView'
import { countryOfTheDay, countryPath, utcDayLabel } from '../../lib/countryCatalog'

export const dynamic = 'force-dynamic'

export function generateMetadata(): Metadata {
  const country = countryOfTheDay()
  return {
    title: `Страна дня — ${country.nameRu} — Паспорт страны`,
    description: `Сегодня в паспорте: ${country.nameRu}. Флаг, столица, факт и ссылка на викторину.`,
  }
}

export default function TodayPage() {
  const country = countryOfTheDay()
  const day = utcDayLabel()

  return (
    <LegalShell catalogBack>
      <CountryPassportView country={country} kicker={`Страна дня · ${day}`} />
      <p>
        Завтра будет другая. Все паспорта — в <a href="/countries">каталоге стран</a>, эта страница:{' '}
        <a href={countryPath(country.iso)}>{country.nameRu}</a>.
      </p>
    </LegalShell>
  )
}
