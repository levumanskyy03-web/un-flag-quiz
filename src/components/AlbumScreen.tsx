import { useState } from 'react'
import { COUNTRIES } from '../data/countries'
import { STRINGS } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { STAMP_TOTAL, hasStamp } from '../lib/stamps'
import type { QuizSettings } from './HomeScreen'
import { AppChrome } from './AppChrome'
import { Flag } from './Flag'
import { HubNav, type HubTab } from './HubNav'
import { PassportModal } from './PassportModal'
import { WorldsBack } from './WorldsBack'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'

interface AlbumScreenProps {
  settings: QuizSettings
  stamps: string[]
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  xp?: number
  xpReady?: boolean
  onChange: (settings: QuizSettings) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
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
}: AlbumScreenProps) {
  const t = STRINGS[settings.lang]
  const [openIso, setOpenIso] = useState<string | null>(null)
  const openCountry = COUNTRIES.find((country) => country.iso === openIso)

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
        />
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.album}</h1>
        <p className="learn-copy">{t.albumCount(stamps.length, STAMP_TOTAL)}</p>
      </header>

      <HubNav lang={settings.lang} active="album" onSelect={onHub} />

      {stamps.length === 0 ? <p className="setting-hint">{t.albumEmpty}</p> : null}

      <section className="stamp-grid">
        {COUNTRIES.map((country) => {
          const owned = hasStamp(stamps, country.iso)
          const name = countryName(country, settings.lang)
          return (
            <button
              key={country.iso}
              type="button"
              className={`stamp-card${owned ? '' : ' is-locked'}`}
              disabled={!owned}
              onClick={() => {
                if (owned) setOpenIso(country.iso)
              }}
            >
              <span className="stamp-frame">
                <Flag iso={country.iso} name={name} size="card" />
              </span>
              <p className="stamp-name">{owned ? name : '—'}</p>
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
