'use client'

import './empireTown.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  EMPIRE_RESOURCE_BY_WORLD,
  EMPIRE_RESOURCES,
  EMPIRE_WORLD_BY_RESOURCE,
  empireEraRow,
  isEmpireWorldBuilding,
  EMPIRE_PERKS,
  EMPIRE_XP_BOOST_COINS,
  EMPIRE_XP_BOOST_COINS_MS,
  EMPIRE_XP_BOOST_GEMS,
  EMPIRE_XP_BOOST_GEMS_MS,
  type EmpireBuilding,
  type EmpireResource,
} from '../data/empire'
import { CARD_FRAME_IDS, FRAME_MIN_ERA, SHARE_THEME_IDS, SHOP_FRAME_IDS, SHOP_SHARE_IDS, type CardFrameId, type ShareThemeId } from '../data/cosmetics'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  activeBuilds,
  albumMult,
  buildSlots,
  buildingLevel,
  buildingMax,
  hasLegacy,
  legacyOverview,
  pantheonResPerHour,
  canAfford,
  cosmeticOwned,
  cosmeticPrice,
  coinsPerHourOf,
  eraCheck,
  housingCap,
  resPerHour,
  sellRate,
  skipBuildCost,
  specialistsTotal,
  storageCap,
  upgradeCost,
  type EmpireState,
} from '../lib/empire/rules'
import {
  LEGACY_ENV,
  empireAdvanceEra,
  empireBuild,
  empireClaimLegacy,
  empireSetTitle,
  empireBuyCosmetic,
  empireBuyPerk,
  empireBuyXpBoost,
  empireEquip,
  empireRename,
  empireSkipBuild,
  empireSyncAlbum,
  empireSell,
  startEmpireLoop,
  stopEmpireLoop,
  useEmpire,
  useEmpireSync,
} from '../lib/empireStore'
import { type QuizWorld } from '../lib/quiz'
import { LEGACY_MISSIONS, type LegacyReward, type LegacyTitleId } from '../data/empireLegacy'
import { Flag } from './Flag'
import { GeoIcon } from './GeoIcon'

export function worldTitle(world: QuizWorld, lang: Lang) {
  const t = STRINGS[lang]
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  return t.food
}

const WORLD_ICON = {
  geo: 'globe',
  leaders: 'laurel',
  football: 'ball',
  olympics: 'torch',
  biology: 'leaf',
  math: 'sigma',
  astronomy: 'orbit',
  cs: 'code',
  food: 'bowl',
} as const

const COMMON_ICON = {
  hall: 'hq',
  housing: 'pin',
  storage: 'deck',
  treasury: 'stamp',
  library: 'notes',
  pantheon: 'laurel',
} as const

type T = (typeof STRINGS)[Lang]

export function eraTitle(era: number, t: T) {
  const key = empireEraRow(era).key
  if (key === 'settlement') return t.empireEra_settlement
  if (key === 'antiquity') return t.empireEra_antiquity
  if (key === 'medieval') return t.empireEra_medieval
  if (key === 'earlyModern') return t.empireEra_earlyModern
  if (key === 'industrial') return t.empireEra_industrial
  if (key === 'electric') return t.empireEra_electric
  if (key === 'digital') return t.empireEra_digital
  return t.empireEra_space
}

export function resourceTitle(key: EmpireResource, t: T) {
  if (key === 'maps') return t.empireRes_maps
  if (key === 'seals') return t.empireRes_seals
  if (key === 'tickets') return t.empireRes_tickets
  if (key === 'medals') return t.empireRes_medals
  if (key === 'seeds') return t.empireRes_seeds
  if (key === 'blueprints') return t.empireRes_blueprints
  if (key === 'stardust') return t.empireRes_stardust
  if (key === 'chips') return t.empireRes_chips
  return t.empireRes_spices
}

export function buildingTitle(building: EmpireBuilding, lang: Lang) {
  const t = STRINGS[lang]
  if (isEmpireWorldBuilding(building)) return worldTitle(building, lang)
  if (building === 'hall') return t.empireBuilding_hall
  if (building === 'housing') return t.empireBuilding_housing
  if (building === 'storage') return t.empireBuilding_storage
  if (building === 'treasury') return t.empireBuilding_treasury
  if (building === 'library') return t.empireBuilding_library
  if (building === 'pantheon') return t.empireBuilding_pantheon
  return building
}

export function titleName(title: LegacyTitleId, lang: Lang) {
  return STRINGS[lang][`empireTitle_${title}`]
}

function buildingDesc(building: EmpireBuilding, lang: Lang) {
  const t = STRINGS[lang]
  if (isEmpireWorldBuilding(building)) return t.empireWorldBuildingHint(worldTitle(building, lang))
  if (building === 'hall') return t.empireBuildingDesc_hall
  if (building === 'housing') return t.empireBuildingDesc_housing
  if (building === 'storage') return t.empireBuildingDesc_storage
  if (building === 'treasury') return t.empireBuildingDesc_treasury
  if (building === 'library') return t.empireBuildingDesc_library
  if (building === 'pantheon') return t.empireLegacyUnlock_pantheon
  return ''
}

