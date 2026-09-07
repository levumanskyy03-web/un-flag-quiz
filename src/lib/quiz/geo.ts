import { COUNTRIES, type Country } from '../../data/countries'
import { COUNTRY_CODES } from '../../data/countryCodes'
import { countriesForPool, isExtraIso } from '../../data/extras'
import { foundedYear } from '../../data/founded'
import { getPassport } from '../../data/passports'
import { HOLDOUT_BY_ISO, TERRITORY_BY_ISO } from '../../data/territories'
import { LEVEL_ISOS, isFinalLevel, isLevelNumber } from '../../data/levels'
import { isEasyForMode } from '../../data/modeDifficulty'
import { canAskNeighbors } from '../../data/neighbors'
import {
  canAskWater,
  countryForWater,
  isEasyWaterBody,
  isosForWater,
  neighboringWaters,
  pickWaterId,
  WATER_LEVEL_SIZE,
  waterDataMode,
  waterIdsForMode,
  waterLevelChunks,
  watersFor,
  type WaterMapMode,
  type WaterMode,
} from '../../data/water'
import { nearbyRankingCountries, rankingCountries, rankingPlaceOf, type RankingMode } from '../../data/rankings'
import { correctLanguageIds, quizLanguageId } from '../../data/languages'
import { govKindOf } from '../../data/governments'
import {
  isCodesMode,
  isNameToGov,
  isNameToLanguage,
  isRankingMode,
  isWaterMapMode,
  isWaterMode,
  languageIdsFrom,
  matchesPlayDifficulty,
  orderedModes,
  parseRegions,
  pickDistractors,
  pickFirstFit,
  QUESTIONS_PER_ROUND,
  shuffle,
  withFacts,
  withPriorBan,
  type OptionAvoid,
  type Question,
  type QuizDifficulty,
  type QuizMode,
  type RegionFilter,
} from './core'

function extraHasMap(iso: string): boolean {
  if (iso === 'ps') return false
  return HOLDOUT_BY_ISO.has(iso) || TERRITORY_BY_ISO.has(iso)
}

export function extraFitsMode(country: Country, mode: QuizMode): boolean {
  if (!isExtraIso(country.iso)) return true
  if (isWaterMode(mode) || isRankingMode(mode) || isNameToLanguage(mode) || isNameToGov(mode)) return false
  if (mode === 'neighborsToName') return canAskNeighbors(country.iso)
  if (
    mode === 'nameToCapital' ||
    mode === 'nameToCurrency' ||
    mode === 'nameToPopulation' ||
    mode === 'factsToName'
  ) {
    return Boolean(getPassport(country.iso))
  }
  if (mode === 'nameToFounded') return foundedYear(country.iso) !== undefined
  if (mode === 'nameToMap' || mode === 'mapToName') return extraHasMap(country.iso)
  if (isCodesMode(mode)) return Boolean(COUNTRY_CODES[country.iso])
  return true
}

export function getPool(
  region: RegionFilter,
  difficulty: QuizDifficulty,
  mode: QuizMode,
  includeExtras = false,
): Country[] {
  const regions = parseRegions(region)
  if (isWaterMapMode(mode)) {
    const ids = waterIdsForMode(mode).filter((id) => {
      const inRegion = isosForWater(id, waterDataMode(mode)).some((iso) => {
        const country = COUNTRIES.find((item) => item.iso === iso)
        return Boolean(country && regions.includes(country.region))
      })
      if (!inRegion) return false
      return isEasyWaterBody(id) === (difficulty === 'easy')
    })
    const fallback = ids.length > 0 ? ids : waterIdsForMode(mode).filter((id) =>
      isosForWater(id, waterDataMode(mode)).some((iso) => {
        const country = COUNTRIES.find((item) => item.iso === iso)
        return Boolean(country && regions.includes(country.region))
      }),
    )
    return fallback
      .map((id) => countryForWater(id, mode))
      .filter((country): country is Country => Boolean(country))
  }
  return countriesForPool(includeExtras).filter((country) => {
    if (!regions.includes(country.region)) return false
    if (!extraFitsMode(country, mode)) return false
    if (mode === 'neighborsToName' && !canAskNeighbors(country.iso)) return false
    if (isWaterMode(mode) && !canAskWater(country.iso, mode)) return false
    if (isRankingMode(mode) && rankingPlaceOf(mode, country.iso) === null) return false
    return matchesPlayDifficulty(country, mode, difficulty)
  })
}

export function getRegionPool(region: RegionFilter, includeExtras = false): Country[] {
  const regions = parseRegions(region)
  return countriesForPool(includeExtras).filter((country) => regions.includes(country.region))
}

