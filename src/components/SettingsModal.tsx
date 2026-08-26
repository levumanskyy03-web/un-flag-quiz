'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ACHIEVEMENTS, achievementCopy } from '../data/achievements'
import { type AvatarId } from '../data/avatars'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  checkNameAvailable,
  fetchAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
  updateAccountProfile,
  type Account,
  type AuthError,
} from '../lib/account'
import { listAchievements } from '../lib/achievements'
import type { RoundRecord } from '../lib/history'
import type { LevelClear } from '../lib/levelProgress'
import { NAME_MIN, PASSWORD_MIN } from '../lib/leaderboard'
import { isNameAllowed } from '../lib/nameFilter'
import { isNameCooldown } from '../lib/nameRules'
import { statsByMode } from '../lib/modeStats'
import { loadProfile, saveProfile } from '../lib/profile'
import { formatClock, hasLevels } from '../lib/quiz'
import { formatXp, accountProgress } from '../lib/xp'
import { countLifetimeSeed, loadLifetime } from '../lib/lifetime'
import { AvatarMark } from './AvatarMark'
import { AchievementMark } from './AchievementMark'
import { AvatarPicker } from './AvatarPicker'
import { LanguageToggle } from './LanguageToggle'
import { PasswordModal } from './PasswordModal'

const REPORT_EMAIL = 'levumanskyy03@gmail.com'

type Tab = 'account' | 'achievements' | 'about' | 'report'
type AuthTab = 'login' | 'register'

interface SettingsModalProps {
  lang: Lang
  history: RoundRecord[]
  bests: RoundRecord[]
  levelClears: LevelClear[]
  onLangChange: (lang: Lang) => void
  onClose: () => void
  onAuth?: (account: Account | null) => void
}

