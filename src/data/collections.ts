import { uniquePersons, termsForKind } from './leaders'
import { SITE_LISTS } from './lists'
import { GREAT_CLUBS } from './footballGreatClubs'
import { UCL_WINNERS } from './ucl'
import { WORLD_CUP_WINNERS } from './worldCup'
import { mathItemsOf } from './math'
import { astroItemsOf } from './astro'
import { themeItemsOf } from './theme'
import { QUIZ_WORLDS, type QuizMode, type QuizWorld } from '../lib/quiz/core'

export type Collection = {
  world: QuizWorld
  id: string
  mode: QuizMode
  ids: readonly string[]
  idsAreYears?: boolean
}

function itemIds(items: { id: string }[]): string[] {
  return items.map((item) => item.id)
}

export const COLLECTIONS: Collection[] = [
  ...SITE_LISTS.map((list) => ({
    world: 'geo' as const,
    id: list.id,
    mode: 'flagToName' as const,
    ids: list.isos,
  })),
  { world: 'football', id: 'great-clubs', mode: 'clubCrestToName', ids: GREAT_CLUBS.map((club) => club.id) },
  {
    world: 'football',
    id: 'wc-winners',
    mode: 'wcWinners',
    ids: WORLD_CUP_WINNERS.map((row) => String(row.year)),
    idsAreYears: true,
  },
  {
    world: 'football',
    id: 'ucl-winners',
    mode: 'uclWinners',
    ids: UCL_WINNERS.map((row) => String(row.year)),
    idsAreYears: true,
  },
  { world: 'leaders', id: 'us-presidents', mode: 'usPhotoToName', ids: uniquePersons(termsForKind('us')).map((term) => term.id) },
  { world: 'leaders', id: 'popes', mode: 'popePhotoToName', ids: uniquePersons(termsForKind('pope')).map((term) => term.id) },
  { world: 'leaders', id: 'uk-monarchs', mode: 'ukPhotoToName', ids: uniquePersons(termsForKind('uk')).map((term) => term.id) },
  { world: 'leaders', id: 'rus-leaders', mode: 'rusPhotoToName', ids: uniquePersons(termsForKind('rus')).map((term) => term.id) },
  { world: 'math', id: 'symbols', mode: 'symbolToMeaning', ids: itemIds(mathItemsOf('symbolToMeaning')) },
  { world: 'math', id: 'shapes', mode: 'shapeToName', ids: itemIds(mathItemsOf('shapeToName')) },
  { world: 'math', id: 'math-people', mode: 'mathPhotoToName', ids: itemIds(mathItemsOf('mathPhotoToName')) },
  { world: 'astronomy', id: 'planets', mode: 'planetToOrder', ids: itemIds(astroItemsOf('planetToOrder')) },
  { world: 'astronomy', id: 'moons', mode: 'moonToPlanet', ids: itemIds(astroItemsOf('moonToPlanet')) },
  { world: 'astronomy', id: 'constellations', mode: 'constelToName', ids: itemIds(astroItemsOf('constelToName')) },
  { world: 'astronomy', id: 'deep-sky', mode: 'deepSkyFactsToName', ids: itemIds(astroItemsOf('deepSkyFactsToName')) },
  { world: 'astronomy', id: 'space-missions', mode: 'missionFactsToName', ids: itemIds(astroItemsOf('missionFactsToName')) },
  { world: 'biology', id: 'organelles', mode: 'organelleToRole', ids: itemIds(themeItemsOf('organelleToRole')) },
  { world: 'biology', id: 'organs', mode: 'organToSystem', ids: itemIds(themeItemsOf('organToSystem')) },
  { world: 'biology', id: 'kingdoms', mode: 'kingdomToExample', ids: itemIds(themeItemsOf('kingdomToExample')) },
  { world: 'olympics', id: 'hosts', mode: 'olyYearToHost', ids: itemIds(themeItemsOf('olyYearToHost')) },
  { world: 'olympics', id: 'sports', mode: 'sportToCategory', ids: itemIds(themeItemsOf('sportToCategory')) },
  { world: 'olympics', id: 'nocs', mode: 'nocToName', ids: itemIds(themeItemsOf('nocToName')) },
  { world: 'cs', id: 'terms', mode: 'csTermToMeaning', ids: itemIds(themeItemsOf('csTermToMeaning')) },
  { world: 'cs', id: 'langs', mode: 'codeToLang', ids: itemIds(themeItemsOf('codeToLang')) },
  { world: 'cs', id: 'structs', mode: 'structToUse', ids: itemIds(themeItemsOf('structToUse')) },
  { world: 'cs', id: 'hackers', mode: 'csPhotoToName', ids: itemIds(themeItemsOf('csPhotoToName')) },
  { world: 'food', id: 'dishes', mode: 'dishToCuisine', ids: itemIds(themeItemsOf('dishToCuisine')) },
  { world: 'food', id: 'origins', mode: 'foodToOrigin', ids: itemIds(themeItemsOf('foodToOrigin')) },
  { world: 'food', id: 'plates', mode: 'foodPhotoToDish', ids: itemIds(themeItemsOf('foodPhotoToDish')) },
]

export function isQuizWorldId(value: string): value is QuizWorld {
  return (QUIZ_WORLDS as readonly string[]).includes(value)
}

export function collectionsOf(world: QuizWorld): Collection[] {
  return COLLECTIONS.filter((item) => item.world === world)
}

export function collectionById(world: string, id: string): Collection | undefined {
  return COLLECTIONS.find((item) => item.world === world && item.id === id)
}

export function collectionParams() {
  return COLLECTIONS.map((item) => ({ world: item.world, id: item.id }))
}

export function collectionPath(world: QuizWorld, id: string) {
  return `/lists/${world}/${id}`
}

export function collectionPlayHref(world: QuizWorld, id: string) {
  return `/${world}?list=${encodeURIComponent(id)}`
}

export function dailyPlayHref(world: QuizWorld) {
  return `/${world}?daily=1`
}
