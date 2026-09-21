import { useSyncExternalStore } from 'react'
import { COMPANY_HQ_COST, COMPANY_STAGES, companyStage, type CompanyTask } from '../data/company'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  buyCompanyHq,
  catchCompanySpark,
  claimCompanyStage,
  companyRatePerMin,
  getCompanyClientSnapshot,
  getCompanyServerSnapshot,
  stageReady,
  stageStars,
  subscribeCompany,
  taskDone,
  taskProgress,
  type CompanyState,
} from '../lib/companyStore'
import type { QuizWorld } from '../lib/quiz'
import { GeoIcon } from './GeoIcon'
import { tokenKnowledgeBoostActive, useTokens } from '../lib/tokenStore'
import { WorldsBack } from './WorldsBack'

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

export function companyTaskLabel(task: CompanyTask, lang: Lang) {
  const t = STRINGS[lang]
  if (task.kind === 'focus') return t.companyTaskFocus(task.n)
  if (task.kind === 'sparks') return t.companyTaskSparks(task.n)
  if (task.kind === 'rounds') return t.companyTaskRounds(task.n)
  if (task.kind === 'completes') return t.companyTaskCompletes(task.n)
  if (task.kind === 'buyHq') return t.companyTaskBuyHq
  return t.companyTaskWorldRounds(task.n, worldTitle(task.world ?? 'geo', lang))
}

export function companyTaskIcon(kind: CompanyTask['kind']): 'hq' | 'trophy' | 'globe' | 'orbit' {
  if (kind === 'focus') return 'orbit'
  if (kind === 'sparks') return 'trophy'
  if (kind === 'buyHq') return 'hq'
  return 'globe'
}

function fmtKnowledge(n: number, lang: Lang) {
  return Math.floor(n).toLocaleString(lang)
}

export function useCompany() {
  return useSyncExternalStore(subscribeCompany, getCompanyClientSnapshot, getCompanyServerSnapshot)
}

