import {
  FOOTBALL_PLAYERS,
  footballPlayerPool,
  playerCountry,
  type FootballPlayer,
} from '../../data/footballPlayers'
import { AFCON_EASY_FROM, AFCON_WINNERS } from '../../data/afcon'
import { COPA_EASY_FROM, COPA_WINNERS } from '../../data/copaAmerica'
import {
  euroFinalistRelatedIds,
  euroHostCountries,
  euroHostPool,
  euroHostRelatedIds,
  euroPool,
  euroRelatedTeamIds,
  euroTeamCountries,
  euroWinYearsFor,
  EURO_HOSTS,
  EURO_WINNERS,
} from '../../data/euros'
import { UCL_EASY_FROM, UCL_WINNERS, uclClubCountries, uclRelatedClubIds, uclWinYearsFor } from '../../data/ucl'
import {
  WC_SCORER_EASY_FROM,
  WC_SCORERS,
  wcScorerAnswerId,
  wcScorerCountries,
  wcScorerRelatedIds,
} from '../../data/wcScorers'
import {
  footballTeamCountry,
  footballOptionClashes,
  tournamentRelatedWinnerIds,
  tournamentTeamCountries,
  tournamentWinYears,
  tournamentYearPool,
  wcChampionCountries,
  wcFinalistCountries,
  wcFinalistRelatedIds,
  wcHostAnswerId,
  wcHostCountries,
  wcHostPool,
  wcHostRelatedIds,
  wcRelatedTeamIds,
  wcWinYearsFor,
  WORLD_CUP_HOSTS,
  WORLD_CUP_WINNERS,
  WC_EASY_FROM,
  type WorldCupWinner,
} from '../../data/worldCup'
import { playerClueSequence } from '../playerFacts'
import {
  isFootballMode,
  isPlayerFootballMode,
  modesForFootballMix,
  pickFirstFit,
  QUESTIONS_PER_ROUND,
  shuffle,
  type Country,
  type FootballMode,
  type MixKind,
  type OptionAvoid,
  type Question,
  type QuizDifficulty,
  type QuizMode,
} from './core'

export function footballYearList(mode: QuizMode, difficulty: QuizDifficulty): number[] {
  if (mode === 'wcHosts') return wcHostPool(difficulty).map((item) => item.year)
  if (mode === 'euroHosts') return euroHostPool(difficulty).map((item) => item.year)
  if (mode === 'euroWinners' || mode === 'euroFinalists' || mode === 'euroTitleYears') {
    return euroPool(difficulty).map((item) => item.year)
  }
  if (mode === 'wcScorers') return tournamentYearPool(WC_SCORERS, difficulty, WC_SCORER_EASY_FROM).map((item) => item.year)
  if (mode === 'uclWinners') return tournamentYearPool(UCL_WINNERS, difficulty, UCL_EASY_FROM).map((item) => item.year)
  if (mode === 'copaWinners') return tournamentYearPool(COPA_WINNERS, difficulty, COPA_EASY_FROM).map((item) => item.year)
  if (mode === 'afconWinners') return tournamentYearPool(AFCON_WINNERS, difficulty, AFCON_EASY_FROM).map((item) => item.year)
  if (isFootballMode(mode)) {
    return tournamentYearPool(WORLD_CUP_WINNERS, difficulty, WC_EASY_FROM).map((item) => item.year)
  }
  return []
}

export function footballPoolSize(mode: QuizMode, difficulty: QuizDifficulty): number {
  if (isPlayerFootballMode(mode)) return footballPlayerPool(difficulty).length
  return footballYearList(mode, difficulty).length
}

export function footballMixPoolSize(mix: MixKind, difficulty: QuizDifficulty): number {
  return modesForFootballMix(mix).reduce((sum, mode) => sum + footballPoolSize(mode, difficulty), 0)
}

