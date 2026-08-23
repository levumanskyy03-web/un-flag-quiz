export const AVATAR_IDS = [
  'globe',
  'compass',
  'flag',
  'lion',
  'eagle',
  'whale',
  'panda',
  'fox',
  'owl',
  'turtle',
  'cat',
  'dog',
  'penguin',
  'camel',
  'koala',
  'sun',
  'moon',
  'mountain',
  'tree',
  'wave',
  'star',
  'crown',
  'ship',
  'rocket',
  'dragon',
] as const

export type AvatarId = (typeof AVATAR_IDS)[number]

export const DEFAULT_AVATAR: AvatarId = 'globe'

export interface AvatarInfo {
  id: AvatarId
  bg: string
  fg: string
  en: string
  ru: string
}

export const AVATARS: AvatarInfo[] = [
  { id: 'globe', bg: '#d7ebff', fg: '#1a6fd4', en: 'Globe', ru: 'Глобус' },
  { id: 'compass', bg: '#d9f3e8', fg: '#178a5a', en: 'Compass', ru: 'Компас' },
  { id: 'flag', bg: '#fde8e8', fg: '#c63b3b', en: 'Flag', ru: 'Флаг' },
  { id: 'lion', bg: '#f8ecd2', fg: '#b56a14', en: 'Lion', ru: 'Лев' },
  { id: 'eagle', bg: '#e8eef6', fg: '#3d4f63', en: 'Eagle', ru: 'Орёл' },
  { id: 'whale', bg: '#d9eef8', fg: '#1b6f96', en: 'Whale', ru: 'Кит' },
  { id: 'panda', bg: '#f0f0f0', fg: '#2a2a2a', en: 'Panda', ru: 'Панда' },
  { id: 'fox', bg: '#fde8d6', fg: '#d35400', en: 'Fox', ru: 'Лиса' },
  { id: 'owl', bg: '#ece4f7', fg: '#6b3fa0', en: 'Owl', ru: 'Сова' },
  { id: 'turtle', bg: '#e2f4dc', fg: '#3c7d2a', en: 'Turtle', ru: 'Черепаха' },
  { id: 'cat', bg: '#f7e6f0', fg: '#a33d73', en: 'Cat', ru: 'Кот' },
  { id: 'dog', bg: '#f4e6d4', fg: '#8a5a2b', en: 'Dog', ru: 'Пёс' },
  { id: 'penguin', bg: '#e4eef7', fg: '#1c2a3a', en: 'Penguin', ru: 'Пингвин' },
  { id: 'camel', bg: '#f6e7c8', fg: '#c4892a', en: 'Camel', ru: 'Верблюд' },
  { id: 'koala', bg: '#e8eee6', fg: '#5b6b4a', en: 'Koala', ru: 'Коала' },
  { id: 'sun', bg: '#fff1c9', fg: '#e09a00', en: 'Sun', ru: 'Солнце' },
  { id: 'moon', bg: '#e4e0f6', fg: '#4a3f8f', en: 'Moon', ru: 'Луна' },
  { id: 'mountain', bg: '#e6eef2', fg: '#4d6575', en: 'Mountain', ru: 'Гора' },
  { id: 'tree', bg: '#dff3d8', fg: '#2f7a32', en: 'Tree', ru: 'Дерево' },
  { id: 'wave', bg: '#d4f0f4', fg: '#0e7c8b', en: 'Wave', ru: 'Волна' },
  { id: 'star', bg: '#fff4d0', fg: '#c79200', en: 'Star', ru: 'Звезда' },
  { id: 'crown', bg: '#f8ecd0', fg: '#b8860b', en: 'Crown', ru: 'Корона' },
  { id: 'ship', bg: '#dceaf7', fg: '#2a5f8f', en: 'Ship', ru: 'Корабль' },
  { id: 'rocket', bg: '#ece4fb', fg: '#6c3cc7', en: 'Rocket', ru: 'Ракета' },
  { id: 'dragon', bg: '#e4f6ea', fg: '#1f7a48', en: 'Dragon', ru: 'Дракон' },
]

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === 'string' && (AVATAR_IDS as readonly string[]).includes(value)
}

export function avatarInfo(id: string | undefined): AvatarInfo {
  return AVATARS.find((item) => item.id === id) ?? AVATARS[0]
}

export function avatarLabel(id: string | undefined, lang: 'ru' | 'en'): string {
  const info = avatarInfo(id)
  return lang === 'ru' ? info.ru : info.en
}