export function SettingsModal({
  lang,
  history,
  bests,
  levelClears,
  onLangChange,
  onClose,
  onAuth,
}: SettingsModalProps) {
  const t = STRINGS[lang]
  const titleId = useId()
  const [tab, setTab] = useState<Tab>('account')
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [account, setAccount] = useState<Account | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [profile, setProfile] = useState(loadProfile)
  const [name, setName] = useState(loadProfile().name)
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [saved, setSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [nameFree, setNameFree] = useState<boolean | null>(null)
  const [reportTitle, setReportTitle] = useState('')
  const [reportBody, setReportBody] = useState('')
  const [reportOpened, setReportOpened] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [focusAchievement, setFocusAchievement] = useState<(typeof ACHIEVEMENTS)[number]['id'] | null>(null)
  const authBlockRef = useRef<HTMLDivElement>(null)
  const stats = useMemo(() => statsByMode(history, bests, levelClears), [history, bests, levelClears])
  const xp = loadLifetime(countLifetimeSeed(history, levelClears)).xp
  const rank = accountProgress(xp)
  const achievements = useMemo(
    () => listAchievements(history, bests, levelClears, account?.createdAt),
    [history, bests, levelClears, account?.createdAt],
  )
  const unlockedCount = achievements.filter((item) => item.unlocked).length

  useEffect(() => {
    let cancelled = false
    fetchAccount().then(async (user) => {
      if (cancelled) return
      setAccount(user)
      if (user) {
        setName(user.name)
        const local = loadProfile()
        setProfile(local)
        if (local.avatarId && local.avatarId !== user.avatarId) {
          const result = await updateAccountProfile({ avatarId: local.avatarId })
          if (!cancelled && result.ok) {
            setAccount(result.user)
            onAuth?.(result.user)
          }
        }
      }
      if (!cancelled) setAuthReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (pickerOpen) {
        setPickerOpen(false)
        return
      }
      if (passwordOpen) {
        setPasswordOpen(false)
        return
      }
      onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, pickerOpen, passwordOpen])

  useEffect(() => {
    const trimmed = name.trim()
    const current = account?.name ?? profile.name
    if (trimmed.length < NAME_MIN || trimmed === current) {
      setNameFree(null)
      return
    }
    if (!isNameAllowed(trimmed)) {
      setNameFree(null)
      setError('blocked')
      return
    }
    const id = window.setTimeout(() => {
      void checkNameAvailable(trimmed).then((result) => {
        if (!result.ok) {
          if (result.error === 'blocked') setError('blocked')
          return
        }
        setNameFree(result.available)
      })
    }, 350)
    return () => window.clearTimeout(id)
  }, [name, account?.name, profile.name])

  async function pickAvatar(avatarId: AvatarId) {
    const next = saveProfile({
      ...loadProfile(),
      name: name.trim() || loadProfile().name,
      avatarId,
      photo: undefined,
    })
    setProfile(next)
    if (!account) return
    const result = await updateAccountProfile({ avatarId })
    if (result.ok) {
      setAccount(result.user)
      onAuth?.(result.user)
    }
  }

  function savePhoto(photo: string) {
    setProfile(saveProfile({ ...loadProfile(), name: name.trim() || loadProfile().name, photo }))
  }

  async function saveName() {
    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN) {
      setError('invalid')
      return
    }
    if (!isNameAllowed(trimmed)) {
      setError('blocked')
      return
    }
    const current = account?.name ?? profile.name
    const changedAt = account?.nameChangedAt ?? profile.nameChangedAt
    if (trimmed !== current && isNameCooldown(changedAt)) {
      setError('cooldown')
      return
    }
    setBusy(true)
    setError(null)
    setSaved(false)
    if (trimmed !== current) {
      const taken = await checkNameAvailable(trimmed)
      if (taken.ok && !taken.available) {
        setBusy(false)
        setError('taken')
        setNameFree(false)
        return
      }
    }
    if (account) {
      const result = await updateAccountProfile({ name: trimmed })
      setBusy(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setAccount(result.user)
      setName(result.user.name)
      setProfile(loadProfile())
      onAuth?.(result.user)
    } else {
      setProfile(
        saveProfile({
          ...loadProfile(),
          name: trimmed,
          nameChangedAt: trimmed === current ? profile.nameChangedAt : Date.now(),
        }),
      )
      setBusy(false)
    }
    setSaved(true)
    setNameFree(null)
  }

  async function submitAuth() {
    if (busy) return
    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN || password.length < PASSWORD_MIN) {
      setError('invalid')
      return
    }
    if (authTab === 'register' && !isNameAllowed(trimmed)) {
      setError('blocked')
      return
    }
    if (authTab === 'register' && password !== repeat) {
      setError('mismatch')
      return
    }
    setBusy(true)
    setError(null)
    const result =
      authTab === 'register' ? await registerAccount(trimmed, password) : await loginAccount(trimmed, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setAccount(result.user)
    setName(result.user.name)
    setProfile(loadProfile())
    setPassword('')
    setRepeat('')
    onAuth?.(result.user)
  }

  async function signOut() {
    if (busy) return
    setBusy(true)
    setError(null)
    await logoutAccount()
    const still = await fetchAccount()
    setBusy(false)
    if (still) {
      setAccount(still)
      onAuth?.(still)
      setError('offline')
      return
    }
    setAccount(null)
    setAuthTab('login')
    setPassword('')
    setRepeat('')
    setPasswordOpen(false)
    setPasswordSaved(false)
    setProfile(loadProfile())
    onAuth?.(null)
    window.setTimeout(() => {
      authBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  function sendReport() {
    const title = reportTitle.trim() || t.reportDefaultTitle
    const body = reportBody.trim()
    if (!body) return
    const url = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    window.location.href = url
    setReportOpened(true)
  }

  return (
    <div className="passport-overlay" onClick={onClose}>
      <div
        className="passport-sheet account-sheet settings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-sheet-head">
          <h2 id={titleId}>{t.settings}</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </header>

        <div className="choice-grid settings-tabs">
          {(['account', 'achievements', 'about', 'report'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`choice ${tab === item ? 'is-active' : ''}`}
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
            >
              {item === 'account'
                ? t.settingsAccount
                : item === 'achievements'
                  ? t.settingsAchievements
                  : item === 'about'
                    ? t.settingsAbout
                    : t.settingsReport}
            </button>
          ))}
        </div>

        {tab === 'account' ? (
          <div className="settings-pane">
            <div className="settings-profile-row">
              <button
                type="button"
                className="avatar-open"
                onClick={() => setPickerOpen(true)}
                aria-label={t.avatarChange}
              >
                <AvatarMark id={profile.avatarId} photo={profile.photo} size={64} />
              </button>
              <div>
                <p className="account-signed-in">{name.trim() || t.guestName}</p>
                <p className="account-level">{t.accountLevel(rank.level)}</p>
                <p className="profile-xp">
                  {t.xpTotal(formatXp(xp, lang))} · {t.accountLevelNext(formatXp(rank.remain, lang))}
                </p>
                {authReady && !account ? <p className="setting-hint">{t.guestHint}</p> : null}
                <button type="button" className="btn-ghost avatar-change-btn" onClick={() => setPickerOpen(true)}>
                  {t.avatarChange}
                </button>
              </div>
            </div>

            <label className="player-name">
              <span>{t.profileName}</span>
              <input
                type="text"
                name="profile-name"
                maxLength={24}
                autoComplete="nickname"
                placeholder={t.playerNameHint}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setSaved(false)
                  setError(null)
                }}
              />
            </label>
            <p className="setting-hint">{t.nameChangeHint}</p>
            {nameFree === false ? <p className="account-error">{t.authNameTaken}</p> : null}
            {error === 'blocked' ? <p className="account-error">{t.authNameBlocked}</p> : null}
            <button type="button" className="btn-secondary" onClick={() => void saveName()} disabled={busy}>
              {t.saveProfile}
            </button>
            {saved ? <p className="settings-ok">{t.profileSaved}</p> : null}

            <h3 className="settings-sub">{t.profileLanguage}</h3>
            <LanguageToggle lang={lang} onChange={onLangChange} />

            {authReady && account ? (
              <div className="settings-account-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setPasswordSaved(false)
                    setPasswordOpen(true)
                  }}
                  disabled={busy}
                >
                  {t.passwordChange}
                </button>
                {passwordSaved ? <p className="settings-ok">{t.passwordChanged}</p> : null}
                <button type="button" className="btn-secondary" onClick={() => void signOut()} disabled={busy}>
                  {t.signOut}
                </button>
              </div>
            ) : null}
            {authReady && !account ? (
              <div ref={authBlockRef}>
                <h3 className="settings-sub">{t.account}</h3>
                <div className="choice-grid">
                  <button
                    type="button"
                    className={`choice ${authTab === 'login' ? 'is-active' : ''}`}
                    aria-pressed={authTab === 'login'}
                    onClick={() => {
                      setAuthTab('login')
                      setError(null)
                    }}
                  >
                    {t.signIn}
                  </button>
                  <button
                    type="button"
                    className={`choice ${authTab === 'register' ? 'is-active' : ''}`}
                    aria-pressed={authTab === 'register'}
                    onClick={() => {
                      setAuthTab('register')
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
                    void submitAuth()
                  }}
                >
                  <label className="player-name">
                    <span>{t.password}</span>
                    <input
                      type="password"
                      name="password"
                      autoComplete={authTab === 'register' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>
                  {authTab === 'register' ? (
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
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {authTab === 'register' ? t.signUp : t.signIn}
                  </button>
                </form>
              </div>
            ) : null}
            {error && error !== 'blocked' ? <p className="account-error">{authErrorText(error, t)}</p> : null}

            <h3 className="settings-sub">{t.modeStats}</h3>
            <ul className="mode-stats">
              {stats.map((item) => (
                <li key={item.mode}>
                  <p className="mode-stats-name">{modeLabel(item.mode, lang)}</p>
                  {item.best ? (
                    <p>
                      {t.score(item.best.correct, item.best.total)} · {formatClock(item.best.roundMs)}
                    </p>
                  ) : (
                    <p className="setting-hint">{t.modeStatsEmpty}</p>
                  )}
                  <p className="setting-hint">
                    {t.modeStatsRounds(item.rounds)}
                    {hasLevels(item.mode)
                      ? ` · ${t.modeStatsCampaign(item.campaign, item.campaignTotal)}`
                      : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'achievements' ? (
          <div className="settings-pane">
            <p className="setting-hint">
              {t.achievementsUnlocked(unlockedCount, ACHIEVEMENTS.length)}
            </p>
            <div className="achievement-grid">
              {ACHIEVEMENTS.map((info) => {
                const item = achievements.find((entry) => entry.id === info.id)
                const copy = achievementCopy(info.id, lang)
                return (
                  <button
                    key={info.id}
                    type="button"
                    className={`achievement-pick ${item?.unlocked ? 'is-on' : ''} ${focusAchievement === info.id ? 'is-active' : ''}`}
                    aria-pressed={item?.unlocked ?? false}
                    aria-label={copy.title}
                    onClick={() => setFocusAchievement(info.id)}
                  >
                    <AchievementMark id={info.id} />
                  </button>
                )
              })}
            </div>
            {focusAchievement ? (
              <div className="achievement-detail">
                <p className="mode-stats-name">{achievementCopy(focusAchievement, lang).title}</p>
                <p className="setting-hint">{achievementCopy(focusAchievement, lang).hint}</p>
              </div>
            ) : (
              <p className="setting-hint">{t.achievementTap}</p>
            )}
          </div>
        ) : null}

        {tab === 'about' ? (
          <div className="settings-pane settings-copy">
            <p>{t.aboutBody}</p>
            <p>{t.aboutModes}</p>
            <p>{t.credit}</p>
          </div>
        ) : null}

        {tab === 'report' ? (
          <form
            className="settings-pane account-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendReport()
            }}
          >
            <p className="setting-hint">{t.reportHint}</p>
            <label className="player-name">
              <span>{t.reportSubject}</span>
              <input
                type="text"
                value={reportTitle}
                onChange={(event) => setReportTitle(event.target.value)}
                placeholder={t.reportDefaultTitle}
              />
            </label>
            <label className="player-name">
              <span>{t.reportMessage}</span>
              <textarea
                className="settings-report-body"
                rows={5}
                value={reportBody}
                onChange={(event) => {
                  setReportBody(event.target.value)
                  setReportOpened(false)
                }}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={!reportBody.trim()}>
              {t.reportSend}
            </button>
            {reportOpened ? <p className="settings-ok">{t.reportSent}</p> : null}
          </form>
        ) : null}
      </div>
      {passwordOpen ? (
        <PasswordModal
          lang={lang}
          onClose={() => setPasswordOpen(false)}
          onDone={(user) => {
            setAccount(user)
            setPasswordSaved(true)
            onAuth?.(user)
          }}
        />
      ) : null}
      {pickerOpen ? (
        <AvatarPicker
          lang={lang}
          avatarId={profile.avatarId}
          photo={profile.photo}
          onPick={(id) => void pickAvatar(id)}
          onPhoto={savePhoto}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

function authErrorText(error: AuthError, t: (typeof STRINGS)[Lang]) {
  if (error === 'taken') return t.authNameTaken
  if (error === 'blocked') return t.authNameBlocked
  if (error === 'cooldown') return t.authNameCooldown
  if (error === 'auth') return t.authBadCredentials
  if (error === 'offline') return t.authOffline
  if (error === 'mismatch') return t.authPasswordMismatch
  return t.authInvalid
}
