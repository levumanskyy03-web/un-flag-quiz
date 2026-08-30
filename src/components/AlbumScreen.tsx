import { useState } from 'react'
import { COUNTRIES } from '../data/countries'
import { findCountry } from '../data/extras'
import { STRINGS } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import {
  STAMP_MAX,
  STAMP_TOTAL,
  hasStamp,
  stampCopies,
  stampCopyCount,
  stampCountryCount,
  type StampAlbum,
} from '../lib/stamps'
import type { QuizSettings } from './HomeScreen'
import { AppChrome } from './AppChrome'
import { Flag } from './Flag'
import { FitText } from './FitText'
import { HubNav, type HubTab } from './HubNav'
import { PassportModal } from './PassportModal'
import { WorldsBack } from './WorldsBack'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'

interface AlbumScreenProps {
  settings: QuizSettings
  stamps: StampAlbum
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onClearBests?: () => void
}

export function AlbumScreen({
  settings,
  stamps,
  history,
  bests,
  levelClears,
  xp = 0,
  xpReady = false,
  onChange,
  onHub,
  onWorlds,
  onClearBests,
}: AlbumScreenProps) {
  const t = STRINGS[settings.lang]
  const [openIso, setOpenIso] = useState<string | null>(null)
  const openCountry = openIso ? findCountry(openIso) : undefined
  const copies = stampCopyCount(stamps)
  const countries = stampCountryCount(stamps)

  return (
    <div className="screen album-screen">
      <header className="home-header">
        <AppChrome
          settings={settings}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onChange={onChange}
          onClearBests={onClearBests}
        />
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.album}</h1>
        <p className="learn-copy">{t.albumCount(copies, countries, STAMP_TOTAL)}</p>
        <p className="setting-hint">{t.albumHint}</p>
      </header>

      <HubNav lang={settings.lang} active="album" onSelect={onHub} />

      {copies === 0 ? <p className="setting-hint">{t.albumEmpty}</p> : null}

      <section className="stamp-grid">
        {COUNTRIES.map((country) => {
          const owned = hasStamp(stamps, country.iso)
          const count = stampCopies(stamps, country.iso)
          const name = countryName(country, settings.lang)
          return (
            <button
              key={country.iso}
              type="button"
              className={`stamp-card${owned ? '' : ' is-locked'}${count >= STAMP_MAX ? ' is-max' : ''}`}
              disabled={!owned}
              onClick={() => {
                if (owned) setOpenIso(country.iso)
              }}
            >
              <span className="stamp-frame">
                <Flag iso={country.iso} name={name} size="card" />
              </span>
              {owned ? (
                <span className="stamp-pips" aria-hidden="true">
                  {Array.from({ length: STAMP_MAX }, (_, index) => (
                    <span key={index} className={`stamp-pip${index < count ? ' is-on' : ''}`} />
                  ))}
                </span>
              ) : null}
              <p className="stamp-name">
                <FitText>{owned ? name : '—'}</FitText>
              </p>
            </button>
          )
        })}
      </section>

      {openCountry ? (
        <PassportModal
          key={openCountry.iso}
          country={openCountry}
          lang={settings.lang}
          onClose={() => setOpenIso(null)}
          onOpenCountry={setOpenIso}
        />
      ) : null}
    </div>
  )
}
