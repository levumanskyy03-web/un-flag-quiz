import {
  FOOTBALL_PLAYERS,
  footballPlayerPool,
  playerById,
  playerCountry,
  type FootballPlayer,
} from '../../data/footballPlayers'
import { AFCON_EASY_FROM, AFCON_HOSTS, AFCON_WINNERS } from '../../data/afcon'
import { COPA_EASY_FROM, COPA_HOSTS, COPA_WINNERS } from '../../data/copaAmerica'
import {
  ASIAN_CUP_EASY_FROM,
  ASIAN_CUP_WINNERS,
  EUROPA_EASY_FROM,
  GOLD_CUP_EASY_FROM,
  GOLD_CUP_WINNERS,
  LEAGUE_EASY_FROM,
  LIBERTADORES_EASY_FROM,
  NATIONS_LEAGUE_EASY_FROM,
  NATIONS_LEAGUE_WINNERS,
} from '../../data/footballCups'
import { EUROPA_WINNERS } from '../../data/europaLeague'
import { LIBERTADORES_WINNERS } from '../../data/libertadores'
import { LEAGUE_TITLES } from '../../data/topLeagues'
import { FOOTBALL_STADIUMS } from '../../data/footballStadiums'
import { allFootballClubs } from '../../data/footballClubs'
import { BALLON_DOR_WINNERS, GOLDEN_BALL_WINNERS } from '../../data/ballonDor'
import { FOOTBALL_MANAGERS } from '../../data/footballManagers'
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
import {
  UCL_EASY_FROM,
  UCL_WINNERS,
  uclAsCup,
  uclClubCountries,
  uclRelatedClubIds,
  uclRelatedFinalistIds,
  uclWinYearsFor,
} from '../../data/ucl'
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
  hostRelatedIds,
  tournamentRelatedFinalistIds,
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
  isManagerFootballMode,
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
  if (mode === 'copaHosts') return tournamentYearPool(COPA_HOSTS, difficulty, COPA_EASY_FROM).map((item) => item.year)
  if (mode === 'afconHosts') return tournamentYearPool(AFCON_HOSTS, difficulty, AFCON_EASY_FROM).map((item) => item.year)
  if (mode === 'euroWinners' || mode === 'euroFinalists' || mode === 'euroTitleYears') {
    return euroPool(difficulty).map((item) => item.year)
  }
  if (mode === 'wcScorers') return tournamentYearPool(WC_SCORERS, difficulty, WC_SCORER_EASY_FROM).map((item) => item.year)
  if (mode === 'uclWinners' || mode === 'uclFinalists' || mode === 'uclTitleYears') {
    return tournamentYearPool(UCL_WINNERS, difficulty, UCL_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'copaWinners' || mode === 'copaFinalists') {
    return tournamentYearPool(COPA_WINNERS, difficulty, COPA_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'afconWinners' || mode === 'afconFinalists') {
    return tournamentYearPool(AFCON_WINNERS, difficulty, AFCON_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'asianCupWinners') {
    return tournamentYearPool(ASIAN_CUP_WINNERS, difficulty, ASIAN_CUP_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'goldCupWinners') {
    return tournamentYearPool(GOLD_CUP_WINNERS, difficulty, GOLD_CUP_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'nationsLeagueWinners') {
    return tournamentYearPool(NATIONS_LEAGUE_WINNERS, difficulty, NATIONS_LEAGUE_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'europaWinners') {
    return tournamentYearPool(EUROPA_WINNERS, difficulty, EUROPA_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'libertadoresWinners') {
    return tournamentYearPool(LIBERTADORES_WINNERS, difficulty, LIBERTADORES_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'leagueWinners') {
    return tournamentYearPool(LEAGUE_TITLES, difficulty, LEAGUE_EASY_FROM).map((item) => item.year)
  }
  if (mode === 'ballonDorWinners') return BALLON_DOR_WINNERS.map((item) => item.year)
  if (mode === 'goldenBallWinners') return GOLDEN_BALL_WINNERS.map((item) => item.year)
  if (isFootballMode(mode) && !isPlayerFootballMode(mode) && !isManagerFootballMode(mode) && mode !== 'clubCrestToName' && mode !== 'stadiumToClub') {
    return tournamentYearPool(WORLD_CUP_WINNERS, difficulty, WC_EASY_FROM).map((item) => item.year)
  }
  return []
}

export function footballPoolSize(mode: QuizMode, difficulty: QuizDifficulty): number {
  if (mode === 'clubCrestToName') return allFootballClubs().length
  if (mode === 'stadiumToClub') return FOOTBALL_STADIUMS.length
  if (isManagerFootballMode(mode)) return FOOTBALL_MANAGERS.length
  if (mode === 'playerShirtToName') {
    const pool = footballPlayerPool(difficulty)
    const numbered = pool.filter((player) => player.number !== undefined)
    return numbered.length >= 4 ? numbered.length : pool.length
  }
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
  if (isManagerFootballMode(mode)) {
    const allow = playerIds && playerIds.length > 0 ? new Set(playerIds) : null
    return FOOTBALL_MANAGERS.filter((item) => !allow || allow.has(item.id)).map(managerCountry)
  }
  if (mode === 'clubCrestToName') {
    const allow = playerIds && playerIds.length > 0 ? new Set(playerIds) : null
    return allFootballClubs()
      .filter((club) => !allow || allow.has(club.id))
      .map((club) => footballTeamCountry(club.id))
  }
  if (mode === 'stadiumToClub') {
    const allow = playerIds && playerIds.length > 0 ? new Set(playerIds) : null
    return FOOTBALL_STADIUMS.filter((item) => !allow || allow.has(item.id)).map((item) => footballTeamCountry(item.clubId))
  }
  const allow = years && years.length > 0 ? new Set(years) : null
  const yearOk = (year: number) => !allow || allow.has(year)
  const ids = new Set<string>()
  const addWinners = (list: readonly WorldCupWinner[], field: 'winnerId' | 'runnerUpId') => {
    for (const item of list) if (yearOk(item.year)) ids.add(item[field])
  }
  if (mode === 'wcWinners' || mode === 'wcTitleYears') addWinners(WORLD_CUP_WINNERS, 'winnerId')
  else if (mode === 'wcFinalists') addWinners(WORLD_CUP_WINNERS, 'runnerUpId')
  else if (mode === 'wcHosts') {
    for (const item of WORLD_CUP_HOSTS) if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
  } else if (mode === 'euroWinners' || mode === 'euroTitleYears') addWinners(EURO_WINNERS, 'winnerId')
  else if (mode === 'euroFinalists') addWinners(EURO_WINNERS, 'runnerUpId')
  else if (mode === 'euroHosts') {
    for (const item of EURO_HOSTS) if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
  } else if (mode === 'copaHosts') {
    for (const item of COPA_HOSTS) if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
  } else if (mode === 'afconHosts') {
    for (const item of AFCON_HOSTS) if (yearOk(item.year)) ids.add(wcHostAnswerId(item.hostIds))
  } else if (mode === 'wcScorers') {
    for (const item of WC_SCORERS) if (yearOk(item.year)) ids.add(wcScorerAnswerId(item))
  } else if (mode === 'uclWinners' || mode === 'uclTitleYears') {
    for (const item of UCL_WINNERS) if (yearOk(item.year)) ids.add(item.clubId)
  } else if (mode === 'uclFinalists') {
    for (const item of UCL_WINNERS) if (yearOk(item.year)) ids.add(item.runnerUpId)
  } else if (mode === 'copaWinners') addWinners(COPA_WINNERS, 'winnerId')
  else if (mode === 'copaFinalists') addWinners(COPA_WINNERS, 'runnerUpId')
  else if (mode === 'afconWinners') addWinners(AFCON_WINNERS, 'winnerId')
  else if (mode === 'afconFinalists') addWinners(AFCON_WINNERS, 'runnerUpId')
  else if (mode === 'asianCupWinners') addWinners(ASIAN_CUP_WINNERS, 'winnerId')
  else if (mode === 'goldCupWinners') addWinners(GOLD_CUP_WINNERS, 'winnerId')
  else if (mode === 'nationsLeagueWinners') addWinners(NATIONS_LEAGUE_WINNERS, 'winnerId')
  else if (mode === 'europaWinners') addWinners(EUROPA_WINNERS, 'winnerId')
  else if (mode === 'libertadoresWinners') addWinners(LIBERTADORES_WINNERS, 'winnerId')
  else if (mode === 'leagueWinners') {
    for (const item of LEAGUE_TITLES) if (yearOk(item.year)) ids.add(item.clubId)
  }
  return [...ids].map((id) => footballTeamCountry(id))
}

export function footballLearnYears(mode: FootballMode, teamId: string, years?: readonly number[]): number[] {
  if (isPlayerFootballMode(mode) || isManagerFootballMode(mode) || mode === 'clubCrestToName') return []
  if (mode === 'stadiumToClub') {
    return FOOTBALL_STADIUMS.filter((item) => item.clubId === teamId).length ? [1] : []
  }
  let list: number[]
  if (mode === 'wcWinners' || mode === 'wcTitleYears') list = wcWinYearsFor(teamId)
  else if (mode === 'wcFinalists') list = WORLD_CUP_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  else if (mode === 'wcHosts') list = WORLD_CUP_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  else if (mode === 'euroWinners' || mode === 'euroTitleYears') list = euroWinYearsFor(teamId)
  else if (mode === 'euroFinalists') list = EURO_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  else if (mode === 'euroHosts') list = EURO_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  else if (mode === 'copaHosts') list = COPA_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  else if (mode === 'afconHosts') list = AFCON_HOSTS.filter((item) => wcHostAnswerId(item.hostIds) === teamId).map((item) => item.year)
  else if (mode === 'wcScorers') list = WC_SCORERS.filter((item) => wcScorerAnswerId(item) === teamId).map((item) => item.year)
  else if (mode === 'uclWinners' || mode === 'uclTitleYears') list = uclWinYearsFor(teamId)
  else if (mode === 'uclFinalists') list = UCL_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  else if (mode === 'copaWinners') list = tournamentWinYears(COPA_WINNERS, teamId)
  else if (mode === 'copaFinalists') list = COPA_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  else if (mode === 'afconWinners') list = tournamentWinYears(AFCON_WINNERS, teamId)
  else if (mode === 'afconFinalists') list = AFCON_WINNERS.filter((item) => item.runnerUpId === teamId).map((item) => item.year)
  else if (mode === 'asianCupWinners') list = tournamentWinYears(ASIAN_CUP_WINNERS, teamId)
  else if (mode === 'goldCupWinners') list = tournamentWinYears(GOLD_CUP_WINNERS, teamId)
  else if (mode === 'nationsLeagueWinners') list = tournamentWinYears(NATIONS_LEAGUE_WINNERS, teamId)
  else if (mode === 'europaWinners') list = tournamentWinYears(EUROPA_WINNERS, teamId)
  else if (mode === 'libertadoresWinners') list = tournamentWinYears(LIBERTADORES_WINNERS, teamId)
  else if (mode === 'leagueWinners') list = LEAGUE_TITLES.filter((item) => item.clubId === teamId).map((item) => item.year)
  else list = []
  if (years && years.length > 0) {
    const allow = new Set(years)
    return list.filter((year) => allow.has(year))
  }
  return list
}

export function footballCountryForYear(mode: FootballMode, year: number): Country[] {
  const cup = (list: readonly WorldCupWinner[], field: 'winnerId' | 'runnerUpId') => {
    const item = list.find((row) => row.year === year)
    return item ? [footballTeamCountry(item[field])] : []
  }
  const host = (list: typeof WORLD_CUP_HOSTS) => {
    const item = list.find((row) => row.year === year)
    return item ? [footballTeamCountry(wcHostAnswerId(item.hostIds))] : []
  }
  if (mode === 'wcHosts') return host(WORLD_CUP_HOSTS)
  if (mode === 'euroHosts') return host(EURO_HOSTS)
  if (mode === 'copaHosts') return host(COPA_HOSTS)
  if (mode === 'afconHosts') return host(AFCON_HOSTS)
  if (mode === 'euroWinners' || mode === 'euroTitleYears') return cup(EURO_WINNERS, 'winnerId')
  if (mode === 'euroFinalists') return cup(EURO_WINNERS, 'runnerUpId')
  if (mode === 'wcScorers') {
    const item = WC_SCORERS.find((row) => row.year === year)
    return item ? [footballTeamCountry(wcScorerAnswerId(item))] : []
  }
  if (mode === 'uclWinners' || mode === 'uclTitleYears') {
    const item = UCL_WINNERS.find((row) => row.year === year)
    return item ? [footballTeamCountry(item.clubId)] : []
  }
  if (mode === 'uclFinalists') {
    const item = UCL_WINNERS.find((row) => row.year === year)
    return item ? [footballTeamCountry(item.runnerUpId)] : []
  }
  if (mode === 'copaWinners') return cup(COPA_WINNERS, 'winnerId')
  if (mode === 'copaFinalists') return cup(COPA_WINNERS, 'runnerUpId')
  if (mode === 'afconWinners') return cup(AFCON_WINNERS, 'winnerId')
  if (mode === 'afconFinalists') return cup(AFCON_WINNERS, 'runnerUpId')
  if (mode === 'asianCupWinners') return cup(ASIAN_CUP_WINNERS, 'winnerId')
  if (mode === 'goldCupWinners') return cup(GOLD_CUP_WINNERS, 'winnerId')
  if (mode === 'nationsLeagueWinners') return cup(NATIONS_LEAGUE_WINNERS, 'winnerId')
  if (mode === 'europaWinners') return cup(EUROPA_WINNERS, 'winnerId')
  if (mode === 'libertadoresWinners') return cup(LIBERTADORES_WINNERS, 'winnerId')
  if (mode === 'leagueWinners') {
    return LEAGUE_TITLES.filter((row) => row.year === year).map((row) => footballTeamCountry(row.clubId))
  }
  if (mode === 'ballonDorWinners' || mode === 'goldenBallWinners') {
    const list = mode === 'ballonDorWinners' ? BALLON_DOR_WINNERS : GOLDEN_BALL_WINNERS
    const item = list.find((row) => row.year === year)
    const player = item ? playerById(item.playerId) : undefined
    return player ? [playerCountry(player)] : []
  }
  const item = WORLD_CUP_WINNERS.find((cupRow) => cupRow.year === year)
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
  if (isManagerFootballMode(mode)) return createManagerRound(count, playerIds)
  if (mode === 'clubCrestToName') return createClubCrestRound(count, playerIds)
  if (mode === 'stadiumToClub') return createStadiumRound(count, playerIds)
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
  if (mode === 'uclFinalists') {
    return createWinnerYearRound(
      'uclFinalists',
      UCL_WINNERS.map(uclAsCup),
      (item) => footballTeamCountry(item.runnerUpId),
      (year) => uclRelatedFinalistIds(year),
      uclClubCountries(),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'uclTitleYears') {
    return createTitleYearsRound('uclTitleYears', UCL_WINNERS.map(uclAsCup), uclWinYearsFor, count, scoped, avoid)
  }
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
  if (mode === 'copaFinalists') {
    return createWinnerYearRound(
      'copaFinalists',
      COPA_WINNERS,
      (item) => footballTeamCountry(item.runnerUpId),
      (year) => tournamentRelatedFinalistIds(COPA_WINNERS, year),
      tournamentTeamCountries(COPA_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'copaHosts') return createHostsRound('copaHosts', COPA_HOSTS, count, scoped, avoid)
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
  if (mode === 'afconFinalists') {
    return createWinnerYearRound(
      'afconFinalists',
      AFCON_WINNERS,
      (item) => footballTeamCountry(item.runnerUpId),
      (year) => tournamentRelatedFinalistIds(AFCON_WINNERS, year),
      tournamentTeamCountries(AFCON_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'afconHosts') return createHostsRound('afconHosts', AFCON_HOSTS, count, scoped, avoid)
  if (mode === 'asianCupWinners') {
    return createWinnerYearRound(
      'asianCupWinners',
      ASIAN_CUP_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(ASIAN_CUP_WINNERS, year),
      tournamentTeamCountries(ASIAN_CUP_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'goldCupWinners') {
    return createWinnerYearRound(
      'goldCupWinners',
      GOLD_CUP_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(GOLD_CUP_WINNERS, year),
      tournamentTeamCountries(GOLD_CUP_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'nationsLeagueWinners') {
    return createWinnerYearRound(
      'nationsLeagueWinners',
      NATIONS_LEAGUE_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(NATIONS_LEAGUE_WINNERS, year),
      tournamentTeamCountries(NATIONS_LEAGUE_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'europaWinners') {
    return createWinnerYearRound(
      'europaWinners',
      EUROPA_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(EUROPA_WINNERS, year),
      tournamentTeamCountries(EUROPA_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'libertadoresWinners') {
    return createWinnerYearRound(
      'libertadoresWinners',
      LIBERTADORES_WINNERS,
      (item) => footballTeamCountry(item.winnerId),
      (year) => tournamentRelatedWinnerIds(LIBERTADORES_WINNERS, year),
      tournamentTeamCountries(LIBERTADORES_WINNERS),
      count,
      scoped,
      avoid,
    )
  }
  if (mode === 'leagueWinners') return createLeagueRound(count, difficulty, scoped, avoid)
  if (mode === 'ballonDorWinners') return createYearPlayerRound('ballonDorWinners', BALLON_DOR_WINNERS, count, scoped)
  if (mode === 'goldenBallWinners') return createYearPlayerRound('goldenBallWinners', GOLDEN_BALL_WINNERS, count, scoped)
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
  if (mode === 'ballonDorWinners') return createYearPlayerRound('ballonDorWinners', BALLON_DOR_WINNERS, count)
  if (mode === 'goldenBallWinners') return createYearPlayerRound('goldenBallWinners', GOLDEN_BALL_WINNERS, count)
  const full = footballPlayerPool(difficulty)
  let pool = playerIds?.length ? full.filter((player) => playerIds.includes(player.id)) : full
  if (mode === 'playerShirtToName') {
    const numbered = (playerIds?.length ? full.filter((player) => playerIds.includes(player.id)) : full).filter(
      (player) => player.number !== undefined,
    )
    pool = numbered.length >= 4 ? numbered : pool.filter((player) => player.number !== undefined)
  }
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
    if (mode === 'playerToNation') {
      const nation = footballTeamCountry(player.nation)
      const otherNations = shuffle(
        [...new Set(FOOTBALL_PLAYERS.map((item) => item.nation).filter((id) => id !== player.nation))],
      )
        .slice(0, 3)
        .map((id) => footballTeamCountry(id))
      questions.push({
        country: nation,
        mode,
        options: shuffle([nation, ...otherNations]),
        promptEntity: country,
      })
      continue
    }
    if (mode === 'playerToClub') {
      const clubId = player.clubs[0]
      if (!clubId) continue
      const club = footballTeamCountry(clubId)
      const other = shuffle(allFootballClubs().filter((item) => item.id !== clubId && !player.clubs.includes(item.id)))
        .slice(0, 3)
        .map((item) => footballTeamCountry(item.id))
      questions.push({
        country: club,
        mode,
        options: shuffle([club, ...other]),
        promptEntity: country,
      })
      continue
    }
    if (mode === 'playerClubToName') {
      const clubId = player.clubs[0]
      if (!clubId) continue
      const others = distractors.filter((item) => item.id !== player.id && !item.clubs.includes(clubId))
      questions.push({
        country,
        mode,
        options: pickPlayerNameOptions(player, others.length >= 3 ? others : distractors, avoidIds),
        promptEntity: footballTeamCountry(clubId),
      })
      avoidIds.add(player.id)
      continue
    }
    if (mode === 'playerShirtToName') {
      questions.push({
        country,
        mode,
        options: pickPlayerNameOptions(player, distractors, avoidIds),
        shirtNumber: player.number,
        promptEntity: footballTeamCountry(player.nation),
      })
      avoidIds.add(player.id)
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

function managerCountry(manager: (typeof FOOTBALL_MANAGERS)[number]): Country {
  return {
    iso: manager.id,
    nameEn: manager.en,
    nameRu: manager.ru,
    region: 'europe',
    difficulty: 'easy',
  }
}

function createManagerRound(count: number, ids?: string[]): Question[] {
  const pool = ids?.length ? FOOTBALL_MANAGERS.filter((item) => ids.includes(item.id)) : FOOTBALL_MANAGERS
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  const avoid = new Set<string>()
  for (const manager of picked) {
    const country = managerCountry(manager)
    const rest = shuffle(FOOTBALL_MANAGERS.filter((item) => item.id !== manager.id && !avoid.has(item.id))).slice(0, 3)
    questions.push({
      country,
      mode: 'managerPhotoToName',
      options: shuffle([country, ...rest.map(managerCountry)]),
    })
    avoid.add(manager.id)
  }
  return questions
}

function createClubCrestRound(count: number, ids?: string[]): Question[] {
  const clubs = ids?.length ? allFootballClubs().filter((club) => ids.includes(club.id)) : allFootballClubs()
  const picked = shuffle(clubs).slice(0, Math.min(count, clubs.length))
  const questions: Question[] = []
  for (const club of picked) {
    const country = footballTeamCountry(club.id)
    const others = shuffle(clubs.filter((item) => item.id !== club.id)).slice(0, 3).map((item) => footballTeamCountry(item.id))
    questions.push({
      country,
      mode: 'clubCrestToName',
      options: shuffle([country, ...others]),
    })
  }
  return questions
}

function createStadiumRound(count: number, ids?: string[]): Question[] {
  const pool = ids?.length ? FOOTBALL_STADIUMS.filter((item) => ids.includes(item.id)) : FOOTBALL_STADIUMS
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  for (const stadium of picked) {
    const club = footballTeamCountry(stadium.clubId)
    const others = shuffle(FOOTBALL_STADIUMS.filter((item) => item.clubId !== stadium.clubId))
      .slice(0, 3)
      .map((item) => footballTeamCountry(item.clubId))
    questions.push({
      country: club,
      mode: 'stadiumToClub',
      options: shuffle([club, ...others]),
      stadiumName: stadium.en,
    })
  }
  return questions
}

function createHostsRound(
  mode: FootballMode,
  list: typeof COPA_HOSTS,
  count: number,
  years: number[] | undefined,
  avoid: OptionAvoid,
): Question[] {
  const pool = years?.length ? list.filter((item) => years.includes(item.year)) : [...list]
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const fillers = [...new Set(list.flatMap((item) => [wcHostAnswerId(item.hostIds), ...item.hostIds]))].map(footballTeamCountry)
  const questions: Question[] = []
  for (const item of picked) {
    const host = footballTeamCountry(wcHostAnswerId(item.hostIds))
    questions.push({
      country: host,
      options: pickFootballOptions(host, hostRelatedIds(list, item.year), fillers, { avoidKeys: avoid.keys }),
      mode,
      year: item.year,
    })
    avoid.keys.push(host.iso)
  }
  return questions
}

function createLeagueRound(
  count: number,
  difficulty: QuizDifficulty,
  years: number[] | undefined,
  avoid: OptionAvoid,
): Question[] {
  const pool = years?.length
    ? LEAGUE_TITLES.filter((item) => years.includes(item.year))
    : tournamentYearPool(LEAGUE_TITLES, difficulty, LEAGUE_EASY_FROM)
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const fillers = [...new Set(LEAGUE_TITLES.map((item) => item.clubId))].map(footballTeamCountry)
  const questions: Question[] = []
  for (const item of picked) {
    const club = footballTeamCountry(item.clubId)
    const related = LEAGUE_TITLES.filter((row) => row.year === item.year && row.clubId !== item.clubId).map((row) => row.clubId)
    questions.push({
      country: club,
      options: pickFootballOptions(club, related, fillers, { avoidKeys: avoid.keys }),
      mode: 'leagueWinners',
      year: item.year,
      league: item.league,
    })
    avoid.keys.push(club.iso)
  }
  return questions
}

function createYearPlayerRound(
  mode: 'ballonDorWinners' | 'goldenBallWinners',
  list: typeof BALLON_DOR_WINNERS,
  count: number,
  years?: number[],
): Question[] {
  const available = list.filter((item) => playerById(item.playerId))
  const pool = years?.length ? available.filter((item) => years.includes(item.year)) : available
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
  const questions: Question[] = []
  const avoid = new Set<string>()
  for (const item of picked) {
    const player = playerById(item.playerId)
    if (!player) continue
    const country = playerCountry(player)
    const others = shuffle(FOOTBALL_PLAYERS.filter((row) => row.id !== player.id && !avoid.has(row.id))).slice(0, 3)
    questions.push({
      country,
      mode,
      year: item.year,
      goldenEvent: item.event,
      options: shuffle([country, ...others.map(playerCountry)]),
    })
    avoid.add(player.id)
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
