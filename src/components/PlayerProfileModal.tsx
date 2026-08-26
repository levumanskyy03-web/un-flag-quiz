'use client'

import { useEffect, useId, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  fetchPlayerProfile,
  formatRegisteredAt,
  type PublicPlayerProfile,
} from '../lib/account'
import { formatXp } from '../lib/xp'
import { AchievementGallery } from './AchievementGallery'
import { AvatarMark } from './AvatarMark'

interface PlayerProfileModalProps {
  lang: Lang
  playerId: string
  previewName?: string
  previewXp?: number
  previewLevel?: number
  onClose: () => void
}

export function PlayerProfileModal({
  lang,
  playerId,
  previewName,
  previewXp,
  previewLevel,
  onClose,
}: PlayerProfileModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [player, setPlayer] = useState<PublicPlayerProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    setReady(false)
    fetchPlayerProfile(playerId)
      .then((next) => {
        if (cancelled) return
        setPlayer(next)
        setReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setPlayer(null)
        setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [playerId])

  const name = player?.name ?? previewName ?? t.playerProfile
  const xp = player?.xp ?? previewXp ?? 0
  const level = player?.level ?? previewLevel ?? 1
  const createdAt = player?.createdAt

  return (
    <div
      className="passport-overlay player-profile-overlay"
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
    >
      <div
        className="passport-sheet account-sheet settings-sheet player-profile-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-sheet-head">
          <h2 id={titleId}>{t.playerProfile}</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>

        {!ready && !previewName ? (
          <p className="setting-hint">{t.playerProfile}</p>
        ) : ready && !player ? (
          <p className="leaderboard-empty">{t.playerProfileMissing}</p>
        ) : (
          <div className="settings-pane">
            <div className="settings-profile-row">
              <AvatarMark id={player?.avatarId} size={64} />
              <div>
                <p className="account-signed-in">{name}</p>
                {createdAt ? (
                  <p className="account-registered">{t.accountRegistered(formatRegisteredAt(createdAt, lang))}</p>
                ) : null}
                <p className="account-level">{t.accountLevel(level || 1)}</p>
                <p className="profile-xp">{t.xpTotal(formatXp(xp, lang))}</p>
              </div>
            </div>
            {player ? (
              <>
                <h3 className="settings-sub">{t.settingsAchievements}</h3>
                <AchievementGallery lang={lang} unlockedIds={player.achievementIds} />
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
