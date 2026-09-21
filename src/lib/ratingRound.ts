import { FINAL_LIVES, isFinalLevel } from '../data/levels'
import type { RatingBoard } from './leaderboard'
import {
  ASTRO_MODES,
  FOOTBALL_MODES,
  LEADERS_MODES,
  LEVEL_MODES,
  MATH_MODES,
  MAX_LIVES,
  THEME_MODES,
  answerPauseMs,
  campaignLevelCount,
  campaignMaxForWorld,
  campaignModesForWorld,
  hasGeoFinale,
  hasLevels,
  isAstroMode,
  isFootballMode,
  isMathMode,
  isQuizDifficulty,
  isQuizMode,
  isThemeMode,
  levelQuestionCount,
  livesFor,
  questionLimitMs,
  worldOfMode,
  QUIZ_WORLDS,
  type QuizDifficulty,
  type QuizMode,
  type QuizWorld,
  type RoundEnd,
} from './quiz'
import { xpForComplete, xpPerFreePlayCorrect } from './xp'

export const RATING_MIN_MS_PER_QUESTION = 300
export const RATING_ROUND_LIMIT = 20
export const RATING_ROUND_WINDOW_SEC = 10 * 60
export const RATING_DAY_XP_MAX = 100_000
export const RATING_LIVES_MAX = 20

export interface RatedRoundInput {
  path: 'levels' | 'pool'
  mode: QuizMode
  questions: number
  correct: number
  roundMs: number
  level?: number
  hardcore?: boolean
  livesLeft?: number
  livesLimit?: number
  difficulty?: QuizDifficulty
  endedBy?: RoundEnd
}

export interface ScoredRound {
  path: 'levels' | 'pool'
  mode: QuizMode
  world: QuizWorld
  runXp: number
  hardcore: boolean
  level?: number
  livesLeft: number
  roundMs: number
}

export interface ServerRating {
  xp: number
  level: number
  xpByWorld: Record<QuizWorld, number>
  clears: string[]
  xpGain: number
}

export function parseRatedRound(body: unknown): RatedRoundInput | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (record.kind !== 'round' && record.board !== 'round') return null
  const path = record.path
  if (path !== 'levels' && path !== 'pool') return null
  if (typeof record.mode !== 'string' || !isQuizMode(record.mode)) return null
  if (!Number.isInteger(record.questions) || !Number.isInteger(record.correct)) return null
  if (typeof record.roundMs !== 'number' || !Number.isFinite(record.roundMs)) return null
  const questions = record.questions as number
  const correct = record.correct as number
  const roundMs = Math.round(record.roundMs)
  if (questions < 1 || correct < 1 || correct > questions || roundMs < 1) return null
  const input: RatedRoundInput = {
    path,
    mode: record.mode,
    questions,
    correct,
    roundMs,
  }
  if (path === 'levels') {
    if (!Number.isInteger(record.level)) return null
    if (typeof record.hardcore !== 'boolean') return null
    if (!Number.isInteger(record.livesLeft) || !Number.isInteger(record.livesLimit)) return null
    input.level = record.level as number
    input.hardcore = record.hardcore
    input.livesLeft = record.livesLeft as number
    input.livesLimit = record.livesLimit as number
    return input
  }
  if (!isQuizDifficulty(record.difficulty)) return null
  const endedBy = record.endedBy
  if (endedBy !== 'complete' && endedBy !== 'timeout' && endedBy !== 'lives') return null
  input.difficulty = record.difficulty
  input.endedBy = endedBy
  return input
}

export function scoreRatedRound(input: RatedRoundInput): ScoredRound | null {
  if (!timingOk(input)) return null
  if (input.path === 'levels') return scoreLevels(input)
  return scorePool(input)
}

