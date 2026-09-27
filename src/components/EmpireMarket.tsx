'use client'

import { useState } from 'react'
import { EMPIRE_RESOURCE_BY_WORLD, EMPIRE_RESOURCES, type EmpireResource } from '../data/empire'
import { STRINGS, type Lang } from '../i18n/strings'
import { focusWorld, tradeCap, tradeFee, tradeOut } from '../lib/empire/economy'
import { QUIZ_WORLDS, type PlayPath, type QuizWorld } from '../lib/quiz'
import { buildingLevel, worldYield, type EmpireState } from '../lib/empire/rules'
import { empireClaimContract, empireSetDecree, empireTrade } from '../lib/empireStore'
import { resourceTitle, worldTitle } from './EmpireScreen'

function pathTitle(path: PlayPath, t: (typeof STRINGS)['ru']) {
  if (path === 'levels') return t.empirePath_levels
  if (path === 'list') return t.empirePath_list
  if (path === 'daily') return t.empirePath_daily
  return t.empirePath_pool
}

export function EmpireMarket({ lang, state }: { lang: Lang; state: EmpireState }) {
  const t = STRINGS[lang]
  const [from, setFrom] = useState<EmpireResource>('maps')
  const [to, setTo] = useState<EmpireResource>('seals')
  const [error, setError] = useState<string | null>(null)
  const amount = 10
  const out = from === to ? 0 : tradeOut(amount, buildingLevel(state, 'treasury'))
  const fee = tradeFee(amount)
  const left = Math.max(0, tradeCap(state.era) - state.economy.tradeSpent)
  const focus = focusWorld(state.economy.decree)

  function decree(next: Parameters<typeof empireSetDecree>[0]) {
    setError(empireSetDecree(next) ? null : t.empireDecreeLocked)
  }

  return (
    <section className="empire-market">
      <h2>{t.empireMarket}</h2>
      <h3>{t.empireDecree}</h3>
      <div className="empire-decree-row">
        <button type="button" className={state.economy.decree === 'balanced' ? 'is-on' : ''} onClick={() => decree('balanced')}>
          {t.empireDecreeBalanced}
        </button>
        <button type="button" className={state.economy.decree === 'tax' ? 'is-on' : ''} onClick={() => decree('tax')}>
          {t.empireDecreeTax}
        </button>
        <button type="button" className={state.economy.decree === 'scholarship' ? 'is-on' : ''} onClick={() => decree('scholarship')}>
          {t.empireDecreeScholarship}
        </button>
      </div>
      <label className="empire-focus">
        <span>{t.empireDecreeFocus}</span>
        <select
          value={focus ?? ''}
          onChange={(e) => {
            const world = e.target.value
            if (QUIZ_WORLDS.includes(world as QuizWorld)) decree(`focus:${world as QuizWorld}`)
          }}
        >
          <option value="">{t.empireDecreeBalanced}</option>
          {QUIZ_WORLDS.map((world) => (
            <option key={world} value={world}>
              {worldTitle(world, lang)}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="empire-card-error">{error}</p> : null}

      <h3>{t.empireContracts}</h3>
      <ul className="empire-contracts">
        {state.economy.contracts.map((contract) => {
          const worldName = contract.world ? worldTitle(contract.world, lang) : ''
          const label =
            contract.kind === 'correct'
              ? t.empireContractCorrect(contract.goal, worldName)
              : contract.kind === 'perfect'
                ? t.empireContractPerfect(contract.goal)
                : t.empireContractPath(contract.path ? pathTitle(contract.path, t) : worldName)
          const ready = contract.progress >= contract.goal && !contract.claimed
          return (
            <li key={contract.id}>
              <span>
                {label}
                {contract.world && contract.kind === 'path' ? ` · ${worldName}` : ''}
              </span>
              <small>
                {contract.progress}/{contract.goal}
                {contract.coins > 0 ? ` · +${contract.coins}` : ''}
                {contract.gems > 0 ? ` · +${contract.gems}` : ''}
              </small>
              {contract.claimed ? (
                <em>{t.empireContractDone}</em>
              ) : (
                <button type="button" disabled={!ready} onClick={() => empireClaimContract(contract.id)}>
                  {t.empireContractClaim}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <h3>{t.empireTrade}</h3>
      <div className="empire-trade">
        <select value={from} onChange={(e) => setFrom(e.target.value as EmpireResource)}>
          {EMPIRE_RESOURCES.map((key) => (
            <option key={key} value={key}>
              {resourceTitle(key, t)} ({state.res[key] ?? 0})
            </option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value as EmpireResource)}>
          {EMPIRE_RESOURCES.map((key) => (
            <option key={key} value={key}>
              {resourceTitle(key, t)}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={from === to || out < 1 || left < amount || (state.res[from] ?? 0) < amount || state.coins < fee}
          onClick={() => setError(empireTrade(from, to, amount) ? null : t.empireTradeCap)}
        >
          {t.empireTradeRate(out, resourceTitle(to, t).toLocaleLowerCase(lang), fee)}
        </button>
        <small>
          {left} · {t.empireMastery(state.economy.mastery[QUIZ_WORLDS.find((world) => EMPIRE_RESOURCE_BY_WORLD[world] === from) ?? 'geo'] ?? 0)}
        </small>
      </div>

      <ul className="empire-mastery">
        {QUIZ_WORLDS.map((world) => {
          const yieldOf = worldYield(state, world)
          const pct = yieldOf.need > 0 ? Math.min(100, Math.round((yieldOf.stock / yieldOf.need) * 100)) : 100
          return (
            <li key={world}>
              <span>{worldTitle(world, lang)}</span>
              <i style={{ width: `${yieldOf.mastery}%` }} />
              <small>
                {t.empireMastery(yieldOf.mastery)} · {t.empireSupply(resourceTitle(EMPIRE_RESOURCE_BY_WORLD[yieldOf.partner], t), pct)}
              </small>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
