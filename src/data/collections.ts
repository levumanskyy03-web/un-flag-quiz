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
  {
    world: 'leaders',
    id: 'died-in-office',
    mode: 'usPhotoToName',
    ids: ['wharrison', 'taylor', 'lincoln', 'garfield', 'mckinley', 'harding', 'fdr', 'kennedy'],
  },
  {
    world: 'leaders',
    id: 'textbook-kings',
    mode: 'ukPhotoToName',
    ids: ['richard1', 'john', 'henry5', 'richard3', 'henry8', 'elizabeth1', 'charles1', 'victoria', 'elizabeth2', 'charles3'],
  },
  {
    world: 'leaders',
    id: 'modern-popes',
    mode: 'popePhotoToName',
    ids: ['pope-255', 'pope-256', 'pope-260', 'pope-261', 'pope-262', 'pope-264', 'pope-265', 'pope-266', 'pope-267'],
  },
  {
    world: 'leaders',
    id: 'rus-known',
    mode: 'rusPhotoToName',
    ids: ['rurik', 'olga', 'vladimir', 'yaroslav', 'nevsky', 'dmitry', 'ivan4', 'peter1', 'catherine2', 'nicholas2', 'lenin', 'gorbachev'],
  },
  { world: 'math', id: 'symbols', mode: 'symbolToMeaning', ids: itemIds(mathItemsOf('symbolToMeaning')) },
  { world: 'math', id: 'shapes', mode: 'shapeToName', ids: itemIds(mathItemsOf('shapeToName')) },
  { world: 'math', id: 'theorems', mode: 'theoremToAuthor', ids: itemIds(mathItemsOf('theoremToAuthor')) },
  { world: 'astronomy', id: 'planets', mode: 'planetToOrder', ids: itemIds(astroItemsOf('planetToOrder')) },
  { world: 'astronomy', id: 'moons', mode: 'moonToPlanet', ids: itemIds(astroItemsOf('moonToPlanet')) },
  { world: 'astronomy', id: 'constellations', mode: 'constelToName', ids: itemIds(astroItemsOf('constelToName')) },
  { world: 'astronomy', id: 'deep-sky', mode: 'deepSkyFactsToName', ids: itemIds(astroItemsOf('deepSkyFactsToName')) },
  { world: 'astronomy', id: 'space-missions', mode: 'missionFactsToName', ids: itemIds(astroItemsOf('missionFactsToName')) },
  { world: 'biology', id: 'organelles', mode: 'organelleToRole', ids: itemIds(themeItemsOf('organelleToRole')) },
  { world: 'biology', id: 'organs', mode: 'organToSystem', ids: itemIds(themeItemsOf('organToSystem')) },
  { world: 'biology', id: 'kingdoms', mode: 'kingdomToExample', ids: itemIds(themeItemsOf('kingdomToExample')) },
  { world: 'biology', id: 'species', mode: 'bioPhotoToName', ids: itemIds(themeItemsOf('bioPhotoToName')) },
  { world: 'biology', id: 'scientists', mode: 'bioScientistPhoto', ids: itemIds(themeItemsOf('bioScientistPhoto')) },
  { world: 'olympics', id: 'hosts', mode: 'olyYearToHost', ids: itemIds(themeItemsOf('olyYearToHost')) },
  { world: 'olympics', id: 'sports', mode: 'sportToCategory', ids: itemIds(themeItemsOf('sportToCategory')) },
  { world: 'olympics', id: 'nocs', mode: 'nocToName', ids: itemIds(themeItemsOf('nocToName')) },
  { world: 'cs', id: 'terms', mode: 'csTermToMeaning', ids: itemIds(themeItemsOf('csTermToMeaning')) },
  { world: 'cs', id: 'langs', mode: 'codeToLang', ids: itemIds(themeItemsOf('codeToLang')) },
  { world: 'cs', id: 'structs', mode: 'structToUse', ids: itemIds(themeItemsOf('structToUse')) },
  {
    world: 'cs',
    id: 'first-machines',
    mode: 'csPhotoToName',
    ids: ['ph-ad', 'ph-bab', 'ph-tu', 'ph-ho', 'ph-sha', 'ph-neu', 'ph-ham', 'ph-rit'],
  },
  {
    world: 'cs',
    id: 'net-langs',
    mode: 'csPhotoToName',
    ids: ['ph-tb', 'ph-cer', 'ph-per', 'ph-lin', 'ph-gui', 'ph-str', 'ph-dij', 'ph-knu'],
  },
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