export function footballLearnCountries(
  mode: FootballMode,
  years?: readonly number[],
  playerIds?: readonly string[],
): Country[] {
  if (isPlayerFootballMode(mode)) {
    const allow = playerIds && playerIds.length > 0 ? new Set(playerIds) : null
    return FOOTBALL_PLAYERS.filter((player) => !allow || allow.has(player.id)).map(playerCountry)
  }
  const allow = years && years.length > 0 ? new Set(years) : null
  const yearOk = (year: number) => !allow || allow.has(year)
  const ids = new Set<string>()
  if (mode === 'wcWinners' || mode === 'wcTitleYears') {
    for (const item of WORLD_CUP_WINNERS) {
      if (yearOk(item.year)) ids.add(item.winnerId)
    }
  } else if (mode === 'wcFinalists') {
    for (const item of WORLD_CUP_WINNERS) {
      if (yearOk(item.year)) ids.add(item.runnerUpId)
    }
  } else if (mode === 'wcHosts') {
    for (const item of WORLD_CUP_HOSTS) {
      if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
    }
  } else if (mode === 'euroWinners' || mode === 'euroTitleYears') {
    for (const item of EURO_WINNERS) {
      if (yearOk(item.year)) ids.add(item.winnerId)
    }
  } else if (mode === 'euroFinalists') {
    for (const item of EURO_WINNERS) {
      if (yearOk(item.year)) ids.add(item.runnerUpId)
    }
  } else if (mode === 'euroHosts') {
    for (const item of EURO_HOSTS) {
      if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
    }
  } else if (mode === 'wcScorers') {
    for (const item of WC_SCORERS) {
      if (yearOk(item.year)) ids.add(wcScorerAnswerId(item))
    }
  } else if (mode === 'uclWinners') {
    for (const item of UCL_WINNERS) {
      if (yearOk(item.year)) ids.add(item.clubId)
    }
  } else if (mode === 'copaWinners') {
    for (const item of COPA_WINNERS) {
      if (yearOk(item.year)) ids.add(item.winnerId)
    }
  } else {
    for (const item of AFCON_WINNERS) {
      if (yearOk(item.year)) ids.add(item.winnerId)
    }
  }
  return [...ids].map((id) => footballTeamCountry(id))
}

export function footballLearnYears(mode: FootballMode, teamId: string, years?: readonly number[]): number[] {
  if (isPlayerFootballMode(mode)) return []
  let list: number[]
  if (mode === 'wcWinners' || mode === 'wcTitleYears') {
    list = wcWinYearsFor(teamId)
  } else if (mode === 'wcFinalists') {
    list = WORLD_CUP_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  } else if (mode === 'wcHosts') {
    list = WORLD_CUP_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  } else if (mode === 'euroWinners' || mode === 'euroTitleYears') {
    list = euroWinYearsFor(teamId)
  } else if (mode === 'euroFinalists') {
    list = EURO_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  } else if (mode === 'euroHosts') {
    list = EURO_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  } else if (mode === 'wcScorers') {
    list = WC_SCORERS.filter((item) => wcScorerAnswerId(item) === teamId).map((item) => item.year)
  } else if (mode === 'uclWinners') {
    list = uclWinYearsFor(teamId)
  } else if (mode === 'copaWinners') {
    list = tournamentWinYears(COPA_WINNERS, teamId)
  } else {
    list = tournamentWinYears(AFCON_WINNERS, teamId)
  }
  if (years && years.length > 0) {
    const allow = new Set(years)
    return list.filter((year) => allow.has(year))
  }
  return list
}

export function footballCountryForYear(mode: FootballMode, year: number): Country[] {
  if (mode === 'wcHosts') {
    const item = WORLD_CUP_HOSTS.find((host) => host.year === year)
    return item ? [footballTeamCountry(wcHostAnswerId(item.hostIds))] : []
  }
  if (mode === 'euroHosts') {
    const item = EURO_HOSTS.find((host) => host.year === year)
    return item ? [footballTeamCountry(wcHostAnswerId(item.hostIds))] : []
  }
  if (mode === 'euroWinners' || mode === 'euroTitleYears') {
    const item = EURO_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.winnerId)] : []
  }
  if (mode === 'euroFinalists') {
    const item = EURO_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.runnerUpId)] : []
  }
  if (mode === 'wcScorers') {
    const item = WC_SCORERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(wcScorerAnswerId(item))] : []
  }
  if (mode === 'uclWinners') {
    const item = UCL_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.clubId)] : []
  }
  if (mode === 'copaWinners') {
    const item = COPA_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.winnerId)] : []
  }
  if (mode === 'afconWinners') {
    const item = AFCON_WINNERS.find((cup) => cup.year === year)
    return item ? [footballTeamCountry(item.winnerId)] : []
  }
  const item = WORLD_CUP_WINNERS.find((cup) => cup.year === year)
  if (!item) return []
  if (mode === 'wcFinalists') return [footballTeamCountry(item.runnerUpId)]
  return [footballTeamCountry(item.winnerId)]
}

