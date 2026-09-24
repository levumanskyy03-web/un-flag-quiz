'use client'

import { useState } from 'react'
import Link from 'next/link'
import { STRINGS, type Lang } from '../i18n/strings'
import { canPay, gateInfo, type GateFeature, type GatePrice, type GateProgress } from '../lib/empire/gates'
import { empireUnlock, useEmpire, useEmpireSync } from '../lib/empireStore'
import { buildingTitle, resourceTitle } from './EmpireScreen'

type T = (typeof STRINGS)[Lang]

export function gateProgressText(progress: GateProgress | null, lang: Lang): string | null {
  const t = STRINGS[lang]
  if (!progress) return null
  if (progress.type === 'era') return t.gateNeedEra(progress.era)
  if (progress.type === 'building') return t.gateNeedBuilding(buildingTitle(progress.building, lang), progress.level)
  return progress.rows.map((row) => t.gateNeedBuilding(buildingTitle(row.building, lang), row.level)).join(' + ')
}

function priceText(price: GatePrice, t: T) {
  if (price.type === 'coins') return t.gateUnlockCoins(price.amount)
  if (price.type === 'gems') return t.gateUnlockGems(price.amount)
  return t.gateUnlockResource(price.amount, resourceTitle(price.resource, t).toLocaleLowerCase())
}

/**
 * Плашка закрытого контента: «Империя+ (скоро)» и второй путь — прогресс или разовая покупка.
 * Рендерить только когда `empireAccess(feature) === 'locked'`.
 */
export function EmpireLock({
  lang,
  feature,
  title,
  note,
  compact = false,
}: {
  lang: Lang
  feature: GateFeature
  title?: string
  note?: string
  compact?: boolean
}) {
  const t = STRINGS[lang]
  const state = useEmpire()
  const sync = useEmpireSync()
  const canBuy = sync === 'server' // гость в пробе за валюту не покупает (docs/economy.md 4.8)
  const info = gateInfo(feature)
  const [error, setError] = useState(false)
  const progress = gateProgressText(info.progress, lang)
  const affordable = canPay(state, info.price)

  return (
    <div className={`empire-lock${compact ? ' is-compact' : ''}`} role="note">
      <div className="empire-lock-head">
        <span className="empire-lock-badge">{t.gateLocked}</span>
        <strong>{title ?? t.gateLocked}</strong>
      </div>
      {note ? <p className="empire-lock-note">{note}</p> : null}
      <div className="empire-lock-ways">
        <button type="button" className="btn-ghost" disabled>
          {t.gatePlusSoon}
        </button>
        {progress || info.price ? <span className="empire-lock-or">{t.gateOr}</span> : null}
        {progress ? (
          <Link className="btn-ghost" href="/empire">
            {progress} · {t.gateToEmpire}
          </Link>
        ) : null}
        {info.price && canBuy ? (
          <button
            type="button"
            className="btn-primary"
            disabled={!affordable}
            onClick={() => {
              const result = empireUnlock(feature)
              setError(!result.ok)
            }}
          >
            {priceText(info.price, t)}
          </button>
        ) : null}
      </div>
      {canBuy && (error || (info.price && !affordable)) ? <small className="empire-lock-error">{t.gateNoFunds}</small> : null}
      {!canBuy && info.price ? <small className="empire-lock-note">{t.empireSyncLocal}</small> : null}
    </div>
  )
}
