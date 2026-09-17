import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRIES } from '../../../data/countries'
import { getPassport, passportCapital, passportFact } from '../../../data/passports'
import { LegalShell } from '../../../components/LegalShell'
import { CountryPassportView } from '../../../components/CountryPassportView'
import { requestLang } from '../../../i18n/requestLang'
import { STRINGS } from '../../../i18n/strings'
import { countryByIso } from '../../../lib/countryCatalog'
import { publicMetadata } from '../../../lib/pageMeta'
import { countryName } from '../../../lib/quiz/core'

export function generateStaticParams() {
  return COUNTRIES.filter((country) => getPassport(country.iso)).map((country) => ({ iso: country.iso }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso: string }>
}): Promise<Metadata> {
  const lang = await requestLang()
  const { iso } = await params
  const country = countryByIso(iso)
  const t = STRINGS[lang]
  if (!country) {
    return publicMetadata(lang, { title: t.legalCountries, description: t.subtitle, path: '/countries' })
  }
  const passport = getPassport(country.iso)
  const name = countryName(country, lang)
  const description = passport
    ? `${name}: ${passportCapital(passport, lang, country.iso)}. ${passportFact(passport, lang, country.iso)}`
    : name
  return publicMetadata(lang, {
    title: name,
    description,
    path: `/country/${country.iso}`,
  })
}

export default async function CountryPage({ params }: { params: Promise<{ iso: string }> }) {
  const { iso } = await params
  const country = countryByIso(iso)
  if (!country || !getPassport(country.iso)) notFound()

  return (
    <LegalShell catalogBack>
      <CountryPassportView country={country} />
    </LegalShell>
  )
}
