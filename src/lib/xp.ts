import { LEVEL_COUNT } from '../data/levels'
import { localeTag, type Lang } from '../i18n/lang'
import type { LevelClear } from './levelProgress'
import {
  getLevelPool,
  hasLevels,
  questionLimitMs,
  type PlayPath,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
  type RoundAnswer,
  isCorrect,
} from './quiz'

export interface XpRound {
  questions: number
  correct: number
  roundMs: number
  mode: QuizMode
  path: PlayPath
  difficulty: QuizDifficulty
  level?: number
  hardcore?: boolean
  livesLimit?: number
  region?: RegionFilter
}

export interface AccountProgress {
  level: number
  xp: number
  nextAt: number
  remain: number
  into: number
  span: number
  ratio: number
}

export const XP_PER_QUESTION = 10
export const WORLD_RECORD_XP = 100
const ACCURACY_EXP = 1.5
const SPEED_MIN = 0.7
const SPEED_MAX = 1.4
const PAR_OF_LIMIT = 0.45
const HARDCORE_PRESSURE = 3
const MODE_BONUS = 1.1
const LEVEL_CURVE = 60
const BONUS_MODES = new Set<QuizMode>([
  'nameToPopulation',
  'nameToFounded',
  'nameToMap',
  'mapToName',
  'neighborsToName',
])

export function xpForComplete(round: XpRound): number {
  if (round.path !== 'levels' || round.questions <= 0 || round.correct <= 0) return 0
  const accuracy = accuracyFactor(round.correct, round.questions)
  const speed = speedFactor(round)
  const difficulty = difficultyFactor(round)
  const mode = BONUS_MODES.has(round.mode) ? MODE_BONUS : 1
  return Math.max(1, Math.round(XP_PER_QUESTION * round.questions * difficulty * accuracy * speed * mode))
}

export function xpForAnswers(
  answers: RoundAnswer[],
  roundMs: number,
  ctx: Omit<XpRound, 'questions' | 'correct' | 'roundMs'>,
): number {
  return xpForComplete({
    ...ctx,
    questions: answers.length,
    correct: answers.filter(isCorrect).length,
    roundMs,
  })
}

export function xpPerFreePlayCorrect(difficulty: QuizDifficulty, mode: QuizMode): number {
  const base = difficulty === 'hardcore' ? 10 : difficulty === 'hard' ? 5 : 2
  return hasLevels(mode) ? base : base * 10
}

export function xpForFreePlay(
  answers: RoundAnswer[],
  difficulty: QuizDifficulty,
  mode: QuizMode,
): number {
  return answers.filter(isCorrect).length * xpPerFreePlayCorrect(difficulty, mode)
}

export function clearBestXp(clear: LevelClear): number {
  const computed = xpFromClear(clear)
  const stored =
    typeof clear.xp === 'number' && Number.isFinite(clear.xp) && clear.xp >= 0 ? Math.floor(clear.xp) : 0
  return Math.max(computed, stored)
}

export function campaignXpDelta(
  runXp: number,
  previous?: LevelClear | null,
): { award: number; bestXp: number } {
  const scored = Math.max(0, Math.floor(runXp))
  const previousBest = previous ? clearBestXp(previous) : 0
  const bestXp = Math.max(previousBest, scored)
  return { award: Math.max(0, scored - previousBest), bestXp }
}

export function xpFromClear(clear: LevelClear): number {
  const questions = getLevelPool(clear.level, clear.mode).length
  const livesLimit = clear.livesLimit && clear.livesLimit > 0 ? clear.livesLimit : clear.hardcore ? 1 : 3
  const mistakes = Math.max(0, livesLimit - clear.livesLeft)
  return xpForComplete({
    questions,
    correct: Math.max(0, questions - mistakes),
    roundMs: clear.roundMs,
    mode: clear.mode,
    path: 'levels',
    difficulty: clear.hardcore ? 'hardcore' : 'hard',
    level: clear.level,
    hardcore: clear.hardcore,
    livesLimit,
  })
}

export function formatXp(n: number, lang: Lang): string {
  return new Intl.NumberFormat(localeTag(lang)).format(Math.max(0, Math.floor(n)))
}

export function xpForAccountLevel(level: number): number {
  if (level <= 1) return 0
  return LEVEL_CURVE * level * (level - 1)
}

export function accountLevel(xp: number): number {
  const safe = Math.max(0, Math.floor(xp))
  const raw = (1 + Math.sqrt(1 + safe / (LEVEL_CURVE / 4))) / 2
  let level = Math.max(1, Math.floor(raw + 1e-9))
  while (xpForAccountLevel(level + 1) <= safe) level += 1
  while (level > 1 && xpForAccountLevel(level) > safe) level -= 1
  return level
}

export function accountProgress(xp: number): AccountProgress {
  const safe = Math.max(0, Math.floor(xp))
  const level = accountLevel(safe)
  const currentAt = xpForAccountLevel(level)
  const nextAt = xpForAccountLevel(level + 1)
  const span = Math.max(1, nextAt - currentAt)
  const into = Math.max(0, safe - currentAt)
  return {
    level,
    xp: safe,
    nextAt,
    remain: Math.max(0, nextAt - safe),
    into,
    span,
    ratio: Math.min(1, into / span),
  }
}

function accuracyFactor(correct: number, questions: number): number {
  return Math.pow(Math.min(1, correct / questions), ACCURACY_EXP)
}

