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
  music: 'speaker',
  melody: 'notes',
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
  if (world === 'music') return t.musicWorld
  if (world === 'melody') return t.melodyWorld
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

      <nav className="world-pick-dock" aria-label={t.explore}>
        <button type="button" className="world-dock-tab" onClick={onCompany}>
          <GeoIcon name="hq" size={22} />
          <FitText minPx={8}>{t.company}</FitText>
        </button>
        <button type="button" className="world-dock-tab" onClick={onShop}>
          <GeoIcon name="pin" size={22} />
          <FitText minPx={8}>{t.shop}</FitText>
        </button>
        <button type="button" className="world-dock-tab" onClick={onStudio}>
          <GeoIcon name="stamp" size={22} />
          <FitText minPx={8}>{t.studio}</FitText>
        </button>
        <button type="button" className="world-dock-tab" onClick={onMultiplayer}>
          <GeoIcon name="trophy" size={22} />
          <FitText minPx={8}>{t.multiplayer}</FitText>
        </button>
      </nav>
    </div>
  )
}
