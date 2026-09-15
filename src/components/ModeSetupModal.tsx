'use client'

import { useEffect } from 'react'
import type { Region } from '../data/countries'
import type { LeaderKind } from '../data/leaders'
import { REGIONS, STRINGS, modeLabel, regionLabel } from '../i18n/strings'
import {
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  FACTS_DIFFICULTIES,
  HARD_FOOTBALL_MIX_MODES,
  HARD_MIX_MODES,
  LANGUAGE_DIFFICULTIES,
  LEADERS_DIFFICULTIES,
  PLAY_DIFFICULTIES,
  ROUND_SIZES,
  fitRoundSize,
  footballMixPoolSize,
  footballPoolSize,
  getPool,
  getRegionPool,
  isFactsToName,
  isLeadersMode,
  isNameToLanguage,
  isPlayerFactsToName,
  isPlayerPhotoMode,
  isRegionSelected,
  leaderPoolSize,
  leadersAskOf,
  leadersAsksOf,
  leadersModeOf,
  toggleRegion,
  type MixKind,
  type QuizMode,
} from '../lib/quiz'
import {
  difficultyForMode,
  footballFamilyLabel,
  geoFamilyLabel,
  modesOfFootballFamily,
  modesOfGeoFamily,
  type FootballFamilyId,
  type GeoFamilyId,
} from '../lib/modeFamilies'
import { FootballModeGrids } from './FootballModeGrids'
import { CodesModeGrid, GeoModeGrids, RankingModeGrid } from './GeoModeGrids'
import { FitText } from './FitText'
import { ModeChoice } from './ModeChoice'
import { DifficultyPicker } from './DifficultyPicker'
import type { QuizSettings } from './HomeScreen'

export type SetupFamily =
  | { world: 'geo'; id: GeoFamilyId }
  | { world: 'football'; id: FootballFamilyId }
  | { world: 'leaders'; id: LeaderKind }

interface ModeSetupModalProps {
  family: SetupFamily
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  onClose: () => void
}

