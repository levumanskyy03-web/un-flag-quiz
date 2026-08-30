'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_AVATAR, type AvatarId } from '../data/avatars'
import { STRINGS, type Lang } from '../i18n/strings'
import type { Account } from '../lib/account'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { loadProfile } from '../lib/profile'
import { AvatarMark } from './AvatarMark'
import { SettingsModal } from './SettingsModal'

export interface SettingsButtonProps {
  lang: Lang
  history?: RoundRecord[]
  bests?: RoundRecord[]
  levelClears?: LevelClear[]
  onLangChange?: (lang: Lang) => void
  onAuth?: (account: Account | null) => void
  onClearBests?: () => void
}

export function SettingsButton({
  lang,
  history = [],
  bests = [],
  levelClears = [],
  onLangChange,
  onAuth,
  onClearBests,
}: SettingsButtonProps) {
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR)
  const [photo, setPhoto] = useState<string | undefined>()

  useEffect(() => {
    const profile = loadProfile()
    setAvatarId(profile.avatarId)
    setPhoto(profile.photo)
  }, [open, lang])

  function refreshMark() {
    const profile = loadProfile()
    setAvatarId(profile.avatarId)
    setPhoto(profile.photo)
  }

  return (
    <>
      <button type="button" className="settings-chip" onClick={() => setOpen(true)} aria-label={t.settings}>
        <AvatarMark id={avatarId} photo={photo} size={32} />
        <span className="settings-chip-gear" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.70 4.01 7.13 2.11 8.87 2.11 9.30 4.01 10.81 4.88 12.66 4.30 13.53 5.81 12.11 7.13 12.11 8.87 13.53 10.19 12.66 11.70 10.81 11.12 9.30 11.99 8.87 13.89 7.13 13.89 6.70 11.99 5.19 11.12 3.34 11.70 2.47 10.19 3.89 8.87 3.89 7.13 2.47 5.81 3.34 4.30 5.19 4.88Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="8" r="2.15" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </span>
      </button>
      {open ? (
        <SettingsModal
          lang={lang}
          history={history}
          bests={bests}
          levelClears={levelClears}
          onClearBests={onClearBests}
          onLangChange={(next) => onLangChange?.(next)}
          onClose={() => {
            refreshMark()
            setOpen(false)
          }}
          onAuth={(user) => {
            refreshMark()
            onAuth?.(user)
          }}
        />
      ) : null}
    </>
  )
}
