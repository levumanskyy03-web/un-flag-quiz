import type { Region } from '../countries'
import type { GovKind } from '../governments'
import type { Text11 } from '../../i18n/text11'

/**
 * Independence on the 1500+ map (not UN membership).
 *
 * independent — own government, defined territory, own foreign policy, and treated
 * as a sovereign by other states of that era (empires, kingdoms, republics).
 *
 * de_facto — effective self-rule and a government on the ground, but without
 * general recognition (UDI, frozen-conflict states, Tibet 1912–51).
 *
 * dependent — colony, viceroyalty, protectorate, vassal, company territory, or
 * a crown/personal-union land that is not its own sovereign. Cards still exist;
 * they name the suzerain (`parent`).
 */
export type PolityKind = 'independent' | 'de_facto' | 'dependent'

export type DependentKind =
  | 'colony'
  | 'protectorate'
  | 'viceroyalty'
  | 'vassal'
  | 'company'
  | 'personal_union'

export interface Polity {
  id: string
  region: Region
  from: number
  to: number | null
  kind: PolityKind
  /** Who the territory answered to; a polity id or a modern ISO (es, gb, pt…). */
  parent?: string
  /** If the suzerain changed, cards pick the span that covers the map year. */
  parentSpans?: { from: number; to: number; id: string }[]
  dependentKind?: DependentKind
  difficulty: 'easy' | 'hard'
  names: Text11
  capital?: Text11
  flagFile?: string
  flagIso?: string
  wikidata: string
  successors: string[]
  /** Equirectangular pin when the snapshot has no polygon. */
  marker?: { x: number; y: number }
  fact?: Text11
}

export interface PolityPassport {
  /** Actual start of the state, which may be earlier than our 1500 map window. */
  founded?: number
  population?: number
  populationYear?: number
  gov?: GovKind
  langs?: string[]
  currency?: Text11
}
