import { COUNTRIES, REGIONS, type Country, type Region } from '../data/countries'

export function countryByIso(iso: string): Country | undefined {
  const id = iso.trim().toLowerCase()
  return COUNTRIES.find((country) => country.iso === id)
}

export function countryPath(iso: string): string {
  return `/country/${iso.trim().toLowerCase()}`
}

export function countriesInRegion(region: Region): Country[] {
  return COUNTRIES.filter((country) => country.region === region).sort((a, b) =>
    a.nameRu.localeCompare(b.nameRu, 'ru'),
  )
}

export function catalogByRegion(): { region: Region; countries: Country[] }[] {
  return REGIONS.map((region) => ({ region, countries: countriesInRegion(region) }))
}

export function neighborCountries(iso: string, neighbors: string[]): Country[] {
  return neighbors
    .map((id) => countryByIso(id))
    .filter((country): country is Country => country !== undefined)
    .sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru'))
}

export function adjacentCountries(iso: string): { prev: Country; next: Country } | null {
  const ordered = REGIONS.flatMap((region) => countriesInRegion(region))
  const index = ordered.findIndex((country) => country.iso === iso)
  if (index < 0 || ordered.length < 2) return null
  return {
    prev: ordered[(index - 1 + ordered.length) % ordered.length],
    next: ordered[(index + 1) % ordered.length],
  }
}

export function countryOfTheDay(at = new Date()): Country {
  const utcDay = Math.floor(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) / 86_400_000)
  return COUNTRIES[Math.abs(utcDay) % COUNTRIES.length]
}

export function utcDayLabel(at = new Date()): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(at)
}
