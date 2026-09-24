import { pickL, t11, type L11 } from '../math'
import type { ThemeItem, ThemeTier } from '../theme'
import { isThemeMode, type ThemeMode } from '../../lib/quiz/themeModes'
import { olyPortrait } from './portraits'
import {
  CATEGORY_LABEL,
  OLY_SPORTS,
  SEASON_BUCKET_LABEL,
  VENUE_LABEL,
  type OlySport,
} from './sports'

function code(year: number): L11 {
  const s = String(year)
  return t11(s, s, s, s, s, s, s, s, s, s, s)
}

function item(
  id: string,
  mode: string,
  tier: ThemeTier,
  prompt: L11 | string,
  answer: L11 | string,
  key: string,
  extra: Partial<Pick<ThemeItem, 'wiki' | 'wikiFile'>> = {},
): ThemeItem | null {
  if (!isThemeMode(mode)) return null
  return { id, mode: mode as ThemeMode, tier, prompt, answer, key, ...extra }
}

function uniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of items) {
    const key = keyOf(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function equipmentKey(sport: OlySport): string {
  return typeof sport.equipment === 'string' ? sport.equipment : sport.equipment.en
}

export function olyGeneratedRows(): ThemeItem[] {
  const rows: Array<ThemeItem | null> = []

  for (const sport of OLY_SPORTS) {
    rows.push(
      item(`oly-sc-${sport.id}`, 'sportToCategory', sport.tier, sport.name, CATEGORY_LABEL[sport.category], sport.category),
    )
    rows.push(item(`oly-sd-${sport.id}`, 'sportToDebut', sport.tier, sport.name, code(sport.debut), String(sport.debut)))
    rows.push(
      item(`oly-se-${sport.id}`, 'sportToEquipment', sport.tier, sport.name, sport.equipment, equipmentKey(sport)),
    )
    rows.push(item(`oly-es-${sport.id}`, 'equipmentToSport', sport.tier, sport.equipment, sport.name, sport.id))
    rows.push(
      item(`oly-sf-${sport.id}`, 'sportToFederation', sport.tier, sport.name, sport.federation, sport.federationId),
    )
    rows.push(item(`oly-sv-${sport.id}`, 'sportToVenue', sport.tier, sport.name, VENUE_LABEL[sport.venue], sport.venue))
    sport.events.forEach((event, index) => {
      rows.push(item(`oly-ev-${sport.id}-${index}`, 'eventToSport', sport.tier, event, sport.name, sport.id))
    })
    sport.athletes.forEach((athlete, index) => {
      const portrait = olyPortrait(pickL(athlete.name, 'en'))
      rows.push(
        item(
          `oly-as-${sport.id}-${index}`,
          'athleteToSport',
          athlete.tier,
          athlete.name,
          sport.name,
          sport.id,
          portrait,
        ),
      )
      if (portrait) {
        rows.push(
          item(
            `oly-ph-${sport.id}-${index}`,
            'olyPhotoToName',
            athlete.tier,
            athlete.name,
            athlete.name,
            pickL(athlete.name, 'en'),
            portrait,
          ),
        )
      }
    })
  }

  for (const sport of uniqueBy(OLY_SPORTS, (item) => item.category)) {
    rows.push(item(`oly-cs-${sport.category}`, 'categoryToSport', sport.tier, CATEGORY_LABEL[sport.category], sport.name, sport.id))
  }

  for (const sport of uniqueBy(OLY_SPORTS, (item) => String(item.debut))) {
    rows.push(item(`oly-ds-${sport.debut}`, 'debutToSport', sport.tier, code(sport.debut), sport.name, sport.id))
  }

  for (const sport of uniqueBy(OLY_SPORTS, (item) => item.federationId)) {
    rows.push(
      item(`oly-fs-${sport.federationId}`, 'federationToSport', sport.tier, sport.federation, sport.name, sport.id),
    )
  }

  for (const sport of uniqueBy(OLY_SPORTS, (item) => item.venue)) {
    rows.push(item(`oly-vs-${sport.venue}`, 'venueToSport', sport.tier, VENUE_LABEL[sport.venue], sport.name, sport.id))
  }

  for (const sport of uniqueBy(
    OLY_SPORTS.filter((item) => item.signature),
    (item) => item.id,
  )) {
    const country = sport.signature!.country
    rows.push(item(`oly-co-${sport.signature!.noc}`, 'countryToOlySport', sport.tier, country, sport.name, sport.id))
  }

  for (const sport of uniqueBy(OLY_SPORTS, (item) => item.seasonBucket)) {
    rows.push(
      item(
        `oly-ss-${sport.seasonBucket}`,
        'seasonToSport',
        sport.tier,
        SEASON_BUCKET_LABEL[sport.seasonBucket],
        sport.name,
        sport.id,
      ),
    )
  }

  return rows.filter((row): row is ThemeItem => row !== null)
}