const FAME_INDEX = new Map(LEVEL_ISOS.flat().map((iso, index) => [iso, index]))
const LEVEL_CHUNKS = new Map<QuizMode, Country[][]>()

function rankedForMode(mode: QuizMode): Country[] {
  return [...COUNTRIES].sort((a, b) => {
    const easyDelta = Number(isEasyForMode(a, mode)) - Number(isEasyForMode(b, mode))
    if (easyDelta !== 0) return -easyDelta
    return (FAME_INDEX.get(a.iso) ?? 999) - (FAME_INDEX.get(b.iso) ?? 999)
  })
}

function levelChunksFor(mode: QuizMode): Country[][] {
  const cached = LEVEL_CHUNKS.get(mode)
  if (cached) return cached
  if (isWaterMode(mode)) {
    const chunks = waterLevelChunks(mode)
    LEVEL_CHUNKS.set(mode, chunks)
    return chunks
  }
  if (mode === 'flagToName' || mode === 'nameToFlag') {
    const byIso = new Map(COUNTRIES.map((country) => [country.iso, country]))
    const chunks = LEVEL_ISOS.map((group) =>
      group.flatMap((iso) => {
        const country = byIso.get(iso)
        return country ? [country] : []
      }),
    )
    LEVEL_CHUNKS.set(mode, chunks)
    return chunks
  }
  const ranked = rankedForMode(mode)
  const chunks: Country[][] = []
  let offset = 0
  for (const group of LEVEL_ISOS) {
    chunks.push(ranked.slice(offset, offset + group.length))
    offset += group.length
  }
  LEVEL_CHUNKS.set(mode, chunks)
  return chunks
}

export function getGeoLevelPool(level: number, mode: QuizMode = 'flagToName'): Country[] {
  if (isWaterMode(mode)) {
    return waterLevelChunks(mode)[level - 1] ?? []
  }
  if (!isLevelNumber(level)) return []
  if (isFinalLevel(level)) return [...COUNTRIES]
  return levelChunksFor(mode)[level - 1] ?? []
}

export function poolForMode(
  pool: Country[],
  mode: QuizMode,
  difficulty?: QuizDifficulty,
): Country[] {
  let next = pool.filter((country) => extraFitsMode(country, mode))
  if (mode === 'neighborsToName') {
    next = pool.filter((country) => canAskNeighbors(country.iso))
    if (next.length < 4) next = COUNTRIES.filter((country) => canAskNeighbors(country.iso))
  } else if (isWaterMode(mode)) {
    next = pool.filter((country) => canAskWater(country.iso, mode))
    if (next.length < 4) next = COUNTRIES.filter((country) => canAskWater(country.iso, mode))
  } else if (isRankingMode(mode)) {
    next = pool.filter((country) => rankingPlaceOf(mode, country.iso) !== null)
    if (next.length < 4) next = rankingCountries(mode)
  } else if (isNameToLanguage(mode)) {
    next = pool.filter((country) => quizLanguageId(country.iso))
    if (next.length < 4) next = COUNTRIES.filter((country) => quizLanguageId(country.iso))
  } else if (isNameToGov(mode)) {
    next = pool.filter((country) => govKindOf(country.iso))
    if (next.length < 4) next = COUNTRIES.filter((country) => govKindOf(country.iso))
  }
  if (!difficulty) return next
  const filtered = next.filter((country) => matchesPlayDifficulty(country, mode, difficulty))
  return filtered.length > 0 ? filtered : next
}

export function createRound(
  pool: Country[],
  count = QUESTIONS_PER_ROUND,
  uniqueKey: (country: Country) => string = (country) => country.iso,
  mode?: QuizMode,
): Question[] {
  if (mode && isWaterMapMode(mode)) return createWaterMapRound(pool, count, mode)
  if (mode && isWaterMode(mode)) return createWaterRound(pool, count, mode, pool.length > WATER_LEVEL_SIZE)
  if (mode && isRankingMode(mode)) return createRankingRound(pool, count, mode)
  if (mode && isNameToLanguage(mode)) return createLanguageRound(pool, count)
  if (mode && isNameToGov(mode)) return createGovRound(pool, count)
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  const avoidKeys: string[] = []

  for (const country of targets) {
    questions.push(
      withPriorBan(
        withFacts({
          country,
          mode,
          options: shuffle([country, ...pickDistractors(country, pool, 3, uniqueKey, avoidKeys)]),
        }),
        avoidKeys,
      ),
    )
    avoidKeys.push(uniqueKey(country))
  }

  return questions
}

