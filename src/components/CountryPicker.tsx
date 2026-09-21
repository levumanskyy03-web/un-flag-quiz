'use client'

import { useEffect, useMemo, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = countryByIso(value)
  const selectedName = selected ? countryName(selected, lang) : null
  const list = useMemo(() => {
    const ordered = sortCountriesByName(COUNTRIES, lang)
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) return ordered
    return ordered.filter((country) => countryName(country, lang).toLocaleLowerCase().includes(needle))
  }, [lang, query])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      closePicker()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  function closePicker() {
    setOpen(false)
    setQuery('')
  }

  function pick(iso: string) {
    onChange(iso)
    window.setTimeout(closePicker, 0)
  }

  return (
    <div className="country-picker">
      <span className="country-picker-label">{t.accountCountry}</span>
      <button
        type="button"
        className={`country-picker-open${selected ? '' : ' is-empty'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {selected && selectedName ? (
          <>
            <Flag iso={selected.iso} name={selectedName} size="icon" />
            <span>{selectedName}</span>
          </>
        ) : (
          <span>{t.countrySearch}</span>
        )}
      </button>
      {open ? (
        <div
          className="passport-overlay country-picker-overlay"
          onClick={(event) => {
            event.stopPropagation()
            closePicker()
          }}
          role="presentation"
        >
          <div
            className="passport-sheet account-sheet country-picker-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t.accountCountry}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="account-sheet-head">
              <h2>{t.accountCountry}</h2>
              <button type="button" className="btn-ghost" onClick={closePicker}>
                {t.close}
              </button>
            </header>
            <input
              type="search"
              className="country-picker-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.countrySearch}
              autoComplete="off"
              autoFocus
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
                    onClick={(event) => {
                      event.stopPropagation()
                      pick(country.iso)
                    }}
                  >
                    <Flag iso={country.iso} name={name} size="icon" />
                    <span>{name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
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
