'use client'

import { useEffect, useId, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { deleteAccount, type AuthError } from '../lib/account'
import { PASSWORD_MIN } from '../lib/leaderboard'

interface DeleteAccountModalProps {
  lang: Lang
  onClose: () => void
  onDeleted: () => void
}

export function DeleteAccountModal({ lang, onClose, onDeleted }: DeleteAccountModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const ready = password.length >= PASSWORD_MIN

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  async function confirmDelete() {
    if (busy) return
    if (!ready) {
      setError('invalid')
      return
    }
    setBusy(true)
    setError(null)
    const result = await deleteAccount(password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onDeleted()
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
          <h2 id={titleId}>{t.deleteAccount}</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>
        <form
          className="account-form"
          onSubmit={(event) => {
            event.preventDefault()
            void confirmDelete()
          }}
        >
          <p className="setting-hint">{t.deleteAccountHint}</p>
          <label className="player-name">
            <span>{t.passwordCurrent}</span>
            <input
              type="password"
              name="delete-password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError(null)
              }}
            />
          </label>
          <p className="setting-hint">{t.deleteAccountConfirm}</p>
          {error ? <p className="account-error">{deleteErrorText(error, t)}</p> : null}
          <button type="submit" className="btn-sign-out" disabled={busy || !ready}>
            {t.deleteAccount}
          </button>
        </form>
      </div>
    </div>
  )
}

function deleteErrorText(error: AuthError, t: (typeof STRINGS)[Lang]) {
  if (error === 'auth') return t.authWrongPassword
  if (error === 'offline') return t.authOffline
  if (error === 'limited') return t.authTooMany
  return t.authInvalid
}
