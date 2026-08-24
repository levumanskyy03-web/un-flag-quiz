'use client'

import { useEffect, useId, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { updateAccountProfile, type Account, type AuthError } from '../lib/account'
import { PASSWORD_MIN } from '../lib/leaderboard'

type PasswordError = AuthError | 'same'

interface PasswordModalProps {
  lang: Lang
  onClose: () => void
  onDone: (user: Account) => void
}

export function PasswordModal({ lang, onClose, onDone }: PasswordModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRepeat, setNewRepeat] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<PasswordError | null>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  const ready =
    currentPassword.length >= PASSWORD_MIN &&
    newPassword.length >= PASSWORD_MIN &&
    newRepeat.length >= PASSWORD_MIN
  const same = newPassword.length >= PASSWORD_MIN && newPassword === currentPassword
  const mismatch = newRepeat.length > 0 && newRepeat !== newPassword
  const liveError: PasswordError | null = same ? 'same' : mismatch ? 'mismatch' : error

  async function savePassword() {
    if (busy) return
    if (!ready) {
      setError('invalid')
      return
    }
    if (same) {
      setError('same')
      return
    }
    if (newPassword !== newRepeat) {
      setError('mismatch')
      return
    }
    setBusy(true)
    setError(null)
    const result = await updateAccountProfile({ currentPassword, newPassword })
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onDone(result.user)
    onClose()
  }

  return (
    <div
      className="passport-overlay password-overlay"
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
      role="presentation"
    >
      <div
        className="passport-sheet account-sheet password-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-sheet-head">
          <h2 id={titleId}>{t.passwordChange}</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>
        <form
          className="account-form"
          onSubmit={(event) => {
            event.preventDefault()
            void savePassword()
          }}
        >
          <label className="player-name">
            <span>{t.passwordCurrent}</span>
            <input
              type="password"
              name="current-password"
              autoComplete="current-password"
              autoFocus
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value)
                setError(null)
              }}
            />
          </label>
          <label className="player-name">
            <span>{t.passwordNew}</span>
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value)
                setError(null)
              }}
            />
          </label>
          <label className="player-name">
            <span>{t.passwordRepeat}</span>
            <input
              type="password"
              name="new-password-repeat"
              autoComplete="new-password"
              value={newRepeat}
              onChange={(event) => {
                setNewRepeat(event.target.value)
                setError(null)
              }}
            />
          </label>
          <p className="setting-hint">{t.passwordHint}</p>
          {liveError ? <p className="account-error">{passwordErrorText(liveError, t)}</p> : null}
          <button type="submit" className="btn-primary" disabled={busy || !ready || same || mismatch}>
            {t.saveProfile}
          </button>
        </form>
      </div>
    </div>
  )
}

function passwordErrorText(error: PasswordError, t: (typeof STRINGS)[Lang]) {
  if (error === 'same') return t.authPasswordSame
  if (error === 'mismatch') return t.authPasswordMismatch
  if (error === 'auth') return t.authWrongPassword
  if (error === 'offline') return t.authOffline
  return t.authInvalid
}
