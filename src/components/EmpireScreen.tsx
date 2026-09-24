'use client'

import { useEffect, useState } from 'react'
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
  buildingsOf,
  hasLegacy,
  legacyOverview,
  pantheonResPerHour,
  canAfford,
  coinsPerHour,
  cosmeticOwned,
  cosmeticPrice,
  coinsPerHourOf,
  eraCheck,
  housingCap,
  offlineHours,
  resPerHour,
  sellRate,
  skipBuildCost,
  specialistsTotal,
  storageCap,
  treasuryCap,
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
import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'
import { LEGACY_MISSIONS, type LegacyReward, type LegacyTitleId } from '../data/empireLegacy'
import { Flag } from './Flag'
import { GeoIcon } from './GeoIcon'
import { WorldsBack } from './WorldsBack'

type Tab = 'country' | 'treasury' | 'legacy' | 'world'

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

function Tower({ building, state, onClick, active }: { building: EmpireBuilding; state: EmpireState; onClick: () => void; active: boolean }) {
  const level = buildingLevel(state, building)
  const storeys = Math.min(12, level)
  const busy = (state.buildings[building]?.buildUntil ?? null) !== null
  const icon = isEmpireWorldBuilding(building) ? WORLD_ICON[building] : COMMON_ICON[building as keyof typeof COMMON_ICON]
  const cls = `empire-tower is-${building} is-tier-${towerTier(level)}${active ? ' is-active' : ''}${level === 0 ? ' is-plot' : ''}`
  return (
    <button type="button" className={cls} onClick={onClick}>
      <span className="empire-tower-roof" aria-hidden="true" />
      <span className="empire-tower-shaft" aria-hidden="true">
        {Array.from({ length: storeys }, (_, i) => (
          <i key={i} className="empire-tower-storey" />
        ))}
        {busy ? <i className="empire-tower-scaffold" /> : null}
      </span>
      <span className="empire-tower-base">
        <GeoIcon name={icon} size={16} />
        <strong>{level}</strong>
      </span>
    </button>
  )
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
  const [tab, setTab] = useState<Tab>('country')
  const [focus, setFocus] = useState<EmpireBuilding | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

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
  const focusList: readonly EmpireBuilding[] = focus ? [focus] : buildingsOf(state)
  const skyline: readonly EmpireBuilding[] = hasLegacy(state, 'legacy:pantheon') ? [...QUIZ_WORLDS, 'pantheon'] : QUIZ_WORLDS

  return (
    <div className="screen home-screen empire-screen">
      <WorldsBack lang={lang} onClick={onWorlds} label={t.empireBack} />

      <header className="empire-head">
        <div className="empire-title">
          <span className="empire-kicker">{t.empire}</span>
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
              {state.title ? <span className="empire-title-badge">{titleName(state.title, lang)}</span> : null}
              <span aria-hidden="true">✎</span>
            </button>
          )}
          <p className="empire-era">
            {t.empireEraOf(state.era)} · {eraTitle(state.era, t)} · ×{era.mult}
          </p>
        </div>
        <div className="empire-wallet">
          <span>
            <GeoIcon name="pin" size={16} />
            <strong>{fmt(state.coins, lang)}</strong>
            <small>/ {fmt(treasuryCap(state), lang)}</small>
          </span>
          <span>
            <GeoIcon name="orbit" size={16} />
            <strong>{state.gems}</strong>
            <small>{t.empireGems}</small>
          </span>
          <span>
            <GeoIcon name="hq" size={16} />
            <strong>
              {specialistsTotal(state)} / {housingCap(state)}
            </strong>
            <small>{t.empireSpecialists}</small>
          </span>
          <span>
            <strong>{t.empirePerHour(fmtRate(coinsPerHour(state), lang))}</strong>
            <small>{t.empireOffline(offlineHours(state, now))}</small>
          </span>
        </div>
      </header>

      <nav className="empire-tabs" aria-label={t.empire}>
        {(['country', 'treasury', 'legacy', 'world'] as Tab[]).map((id) => (
          <button key={id} type="button" className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>
            {id === 'country' ? t.empireTabCountry : id === 'treasury' ? t.empireTabTreasury : id === 'legacy' ? t.empireLegacy : t.empireTabWorld}
          </button>
        ))}
      </nav>

      {tab === 'country' ? (
        <>
          <section className={`empire-scene is-era-${state.era}${hasLegacy(state, 'legacy:night') ? ' is-night' : ''}`}>
            <div className="empire-sky" aria-hidden="true">
              <span className="empire-sun" />
              <span className="empire-stars" />
            </div>
            <div className="empire-skyline" style={{ gridTemplateColumns: `repeat(${skyline.length}, 1fr)` }}>
              {skyline.map((b) => (
                <Tower key={b} building={b} state={state} active={focus === b} onClick={() => setFocus(focus === b ? null : b)} />
              ))}
            </div>
            <div className="empire-ground" aria-hidden="true" />
          </section>

          <p className="empire-intro">{state.era === 1 && buildingLevel(state, 'hall') === 0 ? t.empireIntro : t.empireHowToEarn}</p>

          <section className="empire-era-box">
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
              <small>{t.empireSlots(building, slots)}</small>
              <button type="button" className="btn-primary" disabled={!canAdvance} onClick={() => empireAdvanceEra()}>
                {t.empireAdvanceEra}
              </button>
            </div>
          </section>

          <section className="empire-grid">
            {focus ? (
              <button type="button" className="btn-secondary empire-unfocus" onClick={() => setFocus(null)}>
                ← {t.empireTabCountry}
              </button>
            ) : null}
            {focusList.map((b) => (
              <BuildingCard key={b} building={b} state={state} lang={lang} now={now} />
            ))}
          </section>
        </>
      ) : null}

      {tab === 'treasury' ? (
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

      {tab === 'legacy' ? <LegacyTab lang={lang} state={state} now={now} /> : null}

      {tab === 'world' ? <WorldTab lang={lang} state={state} /> : null}
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
