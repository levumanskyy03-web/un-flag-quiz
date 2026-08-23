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

interface SettingsButtonProps {
  lang: Lang
  history?: RoundRecord[]
  bests?: RoundRecord[]
  levelClears?: LevelClear[]
  onLangChange?: (lang: Lang) => void
  onAuth?: (account: Account | null) => void
}

export function SettingsButton({
  lang,
  history = [],
  bests = [],
  levelClears = [],
  onLangChange,
  onAuth,
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
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.5 1.5h3l.4 1.6 1.5.6 1.4-1 2.1 2.1-1 1.4.6 1.5 1.6.4v3l-1.6.4-.6 1.5 1 1.4-2.1 2.1-1.4-1-1.5.6-.4 1.6h-3l-.4-1.6-1.5-.6-1.4 1-2.1-2.1 1-1.4L1.5 9.9 0 9.5v-3l1.6-.4.6-1.5-1-1.4L3.3 1.1l1.4 1 .5-.6L6.5 1.5z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </button>
      {open ? (
        <SettingsModal
          lang={lang}
          history={history}
          bests={bests}
          levelClears={levelClears}
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
