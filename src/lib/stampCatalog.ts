import { ASTRO_ITEMS, ASTRO_PEOPLE, astroById, astroDisplayName } from '../data/astro'
import { AFCON_HOSTS, AFCON_WINNERS } from '../data/afcon'
import { COPA_HOSTS, COPA_WINNERS } from '../data/copaAmerica'
import { ALL_LEADER_TERMS, leaderDisplayName, uniquePersons, type LeaderKind } from '../data/leaders'
import { portraitFileForTerm } from '../data/leaderPortraitFiles'
import { ASIAN_CUP_WINNERS, GOLD_CUP_WINNERS, NATIONS_LEAGUE_WINNERS } from '../data/footballCups'
import { allFootballClubs, clubWiki, footballClub, footballClubName } from '../data/footballClubs'
import { FOOTBALL_MANAGERS, managerById, managerDisplayName } from '../data/footballManagers'
import { FOOTBALL_PLAYERS, playerById, playerDisplayName } from '../data/footballPlayers'
import { EURO_HOSTS, EURO_WINNERS } from '../data/euros'
import { MATH_ITEMS, MATH_PEOPLE, mathById, mathDisplayName, pickL } from '../data/math'
import { THEME_ITEMS, themeById, themeDisplayName } from '../data/theme'
import {
  MATH_MODES,
  countryName,
  mathIsGenerated,
  themeWorldOf,
  isThemePhotoMode,
  type QuizMode,
  type QuizWorld,
} from './quiz'
import {
  footballTeamCountry,
  wcHostAnswerId,
  WORLD_CUP_HOSTS,
  WORLD_CUP_WINNERS,
  type WorldCupHost,
  type WorldCupWinner,
} from '../data/worldCup'
import { modeLabel, type Lang } from '../i18n/strings'
import type { StampAlbum } from './stamps'

export type StampVisual = 'flag' | 'portrait' | 'text'
export type StampGroupId =
  | 'players'
  | 'managers'
  | 'clubs'
  | 'nations'
  | 'us'
  | 'pope'
  | 'rus'
  | 'uk'
  | 'mathModes'
  | 'mathPeople'
  | 'mathCards'
  | 'planets'
  | 'moons'
  | 'stars'
  | 'exploration'
  | 'people'
  | 'cards'

export interface StampCard {
  id: string
  group: StampGroupId
  visual: StampVisual
  flagIso?: string
  wiki?: string
  wikiFile?: string
  portraitFlag?: string
}

function addWinnerIds(ids: Set<string>, rows: readonly WorldCupWinner[]) {
  for (const row of rows) {
    ids.add(row.winnerId)
    ids.add(row.runnerUpId)
  }
}

function addHostIds(ids: Set<string>, rows: readonly WorldCupHost[]) {
  for (const row of rows) ids.add(wcHostAnswerId(row.hostIds))
}

function footballNationIds(): string[] {
  const ids = new Set<string>()
  addWinnerIds(ids, WORLD_CUP_WINNERS)
  addHostIds(ids, WORLD_CUP_HOSTS)
  addWinnerIds(ids, EURO_WINNERS)
  addHostIds(ids, EURO_HOSTS)
  addWinnerIds(ids, COPA_WINNERS)
  addHostIds(ids, COPA_HOSTS)
  addWinnerIds(ids, AFCON_WINNERS)
  addHostIds(ids, AFCON_HOSTS)
  addWinnerIds(ids, ASIAN_CUP_WINNERS)
  addWinnerIds(ids, GOLD_CUP_WINNERS)
  addWinnerIds(ids, NATIONS_LEAGUE_WINNERS)
  ids.delete('')
  return [...ids]
}