export function createFootballRound(
  mode: QuizMode,
  count = QUESTIONS_PER_ROUND,
  difficulty: QuizDifficulty = 'easy',
  years?: number[],
  prior?: OptionAvoid,
  playerIds?: string[],
): Question[] {
  if (isPlayerFootballMode(mode)) return createPlayerRound(mode, count, difficulty, playerIds)
  const avoid: OptionAvoid = {
    keys: [...(prior?.keys ?? [])],
    years: [...(prior?.years ?? [])],
    waters: [...(prior?.waters ?? [])],
  }
  const scoped = years?.length ? years : footballYearList(mode, difficulty)
  if (mode === 'wcFinalists') return createWcFinalistsRound(count, scoped, avoid)
  if (mode === 'wcHosts') return createWcHostsRound(count, difficulty, scoped, avoid)
  if (mode === 'wcTitleYears') {
    return createTitleYearsRound('wcTitleYears', WORLD_CUP_WINNERS, wcWinYearsFor, count, scoped, avoid)
  }
  if (mode === 'euroWinners') {
    return createWinnerYearRound(
      'euroWinners',
      EURO_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => euroRelatedTeamIds(year),
      euroTeamCountries(),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'euroFinalists') {
    return createWinnerYearRound(
      'euroFinalists',
      EURO_WINNERS,
      (item) => footballTeamCountry(item.runnerUpId),
      (year) => euroFinalistRelatedIds(year),
      euroTeamCountries(),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'euroHosts') return createEuroHostsRound(count, difficulty, scoped, avoid)
  if (mode === 'euroTitleYears') {
    return createTitleYearsRound('euroTitleYears', EURO_WINNERS, euroWinYearsFor, count, scoped, avoid)
  }
  if (mode === 'wcScorers') return createWcScorersRound(count, difficulty, scoped, avoid)
  if (mode === 'uclWinners') return createUclWinnersRound(count, difficulty, scoped, avoid)
  if (mode === 'copaWinners') {
    return createWinnerYearRound(
      'copaWinners',
      COPA_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(COPA_WINNERS, year),
      tournamentTeamCountries(COPA_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'afconWinners') {
    return createWinnerYearRound(
      'afconWinners',
      AFCON_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(AFCON_WINNERS, year),
      tournamentTeamCountries(AFCON_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  return createWcWinnersRound(count, scoped, avoid)
}

export function createFootballMixedRound(
  modes: readonly FootballMode[],
  count: number,
  difficulty: QuizDifficulty,
): Question[] {
  const playable = modes.filter((mode) => mode !== 'playerFactsToName')
  if (playable.length === 0 || count <= 0) return []
  const questions: Question[] = []
  const used = new Set<string>()
  const avoid: OptionAvoid = { keys: [], years: [], waters: [] }
  for (let i = 0; i < count * 6 && questions.length < count; i += 1) {
    const mode = playable[i % playable.length]
    const [question] = createFootballRound(mode, 1, difficulty, undefined, avoid)
    if (!question) continue
    const key = `${question.mode}:${question.year}:${question.country.iso}`
    if (used.has(key)) continue
    used.add(key)
    questions.push(question)
    avoid.keys = [...avoid.keys, question.country.iso]
    if (question.year !== undefined) avoid.years = [...avoid.years, question.year]
  }
  return questions
}

export function createWcWinnersRound(
  count = QUESTIONS_PER_ROUND,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const source = years?.length
    ? WORLD_CUP_WINNERS.filter((item) => years.includes(item.year))
    : WORLD_CUP_WINNERS
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  const questions: Question[] = []
  for (const item of picked) {
    const winner = footballTeamCountry(item.winnerId)
    questions.push({
      country: winner,
      options: pickFootballOptions(winner, wcRelatedTeamIds(item.year), wcChampionCountries(), {
        avoidKeys: avoid.keys,
      }),
      mode: 'wcWinners',
      year: item.year,
    })
    avoid.keys.push(winner.iso)
  }
  return questions
}

function createWcFinalistsRound(
  count: number,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const source = years?.length
    ? WORLD_CUP_WINNERS.filter((item) => years.includes(item.year))
    : WORLD_CUP_WINNERS
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  const questions: Question[] = []
  for (const item of picked) {
    const finalist = footballTeamCountry(item.runnerUpId)
    questions.push({
      country: finalist,
      options: pickFootballOptions(finalist, wcFinalistRelatedIds(item.year), wcFinalistCountries(), {
        avoidKeys: avoid.keys,
      }),
      mode: 'wcFinalists',
      year: item.year,
    })
    avoid.keys.push(finalist.iso)
  }
  return questions
}

function createWcHostsRound(
  count: number,
  difficulty: QuizDifficulty,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const pool = years?.length
    ? WORLD_CUP_HOSTS.filter((item) => years.includes(item.year))
    : wcHostPool(difficulty)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  for (const item of picked) {
    const host = footballTeamCountry(wcHostAnswerId(item.hostIds))
    questions.push({
      country: host,
      options: pickFootballOptions(host, wcHostRelatedIds(item.year), wcHostCountries(), {
        avoidKeys: avoid.keys,
      }),
      mode: 'wcHosts',
      year: item.year,
    })
    avoid.keys.push(host.iso)
  }
  return questions
}

function createTitleYearsRound(
  mode: FootballMode,
  list: readonly WorldCupWinner[],
  winYears: (winnerId: string) => number[],
  count: number,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const source = years?.length ? list.filter((item) => years.includes(item.year)) : [...list]
  const picked = shuffle(source).slice(0, Math.min(count, source.length))
  const allYears = list.map((item) => item.year)
  const questions: Question[] = []
  for (const item of picked) {
    const winner = footballTeamCountry(item.winnerId)
    const theirYears = new Set(winYears(item.winnerId))
    const related: number[] = []
    const addYear = (year?: number) => {
      if (year === undefined || year === item.year || theirYears.has(year) || related.includes(year)) return
      related.push(year)
    }
    for (const cup of list) {
      if (cup.runnerUpId === item.winnerId) addYear(cup.year)
    }
    const index = list.findIndex((cup) => cup.year === item.year)
    addYear(list[index - 1]?.year)
    addYear(list[index + 1]?.year)
    const blocked = new Set(theirYears)
    const yearOptions = [
      item.year,
      ...pickFirstFit(3, avoid.years, (banned) => {
        const relatedPicks = shuffle(related.filter((year) => !banned.has(year))).slice(0, 2)
        const fillers = shuffle(
          allYears.filter((year) => !blocked.has(year) && !relatedPicks.includes(year) && !banned.has(year)),
        )
        const pickedYears: number[] = []
        for (const year of [...relatedPicks, ...fillers]) {
          if (pickedYears.includes(year) || blocked.has(year) || year === item.year) continue
          pickedYears.push(year)
          if (pickedYears.length === 3) break
        }
        return pickedYears
      }),
    ]
    questions.push({
      country: winner,
      options: [],
      yearOptions: shuffle(yearOptions),
      mode,
      year: item.year,
    })
    avoid.years.push(item.year)
  }
  return questions
}

function createWinnerYearRound(
  mode: FootballMode,
  source: readonly WorldCupWinner[],
  answerOf: (item: WorldCupWinner) => Country,
  relatedOf: (year: number) => string[],
  fillers: Country[],
  count: number,
  years: number[] | undefined,
  avoid: OptionAvoid,
): Question[] {
  const pool = years?.length ? source.filter((item) => years.includes(item.year)) : [...source]
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  for (const item of picked) {
    const answer = answerOf(item)
    questions.push({
      country: answer,
      options: pickFootballOptions(answer, relatedOf(item.year), fillers, { avoidKeys: avoid.keys }),
      mode,
      year: item.year,
    })
    avoid.keys.push(answer.iso)
  }
  return questions
}

function createEuroHostsRound(
  count: number,
  difficulty: QuizDifficulty,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const pool = years?.length
    ? EURO_HOSTS.filter((item) => years.includes(item.year))
    : euroHostPool(difficulty)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  for (const item of picked) {
    const host = footballTeamCountry(wcHostAnswerId(item.hostIds))
    questions.push({
      country: host,
      options: pickFootballOptions(host, euroHostRelatedIds(item.year), euroHostCountries(), {
        avoidKeys: avoid.keys,
      }),
      mode: 'euroHosts',
      year: item.year,
    })
    avoid.keys.push(host.iso)
  }
  return questions
}

function createWcScorersRound(
  count: number,
  difficulty: QuizDifficulty,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const pool = years?.length
    ? WC_SCORERS.filter((item) => years.includes(item.year))
    : tournamentYearPool(WC_SCORERS, difficulty, WC_SCORER_EASY_FROM)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const fillers = wcScorerCountries()
  const questions: Question[] = []
  for (const item of picked) {
    const country = footballTeamCountry(wcScorerAnswerId(item))
    questions.push({
      country,
      options: pickFootballOptions(country, wcScorerRelatedIds(item.year), fillers, {
        avoidKeys: avoid.keys,
      }),
      mode: 'wcScorers',
      year: item.year,
    })
    avoid.keys.push(country.iso)
  }
  return questions
}

function createUclWinnersRound(
  count: number,
  difficulty: QuizDifficulty,
  years?: number[],
  avoid: OptionAvoid = { keys: [], years: [], waters: [] },
): Question[] {
  const pool = years?.length
    ? UCL_WINNERS.filter((item) => years.includes(item.year))
    : tournamentYearPool(UCL_WINNERS, difficulty, UCL_EASY_FROM)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const fillers = uclClubCountries()
  const questions: Question[] = []
  for (const item of picked) {
    const club = footballTeamCountry(item.clubId)
    questions.push({
      country: club,
      options: pickFootballOptions(club, uclRelatedClubIds(item.year), fillers, {
        avoidKeys: avoid.keys,
      }),
      mode: 'uclWinners',
      year: item.year,
    })
    avoid.keys.push(club.iso)
  }
  return questions
}

function pickFootballOptions(
  correct: Country,
  relatedIds: string[],
  fillers: Country[],
  opts: { shuffleRelated?: boolean; maxRelated?: number; avoidKeys?: readonly string[] } = {},
): Country[] {
  const distractors = pickFirstFit(3, opts.avoidKeys ?? [], (banned) => {
    const related: Country[] = []
    const seen = new Set([correct.iso])
    for (const id of relatedIds) {
      const team = footballTeamCountry(id)
      if (seen.has(team.iso) || banned.has(team.iso) || footballOptionClashes(team.iso, correct.iso)) continue
      seen.add(team.iso)
      related.push(team)
    }
    const maxRelated = opts.maxRelated ?? 2
    const ordered = opts.shuffleRelated === false ? related : shuffle(related)
    const relatedPicks = ordered.slice(0, Math.min(maxRelated, ordered.length))
    const extra = shuffle(
      fillers.filter(
        (team) => !seen.has(team.iso) && !banned.has(team.iso) && !footballOptionClashes(team.iso, correct.iso),
      ),
    )
    const options: Country[] = []
    const used = new Set<string>([correct.iso])
    for (const team of [...relatedPicks, ...extra]) {
      if (used.has(team.iso) || footballOptionClashes(team.iso, correct.iso)) continue
      used.add(team.iso)
      options.push(team)
      if (options.length === 3) break
    }
    return options
  })
  return shuffle([correct, ...distractors])
}

function createPlayerRound(
  mode: QuizMode,
  count: number,
  difficulty: QuizDifficulty,
  playerIds?: string[],
): Question[] {
  const full = footballPlayerPool(difficulty)
  const pool = playerIds?.length ? full.filter((player) => playerIds.includes(player.id)) : full
  const distractors = playerIds?.length ? FOOTBALL_PLAYERS : full
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  const avoidIds = new Set<string>()
  for (const player of picked) {
    const country = playerCountry(player)
    if (mode === 'playerFactsToName') {
      questions.push({
        country,
        mode,
        options: [country],
        facts: playerClueSequence(player.id),
      })
      continue
    }
    questions.push({
      country,
      mode,
      options: pickPlayerNameOptions(player, distractors, avoidIds),
    })
    avoidIds.add(player.id)
  }
  return questions
}

function pickPlayerNameOptions(
  player: FootballPlayer,
  pool: FootballPlayer[],
  avoidIds: ReadonlySet<string>,
): Country[] {
  const distractors = pickFirstFit(3, [...avoidIds], (banned) => {
    const sameNation = shuffle(
      pool.filter((item) => item.nation === player.nation && item.id !== player.id && !banned.has(item.id)),
    )
    const samePos = shuffle(
      pool.filter((item) => item.position === player.position && item.id !== player.id && !banned.has(item.id)),
    )
    const rest = shuffle(pool.filter((item) => item.id !== player.id && !banned.has(item.id)))
    const seen = new Set([player.id])
    const picks: FootballPlayer[] = []
    for (const item of [...sameNation.slice(0, 1), ...samePos, ...rest]) {
      if (picks.length === 3) break
      if (seen.has(item.id) || banned.has(item.id)) continue
      seen.add(item.id)
      picks.push(item)
    }
    return picks.map(playerCountry)
  })
  return shuffle([playerCountry(player), ...distractors])
}
