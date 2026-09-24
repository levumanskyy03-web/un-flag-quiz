import { useMemo } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { type QuizWorld } from '../lib/quiz'
import {
  albumCards,
  stampCardName,
  stampCatalogTotal,
  type StampCard,
  type StampGroupId,
} from '../lib/stampCatalog'
import {
  STAMP_MAX,
  hasStamp,
  stampCopies,
  stampCopyCount,
  stampCountryCount,
  useWorldStamps,
} from '../lib/stamps'
import type { QuizSettings } from './HomeScreen'
import { stampRarity } from '../lib/empire/album'
import { AlbumLootHow } from './AlbumLootHow'
import { TeamFlag } from './Flag'
import { FitText } from './FitText'
import { HubNav, type HubTab } from './HubNav'
import { LeaderPortrait } from './LeaderPortrait'
import { WorldsBack } from './WorldsBack'

interface WorldAlbumScreenProps {
  settings: QuizSettings
  world: Exclude<QuizWorld, 'geo'>
  tabs: HubTab[]
  onHub: (tab: HubTab) => void
  onWorlds: () => void
}

const GROUP_ORDER: StampGroupId[] = [
  'players',
  'managers',
  'clubs',
  'nations',
  'us',
  'pope',
  'rus',
  'uk',
  'mathModes',
  'mathPeople',
  'mathCards',
  'planets',
  'moons',
  'stars',
  'exploration',
  'people',
  'cards',
]

function groupLabel(group: StampGroupId, lang: Lang): string {
  const t = STRINGS[lang]
  if (group === 'players') return t.footballGroupPlayers
  if (group === 'managers') return t.footballGroupManagers
  if (group === 'clubs') return t.footballGroupClubs
  if (group === 'nations') return t.footballTableCountry
  if (group === 'us') return t.usPresidents
  if (group === 'pope') return t.popesLeaders
  if (group === 'rus') return t.askoldToUnion
  if (group === 'uk') return t.ukMonarchs
  if (group === 'mathModes') return t.math
  if (group === 'mathPeople') return t.mathFamilyPeople
  if (group === 'mathCards') return t.album
  if (group === 'planets') return t.astroFamilyPlanets
  if (group === 'moons') return t.astroFamilyMoons
  if (group === 'stars') return t.astroFamilySky
  if (group === 'exploration') return t.astroFamilyExploration
  if (group === 'people') return t.astroFamilyPeople
  return t.album
}

function StampFace({ card, name }: { card: StampCard; name: string }) {
  if (card.visual === 'flag' && card.flagIso) {
    return <TeamFlag iso={card.flagIso} name={name} size="card" />
  }
  if (card.visual === 'portrait') {
    return (
      <LeaderPortrait
        name={name}
        wiki={card.wiki ?? ''}
        file={card.wikiFile}
        flagIso={card.portraitFlag}
        size="card"
      />
    )
  }
  return <span className="stamp-text">{name}</span>
}

export function WorldAlbumScreen({ settings, world, tabs, onHub, onWorlds }: WorldAlbumScreenProps) {
  const t = STRINGS[settings.lang]
  const album = useWorldStamps(world)
  const copies = stampCopyCount(album)
  const owned = stampCountryCount(album)
  const cards = useMemo(() => albumCards(world, album), [world, album])
  const groups = useMemo(() => {
    const byGroup = new Map<StampGroupId, StampCard[]>()
    for (const card of cards) {
      const list = byGroup.get(card.group) ?? []
      list.push(card)
      byGroup.set(card.group, list)
    }
    return GROUP_ORDER.filter((group) => byGroup.has(group)).map((group) => ({
      group,
      cards: (byGroup.get(group) ?? []).slice().sort((a, b) =>
        stampCardName(a, settings.lang).localeCompare(stampCardName(b, settings.lang), settings.lang),
      ),
    }))
  }, [cards, settings.lang])
  const total = stampCatalogTotal(world)
  const showGroupTitles = groups.length > 1

  return (
    <div className="screen album-screen">
      <header className="home-header">
        <WorldsBack lang={settings.lang} onClick={onWorlds} />
        <h1>{t.album}</h1>
        <p className="learn-copy">{t.albumCountWorld(copies, owned, total)}</p>
        <p className="setting-hint">{t.albumHintWorld}</p>
      </header>

      <HubNav lang={settings.lang} active="album" tabs={tabs} onSelect={onHub} />

      <AlbumLootHow lang={settings.lang} world="world" />

      {copies === 0 ? <p className="setting-hint">{t.albumEmpty}</p> : null}

      {groups.map(({ group, cards: list }) => (
        <section key={group} className="stamp-group">
          {showGroupTitles ? <h2 className="stamp-group-title">{groupLabel(group, settings.lang)}</h2> : null}
          <div className="stamp-grid">
            {list.map((card) => {
              const got = hasStamp(album, card.id)
              const count = stampCopies(album, card.id)
              const name = stampCardName(card, settings.lang)
              const rarity = stampRarity(world, card.id)
              return (
                <div
                  key={card.id}
                  className={`stamp-card is-${rarity}${got ? '' : ' is-locked'}${count >= STAMP_MAX ? ' is-max' : ''}`}
                  title={t[`stampRarity_${rarity}`]}
                >
                  <span className="stamp-frame">
                    <StampFace card={card} name={name} />
                  </span>
                  <span className="stamp-pips" aria-hidden="true">
                    {Array.from({ length: STAMP_MAX }, (_, index) => (
                      <span key={index} className={`stamp-pip${index < count ? ' is-on' : ''}`} />
                    ))}
                  </span>
                  <p className="stamp-name">
                    <FitText>{name}</FitText>
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
