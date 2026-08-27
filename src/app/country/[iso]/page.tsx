import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRIES } from '../../../data/countries'
import { getPassport } from '../../../data/passports'
import { LegalShell } from '../../../components/LegalShell'
import { CountryPassportView } from '../../../components/CountryPassportView'
import { countryByIso } from '../../../lib/countryCatalog'

export function generateStaticParams() {
  return COUNTRIES.filter((country) => getPassport(country.iso)).map((country) => ({ iso: country.iso }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso: string }>
}): Promise<Metadata> {
  const { iso } = await params
  const country = countryByIso(iso)
  if (!country) return { title: 'Страна — Паспорт страны' }
  const passport = getPassport(country.iso)
  return {
    title: `${country.nameRu} — Паспорт страны`,
    description: passport
      ? `${country.nameRu}: столица ${passport.capitalRu}, ${passport.factRu}`
      : `Паспорт ${country.nameRu}.`,
  }
}

export default async function CountryPage({ params }: { params: Promise<{ iso: string }> }) {
  const { iso } = await params
  const country = countryByIso(iso)
  if (!country || !getPassport(country.iso)) notFound()

  return (
    <LegalShell>
      <CountryPassportView country={country} />
    </LegalShell>
  )
}