export function CompanyScreen({ lang, onWorlds }: { lang: Lang; onWorlds: () => void }) {
  const t = STRINGS[lang]
  const state = useCompany()
  const tokens = useTokens()
  const current = Math.min(80, state.claimed + 1)
  const stage = companyStage(current)
  const finished = state.claimed >= 80
  const ready = stageReady(state)
  const rate = companyRatePerMin(state)
  const capHours = (state.capMs / 3_600_000).toFixed(1).replace(/\.0$/, '')
  const buff = Date.now() < state.buffUntil
  const tokenBuff = tokenKnowledgeBoostActive()

  return (
    <div className={`screen home-screen company-screen${tokens.hqSkin ? ' has-hq-skin' : ''}`}>
      <header className="home-header">
        <WorldsBack lang={lang} onClick={onWorlds} />
        <h1>{t.company}</h1>
        <p className="subtitle">{t.companyHint}</p>
      </header>

      <section className="card settings-card company-ledger">
        <p className="company-knowledge">
          <GeoIcon name="hq" size={22} />
          <span>
            {t.companyKnowledge}: {fmtKnowledge(state.knowledge, lang)}
          </span>
        </p>
        <p className="setting-hint">
          {t.companyRate(rate.toFixed(1))}
          {' · '}
          {t.companyCap(capHours)}
          {buff ? ` · ${t.companyBuff}` : ''}
          {tokenBuff ? ` · ${t.shopBoostKnowledge}` : ''}
        </p>
        <div className="company-hq-row">
          {state.hq ? (
            <p className="setting-hint">{t.companyHqOwned}</p>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              disabled={state.knowledge < COMPANY_HQ_COST}
              onClick={() => buyCompanyHq()}
            >
              {t.companyBuyHq} · {COMPANY_HQ_COST}
            </button>
          )}
        </div>
        <p className="setting-hint">{t.companyHqHint}</p>
      </section>

      {finished ? (
        <section className="card settings-card">
          <p>{t.companyFinished}</p>
        </section>
      ) : stage ? (
        <section className="card settings-card company-current">
          <h2>{t.companyStage(stage.level)}</h2>
          <p className="company-stars" aria-label={`${stageStars(state)} / 3`}>
            {'★'.repeat(stageStars(state))}
            {'☆'.repeat(3 - stageStars(state))}
          </p>
          <ul className="company-tasks">
            {stage.tasks.map((task, i) => (
              <CompanyTaskRow key={`${stage.level}-${i}`} task={task} state={state} lang={lang} open />
            ))}
          </ul>
          <p className="setting-hint">
            {t.companyRewardKnowledge(fmtKnowledge(stage.reward.knowledge, lang))}
            {' · '}
            {t.companyRewardRate(stage.reward.ratePct)}
            {stage.reward.capMs > 0 ? ` · ${t.companyRewardCap(Math.round(stage.reward.capMs / 60_000))}` : ''}
          </p>
          <button type="button" className="btn-primary" disabled={!ready} onClick={() => claimCompanyStage()}>
            {t.companyClaim}
          </button>
          <button type="button" className="btn-ghost" onClick={onWorlds}>
            {t.companyPlay}
          </button>
        </section>
      ) : null}

      <section className="card settings-card company-track-card">
        <div className="company-track">
          {COMPANY_STAGES.map((item) => {
            const stars = stageStars(state, item.level)
            const isCurrent = item.level === current && !finished
            const cleared = item.level <= state.claimed
            return (
              <div
                key={item.level}
                className={`company-node${isCurrent ? ' is-current' : ''}${cleared ? ' is-cleared' : ''}`}
                title={t.companyStage(item.level)}
              >
                <span className="company-node-stars">{cleared ? '★★★' : isCurrent ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '···'}</span>
                <span className="company-node-n">{item.level}</span>
                {!cleared && !isCurrent ? (
                  <span className="company-node-icons">
                    {item.tasks.map((task, i) => (
                      <GeoIcon key={i} name={companyTaskIcon(task.kind)} size={12} />
                    ))}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function CompanyTaskRow({
  task,
  state,
  lang,
  open,
}: {
  task: CompanyTask
  state: CompanyState
  lang: Lang
  open: boolean
}) {
  const t = STRINGS[lang]
  const done = taskDone(state, task)
  const { current, goal } = taskProgress(state, task)
  return (
    <li className={`company-task${done ? ' is-done' : ''}`}>
      <GeoIcon name={companyTaskIcon(task.kind)} size={18} />
      <span>
        {open ? companyTaskLabel(task, lang) : t.companyLocked}
        {open ? (
          <small>
            {Math.min(current, goal)} / {goal}
            {done ? ` · ${t.companyDone}` : ''}
          </small>
        ) : null}
      </span>
    </li>
  )
}

export function CompanyHud({ lang, onOpen }: { lang: Lang; onOpen: () => void }) {
  const t = STRINGS[lang]
  const state = useCompany()
  const stage = companyStage(Math.min(80, state.claimed + 1))
  if (!stage || state.claimed >= 80) return null
  return (
    <button type="button" className="company-hud" onClick={onOpen}>
      <span className="company-hud-kicker">{t.companyHud}</span>
      <span className="company-hud-stage">{t.companyStage(stage.level)}</span>
      <span className="company-hud-stars">{'★'.repeat(stageStars(state))}{'☆'.repeat(3 - stageStars(state))}</span>
      <ul>
        {stage.tasks.map((task, i) => (
          <li key={i} className={taskDone(state, task) ? 'is-done' : undefined}>
            {companyTaskLabel(task, lang)}
          </li>
        ))}
      </ul>
    </button>
  )
}

export function CompanySpark({ lang }: { lang: Lang }) {
  const t = STRINGS[lang]
  const state = useCompany()
  if (!state.spark) return null
  return (
    <button
      type="button"
      className="company-spark"
      style={{ left: `${state.spark.x}%`, top: `${state.spark.y}%` }}
      onClick={() => catchCompanySpark()}
      aria-label={t.companySparkCatch}
    >
      <GeoIcon name="trophy" size={28} />
      <span>{t.companySparkCatch}</span>
    </button>
  )
}