export function applyScoredRound(
  current: {
    xp: number
    xpByWorld: Record<QuizWorld, number>
    levelBestXp: Record<string, number>
    clears: string[]
    ratingDay?: { stamp: string; xp: number }
  },
  scored: ScoredRound,
  wrBonus: number,
  now = Date.now(),
): ServerRating & { levelBestXp: Record<string, number>; ratingDay: { stamp: string; xp: number } } {
  let award = scored.runXp
  const levelBestXp = { ...current.levelBestXp }
  if (scored.path === 'levels' && scored.level !== undefined) {
    const key = `${scored.mode}:${scored.level}`
    const previous = levelBestXp[key] ?? 0
    award = Math.max(0, Math.floor(scored.runXp) - previous)
    levelBestXp[key] = Math.max(previous, Math.floor(scored.runXp))
  }
  award += Math.max(0, Math.floor(wrBonus))
  const stamp = utcDayStamp(now)
  const dayXp = current.ratingDay?.stamp === stamp ? current.ratingDay.xp : 0
  const remaining = Math.max(0, RATING_DAY_XP_MAX - dayXp)
  const xpGain = Math.min(award, remaining)
  const world = scored.world
  const xpByWorld = { ...current.xpByWorld }
  xpByWorld[world] = (xpByWorld[world] ?? 0) + xpGain
  const clears = [...current.clears]
  if (scored.path === 'levels' && scored.level !== undefined) {
    const clearKey = `${scored.mode}:${scored.level}:${scored.hardcore ? '1' : '0'}`
    if (!clears.includes(clearKey)) clears.push(clearKey)
  }
  const xp = current.xp + xpGain
  return {
    xp,
    level: 0,
    xpByWorld,
    clears,
    xpGain,
    levelBestXp,
    ratingDay: { stamp, xp: dayXp + xpGain },
  }
}

export function emptyXpByWorld(): Record<QuizWorld, number> {
  return Object.fromEntries(QUIZ_WORLDS.map((world) => [world, 0])) as Record<QuizWorld, number>
}

export function boardsFromServerRating(rating: ServerRating): Array<{
  board: RatingBoard
  entry: { levelsCleared: number; totalMs: number; xp?: number; level?: number }
}> {
  const items: Array<{
    board: RatingBoard
    entry: { levelsCleared: number; totalMs: number; xp?: number; level?: number }
  }> = []
  if (rating.xp >= 1) {
    items.push({
      board: { kind: 'xp', world: 'all', period: 'all' },
      entry: { levelsCleared: 0, totalMs: 0, xp: rating.xp, level: rating.level },
    })
  }
  for (const world of QUIZ_WORLDS) {
    const amount = Math.max(0, Math.floor(rating.xpByWorld[world] ?? 0))
    if (amount <= 0) continue
    items.push({
      board: { kind: 'xp', world, period: 'all' },
      entry: { levelsCleared: 0, totalMs: 0, xp: amount, level: rating.level },
    })
  }
  for (const hardcore of [false, true]) {
    const geoCleared = uniqueClearCount(rating.clears, hardcore, LEVEL_MODES)
    if (geoCleared > 0) {
      items.push({
        board: { kind: 'clears', hardcore, world: 'geo' },
        entry: { levelsCleared: geoCleared, totalMs: 0 },
      })
    }
    for (const world of QUIZ_WORLDS) {
      if (world === 'geo') continue
      const cleared = uniqueClearCount(rating.clears, hardcore, campaignModesForWorld(world))
      const max = Math.max(1, campaignMaxForWorld(world))
      if (cleared <= 0 || cleared > max) continue
      items.push({
        board: { kind: 'clears', world, hardcore },
        entry: { levelsCleared: cleared, totalMs: 0 },
      })
    }
  }
  const campaignModes = [
    ...LEVEL_MODES,
    ...FOOTBALL_MODES,
    ...LEADERS_MODES,
    ...MATH_MODES,
    ...ASTRO_MODES,
    ...THEME_MODES,
  ]
  for (const mode of campaignModes) {
    for (const hardcore of [false, true]) {
      const levelsCleared = uniqueClearCount(rating.clears, hardcore, [mode])
      const max = Math.max(campaignLevelCount(mode), 1)
      if (levelsCleared <= 0 || levelsCleared > max) continue
      items.push({
        board: { kind: 'mode', mode, hardcore },
        entry: { levelsCleared, totalMs: 0 },
      })
    }
  }
  return items
}

