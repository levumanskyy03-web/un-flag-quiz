'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
 * Закрытый контент: короткая кнопка, подробности — мини-окно.
 * `open` без кнопки: родитель сам открывает окно (например, клик по карточке).
 * Рендерить только когда `empireAccess(feature) === 'locked'`.
 */
export function EmpireLock({
  lang,
  feature,
  title,
  note,
  open,
  onClose,
}: {
  lang: Lang
  feature: GateFeature
  title?: string
  note?: string
  open?: boolean
  onClose?: () => void
}) {
  const t = STRINGS[lang]
  const state = useEmpire()
  const sync = useEmpireSync()
  const canBuy = sync === 'server' // гость в пробе за валюту не покупает (docs/economy.md 4.8)
  const info = gateInfo(feature)
  const [error, setError] = useState(false)
  const [localOpen, setLocalOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const shown = open ?? localOpen
  const progress = gateProgressText(info.progress, lang)
  const affordable = canPay(state, info.price)
  const heading = title ?? t.gateLocked

  function close() {
    setLocalOpen(false)
    setError(false)
    onClose?.()
  }

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (!shown) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setLocalOpen(false)
      setError(false)
      onClose?.()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [shown, onClose])

  const sheet =
    shown && ready
      ? createPortal(
          <div className="passport-overlay empire-lock-overlay" onClick={close} role="presentation">
            <div
              className="passport-sheet empire-lock-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="empire-lock-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="empire-lock-close" aria-label={t.close} onClick={close}>
                ×
              </button>
              <div className="empire-lock-head">
                <span className="empire-lock-badge">{t.gateLocked}</span>
                <strong id="empire-lock-title">{heading}</strong>
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
                      if (result.ok) close()
                    }}
                  >
                    {priceText(info.price, t)}
                  </button>
                ) : null}
              </div>
              {canBuy && (error || (info.price && !affordable)) ? (
                <small className="empire-lock-error">{t.gateNoFunds}</small>
              ) : null}
              {!canBuy && info.price ? <small className="empire-lock-note">{t.empireSyncLocal}</small> : null}
            </div>
          </div>,
          document.body,
        )
      : null

  if (open !== undefined) return sheet

  return (
    <>
      <button type="button" className="empire-lock-trigger" onClick={() => setLocalOpen(true)}>
        <span className="empire-lock-badge">{t.gateLocked}</span>
        <strong>{heading}</strong>
      </button>
      {sheet}
    </>
  )
}
