import { STRINGS, type Lang } from '../i18n/strings'
import { GeoIcon } from './GeoIcon'
import { FitText } from './FitText'
import type { QuizSettings } from './HomeScreen'

import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'

export type World = QuizWorld

interface WorldPickScreenProps {
  settings: QuizSettings
  onPick: (world: World) => void
  onMultiplayer: () => void
  onStudio: () => void
  onCompany: () => void
  onShop: () => void
}

const WORLD_ICON = {
  geo: 'globe',
  leaders: 'laurel',
  football: 'ball',
  olympics: 'torch',
  biology: 'leaf',
  math: 'sigma',
  astronomy: 'orbit',
  cs: 'code',
  food: 'bowl',
} as const

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  return t.food
}

function WorldArt({ world }: { world: QuizWorld }) {
  if (world === 'geo') {
    return (
      <span className="wp-book">
        <span className="wp-cover" />
        <span className="wp-page" />
      </span>
    )
  }
  if (world === 'football') {
    return (
      <span className="wp-ticket">
        <span className="wp-pitch" />
      </span>
    )
  }
  if (world === 'leaders') {
    return (
      <span className="wp-decree">
        <GeoIcon name="laurel" size={28} />
      </span>
    )
  }
  if (world === 'math') {
    return (
      <span className="wp-board">
        <GeoIcon name="sigma" size={28} />
      </span>
    )
  }
  if (world === 'astronomy') {
    return (
      <span className="wp-orbit">
        <GeoIcon name="orbit" size={28} />
      </span>
    )
  }
  return (
    <span className={`wp-theme is-${world}`}>
      <GeoIcon name={WORLD_ICON[world]} size={28} />
    </span>
  )
}

export function WorldPickScreen({ settings, onPick, onMultiplayer, onStudio, onCompany, onShop }: WorldPickScreenProps) {
  const t = STRINGS[settings.lang]

  return (
    <div className="screen world-pick-screen">
      <header className="home-header">
        <h1>{t.worldsPick}</h1>
      </header>

      <div className="world-pick-grid">
        {QUIZ_WORLDS.map((world) => (
          <button key={world} type="button" className={`world-pick is-${world}`} onClick={() => onPick(world)}>
            <span className="world-pick-art" aria-hidden="true">
              <WorldArt world={world} />
            </span>
            <span className="world-pick-copy">
              <FitText minPx={8}>{worldTitle(world, t)}</FitText>
            </span>
          </button>
        ))}
      </div>

      <div className="world-pick-grid is-extras">
        <button type="button" className="world-pick is-company" onClick={onCompany}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-company">
              <GeoIcon name="hq" size={28} />
            </span>
          </span>
          <span className="world-pick-copy">
            <FitText minPx={8}>{t.company}</FitText>
          </span>
        </button>

        <button type="button" className="world-pick is-shop" onClick={onShop}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-shop">
              <GeoIcon name="pin" size={28} />
            </span>
          </span>
          <span className="world-pick-copy">
            <FitText minPx={8}>{t.shop}</FitText>
          </span>
        </button>

        <button type="button" className="world-pick is-studio" onClick={onStudio}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-studio">
              <GeoIcon name="stamp" size={28} />
            </span>
          </span>
          <span className="world-pick-copy">
            <FitText minPx={8}>{t.studio}</FitText>
          </span>
        </button>

        <button type="button" className="world-pick is-multiplayer" onClick={onMultiplayer}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="wp-duel">
              <GeoIcon name="trophy" size={28} />
            </span>
          </span>
          <span className="world-pick-copy">
            <FitText minPx={8}>{t.multiplayer}</FitText>
          </span>
        </button>
      </div>
    </div>
  )
}
