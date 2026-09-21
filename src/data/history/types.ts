import type { Region } from '../countries'
import type { Text11 } from '../../i18n/text11'

/**
 * Independence on the 1800+ map (not UN membership).
 *
 * independent — own government, defined territory, own foreign policy, and treated
 * as a sovereign by other states of that era (empires, kingdoms, republics).
 *
 * de_facto — effective self-rule and a government on the ground, but without
 * general recognition (UDI, frozen-conflict states, Tibet 1912–51).
 *
 * Everything else is not a country card: colonies, protectorates, viceroyalties,
 * ethnographic regions, or a modern state that had not yet become independent.
 */
export type PolityKind = 'independent' | 'de_facto'

export interface Polity {
  id: string
  region: Region
  from: number
  to: number | null
  kind: PolityKind
  difficulty: 'easy' | 'hard'
  names: Text11
  capital: Text11
  flagFile?: string
  flagIso?: string
  wikidata: string
  successors: string[]
  /** Equirectangular pin when the snapshot has no polygon. */
  marker?: { x: number; y: number }
  fact: Text11
}
