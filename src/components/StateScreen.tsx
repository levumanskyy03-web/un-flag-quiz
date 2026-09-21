'use client'

import { useEffect, useMemo, useState } from 'react'
import { COUNTRIES } from '../data/countries'
import {
  STATE_MINISTRY_MAX,
  stateConvertCap,
  stateIdleCap,
  stateMinistryCost,
  stateServantCap,
  stateStampTokens,
  type StateMinistry,
} from '../data/state'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import {
  hireServant,
  convertStampToTreasury,
  stateServantRate,
  upgradeMinistry,
  useRealm,
} from '../lib/stateStore'
import {
  checkNameAvailable,
  fetchAccount,
  updateAccountProfile,
  type Account,
  type AuthError,
} from '../lib/account'
import { NAME_MIN } from '../lib/leaderboard'
import { isNameAllowed } from '../lib/nameFilter'
import { isNameCooldown } from '../lib/nameRules'
import { loadProfile, saveProfile } from '../lib/profile'
import { stampCopies, useStamps } from '../lib/stamps'
import { useTokens } from '../lib/tokenStore'
import { useCompany } from './CompanyScreen'
import { Flag } from './Flag'
import { GeoIcon } from './GeoIcon'

export function StateScreen({
  lang,
  onWorlds,
  onPlay,
}: {
  lang: Lang
  onWorlds: () => void
  onPlay: () => void
}) {
  const t = STRINGS[lang]
  const realm = useRealm()
  const tokens = useTokens()
  const company = useCompany()
  const stamps = useStamps()
  const [account, setAccount] = useState<Account | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [nameDraft, setNameDraft] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameBusy, setNameBusy] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [nameError, setNameError] = useState<AuthError | 'short' | null>(null)
  const extras = useMemo(
    () => COUNTRIES.filter((country) => stampCopies(stamps, country.iso) >= 2).slice(0, 8),
    [stamps],
  )
  const convertCap = stateConvertCap(realm.ministries.administration)
  const idleCap = stateIdleCap(realm.ministries.administration)
  const servantCap = stateServantCap(realm.ministries.administration)
  const stampTokens = stateStampTokens(realm.ministries.trade)
  const convertLeft = convertCap - realm.convertToday
  const rate = stateServantRate(realm)
  const canConvert = convertLeft > 0 && extras.length > 0
  const canHire = realm.servants < servantCap && canConvert

  useEffect(() => {
    let cancelled = false
    fetchAccount().then((user) => {
      if (cancelled) return
      const nextName = user?.name || loadProfile().name
      setAccount(user)
      setPlayerName(nextName)
      setNameDraft(nextName)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function nameErrorText(error: AuthError | 'short') {
    if (error === 'short') return t.playerNameShort
    if (error === 'taken') return t.authNameTaken
    if (error === 'blocked') return t.authNameBlocked
    if (error === 'cooldown') return t.authNameCooldown
    if (error === 'offline') return t.authOffline
    return t.authInvalid
  }

  async function savePlayerNickname() {
    const next = nameDraft.trim()
    if (next.length < NAME_MIN) {
      setNameError('short')
      return
    }
    if (!isNameAllowed(next)) {
      setNameError('blocked')
      return
    }
    const local = loadProfile()
    const current = account?.name ?? local.name
    const changedAt = account?.nameChangedAt ?? local.nameChangedAt
    if (next !== current && isNameCooldown(changedAt)) {
      setNameError('cooldown')
      return
    }

    setNameBusy(true)
    setNameError(null)
    setNameSaved(false)
    if (account && next !== current) {
      const available = await checkNameAvailable(next)
      if (available.ok && !available.available) {
        setNameBusy(false)
        setNameError('taken')
        return
      }
      const result = await updateAccountProfile({ name: next })
      setNameBusy(false)
      if (!result.ok) {
        setNameError(result.error)
        return
      }
      setAccount(result.user)
      setPlayerName(result.user.name)
      setNameDraft(result.user.name)
    } else {
      saveProfile({
        ...local,
        name: next,
        nameChangedAt: next === current ? local.nameChangedAt : Date.now(),
      })
      setNameBusy(false)
      setPlayerName(next)
    }
    setNameSaved(true)
    setEditingName(false)
  }

  function ministryCard(kind: StateMinistry, title: string, hint: string) {
    const level = realm.ministries[kind]
    const maxed = level >= STATE_MINISTRY_MAX
    const price = maxed ? 0 : stateMinistryCost(kind, level)
    const can = !maxed && (kind === 'education' ? company.knowledge >= price : tokens.balance >= price)
    const icon =
      kind === 'education'
        ? 'meridians'
        : kind === 'infra'
          ? 'hq'
          : kind === 'foreign'
            ? 'laurel'
            : kind === 'economy'
              ? 'pin'
              : kind === 'trade'
                ? 'stamp'
                : 'map'
    return (
      <button
        key={kind}
        type="button"
        className={`state-building is-${kind}`}
        disabled={!can}
        onClick={() => upgradeMinistry(kind)}
      >
        <span className="state-building-art" aria-hidden="true">
          <GeoIcon name={icon} size={28} />
          <span className="state-building-roof" />
        </span>
        <span className="state-building-copy">
          <strong>{title}</strong>
          <span className="state-level-pips" aria-label={t.stateMinistryLevel(level)}>
            {Array.from({ length: STATE_MINISTRY_MAX }, (_, index) => (
              <i key={index} className={index < level ? 'is-on' : ''} />
            ))}
          </span>
          <small>{hint}</small>
          <span className="state-building-action">
            {maxed ? t.stateMaxLevel : `${t.stateUpgrade} · ${price}`}
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className="screen state-screen">
      <section className="state-game-shell">
        <header className="state-command-bar">
          <button type="button" className="state-back-button" aria-label={t.worldsBack} onClick={onWorlds}>
            <span aria-hidden="true">←</span>
          </button>
          <div className="state-identity">
            <span className="state-emblem" aria-hidden="true">
              <GeoIcon name="map" size={26} />
            </span>
            <div>
              <span className="state-kicker">{t.state}</span>
              <h1>{realm.name || t.state}</h1>
              <button
                type="button"
                className="state-player-name"
                aria-label={t.profileName}
                onClick={() => {
                  setNameSaved(false)
                  setEditingName(true)
                }}
              >
                {playerName || t.playerNameHint}
                <span aria-hidden="true">✎</span>
              </button>
            </div>
          </div>
          <div className="state-resource-row">
            <span className="state-resource">
              <GeoIcon name="pin" size={17} />
              <span>{t.stateTreasury}</span>
              <strong>{tokens.balance}</strong>
            </span>
            <span className="state-resource">
              <GeoIcon name="meridians" size={17} />
              <span>{t.companyKnowledge}</span>
              <strong>{Math.floor(company.knowledge).toLocaleString(lang)}</strong>
            </span>
            <span className="state-resource">
              <GeoIcon name="hq" size={17} />
              <span>{t.stateServants(realm.servants)}</span>
              <strong>{rate.toFixed(3)}/с</strong>
            </span>
          </div>
        </header>

        {editingName ? (
          <form
            className="state-name-editor"
            onSubmit={(event) => {
              event.preventDefault()
              void savePlayerNickname()
            }}
          >
            <label>
              <span>{t.profileName}</span>
              <input
                autoFocus
                type="text"
                maxLength={24}
                autoComplete="nickname"
                value={nameDraft}
                placeholder={t.playerNameHint}
                onChange={(event) => {
                  setNameDraft(event.target.value)
                  setNameError(null)
                }}
              />
            </label>
            <button type="submit" className="btn-primary" disabled={nameBusy}>
              {t.saveProfile}
            </button>
          </form>
        ) : null}
        {nameError ? <p className="account-error state-name-note">{nameErrorText(nameError)}</p> : null}
        {nameSaved ? <p className="settings-ok state-name-note">{t.profileSaved}</p> : null}

        <section className="state-board">
          <span className="state-cloud is-one" aria-hidden="true" />
          <span className="state-cloud is-two" aria-hidden="true" />
          <div className="state-territory" aria-hidden="true">
            <span className="state-land">
              <i className="state-capital" />
              <i className="state-town is-one" />
              <i className="state-town is-two" />
              <i className="state-road is-one" />
              <i className="state-road is-two" />
            </span>
            <span className="state-tree is-one">♠</span>
            <span className="state-tree is-two">♠</span>
            <span className="state-tree is-three">♠</span>
          </div>
          <p className="state-idle-cap">{t.stateIdleCap(realm.idleToday, idleCap)}</p>
          <button type="button" className="btn-primary state-play-button" onClick={onPlay}>
            <GeoIcon name="compass" size={20} />
            {t.statePlay}
          </button>
        </section>

        <section className="state-ministry-zone">
          {ministryCard('education', t.stateEducation, t.stateEducationHint)}
          {ministryCard('infra', t.stateInfra, t.stateInfraHint)}
          {ministryCard('foreign', t.stateForeign, t.stateForeignHint)}
          {ministryCard('economy', t.stateEconomy, t.stateEconomyHint)}
          {ministryCard('trade', t.stateTrade, t.stateTradeHint)}
          {ministryCard('administration', t.stateAdministration, t.stateAdministrationHint)}
        </section>

        <section className="state-cadres-zone">
          <div className="state-zone-heading">
            <div>
              <span className="state-zone-icon" aria-hidden="true"><GeoIcon name="stamp" size={22} /></span>
              <h2>{t.stateCadres}</h2>
            </div>
            <p>
              {t.stateServantRate(rate.toFixed(3))}
              {' · '}
              {t.stateConvertLeft(realm.convertToday, convertCap)}
            </p>
          </div>
          <p className="state-stamp-how">{t.stateStampHow}</p>
          {extras.length === 0 ? (
            <p className="state-empty-message">{t.stateStampNeed}</p>
          ) : (
            <div className="state-market-grid">
              {extras.map((country) => (
                <article key={country.iso} className="state-market-card">
                  <Flag iso={country.iso} name={countryName(country, lang)} size="thumb" />
                  <strong>{countryName(country, lang)}</strong>
                  <button type="button" disabled={!canConvert} onClick={() => convertStampToTreasury(country.iso)}>
                    {t.stateSellStamp} · {stampTokens}
                  </button>
                  <button type="button" disabled={!canHire} onClick={() => hireServant(country.iso)}>
                    {realm.servants >= servantCap ? t.stateMaxServants : t.stateHire}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  )
}