function fmt(n: number, lang: Lang) {
  return Math.floor(n).toLocaleString(lang)
}

function fmtRate(n: number, lang: Lang) {
  return n >= 100 ? Math.round(n).toLocaleString(lang) : n.toFixed(1)
}

function remaining(until: number, now: number) {
  const s = Math.max(0, Math.ceil((until - now) / 1000))
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

/** Ступень внешнего вида здания (docs §12): уровни 1–9 / 10–24 / 25+. */
function towerTier(level: number) {
  return level >= 25 ? 3 : level >= 10 ? 2 : 1
}

function CostLine({ building, state, lang }: { building: EmpireBuilding; state: EmpireState; lang: Lang }) {
  const t = STRINGS[lang]
  const cost = upgradeCost(state, building)
  return (
    <span className="empire-cost">
      <span className={state.coins < cost.coins ? 'is-short' : ''}>
        {fmt(cost.coins, lang)} {t.empireCoins.toLowerCase()}
      </span>
      {(Object.entries(cost.res) as [EmpireResource, number][]).map(([key, need]) => (
        <span key={key} className={(state.res[key] ?? 0) < need ? 'is-short' : ''}>
          {fmt(need, lang)} {resourceTitle(key, t).toLowerCase()}
        </span>
      ))}
    </span>
  )
}

function BuildingCard({ building, state, lang, now }: { building: EmpireBuilding; state: EmpireState; lang: Lang; now: number }) {
  const t = STRINGS[lang]
  const row = state.buildings[building] ?? { level: 0, buildUntil: null }
  const level = row.level
  const max = buildingMax(state, building)
  const maxed = level >= max
  const cost = upgradeCost(state, building)
  const affordable = canAfford(state, cost)
  const busy = row.buildUntil !== null
  const slotsFull = activeBuilds(state, now).length >= buildSlots(state, now)
  const world = isEmpireWorldBuilding(building) ? building : null
  const [error, setError] = useState<string | null>(null)

  function onBuild() {
    const result = empireBuild(building)
    if (result.ok) {
      setError(null)
      return
    }
    setError(result.reason === 'max' ? t.empireMaxLevel : result.reason === 'busy' ? t.empireBusy : t.empireNoFunds)
  }

  return (
    <article className={`empire-card${world ? ` is-${world}` : ` is-${building}`}`}>
      <header>
        <GeoIcon name={world ? WORLD_ICON[world] : COMMON_ICON[building as keyof typeof COMMON_ICON]} size={20} />
        <div>
          <h3>{buildingTitle(building, lang)}</h3>
          <small>{t.empireLevel(level)} / {max}</small>
        </div>
      </header>
      <p>{buildingDesc(building, lang)}</p>
      {world ? (
        <dl className="empire-card-stats">
          <div>
            <dt>{resourceTitle(EMPIRE_RESOURCE_BY_WORLD[world], t)}</dt>
            <dd>{t.empirePerHour(fmtRate(resPerHour(state, world), lang))}</dd>
          </div>
          <div>
            <dt>{t.empireCoins}</dt>
            <dd>{t.empirePerHour(fmtRate(coinsPerHourOf(state, world), lang))}</dd>
          </div>
          <div>
            <dt>{t.empireSpecialists}</dt>
            <dd>
              {state.specialists[world]}
              {state.pendingSpecialists[world] > 0 ? <small> · {t.empirePending(state.pendingSpecialists[world])}</small> : null}
            </dd>
          </div>
        </dl>
      ) : null}
      {building === 'pantheon' && level > 0 ? (
        <dl className="empire-card-stats">
          <div>
            <dt>{t.empireRes_maps} … {t.empireRes_spices}</dt>
            <dd>{t.empirePerHour(fmtRate(pantheonResPerHour(state), lang))}</dd>
          </div>
        </dl>
      ) : null}
      {world && albumMult(state, world) > 1 ? (
        <p className="empire-card-album">{t.empireAlbumBonus(((albumMult(state, world) - 1) * 100).toFixed(1))}</p>
      ) : null}
      {busy ? (
        <div className="empire-card-busy">
          <p>
            {t.empireBuilding} {remaining(row.buildUntil ?? now, now)}
          </p>
          <button
            type="button"
            className="btn-secondary"
            disabled={state.gems < skipBuildCost(state, building, now)}
            onClick={() => empireSkipBuild(building)}
          >
            {t.empireSkipBuild(skipBuildCost(state, building, now))}
          </button>
        </div>
      ) : maxed ? (
        <p className="empire-card-max">{t.empireMaxLevel}</p>
      ) : (
        <div className="empire-card-buy">
          <CostLine building={building} state={state} lang={lang} />
          <button type="button" className="btn-primary" disabled={!affordable || slotsFull} onClick={onBuild}>
            {level === 0 ? t.empireBuild : t.empireUpgrade}
          </button>
        </div>
      )}
      {error ? <p className="empire-card-error">{error}</p> : null}
    </article>
  )
}

const MAP_W = 1560
const MAP_H = 1180
const TOWN_ZOOM = 0.55
const WALK_SPEED = 250
const PLAYER_R = 14
const BLOCK_R = 48
const INTERACT_R = 112

type TownSpot = {
  key: string
  kind: 'build' | 'legacy' | 'board'
  building?: EmpireBuilding
  x: number
  y: number
}

const TOWN_LAYOUT: readonly TownSpot[] = [
  { key: 'board', kind: 'board', x: 280, y: 250 },
  { key: 'hall', kind: 'build', building: 'hall', x: 540, y: 250 },
  { key: 'housing', kind: 'build', building: 'housing', x: 800, y: 250 },
  { key: 'storage', kind: 'build', building: 'storage', x: 1060, y: 250 },
  { key: 'library', kind: 'build', building: 'library', x: 1320, y: 250 },
  { key: 'geo', kind: 'build', building: 'geo', x: 280, y: 530 },
  { key: 'leaders', kind: 'build', building: 'leaders', x: 540, y: 530 },
  { key: 'football', kind: 'build', building: 'football', x: 800, y: 530 },
  { key: 'olympics', kind: 'build', building: 'olympics', x: 1060, y: 530 },
  { key: 'biology', kind: 'build', building: 'biology', x: 1320, y: 530 },
  { key: 'math', kind: 'build', building: 'math', x: 280, y: 810 },
  { key: 'astronomy', kind: 'build', building: 'astronomy', x: 540, y: 810 },
  { key: 'cs', kind: 'build', building: 'cs', x: 800, y: 810 },
  { key: 'food', kind: 'build', building: 'food', x: 1060, y: 810 },
  { key: 'treasury', kind: 'build', building: 'treasury', x: 1320, y: 810 },
  { key: 'legacy', kind: 'legacy', x: 540, y: 1040 },
  { key: 'pantheon', kind: 'build', building: 'pantheon', x: 800, y: 1040 },
]

type WalkKey = 'left' | 'right' | 'up' | 'down'

function walkKey(e: KeyboardEvent): WalkKey | null {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') return 'left'
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') return 'right'
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') return 'up'
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') return 'down'
  return null
}

function hitsPlot(x: number, y: number, spots: readonly TownSpot[]) {
  if (x < 20 || y < 20 || x > MAP_W - 20 || y > MAP_H - 20) return true
  const min = PLAYER_R + BLOCK_R
  for (const spot of spots) {
    const dx = x - spot.x
    const dy = y - spot.y
    if (dx * dx + dy * dy < min * min) return true
  }
  return false
}

function approachPoint(x: number, y: number, spots: readonly TownSpot[]) {
  let px = Math.min(MAP_W - 24, Math.max(24, x))
  let py = Math.min(MAP_H - 24, Math.max(24, y))
  const min = PLAYER_R + BLOCK_R + 4
  for (const spot of spots) {
    const dx = px - spot.x
    const dy = py - spot.y
    const dist = Math.hypot(dx, dy)
    if (dist < min) {
      if (dist < 0.01) {
        px = spot.x + min
        continue
      }
      px = spot.x + (dx / dist) * min
      py = spot.y + (dy / dist) * min
    }
  }
  return { x: px, y: py }
}

function spotLabel(spot: TownSpot, lang: Lang) {
  const t = STRINGS[lang]
  if (spot.kind === 'board') return t.empireBoard
  if (spot.kind === 'legacy') return t.empireLegacy
  return buildingTitle(spot.building!, lang)
}

function TownPlot({ spot, state, lang, near }: { spot: TownSpot; state: EmpireState; lang: Lang; near: boolean }) {
  const building = spot.building
  const level = building ? buildingLevel(state, building) : 1
  const busy = building ? (state.buildings[building]?.buildUntil ?? null) !== null : false
  const tier = building ? towerTier(level) : 1
  const icon = building
    ? isEmpireWorldBuilding(building)
      ? WORLD_ICON[building]
      : COMMON_ICON[building]
    : spot.kind === 'board'
      ? 'deck'
      : 'laurel'
  return (
    <div
      className={`empire-plot is-${spot.key} is-tier-${tier}${level === 0 ? ' is-empty' : ''}${busy ? ' is-busy' : ''}${near ? ' is-near' : ''}`}
      style={{ left: spot.x, top: spot.y }}
    >
      <div className="empire-yard">
        <span className="empire-roof" />
        <span className="empire-house">
          <i />
          <i />
        </span>
        {busy ? (
          <>
            <i className="empire-scaffold" />
            <i className="empire-site-crane" />
            <i className="empire-worker" />
            <i className="empire-worker is-b" />
          </>
        ) : level > 0 ? (
          <i className="empire-smoke" />
        ) : (
          <i className="empire-stake" />
        )}
        <GeoIcon name={icon} size={16} />
      </div>
      {building ? <strong className="empire-plot-lv">{level}</strong> : null}
      <span className="empire-plot-name">{spotLabel(spot, lang)}</span>
    </div>
  )
}

function TownMap({
  spots,
  state,
  lang,
  dockOpen,
  onNear,
}: {
  spots: readonly TownSpot[]
  state: EmpireState
  lang: Lang
  dockOpen: boolean
  onNear: (key: string | null) => void
}) {
  const viewRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 670, y: 390 })
  const dest = useRef<{ x: number; y: number } | null>(null)
  const keys = useRef(new Set<WalkKey>())
  const face = useRef(1)
  const nearKey = useRef<string | null>(null)
  const spotsRef = useRef(spots)
  const dockRef = useRef(dockOpen)
  const onNearRef = useRef(onNear)
  const [frame, setFrame] = useState({ x: 670, y: 390, face: 1, moving: false, near: null as string | null, camX: 0, camY: 0 })

  useEffect(() => {
    spotsRef.current = spots
    dockRef.current = dockOpen
    onNearRef.current = onNear
  })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = walkKey(e)
      if (!key) return
      const target = e.target
      if (target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      e.preventDefault()
      keys.current.add(key)
    }
    const up = (e: KeyboardEvent) => {
      const key = walkKey(e)
      if (key) keys.current.delete(key)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const step = (nowTs: number) => {
      const dt = Math.min(0.05, (nowTs - last) / 1000)
      last = nowTs
      const list = spotsRef.current
      let vx = 0
      let vy = 0
      if (keys.current.has('left')) vx -= 1
      if (keys.current.has('right')) vx += 1
      if (keys.current.has('up')) vy -= 1
      if (keys.current.has('down')) vy += 1
      if (vx || vy) dest.current = null
      else if (dest.current) {
        const dx = dest.current.x - pos.current.x
        const dy = dest.current.y - pos.current.y
        const dist = Math.hypot(dx, dy)
        if (dist < 8) dest.current = null
        else {
          vx = dx / dist
          vy = dy / dist
        }
      }
      let moving = false
      if (vx || vy) {
        const len = Math.hypot(vx, vy) || 1
        const mx = (vx / len) * WALK_SPEED * dt
        const my = (vy / len) * WALK_SPEED * dt
        const nx = pos.current.x + mx
        const ny = pos.current.y + my
        if (!hitsPlot(nx, ny, list)) {
          pos.current = { x: nx, y: ny }
        } else if (!hitsPlot(nx, pos.current.y, list)) {
          pos.current = { x: nx, y: pos.current.y }
        } else if (!hitsPlot(pos.current.x, ny, list)) {
          pos.current = { x: pos.current.x, y: ny }
        }
        if (vx < -0.2) face.current = -1
        else if (vx > 0.2) face.current = 1
        moving = true
      }
      let best: string | null = null
      let bestD = INTERACT_R
      for (const spot of list) {
        const dist = Math.hypot(pos.current.x - spot.x, pos.current.y - spot.y)
        if (dist < bestD) {
          best = spot.key
          bestD = dist
        }
      }
      if (best !== nearKey.current) {
        nearKey.current = best
        onNearRef.current(best)
      }
      const view = viewRef.current
      const vw = view?.clientWidth ?? 640
      const vh = view?.clientHeight ?? 520
      const worldW = vw / TOWN_ZOOM
      const worldH = vh / TOWN_ZOOM
      const bias = dockRef.current ? worldH * 0.16 : 0
      const maxX = Math.max(0, MAP_W - worldW)
      const maxY = Math.max(0, MAP_H - worldH)
      const camX = Math.min(maxX, Math.max(0, pos.current.x - worldW / 2))
      const camY = Math.min(maxY, Math.max(0, pos.current.y - worldH * 0.42 - bias))
      setFrame({ x: pos.current.x, y: pos.current.y, face: face.current, moving, near: best, camX, camY })
      raf = window.requestAnimationFrame(step)
    }
    raf = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(raf)
  }, [])

  function press(key: WalkKey, event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    keys.current.add(key)
  }

  function release(key: WalkKey) {
    keys.current.delete(key)
  }

  return (
    <div
      className="empire-town-view"
      ref={viewRef}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        if ((e.target as HTMLElement).closest('.empire-pad, .empire-hud, .empire-dock, button, a, input')) return
        const rect = viewRef.current?.getBoundingClientRect()
        if (!rect) return
        const worldX = (e.clientX - rect.left) / TOWN_ZOOM + frame.camX
        const worldY = (e.clientY - rect.top) / TOWN_ZOOM + frame.camY
        dest.current = approachPoint(worldX, worldY, spotsRef.current)
      }}
    >
      <div
        className="empire-town-map"
        style={{ transform: `translate(${-frame.camX * TOWN_ZOOM}px, ${-frame.camY * TOWN_ZOOM}px) scale(${TOWN_ZOOM})` }}
      >
        <div className="empire-path is-h" style={{ top: 250, left: 180, width: 1240 }} />
        <div className="empire-path is-h" style={{ top: 530, left: 180, width: 1240 }} />
        <div className="empire-path is-h" style={{ top: 810, left: 180, width: 1240 }} />
        <div className="empire-path is-h" style={{ top: 1040, left: 420, width: 520 }} />
        <div className="empire-path is-v" style={{ left: 540, top: 180, height: 920 }} />
        <div className="empire-path is-v" style={{ left: 800, top: 180, height: 700 }} />
        <i className="empire-tree" style={{ left: 140, top: 140 }} />
        <i className="empire-tree is-b" style={{ left: 1460, top: 160 }} />
        <i className="empire-tree" style={{ left: 150, top: 980 }} />
        <i className="empire-tree is-b" style={{ left: 1420, top: 1000 }} />
        {spots.map((spot) => (
          <TownPlot key={spot.key} spot={spot} state={state} lang={lang} near={frame.near === spot.key} />
        ))}
        <div
          className={`empire-hero${frame.moving ? ' is-moving' : ''}`}
          style={{ left: frame.x, top: frame.y, transform: `translate(-50%, -82%) scaleX(${frame.face})` }}
        >
          <i className="empire-hero-shadow" />
          <span className="empire-hero-bob">
            <i className="empire-hero-head" />
            <i className="empire-hero-body" />
          </span>
        </div>
      </div>
      <div className="empire-pad">
        <button type="button" className="is-up" aria-label="↑" onPointerDown={(e) => press('up', e)} onPointerUp={() => release('up')} onPointerCancel={() => release('up')} />
        <button type="button" className="is-left" aria-label="←" onPointerDown={(e) => press('left', e)} onPointerUp={() => release('left')} onPointerCancel={() => release('left')} />
        <button type="button" className="is-down" aria-label="↓" onPointerDown={(e) => press('down', e)} onPointerUp={() => release('down')} onPointerCancel={() => release('down')} />
        <button type="button" className="is-right" aria-label="→" onPointerDown={(e) => press('right', e)} onPointerUp={() => release('right')} onPointerCancel={() => release('right')} />
      </div>
    </div>
  )
}

