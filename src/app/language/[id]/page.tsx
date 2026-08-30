import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalShell } from '../../../components/LegalShell'
import { LanguageRangeMap } from '../../../components/LanguageRangeMap'
import { Flag } from '../../../components/Flag'
import {
  countriesSpeaking,
  formatSpokenPct,
  languageById,
  languageName,
  languagesIndex,
  officialLanguageIds,
  spokenShare,
} from '../../../data/languages'
import { countryPath } from '../../../lib/countryCatalog'

export function generateStaticParams() {
  return languagesIndex().map((item) => ({ id: item.id }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const info = languageById(id)
  if (!info) return { title: 'Язык — Паспорт страны' }
  const name = languageName(id, 'ru')
  return {
    title: `${name} — Паспорт страны`,
    description: `Где говорят на языке «${name}»: карта ареала и страны, где доля говорящих не меньше 1 %.`,
  }
}

export default async function LanguagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const info = languageById(id)
  if (!info) notFound()
  const countries = countriesSpeaking(id)
  if (countries.length === 0) notFound()
  const name = languageName(id, 'ru')

  return (
    <LegalShell>
      <div className="language-page">
        <p className="country-kicker">
          <a href="/languages">Языки</a>
        </p>
        <h1 className="country-title">{name}</h1>
        <p className="country-title-en">{info.nameEn}</p>
        <LanguageRangeMap isos={countries.map((country) => country.iso)} label={`Ареал: ${name}`} />
        <section className="language-countries">
          <h2>Страны, где этим языком говорят не меньше 1 %</h2>
          <ul className="lang-card-list is-countries">
            {countries.map((country) => {
              const national = officialLanguageIds(country.iso).includes(id)
              const pct = spokenShare(country.iso, id)
              return (
                <li key={country.iso}>
                  <a className={`lang-card${national ? ' is-national' : ''}`} href={countryPath(country.iso)}>
                    <Flag iso={country.iso} name={country.nameRu} size="thumb" />
                    <span className="lang-card-name">{country.nameRu}</span>
                    <span className="lang-card-pct">{formatSpokenPct(pct, 'ru')}</span>
                    {national ? <span className="lang-card-mark">нац.</span> : null}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </LegalShell>
  )
}