export function createWaterRound(
  pool: Country[],
  count: number,
  mode: WaterMode,
  uniqueWaters = true,
): Question[] {
  const eligible = pool.filter((country) => canAskWater(country.iso, mode))
  const used = new Set<string>()
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const country of shuffle(eligible)) {
    const waterId = uniqueWaters ? pickWaterId(country.iso, mode, used) : watersFor(country.iso, mode)[0]
    if (!waterId) continue
    if (uniqueWaters && used.has(waterId)) continue
    used.add(waterId)
    const others = eligible.filter(
      (item) => item.iso !== country.iso && !watersFor(item.iso, mode).includes(waterId),
    )
    questions.push({
      country,
      mode,
      waterId,
      options: shuffle([
        country,
        ...pickDistractors(country, others.length >= 3 ? others : eligible, 3, (item) => item.iso, avoidKeys),
      ]),
    })
    avoidKeys.push(country.iso)
    if (questions.length >= count) break
  }
  return questions
}

function pickWaterMapOptions(correctId: string, mode: WaterMode, avoidIds: readonly string[] = []): string[] {
  const distractors = pickFirstFit(3, avoidIds, (banned) => {
    const adjacent = shuffle(neighboringWaters(correctId, mode)).filter((id) => !banned.has(id))
    const neighborTake = adjacent.length >= 2 ? (Math.random() < 0.55 ? 2 : 1) : adjacent.length
    const neighbors = adjacent.slice(0, neighborTake)
    const taken = new Set([correctId, ...neighbors])
    const filler = shuffle(
      waterIdsForMode(mode).filter((id) => !taken.has(id) && !banned.has(id)),
    ).slice(0, Math.max(0, 3 - neighbors.length))
    return [...neighbors, ...filler]
  })
  return shuffle([correctId, ...distractors])
}

export function createWaterMapRound(pool: Country[], count: number, mode: WaterMapMode): Question[] {
  const eligible = pool.filter((country) => canAskWater(country.iso, mode))
  const used = new Set<string>()
  const questions: Question[] = []
  const avoidWaters: string[] = []
  for (const country of shuffle(eligible)) {
    const waterId = pickWaterId(country.iso, mode, used)
    if (!waterId || used.has(waterId)) continue
    used.add(waterId)
    const waterOptions = pickWaterMapOptions(waterId, mode, avoidWaters)
    questions.push({
      country,
      mode,
      waterId,
      waterOptions,
      options: [country],
    })
    avoidWaters.push(waterId)
    if (questions.length >= count) break
  }
  return questions
}

export function createMixedRound(
  modes: readonly QuizMode[],
  pool: Country[],
  count: number,
  uniqueKey: (country: Country, mode: QuizMode) => string,
  difficulty?: QuizDifficulty,
): Question[] {
  const cycle = orderedModes(modes)
  if (cycle.length === 0 || count <= 0) return []
  const usedIso = new Set<string>()
  const usedWater = new Set<string>()
  const questions: Question[] = []
  const avoid: OptionAvoid = { keys: [], years: [], waters: [] }

  for (let i = 0; i < count; i += 1) {
    let picked: Question | null = null
    for (let offset = 0; offset < cycle.length; offset += 1) {
      const mode = cycle[(i + offset) % cycle.length]
      picked = questionForMode(mode, pool, usedIso, uniqueKey, difficulty, usedWater, avoid)
      if (picked) break
    }
    if (!picked) break
    usedIso.add(picked.country.iso)
    if (picked.waterId) usedWater.add(picked.waterId)
    questions.push(picked)
    if (picked.mode) avoid.keys.push(uniqueKey(picked.country, picked.mode))
    if (picked.waterId) avoid.waters.push(picked.waterId)
    if (picked.year !== undefined) avoid.years.push(picked.year)
  }

  return questions
}

