'use client'

import { useEffect, useId, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  fetchAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
  type Account,
  type AuthError,
} from '../lib/account'
import { NAME_MIN, PASSWORD_MIN } from '../lib/leaderboard'

interface AccountButtonProps {
  lang: Lang
  onAuth?: (account: Account | null) => void
}

type Tab = 'login' | 'register'

export function AccountButton({ lang, onAuth }: AccountButtonProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [account, setAccount] = useState<Account | null>(null)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAccount().then((user) => {
      if (cancelled) return
      setAccount(user)
      if (user) setName(user.name)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    setError(null)
    setPassword('')
    setRepeat('')
    setBusy(false)
  }

  async function submit() {
    if (busy) return
    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN) {
      setError('invalid')
      return
    }
    if (password.length < PASSWORD_MIN) {
      setError('invalid')
      return
    }
    if (tab === 'register' && password !== repeat) {
      setError('mismatch')
      return
    }
    setBusy(true)
    setError(null)
    const result = tab === 'register' ? await registerAccount(trimmed, password) : await loginAccount(trimmed, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setAccount(result.user)
    setPassword('')
    setRepeat('')
    setOpen(false)
    onAuth?.(result.user)
  }

  async function signOut() {
    if (busy) return
    setBusy(true)
    await logoutAccount()
    setBusy(false)
    setAccount(null)
    setPassword('')
    setRepeat('')
    setOpen(false)
    onAuth?.(null)
  }

  return (
    <>
      <button type="button" className="account-chip" onClick={() => setOpen(true)} aria-label={t.account}>
        {account ? account.name : t.signIn}
      </button>
      {open ? (
        <div className="passport-overlay" onClick={close}>
          <div
            className="passport-sheet account-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="account-sheet-head">
              <h2 id={titleId}>{t.account}</h2>
              <button type="button" className="btn-ghost" onClick={close}>
                {t.close}
              </button>
            </header>

            {account ? (
              <>
                <p className="account-signed-in">{account.name}</p>
                <p className="setting-hint">{t.accountSignedIn}</p>
                <button type="button" className="btn-secondary" onClick={() => void signOut()} disabled={busy}>
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <div className="choice-grid">
                  <button
                    type="button"
                    className={`choice ${tab === 'login' ? 'is-active' : ''}`}
                    aria-pressed={tab === 'login'}
                    onClick={() => {
                      setTab('login')
                      setError(null)
                    }}
                  >
                    {t.signIn}
                  </button>
                  <button
                    type="button"
                    className={`choice ${tab === 'register' ? 'is-active' : ''}`}
                    aria-pressed={tab === 'register'}
                    onClick={() => {
                      setTab('register')
                      setError(null)
                    }}
                  >
                    {t.signUp}
                  </button>
                </div>
                <form
                  className="account-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void submit()
                  }}
                >
                  <label className="player-name">
                    <span>{t.playerName}</span>
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      maxLength={24}
                      placeholder={t.playerNameHint}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>
                  <label className="player-name">
                    <span>{t.password}</span>
                    <input
                      type="password"
                      name="password"
                      autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>
                  {tab === 'register' ? (
                    <label className="player-name">
                      <span>{t.passwordRepeat}</span>
                      <input
                        type="password"
                        name="password-repeat"
                        autoComplete="new-password"
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                      />
                    </label>
                  ) : null}
                  <p className="setting-hint">{t.passwordHint}</p>
                  {error ? <p className="account-error">{authErrorText(error, t)}</p> : null}
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {tab === 'register' ? t.signUp : t.signIn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

function authErrorText(error: AuthError, t: (typeof STRINGS)[Lang]) {
  if (error === 'taken') return t.authNameTaken
  if (error === 'auth') return t.authBadCredentials
  if (error === 'offline') return t.authOffline
  if (error === 'mismatch') return t.authPasswordMismatch
  return t.authInvalid
}
