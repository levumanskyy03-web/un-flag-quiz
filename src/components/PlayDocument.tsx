import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import {
  ASTRO_MODES,
  CODES_MODES,
  FOOTBALL_MODES,
  LEADERS_MODES,
  MATH_MODES,
  QUIZ_MODES,
  QUIZ_WORLDS,
  themeModesOfWorld,
  type QuizMode,
  type QuizWorld,
} from '../lib/quiz'

export type PlayHub = QuizWorld | 'home' | 'multiplayer' | 'mine' | 'studio' | 'empire' | 'profile'

const HUB_PATH: Record<Exclude<PlayHub, 'home'>, string> = {
  geo: '/geo',
  football: '/football',
  leaders: '/leaders',
  math: '/math',
  astronomy: '/astronomy',
  biology: '/biology',
  olympics: '/olympics',
  cs: '/cs',
  physics: '/physics',
  food: '/food',
  multiplayer: '/multiplayer',
  mine: '/mine',
  studio: '/studio',
  empire: '/empire',
  profile: '/profile',
}

function hubTitle(hub: PlayHub, t: (typeof STRINGS)['en']): string {
  if (hub === 'home') return t.title
  if (hub === 'geo') return t.geography
  if (hub === 'football') return t.football
  if (hub === 'leaders') return t.leaders
  if (hub === 'math') return t.math
  if (hub === 'astronomy') return t.astronomy
  if (hub === 'biology') return t.biology
  if (hub === 'olympics') return t.olympics
  if (hub === 'cs') return t.cs
  if (hub === 'physics') return t.physics
  if (hub === 'food') return t.food
  if (hub === 'multiplayer') return t.multiplayer
  if (hub === 'mine') return t.mine
  if (hub === 'studio') return t.studio
  if (hub === 'empire') return t.empire
  return t.profile
}

function hubModes(hub: PlayHub): QuizMode[] {
  if (hub === 'geo') return [...QUIZ_MODES, ...CODES_MODES]
  if (hub === 'football') return [...FOOTBALL_MODES]
  if (hub === 'leaders') return [...LEADERS_MODES]
  if (hub === 'math') return [...MATH_MODES]
  if (hub === 'astronomy') return [...ASTRO_MODES]
  if (hub === 'biology' || hub === 'olympics' || hub === 'cs' || hub === 'physics' || hub === 'food') {
    return [...themeModesOfWorld(hub)]
  }
  return []
}

export function PlayDocument({ lang, hub }: { lang: Lang; hub: PlayHub }) {
  const t = STRINGS[lang]
  const title = hubTitle(hub, t)
  const modes = hubModes(hub)
  return (
    <article className="play-document sr-only">
      <h1>{title}</h1>
      <p>{t.subtitle}</p>
      {hub === 'home' ? (
        <ul>
          {QUIZ_WORLDS.map((world) => (
            <li key={world}>
              <a href={HUB_PATH[world]}>{hubTitle(world, t)}</a>
            </li>
          ))}
        </ul>
      ) : null}
      {modes.length > 0 ? (
        <ul>
          {modes.map((mode) => (
            <li key={mode}>{modeLabel(mode, lang)}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