function questionForMode(
  mode: QuizMode,
  pool: Country[],
  usedIso: Set<string>,
  uniqueKey: (country: Country, mode: QuizMode) => string,
  difficulty?: QuizDifficulty,
  usedWater?: Set<string>,
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question | null {
  const modePool = poolForMode(pool, mode, difficulty).filter((country) => !usedIso.has(country.iso))
  if (modePool.length === 0) return null
  if (isWaterMapMode(mode)) {
    const candidates = modePool.filter((country) => {
      const waterId = watersFor(country.iso, mode)[0]
      return Boolean(waterId && !usedWater?.has(waterId))
    })
    if (candidates.length === 0) return null
    const country = shuffle(candidates)[0]
    const waterId = watersFor(country.iso, mode)[0]
    if (!waterId) return null
    return {
      country,
      mode,
      waterId,
      waterOptions: pickWaterMapOptions(waterId, mode, avoid.waters),
      options: [country],
    }
  }
  const country = shuffle(modePool)[0]
  if (isRankingMode(mode)) {
    return {
      country,
      mode,
      options: shuffle([
        country,
        ...pickRankingDistractors(country, modePool, mode, avoid.keys),
      ]),
    }
  }
  if (isNameToLanguage(mode)) {
    return {
      country,
      mode,
      options: shuffle([country, ...pickLanguageDistractors(country, modePool, 3, languageIdsFrom(avoid.keys))]),
    }
  }
  if (isNameToGov(mode)) {
    return {
      country,
      mode,
      options: shuffle([country, ...pickGovDistractors(country, modePool)]),
    }
  }
  if (isWaterMode(mode)) {
    const waterId = watersFor(country.iso, mode)[0]
    if (!waterId) return null
    const others = modePool.filter((item) => item.iso !== country.iso && !watersFor(item.iso, mode).includes(waterId))
    return {
      country,
      mode,
      waterId,
      options: shuffle([
        country,
        ...pickDistractors(country, others.length >= 3 ? others : modePool, 3, (item) => item.iso, avoid.keys),
      ]),
    }
  }
  return withPriorBan(
    withFacts({
      country,
      mode,
      options: shuffle([
        country,
        ...pickDistractors(country, modePool, 3, (item) => uniqueKey(item, mode), avoid.keys),
      ]),
    }),
    avoid.keys,
  )
}

function createRankingRound(pool: Country[], count: number, mode: RankingMode): Question[] {
  const eligible = poolForMode(pool, mode)
  const targets = shuffle(eligible).slice(0, Math.min(count, eligible.length))
  const questions: Question[] = []
  const avoidKeys: string[] = []
  for (const country of targets) {
    questions.push({
      country,
      mode,
      options: shuffle([country, ...pickRankingDistractors(country, eligible, mode, avoidKeys)]),
    })
    avoidKeys.push(country.iso)
  }
  return questions
}

function createGovRound(pool: Country[], count: number): Question[] {
  const eligible = pool.filter((country) => govKindOf(country.iso))
  const targets = shuffle(eligible).slice(0, Math.min(count, eligible.length))
  const questions: Question[] = []
  for (const country of targets) {
    questions.push({
      country,
      mode: 'nameToGov',
      options: shuffle([country, ...pickGovDistractors(country, eligible)]),
    })
  }
  return questions
}

function pickGovDistractors(correct: Country, pool: Country[]): Country[] {
  return pickDistractors(correct, pool, 3, (country) => govKindOf(country.iso) ?? country.iso)
}

function createLanguageRound(pool: Country[], count: number): Question[] {
  const eligible = pool.filter((country) => quizLanguageId(country.iso))
  const targets = shuffle(eligible).slice(0, Math.min(count, eligible.length))
  const questions: Question[] = []
  const avoidLangs: string[] = []
  for (const country of targets) {
    questions.push({
      country,
      mode: 'nameToLanguage',
      options: shuffle([country, ...pickLanguageDistractors(country, eligible, 3, avoidLangs)]),
    })
    const langId = quizLanguageId(country.iso)
    if (langId) avoidLangs.push(langId)
  }
  return questions
}

function pickLanguageDistractors(
  correct: Country,
  pool: Country[],
  n: number,
  avoidLangIds: readonly string[] = [],
): Country[] {
  const bannedCorrect = new Set(correctLanguageIds(correct.iso))
  return pickFirstFit(n, avoidLangIds, (banned) => {
    const pickedIso = new Set([correct.iso])
    const pickedKey = new Set([...bannedCorrect, ...banned])
    const distractors: Country[] = []

    const addFrom = (list: Country[]) => {
      for (const country of shuffle(list)) {
        if (distractors.length >= n) return
        if (pickedIso.has(country.iso)) continue
        const key = quizLanguageId(country.iso)
        if (!key || pickedKey.has(key)) continue
        pickedIso.add(country.iso)
        pickedKey.add(key)
        distractors.push(country)
      }
    }

    addFrom(pool.filter((country) => country.region === correct.region))
    addFrom(COUNTRIES.filter((country) => country.region === correct.region))
    addFrom(pool)
    addFrom(COUNTRIES)

    return distractors
  })
}

function pickRankingDistractors(
  correct: Country,
  pool: Country[],
  mode: RankingMode,
  avoidKeys: readonly string[] = [],
): Country[] {
  return pickFirstFit(3, avoidKeys, (banned) => {
    const allowed = pool.filter((country) => !banned.has(country.iso))
    const nearby = nearbyRankingCountries(mode, correct.iso, allowed, 3)
    if (nearby.length >= 3) return nearby
    const extra = pickDistractors(correct, allowed, 3 - nearby.length, (item) => item.iso).filter(
      (item) => !nearby.some((near) => near.iso === item.iso),
    )
    return [...nearby, ...extra].slice(0, 3)
  })
}
