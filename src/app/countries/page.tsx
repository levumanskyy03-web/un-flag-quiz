import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'
import { Flag } from '../../components/Flag'
import { STRINGS, regionLabel } from '../../i18n/strings'
import { catalogByRegion, countryPath } from '../../lib/countryCatalog'
import { COUNTRIES } from '../../data/countries'

export const metadata: Metadata = {
  title: 'Страны — Паспорт страны',
  description: 'Паспорта всех 193 государств ООН: флаг, столица, валюта, факт.',
}

export default function CountriesPage() {
  const groups = catalogByRegion()

  return (
    <LegalShell title="Страны ООН">
      <p>
        {COUNTRIES.length} государства. Откройте паспорт — столица, валюта, соседи и факт. Потом можно сразу
        играть в викторину.
      </p>
      <p>
        Сегодняшняя страна: <a href="/today">страна дня</a>.
      </p>
      {groups.map(({ region, countries }) => (
        <section key={region} className="country-region">
          <h2>{regionLabel(region, 'ru')}</h2>
          <div className="country-index">
            {countries.map((country) => (
              <a key={country.iso} className="country-index-item" href={countryPath(country.iso)}>
                <Flag iso={country.iso} name={country.nameRu} size="thumb" />
                <span>{country.nameRu}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
      <p className="country-en" lang="en">
        {COUNTRIES.length} UN member states. {STRINGS.en.legalCountries}.
      </p>
    </LegalShell>
  )
}