export function uniqueClearCount(
  clears: string[],
  hardcore: boolean,
  modes: readonly QuizMode[],
): number {
  const allow = new Set(modes)
  const seen = new Set<string>()
  for (const key of clears) {
    const parsed = parseClearKey(key)
    if (!parsed || parsed.hardcore !== hardcore || !allow.has(parsed.mode)) continue
    seen.add(`${parsed.mode}:${parsed.level}`)
  }
  return seen.size
}

function scoreLevels(input: RatedRoundInput): ScoredRound | null {
  if (!hasLevels(input.mode)) return null
  const level = input.level ?? 0
  const max = campaignLevelCount(input.mode)
  if (level < 1 || level > max) return null
  const expected = levelQuestionCount(level, input.mode)
  if (expected < 1 || input.questions !== expected) return null
  const hardcore = Boolean(input.hardcore)
  const livesLimit = input.livesLimit ?? 0
  const livesLeft = input.livesLeft ?? 0
  if (!livesOk(input.mode, level, hardcore, livesLimit, livesLeft)) return null
  const runXp = xpForComplete({
    questions: input.questions,
    correct: input.correct,
    roundMs: input.roundMs,
    mode: input.mode,
    path: 'levels',
    difficulty: hardcore ? 'hardcore' : 'hard',
    level,
    hardcore,
    livesLimit,
  })
  if (runXp < 1) return null
  return {
    path: 'levels',
    mode: input.mode,
    world: worldOfMode(input.mode),
    runXp,
    hardcore,
    level,
    livesLeft,
    roundMs: input.roundMs,
  }
}

function scorePool(input: RatedRoundInput): ScoredRound | null {
  if (input.questions > 20) return null
  const difficulty = input.difficulty
  const endedBy = input.endedBy
  if (!difficulty || !endedBy) return null
  const per = xpPerFreePlayCorrect(difficulty, input.mode)
  let xp = input.correct * per
  if (isFootballMode(input.mode) || isMathMode(input.mode) || isAstroMode(input.mode) || isThemeMode(input.mode)) {
    if (endedBy === 'complete') {
      xp += input.questions
      if (input.correct === input.questions) xp += 2 * input.questions
    }
  }
  const runXp = Math.max(0, Math.round(xp))
  if (runXp < 1) return null
  return {
    path: 'pool',
    mode: input.mode,
    world: worldOfMode(input.mode),
    runXp,
    hardcore: difficulty === 'hardcore',
    livesLeft: 0,
    roundMs: input.roundMs,
  }
}

function livesOk(
  mode: QuizMode,
  level: number,
  hardcore: boolean,
  livesLimit: number,
  livesLeft: number,
): boolean {
  if (livesLeft < 1 || livesLeft > livesLimit || livesLimit > RATING_LIVES_MAX) return false
  const expected = livesFor('levels', hardcore ? 'hardcore' : 'hard', hardcore, level, livesLimit, mode)
  if (hardcore) return livesLimit === 1 && expected === 1
  if (isFinalLevel(level) && hasGeoFinale(mode)) {
    return (FINAL_LIVES as readonly number[]).includes(livesLimit) && livesLimit !== 1
  }
  return livesLimit === MAX_LIVES
}

function timingOk(input: RatedRoundInput): boolean {
  const minMs = input.questions * RATING_MIN_MS_PER_QUESTION
  const per = questionLimitMs(input.mode, { path: input.path })
  const maxMs = input.questions * (per + answerPauseMs(input.mode)) + 8_000
  return input.roundMs >= minMs && input.roundMs <= maxMs
}

function utcDayStamp(at: number): string {
  const date = new Date(at)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseClearKey(key: string): { mode: QuizMode; level: number; hardcore: boolean } | null {
  const match = key.match(/^(.+):(\d+):([01])$/)
  if (!match) return null
  const mode = match[1]
  const level = Number(match[2])
  if (!isQuizMode(mode) || !Number.isInteger(level)) return null
  return { mode, level, hardcore: match[3] === '1' }
}
