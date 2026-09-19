import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'

export const COMPANY_STAGE_COUNT = 80
export const COMPANY_BASE_RATE = 8 / 60
export const COMPANY_OFFLINE_FACTOR = 0.4
export const COMPANY_DEFAULT_CAP_MS = 2 * 60 * 60 * 1000
export const COMPANY_HQ_COST = 150
export const COMPANY_SPARK_LIFE_MS = 14_000
export const COMPANY_BUFF_MS = 90_000
export const COMPANY_ROUND_KNOWLEDGE = 12

export type CompanyTaskKind = 'focus' | 'sparks' | 'rounds' | 'worldRounds' | 'completes' | 'buyHq'

export type CompanyTask = {
  kind: CompanyTaskKind
  n: number
  world?: QuizWorld
}

export type CompanyReward = {
  knowledge: number
  ratePct: number
  capMs: number
}

export type CompanyStage = {
  level: number
  tasks: readonly [CompanyTask, CompanyTask, CompanyTask]
  reward: CompanyReward
}

function rotate<T>(items: readonly T[], shift: number): T[] {
  const n = items.length
  const start = ((shift % n) + n) % n
  return [...items.slice(start), ...items.slice(0, start)]
}

function focusMinutes(level: number): number {
  if (level <= 20) {
    const early = [2, 3, 3, 4, 5, 5, 6, 8, 8, 10, 10, 12, 12, 15, 15, 18, 20, 20, 25, 30]
    return early[level - 1] ?? 30
  }
  return Math.min(45, 30 + Math.floor((level - 20) / 5) * 5)
}

function sparkGoal(level: number): number {
  return Math.min(25, 1 + Math.floor((level - 1) / 4))
}

function roundGoal(level: number): number {
  return Math.min(25, 1 + Math.floor((level - 1) / 3))
}

function playTask(level: number): CompanyTask {
  if (level === 4) return { kind: 'buyHq', n: 1 }
  const rounds = roundGoal(level)
  if (level % 5 === 0) {
    const world = QUIZ_WORLDS[(level / 5 - 1) % QUIZ_WORLDS.length]
    return { kind: 'worldRounds', n: Math.max(1, Math.ceil(rounds / 2)), world }
  }
  if (level % 7 === 0) return { kind: 'completes', n: rounds }
  return { kind: 'rounds', n: rounds }
}

function rewardFor(level: number): CompanyReward {
  const milestone = level === 10 || level === 20 || level === 40 || level === 80
  return {
    knowledge: 25 * level,
    ratePct: milestone ? 12 : level % 2 === 0 ? 5 : 3,
    capMs: level === 5 || level === 10 || level === 20 || level === 40 || level === 80 ? 30 * 60 * 1000 : 0,
  }
}

function buildStage(level: number): CompanyStage {
  const mixed = rotate<CompanyTask>(
    [{ kind: 'focus', n: focusMinutes(level) }, { kind: 'sparks', n: sparkGoal(level) }, playTask(level)],
    level % 3,
  )
  return {
    level,
    tasks: [mixed[0]!, mixed[1]!, mixed[2]!],
    reward: rewardFor(level),
  }
}

export const COMPANY_STAGES: readonly CompanyStage[] = Array.from({ length: COMPANY_STAGE_COUNT }, (_, i) =>
  buildStage(i + 1),
)

export function companyStage(level: number): CompanyStage | undefined {
  if (level < 1 || level > COMPANY_STAGE_COUNT) return undefined
  return COMPANY_STAGES[level - 1]
}

export function sparkIntervalMs(claimed: number): number {
  const min = Math.max(90_000, 180_000 - claimed * 1500)
  const max = Math.max(min + 30_000, 420_000 - claimed * 2500)
  return min + Math.random() * (max - min)
}