type BoardEntry = { id: string | null; score: number; name: string | null; countryIso: string | null; title?: LegacyTitleId | null; goldFlag?: boolean }

function WorldTab({ lang, state }: { lang: Lang; state: EmpireState }) {
  const t = STRINGS[lang]
  const sync = useEmpireSync()
  const [entries, setEntries] = useState<BoardEntry[] | null>(null)
  const [rank, setRank] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/empire/board?limit=25', { credentials: 'include', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { entries: [], rank: null }))
      .then((body: { entries?: BoardEntry[]; rank?: number | null }) => {
        if (!alive) return
        setEntries(Array.isArray(body.entries) ? body.entries : [])
        setRank(typeof body.rank === 'number' ? body.rank : null)
      })
      .catch(() => {
        if (alive) setEntries([])
      })
    return () => {
      alive = false
    }
  }, [state.score])

  const syncText = sync === 'server' ? t.empireSyncServer : sync === 'offline' ? t.empireSyncOffline : t.empireSyncLocal

  return (
    <section className="empire-world">
      <p className={`empire-sync is-${sync}`}>{syncText}</p>
      <div className="empire-score-box">
        <span>{t.empireScore}</span>
        <strong>{fmt(state.score, lang)}</strong>
        {rank ? <small>{t.empireYourRank(rank)}</small> : null}
      </div>
      <h2>{t.empireBoard}</h2>
      {entries === null ? null : entries.length === 0 ? (
        <p className="empire-soon">{t.empireBoardEmpty}</p>
      ) : (
        <ol className="empire-board">
          {entries.map((row, i) => (
            <li key={row.id ?? i}>
              <span className="empire-board-rank">{i + 1}</span>
              {row.countryIso ? (
                <span className={row.goldFlag ? 'flag-gold' : undefined}>
                  <Flag iso={row.countryIso} name="" size="icon" />
                </span>
              ) : (
                <span className="empire-board-noflag" />
              )}
              <span className="empire-board-name">
                {row.name ?? '—'}
                {row.title ? <span className="empire-board-title">{titleName(row.title, lang)}</span> : null}
              </span>
              <strong>{fmt(row.score, lang)}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function EmpireScreen({ lang, onWorlds }: { lang: Lang; onWorlds: () => void }) {
  const t = STRINGS[lang]
  const state = useEmpire()
  const [near, setNear] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const pantheon = hasLegacy(state, 'legacy:pantheon')
  const spots = useMemo(() => (pantheon ? TOWN_LAYOUT : TOWN_LAYOUT.filter((spot) => spot.key !== 'pantheon')), [pantheon])

  useEffect(() => {
    startEmpireLoop()
    empireSyncAlbum()
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => {
      stopEmpireLoop()
      window.clearInterval(id)
    }
  }, [])

  const era = empireEraRow(state.era)
  const check = eraCheck(state)
  const canAdvance = Boolean(check.next) && check.hallOk && check.sumOk && check.resOk
  const slots = buildSlots(state, now)
  const building = activeBuilds(state, now).length
  const spot = spots.find((row) => row.key === near) ?? null
  const night = hasLegacy(state, 'legacy:night')

  return (
    <div className={`screen home-screen empire-screen is-town is-era-${state.era}${night ? ' is-night' : ''}`}>
      <div className={`empire-town-wrap${spot ? ' has-dock' : ''}`}>
        <header className="empire-hud">
          <button type="button" className="empire-exit" aria-label={t.empireBack} onClick={onWorlds}>
            <span aria-hidden="true">‹</span>
          </button>
          <div className="empire-wallet">
            <span className="empire-chip is-coin">
              <i aria-hidden="true" />
              <strong>{fmt(state.coins, lang)}</strong>
            </span>
            <span className="empire-chip is-gem">
              <i aria-hidden="true" />
              <strong>{state.gems}</strong>
            </span>
            <span className="empire-chip is-folk">
              <i aria-hidden="true" />
              <strong>
                {specialistsTotal(state)}/{housingCap(state)}
              </strong>
            </span>
          </div>
        </header>

        <TownMap spots={spots} state={state} lang={lang} dockOpen={spot !== null} onNear={setNear} />

        {spot ? (
          <aside className={`empire-dock is-${spot.key}`}>
            <div className="empire-room" aria-hidden="true">
              <span className="empire-room-roof" />
              <span className="empire-room-window" />
            </div>
            <div className="empire-room-body">
            {spot.kind === 'board' ? <WorldTab lang={lang} state={state} /> : null}
            {spot.kind === 'legacy' ? <LegacyTab lang={lang} state={state} now={now} /> : null}
            {spot.building ? <BuildingCard building={spot.building} state={state} lang={lang} now={now} /> : null}
            {spot.building === 'hall' ? (
              <section className="empire-era-box">
                <div className="empire-room-name">
                  {editing ? (
                    <form
                      className="empire-name-form"
                      onSubmit={(e) => {
                        e.preventDefault()
                        empireRename(draft)
                        setEditing(false)
                      }}
                    >
                      <input autoFocus maxLength={24} value={draft} placeholder={t.empireNameHint} onChange={(e) => setDraft(e.target.value)} />
                      <button type="submit" className="btn-primary">
                        {t.empireRename}
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="empire-name"
                      onClick={() => {
                        setDraft(state.name)
                        setEditing(true)
                      }}
                    >
                      <h1>{state.name || t.empireNameHint}</h1>
                    </button>
                  )}
                  <p className="empire-era">
                    {t.empireEraOf(state.era)} · {eraTitle(state.era, t)} · ×{era.mult}
                    {' · '}
                    {t.empireSlots(building, slots)}
                  </p>
                </div>
                <div>
                  <strong>{check.next ? `${t.empireEraOf(check.next)} · ${eraTitle(check.next, t)}` : t.empireEraMax}</strong>
                  {check.next ? (
                    <ul>
                      <li className={check.hallOk ? 'is-ok' : ''}>{t.empireEraNeedHall(check.hallMin)}</li>
                      <li className={check.sumOk ? 'is-ok' : ''}>{t.empireEraNeedSum(check.levelSumMin)}</li>
                      <li className={check.resOk ? 'is-ok' : ''}>{t.empireEraNeedRes(check.eachResourceMin)}</li>
                    </ul>
                  ) : null}
                </div>
                <div className="empire-era-actions">
                  <button type="button" className="btn-primary" disabled={!canAdvance} onClick={() => empireAdvanceEra()}>
                    {t.empireAdvanceEra}
                  </button>
                </div>
              </section>
            ) : null}
            {spot.building === 'treasury' ? (
              <section className="empire-treasury">
                <p>{t.empireSellHint}</p>
                <ul className="empire-res-list">
                  {EMPIRE_RESOURCES.map((key) => {
                    const world = EMPIRE_WORLD_BY_RESOURCE[key]
                    const have = state.res[key] ?? 0
                    const gain = Math.floor(10 * sellRate(state))
                    return (
                      <li key={key} className={`is-${world}`}>
                        <GeoIcon name={WORLD_ICON[world]} size={18} />
                        <div>
                          <strong>{resourceTitle(key, t)}</strong>
                          <small>
                            {fmt(have, lang)} / {fmt(storageCap(state), lang)} · {t.empirePerHour(fmtRate(resPerHour(state, world), lang))}
                          </small>
                        </div>
                        <button type="button" className="btn-secondary" disabled={have < 10} onClick={() => empireSell(key, 10)}>
                          {t.empireSellTen(gain)}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <CosmeticsBlock lang={lang} state={state} now={now} />
              </section>
            ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}

function rewardText(reward: LegacyReward, t: T) {
  switch (reward.kind) {
    case 'gems':
      return t.empireLegacyRewardGems(reward.gems)
    case 'frame':
      return `${t.empireLegacyReward_frame}: ${t[`empireFrame_${reward.frame}`]}`
    case 'share':
      return `${t.empireLegacyReward_share}: ${t[`empireShare_${reward.share}`]}`
    case 'unlock': {
      const key = reward.unlock.replace(/^legacy:/, '') as
        | 'res5' | 'res10' | 'library10' | 'specialist' | 'maxLevel' | 'buildFast' | 'pantheon' | 'flawlessAnim' | 'goldFlag' | 'night' | 'offline24' | 'slot2'
      return t[`empireLegacyUnlock_${key}`]
    }
  }
}

function LegacyTab({ lang, state, now }: { lang: Lang; state: EmpireState; now: number }) {
  const t = STRINGS[lang]
  const sync = useEmpireSync()
  const rows = legacyOverview(state, LEGACY_ENV)
  const ageDays = Math.max(1, (now - state.createdAt) / 86_400_000)

  return (
    <section className="empire-legacy">
      <p className="empire-intro">{t.empireLegacyIntro}</p>
      {sync !== 'server' ? <p className="empire-legacy-guest">{t.empireLegacyGuest}</p> : null}
      <ul className="empire-legacy-list">
        {rows.map((row) => {
          const mission = LEGACY_MISSIONS.find((m) => m.id === row.id) ?? LEGACY_MISSIONS[0]
          const target = row.nextAt ?? row.finalAt
          const pct = target > 0 ? Math.min(100, Math.round((row.value / target) * 100)) : 100
          const isFinal = row.stage >= mission.stages.length
          const pending = isFinal ? mission.finalRewards : [mission.stages[row.stage].reward]
          const eta = row.value > 0 && row.nextAt !== null && row.value < row.nextAt ? Math.ceil(((row.nextAt - row.value) * ageDays) / row.value) : null
          return (
            <li key={row.id} className={`empire-legacy-item is-${row.id}${row.finalClaimed ? ' is-done' : ''}`}>
              <header>
                <div>
                  <h3>{t[`empireLegacy_${row.id}`]}</h3>
                  <small>{t[`empireLegacyDesc_${row.id}`]}</small>
                </div>
                <strong>{t.empireLegacyValue(fmt(row.value, lang), fmt(target, lang))}</strong>
              </header>
              <div className="empire-legacy-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="empire-legacy-foot">
                <small>
                  {row.finalClaimed
                    ? t.empireLegacyDone
                    : `${isFinal ? t.empireLegacyFinal : t.empireLegacyStage(row.stage + 1, mission.stages.length)} · ${pending.map((r) => rewardText(r, t)).join(', ')}${isFinal ? ` · ${t.empireLegacyReward_title}: ${titleName(mission.title, lang)}` : ''}`}
                  {eta !== null && !row.finalClaimed ? ` · ${t.empireLegacyEta(eta)}` : ''}
                </small>
                {row.finalClaimed ? null : (
                  <button type="button" className="btn-primary" disabled={!row.claimable} onClick={() => empireClaimLegacy(row.id)}>
                    {t.empireLegacyClaim}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <h2>{t.empireTitles}</h2>
      <div className="empire-titles">
        <button type="button" className={state.title === null ? 'is-active' : ''} onClick={() => empireSetTitle(null)}>
          {t.empireTitleNone}
        </button>
        {state.titles.map((title) => (
          <button key={title} type="button" className={state.title === title ? 'is-active' : ''} onClick={() => empireSetTitle(title)}>
            {titleName(title, lang)}
          </button>
        ))}
      </div>
    </section>
  )
}

function CosmeticsBlock({ lang, state, now }: { lang: Lang; state: EmpireState; now: number }) {
  const t = STRINGS[lang]
  const boostLeft = Math.max(0, Math.ceil((state.boosts.xpUntil - now) / 60_000))
  const frameName = (id: CardFrameId) => t[`empireFrame_${id}`]
  const shareName = (id: ShareThemeId) => t[`empireShare_${id}`]

  return (
    <div className="empire-cosmetics">
      <h2>{t.empireBoosts}</h2>
      <ul className="empire-cosmetic-list">
        <li>
          <span className="empire-cosmetic-swatch is-boost" aria-hidden="true">
            <GeoIcon name="orbit" size={18} />
          </span>
          <div>
            <strong>{t.empireBoostXp}</strong>
            {boostLeft > 0 ? <small className="is-on">{t.empireBoostActive(boostLeft)}</small> : null}
          </div>
          <div className="empire-cosmetic-actions">
            <button
              type="button"
              className="btn-secondary"
              disabled={state.coins < EMPIRE_XP_BOOST_COINS}
              onClick={() => empireBuyXpBoost('coins')}
            >
              {t.empireBoostBuyCoins(Math.round(EMPIRE_XP_BOOST_COINS_MS / 60_000), EMPIRE_XP_BOOST_COINS)}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={state.gems < EMPIRE_XP_BOOST_GEMS}
              onClick={() => empireBuyXpBoost('gems')}
            >
              {t.empireBoostBuyGems(Math.round(EMPIRE_XP_BOOST_GEMS_MS / 3_600_000), EMPIRE_XP_BOOST_GEMS)}
            </button>
          </div>
        </li>
      </ul>

      <h2>{t.empirePerks}</h2>
      <ul className="empire-cosmetic-list">
        {(Object.keys(EMPIRE_PERKS) as (keyof typeof EMPIRE_PERKS)[]).map((perk) => {
          const row = EMPIRE_PERKS[perk]
          const until = state.perks[perk] ?? 0
          const daysLeft = Math.max(0, Math.ceil((until - now) / 86_400_000))
          return (
            <li key={perk} className={daysLeft > 0 ? 'is-owned' : ''}>
              <span className="empire-cosmetic-swatch is-boost" aria-hidden="true">
                <GeoIcon name={perk === 'slot2' ? 'hq' : 'stamp'} size={18} />
              </span>
              <div>
                <strong>{t[`empirePerk_${perk}`]}</strong>
                {daysLeft > 0 ? <small className="is-on">{t.empirePerkLeft(daysLeft)}</small> : null}
              </div>
              <button type="button" className="btn-secondary" disabled={state.gems < row.gems} onClick={() => empireBuyPerk(perk)}>
                {t.empirePerkBuy(Math.round(row.ms / 86_400_000), row.gems)}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="empire-album-hint">{t.empireAlbumHint}</p>

      <h2>{t.empireFrames}</h2>
      <ul className="empire-cosmetic-list">
        {CARD_FRAME_IDS.filter((id) => (SHOP_FRAME_IDS as readonly string[]).includes(id) || state.cosmetics.frames.includes(id)).map((id) => {
          const item = { kind: 'frame', id } as const
          const owned = cosmeticOwned(state, item)
          const worn = state.cosmetics.frame === id
          const minEra = FRAME_MIN_ERA[id] ?? 1
          const price = cosmeticPrice(item) ?? 0
          return (
            <li key={id} className={owned ? 'is-owned' : ''}>
              <span className={`empire-cosmetic-swatch avatar-frame is-${id}`} aria-hidden="true" />
              <div>
                <strong>{frameName(id)}</strong>
                <small>{owned ? (worn ? t.empireEquipped : t.empireOwned) : state.era < minEra ? t.gateNeedEra(minEra) : null}</small>
              </div>
              {owned ? (
                <button type="button" className="btn-secondary" onClick={() => empireEquip('frame', worn ? null : id)}>
                  {worn ? t.empireUnequip : t.empireEquip}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  disabled={state.coins < price || state.era < minEra}
                  onClick={() => empireBuyCosmetic(item)}
                >
                  {t.empireBuyFor(price)}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <h2>{t.empireShares}</h2>
      <ul className="empire-cosmetic-list">
        {SHARE_THEME_IDS.filter((id) => (SHOP_SHARE_IDS as readonly string[]).includes(id) || state.cosmetics.shares.includes(id)).map((id) => {
          const item = { kind: 'share', id } as const
          const owned = cosmeticOwned(state, item)
          const worn = state.cosmetics.share === id
          const price = cosmeticPrice(item) ?? 0
          return (
            <li key={id} className={owned ? 'is-owned' : ''}>
              <span className={`empire-cosmetic-swatch share-theme-${id}`} aria-hidden="true" />
              <div>
                <strong>{shareName(id)}</strong>
                <small>{owned ? (worn ? t.empireEquipped : t.empireOwned) : null}</small>
              </div>
              {owned ? (
                <button type="button" className="btn-secondary" onClick={() => empireEquip('share', worn ? null : id)}>
                  {worn ? t.empireUnequip : t.empireEquip}
                </button>
              ) : (
                <button type="button" className="btn-primary" disabled={state.coins < price} onClick={() => empireBuyCosmetic(item)}>
                  {t.empireBuyFor(price)}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