function footballCatalog(): StampCard[] {
  const players: StampCard[] = FOOTBALL_PLAYERS.map((player) => ({
    id: player.id,
    group: 'players',
    visual: 'portrait',
    wiki: player.wiki,
    wikiFile: player.wikiFile,
    portraitFlag: player.nation,
  }))
  const managers: StampCard[] = FOOTBALL_MANAGERS.map((manager) => ({
    id: manager.id,
    group: 'managers',
    visual: 'portrait',
    wiki: manager.wiki,
    portraitFlag: manager.nation,
  }))
  const clubs: StampCard[] = allFootballClubs().map((club) => ({
    id: club.id,
    group: 'clubs',
    visual: 'portrait',
    wiki: club.wiki,
    portraitFlag: club.nation,
  }))
  const taken = new Set([...players, ...managers, ...clubs].map((card) => card.id))
  const nations: StampCard[] = footballNationIds()
    .filter((id) => !taken.has(id))
    .map((id) => ({
      id,
      group: 'nations',
      visual: 'flag',
      flagIso: id,
    }))
  return [...players, ...managers, ...clubs, ...nations]
}

function leaderGroup(kind: LeaderKind): StampGroupId {
  if (kind === 'us') return 'us'
  if (kind === 'pope') return 'pope'
  if (kind === 'rus') return 'rus'
  return 'uk'
}

function leadersCatalog(): StampCard[] {
  return uniquePersons(ALL_LEADER_TERMS).map((term) => ({
    id: term.personId,
    group: leaderGroup(term.kind),
    visual: 'portrait',
    wiki: term.wiki,
    wikiFile: portraitFileForTerm(term.id),
  }))
}

function mathCatalog(): StampCard[] {
  const modes: StampCard[] = MATH_MODES.filter(mathIsGenerated).map((mode) => ({
    id: `mode:${mode}`,
    group: 'mathModes',
    visual: 'text',
  }))
  const people: StampCard[] = MATH_PEOPLE.map((person) => ({
    id: `person:${person.id}`,
    group: 'mathPeople',
    visual: 'portrait',
    wiki: person.wiki,
    wikiFile: person.wikiFile,
    portraitFlag: person.iso,
  }))
  const seen = new Set(people.map((card) => card.id))
  const cards: StampCard[] = []
  for (const item of MATH_ITEMS) {
    if (mathIsGenerated(item.mode) || item.id.startsWith('mg-')) continue
    if (item.personId) continue
    if (seen.has(item.id)) continue
    seen.add(item.id)
    cards.push({
      id: item.id,
      group: 'mathCards',
      visual: 'text',
    })
  }
  return [...modes, ...people, ...cards]
}

function astroCatalog(): StampCard[] {
  const cards: StampCard[] = []
  const seen = new Set<string>()
  for (const item of ASTRO_ITEMS) {
    let id: string
    let group: StampGroupId
    let visual: StampVisual = 'text'
    let wiki: string | undefined
    let wikiFile: string | undefined
    if (item.personId) {
      id = `person:${item.personId}`
      group = 'people'
      visual = 'portrait'
      const person = ASTRO_PEOPLE.find((row) => row.id === item.personId)
      wiki = person?.wiki ?? item.wiki
      wikiFile = person?.wikiFile ?? item.wikiFile
    } else if (item.key.startsWith('mo:')) {
      id = item.key
      group = 'moons'
    } else if (item.body && (item.mode === 'planetToOrder' || item.mode === 'orderToPlanet' || item.mode === 'planetToKind' || item.mode === 'planetFactsToName')) {
      id = `body:${item.body}`
      group = 'planets'
    } else if (item.mode === 'starToClass' || item.mode === 'constelToName') {
      id = item.id
      group = 'stars'
    } else if (item.mode === 'deepSkyFactsToName') {
      id = `deep-sky:${item.id.slice(3)}`
      group = 'stars'
    } else if (item.mode === 'missionToTarget' || item.mode === 'missionFactsToName') {
      id = `mission:${item.id.slice(3)}`
      group = 'exploration'
    } else if (item.mode === 'telescopeFactsToName') {
      id = `telescope:${item.id.slice(3)}`
      group = 'exploration'
    } else {
      continue
    }
    if (seen.has(id)) continue
    seen.add(id)
    cards.push({ id, group, visual, wiki, wikiFile })
  }
  return cards
}

function themeCatalog(world: QuizWorld): StampCard[] {
  return THEME_ITEMS.filter((item) => themeWorldOf(item.mode) === world).map((item) => ({
    id: item.id,
    group: isThemePhotoMode(item.mode) ? 'people' : 'cards',
    visual: item.wikiFile ? 'portrait' : 'text',
    wiki: item.wiki,
    wikiFile: item.wikiFile,
  }))
}

