'use client'

import { useEffect, useMemo, useState } from 'react'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { etestIndexForNumber, etestStationTotal, etestStations, loadEtestCleared } from '../lib/etest'
import { WorldsBack } from './WorldsBack'

interface EtestScreenProps {
  lang: Lang
  onWorlds: () => void
  onStart: (index: number) => void
}

export function EtestScreen({ lang, onWorlds, onStart }: EtestScreenProps) {
  const t = STRINGS[lang]
  const stations = useMemo(() => etestStations(), [])
  const route = useMemo(() => stations.map((station) => station.mode), [stations])
  const total = etestStationTotal(stations)
  const [cleared, setCleared] = useState(0)
  const [numberText, setNumberText] = useState('1')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const next = loadEtestCleared(route)
    setCleared(next)
    const station = stations[next] ?? stations[0]
    setNumberText(String(station?.n ?? 1))
    setReady(true)
  }, [route, stations])

  function chosenIndex() {
    const parsed = Number(numberText)
    if (!Number.isFinite(parsed)) return 0
    return etestIndexForNumber(parsed, stations)
  }

  const index = chosenIndex()
  const station = stations[index]
  const mode = station?.mode
  const finished = cleared >= route.length
  const resumeHere = index === cleared && cleared > 0 && !finished

  return (
    <div className="screen mine-screen">
      <header className="home-header">
        <WorldsBack lang={lang} onClick={onWorlds} />
        <h1>{t.etest}</h1>
      </header>
      <p className="mine-hint">{t.etestHint}</p>
      {!ready || !mode ? null : (
        <section className="mine-board" aria-label={t.etest}>
          <div className="mine-board-head">
            <h2>{modeLabel(mode, lang)}</h2>
            <p>{t.etestStation(station?.n ?? 1, total)}</p>
          </div>
          <div
            className="mine-meter"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={route.length}
            aria-valuenow={cleared}
            aria-label={t.etest}
          >
            <span style={{ width: `${route.length === 0 ? 0 : (cleared / route.length) * 100}%` }} />
          </div>
          {cleared >= route.length ? <p className="mine-hint">{t.etestCleared}</p> : null}
          <label className="etest-number">
            <span>{t.etestNumber}</span>
            <input
              type="number"
              min={1}
              max={total}
              inputMode="numeric"
              value={numberText}
              aria-label={t.etestNumber}
              onChange={(event) => setNumberText(event.target.value)}
              onBlur={() => setNumberText(String(stations[chosenIndex()]?.n ?? 1))}
            />
          </label>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const start = chosenIndex()
              setCleared(start)
              setNumberText(String(stations[start]?.n ?? 1))
              onStart(start)
            }}
          >
            {resumeHere ? t.etestOnward : finished && index === 0 ? t.etestReplay : t.etestStart}
          </button>
        </section>
      )}
    </div>
  )
}