function speedFactor(round: XpRound): number {
  const parMs = round.questions * questionLimitMs(round.mode, { region: round.region, path: round.path }) * PAR_OF_LIMIT
  if (round.roundMs <= 0 || parMs <= 0) return 1
  return clamp(parMs / round.roundMs, SPEED_MIN, SPEED_MAX)
}

function difficultyFactor(round: XpRound): number {
  const level = clamp(round.level ?? 1, 1, LEVEL_COUNT)
  const stage = 1 + (level - 1) / (LEVEL_COUNT - 1)
  const lives = round.livesLimit && round.livesLimit > 0 ? round.livesLimit : round.hardcore ? 1 : 3
  const pressure = round.hardcore || lives <= 1 ? HARDCORE_PRESSURE : livesPressure(lives)
  return stage * pressure
}

function livesPressure(lives: number): number {
  if (lives <= 3) return 1.45
  if (lives <= 10) return 1.2
  return 1
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export type LevelMetal = 'gray' | 'bronze' | 'silver' | 'gold'

export interface AccountLevelMark {
  metal: LevelMetal
  fill: [string, string, string]
  edge: [string, string]
  sheen: string
  ink: string
  shade: string
  scale: number
}

interface MetalStops {
  top: string
  mid: string
  bot: string
  edgeLight: string
  edgeDark: string
  sheen: string
  ink: string
  shade: string
}

const BRONZE_LO: MetalStops = {
  top: '#d2b08a',
  mid: '#b07a48',
  bot: '#8a5028',
  edgeLight: '#ebd2b4',
  edgeDark: '#6e3e1c',
  sheen: '#f4e2cc',
  ink: '#fff8ee',
  shade: '#6e3e1c',
}

const BRONZE_HI: MetalStops = {
  top: '#f0b45a',
  mid: '#d07a28',
  bot: '#9a4a0e',
  edgeLight: '#ffe0a0',
  edgeDark: '#7a3208',
  sheen: '#ffe9b8',
  ink: '#fff8e8',
  shade: '#7a3208',
}

const SILVER_LO: MetalStops = {
  top: '#c5ccd3',
  mid: '#9aa3ad',
  bot: '#6f7882',
  edgeLight: '#e4e8ec',
  edgeDark: '#555e68',
  sheen: '#f4f6f8',
  ink: '#1c242c',
  shade: '#4a545e',
}

const SILVER_HI: MetalStops = {
  top: '#f4f7fb',
  mid: '#c8d2dc',
  bot: '#8a96a4',
  edgeLight: '#ffffff',
  edgeDark: '#5c6773',
  sheen: '#ffffff',
  ink: '#1a222c',
  shade: '#5c6773',
}

const GOLD_LO: MetalStops = {
  top: '#d8c36a',
  mid: '#b8942e',
  bot: '#8a6a12',
  edgeLight: '#efe3a4',
  edgeDark: '#6f5510',
  sheen: '#f6e7b0',
  ink: '#fff8e4',
  shade: '#6f5510',
}

const GOLD_HI: MetalStops = {
  top: '#ffe566',
  mid: '#f5c431',
  bot: '#c98412',
  edgeLight: '#fff3a8',
  edgeDark: '#7a4a08',
  sheen: '#fff6c4',
  ink: '#fffef2',
  shade: '#8a4e08',
}

export function accountLevelMark(level: number): AccountLevelMark {
  const n = Math.max(1, Math.floor(level))
  const scale = n < 40 ? 1 : Math.min(1.4, 1 + (n - 39) * 0.018)

  if (n <= 1) {
    return packMark('gray', scale, {
      top: '#d5dbe2',
      mid: '#b4bcc6',
      bot: '#8c95a0',
      edgeLight: '#eef1f4',
      edgeDark: '#6b7380',
      sheen: '#ffffff',
      ink: '#2f3640',
      shade: '#5c6570',
    })
  }
  if (n <= 10) return packMark('bronze', scale, mixStops(BRONZE_LO, BRONZE_HI, (n - 2) / 8))
  if (n <= 29) return packMark('silver', scale, mixStops(SILVER_LO, SILVER_HI, (n - 11) / 18))
  return packMark('gold', scale, mixStops(GOLD_LO, GOLD_HI, 1 - 0.9 ** (n - 30)))
}

function packMark(metal: LevelMetal, scale: number, stops: MetalStops): AccountLevelMark {
  return {
    metal,
    fill: [stops.top, stops.mid, stops.bot],
    edge: [stops.edgeLight, stops.edgeDark],
    sheen: stops.sheen,
    ink: stops.ink,
    shade: stops.shade,
    scale,
  }
}

function mixStops(a: MetalStops, b: MetalStops, t: number): MetalStops {
  const k = clamp(t, 0, 1)
  return {
    top: mixHex(a.top, b.top, k),
    mid: mixHex(a.mid, b.mid, k),
    bot: mixHex(a.bot, b.bot, k),
    edgeLight: mixHex(a.edgeLight, b.edgeLight, k),
    edgeDark: mixHex(a.edgeDark, b.edgeDark, k),
    sheen: mixHex(a.sheen, b.sheen, k),
    ink: mixHex(a.ink, b.ink, k),
    shade: mixHex(a.shade, b.shade, k),
  }
}

function mixHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return `rgb(${Math.round(lerp(a[0], b[0], t))} ${Math.round(lerp(a[1], b[1], t))} ${Math.round(lerp(a[2], b[2], t))})`
}

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace('#', '')
  return [Number.parseInt(n.slice(0, 2), 16), Number.parseInt(n.slice(2, 4), 16), Number.parseInt(n.slice(4, 6), 16)]
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
