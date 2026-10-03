'use client'

import { useEffect, useMemo, useState } from 'react'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  clearMineLeg,
  loadMine,
  loadMineCleared,
  mineCatalog,
  minePhase,
  mineReady,
  mineRoute,
  mineThemeCount,
  saveMine,
  saveMineCleared,
} from '../lib/mine'
import { QUIZ_WORLDS, worldOfMode, type QuizMode, type QuizWorld } from '../lib/quiz'
import { FitText } from './FitText'
import { WorldsBack } from './WorldsBack'

interface MineScreenProps {
  lang: Lang
  onWorlds: () => void
  onPlay: (mode: QuizMode) => void
}

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  if (world === 'physics') return t.physics
  return t.food
}

export function MineScreen({ lang, onWorlds, onPlay }: MineScreenProps) {
  const t = STRINGS[lang]
  const catalog = useMemo(() => mineCatalog(), [])
  const [modes, setModes] = useState<QuizMode[]>([])
  const [cleared, setCleared] = useState(0)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const stored = loadMine()
    setModes(stored)
    setCleared(loadMineCleared(mineRoute(stored)))
    setReady(true)
  }, [])

  function toggle(mode: QuizMode) {
    setModes((prev) => {
      const next = prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode]
      saveMine(next)
      const route = mineRoute(next)
      setCleared(loadMineCleared(route))
      clearMineLeg()
      return next
    })
  }

  const route = mineRoute(modes)
  const open = mineReady(modes)
  const done = open && cleared >= route.length
  const themes = mineThemeCount(modes)
  const needle = query.trim().toLocaleLowerCase(lang)
  const groups = QUIZ_WORLDS.map((world) => {
    const items = catalog.filter((row) => {
      if (row.world !== world) return false
      if (!needle) return true
      const label = `${worldTitle(world, t)} ${modeLabel(row.mode, lang)}`.toLocaleLowerCase(lang)
      return label.includes(needle)
    })
    return { world, items }
  }).filter((group) => group.items.length > 0)

  return (
    <div className="screen mine-screen">
      <header className="home-header">
        <WorldsBack lang={lang} onClick={onWorlds} />
        <h1>{t.mine}</h1>
      </header>
      <p className="mine-hint">{t.mineHint}</p>
      {!ready ? null : editing ? (
        <>
          <p className="mine-need">{t.mineNeed(modes.length, themes)}</p>
          <input
            className="mine-search"
            type="search"
            value={query}
            placeholder={t.mineSearch}
            aria-label={t.mineSearch}
            onChange={(event) => setQuery(event.target.value)}
          />
          {groups.length === 0 ? <p className="mine-empty">{t.mineNone}</p> : null}
          {groups.map((group) => (
            <section key={group.world} className="mine-group">
              <h2>{worldTitle(group.world, t)}</h2>
              <div className="choice-grid is-modes">
                {group.items.map((row) => {
                  const on = modes.includes(row.mode)
                  return (
                    <button
                      key={row.mode}
                      type="button"
                      className={`choice${on ? ' is-active' : ''}`}
                      aria-pressed={on}
                      onClick={() => toggle(row.mode)}
                    >
                      <FitText minPx={9}>{modeLabel(row.mode, lang)}</FitText>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
          <button type="button" className="btn-primary" onClick={() => setEditing(false)}>
            {t.mineDone}
          </button>
        </>
      ) : (
        <>
          {!open ? <p className="mine-need">{modes.length === 0 ? t.mineEmpty : t.mineNeed(modes.length, themes)}</p> : null}
          {open ? (
            <section className="mine-board" aria-label={t.mineRoute}>
              <div className="mine-board-head">
                <h2>{t.mineRoute}</h2>
                <p>{done ? t.mineCleared : t.mineStation(cleared + 1, route.length)}</p>
              </div>
              <div
                className="mine-meter"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={route.length}
                aria-valuenow={cleared}
                aria-label={t.mineRoute}
              >
                <span style={{ width: `${route.length === 0 ? 0 : (cleared / route.length) * 100}%` }} />
              </div>
              <ol className="mine-route">
                {route.map((mode, index) => {
                  const world = worldOfMode(mode)
                  const state = index < cleared ? 'done' : index === cleared && !done ? 'now' : 'wait'
                  return (
                    <li key={mode} className={`mine-stop is-${state} is-${world}`}>
                      <span className="mine-spine" aria-hidden="true">
                        <span className="mine-dot" />
                      </span>
                      <article className="mine-ticket">
                        <p className="mine-kicker">
                          {t.mineStation(index + 1, route.length)}
                          <span>{worldTitle(world, t)}</span>
                        </p>
                        <h3>{modeLabel(mode, lang)}</h3>
                        {state === 'now' ? <p className="mine-phase">{t.minePhase(minePhase(index, route.length))}</p> : null}
                        {state === 'now' ? (
                          <button type="button" className="btn-primary" onClick={() => onPlay(mode)}>
                            {cleared === 0 ? t.mineStart : t.mineOnward}
                          </button>
                        ) : null}
                      </article>
                    </li>
                  )
                })}
              </ol>
              {done ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    saveMineCleared(route, 0)
                    clearMineLeg()
                    setCleared(0)
                  }}
                >
                  {t.mineReplayRoute}
                </button>
              ) : null}
            </section>
          ) : null}
          <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>
            {t.minePick}
          </button>
        </>
      )}
    </div>
  )
}
