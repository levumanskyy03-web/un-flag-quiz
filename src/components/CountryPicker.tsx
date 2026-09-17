'use client'

import { useMemo, useState } from 'react'
import { COUNTRIES } from '../data/countries'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryByIso } from '../lib/countryCatalog'
import { countryName, sortCountriesByName } from '../lib/quiz'
import { Flag } from './Flag'

interface CountryPickerProps {
  lang: Lang
  value: string
  onChange: (iso: string) => void
}

export function CountryPicker({ lang, value, onChange }: CountryPickerProps) {
  const t = STRINGS[lang]
  const [query, setQuery] = useState('')
  const selected = countryByIso(value)
  const list = useMemo(() => {
    const ordered = sortCountriesByName(COUNTRIES, lang)
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) return ordered
    return ordered.filter((country) => countryName(country, lang).toLocaleLowerCase().includes(needle))
  }, [lang, query])

  return (
    <div className="country-picker">
      <span className="country-picker-label">{t.accountCountry}</span>
      {selected ? (
        <p className="country-picker-current">
          <Flag iso={selected.iso} name={countryName(selected, lang)} size="icon" />
          <span>{countryName(selected, lang)}</span>
        </p>
      ) : null}
      <input
        type="search"
        className="country-picker-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.countrySearch}
        autoComplete="off"
        aria-label={t.countrySearch}
      />
      <div className="country-picker-list" role="listbox" aria-label={t.accountCountry}>
        {list.map((country) => {
          const name = countryName(country, lang)
          const active = country.iso === value
          return (
            <button
              key={country.iso}
              type="button"
              role="option"
              aria-selected={active}
              className={`country-picker-item${active ? ' is-active' : ''}`}
              onClick={() => onChange(country.iso)}
            >
              <Flag iso={country.iso} name={name} size="icon" />
              <span>{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CountryMark({ iso, lang }: { iso?: string; lang: Lang }) {
  const country = iso ? countryByIso(iso) : undefined
  if (!country) return null
  const name = countryName(country, lang)
  return (
    <p className="account-country">
      <Flag iso={country.iso} name={name} size="icon" />
      <span>{name}</span>
    </p>
  )
}