const CATALOG: Partial<Record<QuizWorld, StampCard[]>> = {}

export function stampCatalog(world: QuizWorld): StampCard[] {
  if (world === 'geo') return []
  const cached = CATALOG[world]
  if (cached) return cached
  const next =
    world === 'football'
      ? footballCatalog()
      : world === 'leaders'
        ? leadersCatalog()
        : world === 'math'
          ? mathCatalog()
          : world === 'astronomy'
            ? astroCatalog()
            : themeCatalog(world)
  CATALOG[world] = next
  return next
}

export function stampCatalogTotal(world: QuizWorld): number {
  return stampCatalog(world).length
}

export function stampCardFor(world: QuizWorld, id: string): StampCard {
  if (world === 'geo') {
    return { id, group: 'nations', visual: 'flag', flagIso: id }
  }
  return stampCatalog(world).find((card) => card.id === id) ?? fallbackCard(world, id)
}

function fallbackCard(world: QuizWorld, id: string): StampCard {
  if (world === 'football') {
    const player = playerById(id)
    if (player) {
      return {
        id,
        group: 'players',
        visual: 'portrait',
        wiki: player.wiki,
        wikiFile: player.wikiFile,
        portraitFlag: player.nation,
      }
    }
    const club = footballClub(id)
    if (club) {
      return { id, group: 'clubs', visual: 'portrait', wiki: clubWiki(id), portraitFlag: club.nation }
    }
    return { id, group: 'nations', visual: 'flag', flagIso: id }
  }
  return { id, group: 'cards', visual: 'text' }
}

export function albumCards(world: QuizWorld, album: StampAlbum): StampCard[] {
  const cards = [...stampCatalog(world)]
  const seen = new Set(cards.map((card) => card.id))
  for (const id of Object.keys(album)) {
    if (seen.has(id)) continue
    cards.push(fallbackCard(world, id))
  }
  return cards
}

export function stampCardName(card: StampCard, lang: Lang): string {
  if (card.id.startsWith('mode:')) return modeLabel(card.id.slice(5) as QuizMode, lang)
  if (card.flagIso) return countryName(footballTeamCountry(card.flagIso), lang)
  const player = playerById(card.id)
  if (player) return playerDisplayName(player, lang)
  const manager = managerById(card.id)
  if (manager) return managerDisplayName(manager, lang)
  const club = footballClub(card.id)
  if (club) return footballClubName(club.id, lang)
  const term = ALL_LEADER_TERMS.find((item) => item.personId === card.id)
  if (term) return leaderDisplayName(term, lang)
  if (card.id.startsWith('person:')) {
    const personId = card.id.slice(8)
    const mathPerson = MATH_PEOPLE.find((item) => item.id === personId)
    if (mathPerson) return pickL(mathPerson.name, lang)
    const astroPerson = ASTRO_PEOPLE.find((item) => item.id === personId)
    if (astroPerson) return pickL(astroPerson.name, lang)
  }
  if (card.id.startsWith('body:')) {
    const item = ASTRO_ITEMS.find((row) => row.body === card.id.slice(5) && row.mode === 'planetToOrder')
    if (item) return pickL(item.prompt, lang)
  }
  if (card.id.startsWith('mo:')) {
    const item = ASTRO_ITEMS.find((row) => row.key === card.id && row.mode === 'planetToMoon')
    if (item) return astroDisplayName(item, lang)
  }
  if (card.id.startsWith('deep-sky:')) {
    const item = astroById(`ds-${card.id.slice(9)}`)
    if (item) return astroDisplayName(item, lang)
  }
  if (card.id.startsWith('mission:')) {
    const item = astroById(`mf-${card.id.slice(8)}`)
    if (item) return astroDisplayName(item, lang)
  }
  if (card.id.startsWith('telescope:')) {
    const item = astroById(`tf-${card.id.slice(10)}`)
    if (item) return astroDisplayName(item, lang)
  }
  const math = mathById(card.id)
  if (math) return mathDisplayName(math, lang)
  const astro = astroById(card.id)
  if (astro) return astroDisplayName(astro, lang)
  const theme = themeById(card.id)
  if (theme) return themeDisplayName(theme, lang)
  return card.id
}