export function ModeSetupModal({ family, settings, onChange, onStart, onClose }: ModeSetupModalProps) {
  const t = STRINGS[settings.lang]
  const rankingsInfo = family.world === 'geo' && family.id === 'rankings'
  const title =
    family.world === 'geo'
      ? geoFamilyLabel(family.id, settings.lang)
      : family.world === 'football'
        ? footballFamilyLabel(family.id, settings.lang)
        : family.id === 'pope'
          ? t.popesLeaders
          : family.id === 'rus'
            ? t.askoldToUnion
            : family.id === 'uk'
              ? t.ukMonarchs
              : t.usPresidents

  const poolSize = poolOf(family, settings)
  const factsMode = family.world !== 'leaders' && !settings.mix && isFactsToName(settings.mode)
  const languageMode = family.world === 'geo' && !settings.mix && isNameToLanguage(settings.mode)
  const photoMode = family.world === 'football' && !settings.mix && isPlayerPhotoMode(settings.mode)
  const difficulties =
    family.world === 'leaders'
      ? LEADERS_DIFFICULTIES
      : languageMode
        ? LANGUAGE_DIFFICULTIES
        : factsMode || (family.world === 'football' && isPlayerFactsToName(settings.mode) && !settings.mix)
          ? FACTS_DIFFICULTIES
          : photoMode
            ? LEADERS_DIFFICULTIES
            : PLAY_DIFFICULTIES

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  function update(patch: Partial<QuizSettings>) {
    const next = { ...settings, ...patch }
    const nextPool = poolOf(family, next)
    onChange({ ...next, roundSize: fitRoundSize(next.roundSize, nextPool) })
  }

  function pickMode(mode: QuizMode) {
    update({
      path: 'pool',
      mix: null,
      mode,
      difficulty: difficultyForMode(mode, settings.difficulty),
      levelHardcore: settings.levelHardcore || settings.difficulty === 'hardcore',
    })
  }

  function pickMix(kind: MixKind) {
    const fallback = family.world === 'football' ? 'wcWinners' : 'flagToName'
    if (kind === 'custom') {
      const seed =
        settings.mix === 'custom' && settings.mixModes.length > 0
          ? settings.mixModes
          : family.world === 'football'
            ? [...EASY_FOOTBALL_MIX_MODES]
            : [...EASY_MIX_MODES]
      update({ path: 'pool', mix: 'custom', mixModes: seed, mode: seed[0] ?? fallback })
      return
    }
    const mixModes = family.world === 'football'
      ? kind === 'easy'
        ? [...EASY_FOOTBALL_MIX_MODES]
        : [...HARD_FOOTBALL_MIX_MODES]
      : kind === 'easy'
        ? [...EASY_MIX_MODES]
        : [...HARD_MIX_MODES]
    update({ path: 'pool', mix: kind, mixModes, mode: fallback })
  }

  function toggleMixMode(mode: QuizMode) {
    if (isFactsToName(mode) || isPlayerFactsToName(mode)) return
    const selected = settings.mixModes
    const mixModes = selected.includes(mode) ? selected.filter((item) => item !== mode) : [...selected, mode]
    update({
      path: 'pool',
      mix: 'custom',
      mixModes,
      mode: mixModes[0] ?? (family.world === 'football' ? 'wcWinners' : 'flagToName'),
    })
  }

  const variants =
    family.world === 'geo'
      ? modesOfGeoFamily(family.id)
      : family.world === 'football'
        ? modesOfFootballFamily(family.id)
        : []

  return (
    <div className="passport-overlay mode-setup-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet duel-setup-sheet mode-setup-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mode-setup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        <h2 id="mode-setup-title" className="passport-title">
          {title}
        </h2>
        <p className="duel-setup-hint">{rankingsInfo ? t.rankingSetup : t.modeSetup}</p>

        {family.world !== 'leaders' && family.id === 'mix' ? (
          <>
            <div className="choice-grid">
              <MixPreset
                active={settings.mix === 'easy'}
                title={t.easyMix}
                note={family.world === 'football' ? t.footballEasyMixNote : t.easyMixNote}
                onClick={() => pickMix('easy')}
              />
              <MixPreset
                active={settings.mix === 'hard'}
                title={t.hardMix}
                note={family.world === 'football' ? t.footballHardMixNote : t.hardMixNote}
                onClick={() => pickMix('hard')}
              />
              <MixPreset
                active={settings.mix === 'custom'}
                title={t.customMix}
                note={t.customMixNote}
                onClick={() => pickMix('custom')}
              />
            </div>
            {settings.mix === 'custom' ? (
              <>
                <p className="setting-hint">{t.mixPickModes}</p>
                {family.world === 'geo' ? (
                  <GeoModeGrids
                    lang={settings.lang}
                    activeMode={settings.mode}
                    selectedModes={settings.mixModes}
                    hideModes={['factsToName']}
                    showRankings={false}
                    onPick={toggleMixMode}
                  />
                ) : (
                  <FootballModeGrids
                    lang={settings.lang}
                    activeMode={settings.mode}
                    selectedModes={settings.mixModes}
                    hideModes={['playerFactsToName']}
                    onPick={toggleMixMode}
                  />
                )}
              </>
            ) : null}
          </>
        ) : null}

        {family.world === 'geo' && family.id === 'codes' ? (
          <CodesModeGrid
            lang={settings.lang}
            activeMode={settings.mode}
            mix={Boolean(settings.mix)}
            hideHeading
            onPick={pickMode}
          />
        ) : null}

        {rankingsInfo ? (
          <RankingModeGrid
            lang={settings.lang}
            activeMode={settings.mode}
            mix={false}
            hideHeading
            onPick={() => {}}
          />
        ) : null}

        {variants.length > 1 && family.world !== 'leaders' && family.id !== 'codes' && family.id !== 'rankings' ? (
          <div className="choice-grid is-modes">
            {variants.map((mode) => (
              <ModeChoice
                key={mode}
                label={modeLabel(mode, settings.lang)}
                active={!settings.mix && settings.mode === mode}
                onClick={() => pickMode(mode)}
              />
            ))}
          </div>
        ) : null}

        {family.world === 'leaders' ? (
          <div className={`choice-grid${leadersAsksOf(family.id).length === 3 ? ' is-3' : ''}`}>
            {leadersAsksOf(family.id).map((item) => {
              const askMode = leadersModeOf(family.id, item)
              const label = item === 'photo' ? t.leaderAskPhoto : item === 'number' ? t.leaderAskNumber : t.leaderAskYears
              return (
                <ModeChoice
                  key={item}
                  label={label}
                  active={leadersAskOf(settings.mode) === item}
                  onClick={() => pickMode(askMode)}
                />
              )
            })}
          </div>
        ) : null}

        {family.world === 'geo' && !rankingsInfo ? (
          <>
            <h2>{t.region}</h2>
            <div className="choice-wrap region-chips">
              {(['all', ...REGIONS] as Array<Region | 'all'>).map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`chip region-chip${region === 'all' ? ' region-all' : ''}${
                    isRegionSelected(settings.region, region) ? ' is-active' : ''
                  }`}
                  aria-pressed={isRegionSelected(settings.region, region)}
                  onClick={() => update({ path: 'pool', region: toggleRegion(settings.region, region) })}
                >
                  {region === 'all' ? <span className="region-dot" aria-hidden /> : null}
                  {regionLabel(region, settings.lang)}
                </button>
              ))}
            </div>
            <div className="choice-wrap extras-toggle-row">
              <button
                type="button"
                className={`extras-toggle ${settings.includeExtras ? 'is-active' : ''}`}
                aria-pressed={settings.includeExtras}
                onClick={() => update({ includeExtras: !settings.includeExtras })}
              >
                <span className="region-dot" aria-hidden />
                {t.includeExtras}
              </button>
            </div>
            <p className="setting-hint extras-hint">{t.includeExtrasHint}</p>
          </>
        ) : null}

        {rankingsInfo ? null : (
          <>
            <DifficultyPicker
              lang={settings.lang}
              difficulties={difficulties}
              difficulty={settings.difficulty}
              hardcore={settings.levelHardcore}
              onChange={({ difficulty, hardcore }) => update({ path: 'pool', difficulty, levelHardcore: hardcore })}
            />

            {family.world === 'football' && isPlayerFactsToName(settings.mode) && !settings.mix ? (
              <p className="setting-hint">{t.playerFactsHint}</p>
            ) : null}

            {family.world === 'football' && family.id === 'players' && !settings.mix ? (
              <p className="setting-hint">{t.playerClubNote}</p>
            ) : null}

            {factsMode ? null : (
              <>
                <h2>{family.world === 'football' ? t.footballRoundSize : t.roundSize}</h2>
                <div className="choice-grid is-3">
                  {ROUND_SIZES.map((roundSize) => (
                    <button
                      key={roundSize}
                      type="button"
                      className={`choice ${settings.roundSize === roundSize ? 'is-active' : ''}`}
                      aria-pressed={settings.roundSize === roundSize}
                      disabled={poolSize > 0 && roundSize > poolSize}
                      onClick={() => update({ path: 'pool', roundSize })}
                    >
                      {roundSize}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button type="button" className="btn-primary" disabled={poolSize === 0} onClick={onStart}>
              {t.start}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function MixPreset({
  active,
  title,
  note,
  onClick,
}: {
  active: boolean
  title: string
  note: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`choice has-note is-wide ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <FitText minPx={9}>{title}</FitText>
      <FitText className="choice-note" wrap minPx={7}>
        {note}
      </FitText>
    </button>
  )
}

function poolOf(family: SetupFamily, settings: QuizSettings): number {
  if (family.world === 'football') {
    return settings.mix
      ? footballMixPoolSize(settings.mix, settings.difficulty, settings.mixModes)
      : footballPoolSize(settings.mode, settings.difficulty)
  }
  if (family.world === 'leaders') {
    return isLeadersMode(settings.mode) ? leaderPoolSize(settings.mode, settings.difficulty) : 0
  }
  if (settings.mix === 'custom' && settings.mixModes.length === 0) return 0
  return settings.mix
    ? getRegionPool(settings.region, settings.includeExtras).length
    : getPool(settings.region, settings.difficulty, settings.mode, settings.includeExtras).length
}
