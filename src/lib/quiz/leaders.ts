import {
  leaderCountry,
  leaderShowsNumber,
  neighborsByNumber,
  termsForKind,
  uniquePersons,
  type LeaderTerm,
} from '../../data/leaders'
import {
  isLeaderPhotoMode,
  leaderKindOf,
  pickFirstFit,
  QUESTIONS_PER_ROUND,
  shuffle,
  type Country,
  type LeadersMode,
  type Question,
  type QuizDifficulty,
} from './core'

export function leaderPoolTerms(mode: LeadersMode, difficulty?: QuizDifficulty): LeaderTerm[] {
  const kind = leaderKindOf(mode)
  if (!kind) return []
  const terms = difficulty ? filterLeaderTerms(termsForKind(kind), difficulty) : termsForKind(kind)
  return isLeaderPhotoMode(mode) ? uniquePersons(terms) : terms
}

export function leaderPoolSize(mode: LeadersMode, difficulty?: QuizDifficulty): number {
  return leaderPoolTerms(mode, difficulty).length
}

export const LEADERS_LEVEL_SIZE = 10

export function leaderLearnCountries(mode: LeadersMode): Country[] {
  const kind = leaderKindOf(mode)
  if (!kind) return []
  const terms = termsForKind(kind)
  if (kind === 'us') return terms.map(leaderCountry)
  const list = isLeaderPhotoMode(mode) || !leaderShowsNumber(kind) ? uniquePersons(terms) : terms
  return list.map(leaderCountry)
}

function rankLeaderTerms(terms: LeaderTerm[]): LeaderTerm[] {
  const order = { easy: 0, medium: 1, hard: 2 }
  return [...terms].sort((a, b) => {
    const byTier = order[a.tier] - order[b.tier]
    if (byTier !== 0) return byTier
    return a.n - b.n
  })
}

export function leaderLevelChunks(mode: LeadersMode): Country[][] {
  const ranked = rankLeaderTerms(leaderPoolTerms(mode))
  const chunks: Country[][] = []
  for (let index = 0; index < ranked.length; index += LEADERS_LEVEL_SIZE) {
    chunks.push(ranked.slice(index, index + LEADERS_LEVEL_SIZE).map(leaderCountry))
  }
  return chunks
}

export function leaderCampaignLevels(mode: LeadersMode): number {
  return leaderLevelChunks(mode).length
}

export function leaderLevelNumbers(mode: LeadersMode): number[] {
  return leaderLevelChunks(mode).map((_, index) => index + 1)
}

export function createLeadersRound(
  mode: LeadersMode,
  count = QUESTIONS_PER_ROUND,
  difficulty?: QuizDifficulty,
  isos?: string[],
): Question[] {
  const full = leaderPoolTerms(mode)
  const pool = isos?.length ? full.filter((term) => isos.includes(term.id)) : leaderPoolTerms(mode, difficulty)
  const distractors = isos?.length ? full : pool
  const picked: LeaderTerm[] = []
  const seenPeople = new Set<string>()
  for (const term of shuffle(pool)) {
    if (picked.length >= count) break
    if (seenPeople.has(term.personId)) continue
    seenPeople.add(term.personId)
    picked.push(term)
  }
  const questions: Question[] = []
  const avoidPersonIds: string[] = []
  for (const term of picked) {
    questions.push({
      country: leaderCountry(term),
      mode,
      options: pickLeaderNameOptions(term, distractors, avoidPersonIds),
      year: term.from,
    })
    avoidPersonIds.push(term.personId)
  }
  return questions
}

function filterLeaderTerms(terms: LeaderTerm[], difficulty: QuizDifficulty): LeaderTerm[] {
  const wanted = difficulty === 'easy' ? 'easy' : difficulty === 'medium' ? 'medium' : 'hard'
  const match = terms.filter((term) => term.tier === wanted)
  if (uniquePersons(match).length >= 4) return match
  const order = ['easy', 'medium', 'hard'] as const
  const start = order.indexOf(wanted)
  for (let span = 1; span < order.length; span += 1) {
    const from = Math.max(0, start - span)
    const to = Math.min(order.length - 1, start + span)
    const allowed = new Set(order.slice(from, to + 1))
    const expanded = terms.filter((term) => allowed.has(term.tier))
    if (uniquePersons(expanded).length >= 4) return expanded
  }
  return terms
}

function pickLeaderNameOptions(
  term: LeaderTerm,
  pool: LeaderTerm[],
  avoidPersonIds: readonly string[] = [],
): Country[] {
  const distractors = pickFirstFit(3, avoidPersonIds, (banned) => {
    const nearby = neighborsByNumber(pool, term, 8).filter((item) => !banned.has(item.personId)).slice(0, 2)
    const seen = new Set<string>([term.personId, ...nearby.map((item) => item.personId)])
    const fillers = shuffle(pool.filter((item) => !seen.has(item.personId) && !banned.has(item.personId)))
    const picks: LeaderTerm[] = [...nearby]
    for (const item of fillers) {
      if (picks.length === 3) break
      picks.push(item)
      seen.add(item.personId)
    }
    return picks.map(leaderCountry)
  })
  return shuffle([leaderCountry(term), ...distractors])
}
