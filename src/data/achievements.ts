import type { Lang } from '../i18n/lang'

export const ACHIEVEMENT_TIERS = [1, 2, 3, 4, 5] as const
export type AchievementTier = (typeof ACHIEVEMENT_TIERS)[number]

export const ACHIEVEMENT_IDS = [
  'firstRound',
  'firstHit',
  'completeFive',
  'campaign1',
  'flagComplete',
  'play10m',
  'veteranDay',
  'eightOfTen',
  'perfect5',
  'hardComplete',
  'campaign3',
  'twoModes',
  'rank5',
  'veteranWeek',
  'perfect10',
  'fiveRegions',
  'threeModes',
  'campaign8',
  'hardcoreComplete',
  'rank10',
  'play1h',
  'veteranMonth',
  'perfect20',
  'allModes',
  'campaign15',
  'hardcoreLevel',
  'completes10',
  'rank20',
  'campaign20',
  'goldTen',
  'goldFinal',
  'perfectHardcore',
  'worldPerfect',
  'play10h',
  'recordBreak1',
  'recordBreak10',
] as const

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

export function isAchievementId(value: unknown): value is AchievementId {
  return typeof value === 'string' && (ACHIEVEMENT_IDS as readonly string[]).includes(value)
}

export function parseAchievementIds(value: unknown): AchievementId[] | undefined {
  if (!Array.isArray(value)) return undefined
  const ids: AchievementId[] = []
  const seen = new Set<string>()
  for (const item of value) {
    if (!isAchievementId(item) || seen.has(item)) continue
    seen.add(item)
    ids.push(item)
    if (ids.length >= ACHIEVEMENT_IDS.length) break
  }
  return ids
}

export interface AchievementInfo {
  id: AchievementId
  tier: AchievementTier
  en: string
  ru: string
  enHint: string
  ruHint: string
}

export const ACHIEVEMENTS: AchievementInfo[] = [
  {
    id: 'firstRound',
    tier: 1,
    en: 'First step',
    ru: 'Первый шаг',
    enHint: 'Finish any round',
    ruHint: 'Завершите любой раунд',
  },
  {
    id: 'firstHit',
    tier: 1,
    en: 'On the board',
    ru: 'Есть попадание',
    enHint: 'Score at least one correct answer',
    ruHint: 'Ответьте верно хотя бы раз',
  },
  {
    id: 'completeFive',
    tier: 1,
    en: 'Five through',
    ru: 'До конца',
    enHint: 'Finish a round of 5 or more questions',
    ruHint: 'Пройдите раунд из 5 или больше вопросов до конца',
  },
  {
    id: 'campaign1',
    tier: 1,
    en: 'Campaign start',
    ru: 'Старт кампании',
    enHint: 'Clear campaign level 1',
    ruHint: 'Пройдите 1-й уровень кампании',
  },
  {
    id: 'flagComplete',
    tier: 1,
    en: 'Flag reader',
    ru: 'Читатель флагов',
    enHint: 'Finish a Flag → country round',
    ruHint: 'Пройдите раунд «Флаг → страна» до конца',
  },
  {
    id: 'play10m',
    tier: 1,
    en: 'Ten minutes',
    ru: 'Десять минут',
    enHint: 'Play for 10 minutes in total',
    ruHint: 'Сыграйте суммарно 10 минут',
  },
  {
    id: 'veteranDay',
    tier: 1,
    en: 'One day',
    ru: 'Сутки',
    enHint: 'Keep an account for 1 day',
    ruHint: 'Аккаунту исполнился 1 день',
  },
  {
    id: 'eightOfTen',
    tier: 2,
    en: 'Eight of ten',
    ru: 'Восемь из десяти',
    enHint: 'Score 8/10 or better in one round',
    ruHint: 'Наберите 8 из 10 или лучше в одном раунде',
  },
  {
    id: 'perfect5',
    tier: 2,
    en: 'Five of five',
    ru: 'Пять из пяти',
    enHint: 'Score 5/5',
    ruHint: 'Пройдите раунд 5 из 5 без ошибок',
  },
  {
    id: 'hardComplete',
    tier: 2,
    en: 'No training wheels',
    ru: 'Без лёгкого',
    enHint: 'Finish a round on Hard or Hardcore',
    ruHint: 'Завершите раунд на сложности «сложно» или «хардкор»',
  },
  {
    id: 'campaign3',
    tier: 2,
    en: 'Three levels',
    ru: 'Три уровня',
    enHint: 'Clear 3 campaign levels in one mode',
    ruHint: 'Пройдите 3 уровня кампании в одном режиме',
  },
  {
    id: 'twoModes',
    tier: 2,
    en: 'Two modes',
    ru: 'Два режима',
    enHint: 'Finish a pool round in two different modes',
    ruHint: 'Завершите обычный раунд в двух разных режимах',
  },
  {
    id: 'rank5',
    tier: 2,
    en: 'Level five',
    ru: 'Пятый уровень',
    enHint: 'Reach account level 5',
    ruHint: 'Достигните 5-го уровня аккаунта',
  },
  {
    id: 'veteranWeek',
    tier: 2,
    en: 'One week',
    ru: 'Неделя',
    enHint: 'Keep an account for 7 days',
    ruHint: 'Аккаунту исполнилась 1 неделя',
  },
  {
    id: 'perfect10',
    tier: 3,
    en: 'Ten of ten',
    ru: 'Десять из десяти',
    enHint: 'Score 10/10',
    ruHint: 'Наберите 10 из 10',
  },
  {
    id: 'fiveRegions',
    tier: 3,
    en: 'World tour',
    ru: 'Вокруг света',
    enHint: 'Finish a round in each of the five regions, one region at a time',
    ruHint: 'Завершите раунд в каждом из пяти регионов по отдельности',
  },
  {
    id: 'threeModes',
    tier: 3,
    en: 'Three modes',
    ru: 'Три режима',
    enHint: 'Finish a pool round in three different modes',
    ruHint: 'Завершите обычный раунд в трёх разных режимах',
  },
  {
    id: 'campaign8',
    tier: 3,
    en: 'Eight levels',
    ru: 'Восемь уровней',
    enHint: 'Clear 8 campaign levels in one mode',
    ruHint: 'Пройдите 8 уровней кампании в одном режиме',
  },
  {
    id: 'hardcoreComplete',
    tier: 3,
    en: 'Hardcore',
    ru: 'Хардкор',
    enHint: 'Finish a hardcore pool round without losing your only life',
    ruHint: 'Пройдите обычный раунд в хардкоре до конца',
  },
  {
    id: 'rank10',
    tier: 3,
    en: 'Level ten',
    ru: 'Десятый уровень',
    enHint: 'Reach account level 10',
    ruHint: 'Достигните 10-го уровня аккаунта',
  },
  {
    id: 'play1h',
    tier: 3,
    en: 'One hour',
    ru: 'Час игры',
    enHint: 'Play for 1 hour in total',
    ruHint: 'Сыграйте суммарно 1 час',
  },
  {
    id: 'veteranMonth',
    tier: 3,
    en: 'One month',
    ru: 'Месяц',
    enHint: 'Keep an account for 30 days',
    ruHint: 'Аккаунту исполнился 1 месяц',
  },
  {
    id: 'perfect20',
    tier: 4,
    en: 'Twenty of twenty',
    ru: 'Двадцать из двадцати',
    enHint: 'Score 20/20',
    ruHint: 'Наберите 20 из 20',
  },
  {
    id: 'allModes',
    tier: 4,
    en: 'All modes',
    ru: 'Все режимы',
    enHint: 'Finish a pool round in every quiz mode',
    ruHint: 'Завершите обычный раунд в каждом из 9 режимов',
  },
  {
    id: 'campaign15',
    tier: 4,
    en: 'Fifteen levels',
    ru: 'Пятнадцать уровней',
    enHint: 'Clear 15 campaign levels in one mode',
    ruHint: 'Пройдите 15 уровней кампании в одном режиме',
  },
  {
    id: 'hardcoreLevel',
    tier: 4,
    en: 'Gold level',
    ru: 'Золотой уровень',
    enHint: 'Clear any campaign level on hardcore',
    ruHint: 'Пройдите любой уровень кампании в хардкоре',
  },
  {
    id: 'completes10',
    tier: 4,
    en: 'Ten finishes',
    ru: 'Десять финишей',
    enHint: 'Finish 10 rounds all the way through',
    ruHint: 'Пройдите 10 раундов до конца',
  },
  {
    id: 'rank20',
    tier: 4,
    en: 'Level twenty',
    ru: 'Двадцатый уровень',
    enHint: 'Reach account level 20',
    ruHint: 'Достигните 20-го уровня аккаунта',
  },
  {
    id: 'campaign20',
    tier: 5,
    en: 'Campaign done',
    ru: 'Кампания',
    enHint: 'Clear campaign level 20',
    ruHint: 'Пройдите 20-й уровень кампании',
  },
  {
    id: 'goldTen',
    tier: 5,
    en: 'Ten gold',
    ru: 'Десять золотых',
    enHint: 'Clear 10 campaign levels on hardcore in one mode',
    ruHint: 'Пройдите 10 уровней кампании в хардкоре в одном режиме',
  },
  {
    id: 'goldFinal',
    tier: 5,
    en: 'Final on the edge',
    ru: 'Финал на грани',
    enHint: 'Clear level 20 with one life',
    ruHint: 'Пройдите 20-й уровень с одной жизнью',
  },
  {
    id: 'perfectHardcore',
    tier: 5,
    en: 'Perfect hardcore',
    ru: 'Идеальный хардкор',
    enHint: 'Score 10/10 on hardcore',
    ruHint: 'Наберите 10 из 10 в хардкоре',
  },
  {
    id: 'worldPerfect',
    tier: 5,
    en: 'The whole world',
    ru: 'Весь мир',
    enHint: 'Score 10/10 on all countries, Hard or Hardcore',
    ruHint: 'Наберите 10 из 10 по всем странам на сложности «сложно» или выше',
  },
  {
    id: 'play10h',
    tier: 5,
    en: 'Ten hours',
    ru: 'Десять часов',
    enHint: 'Play for 10 hours in total',
    ruHint: 'Сыграйте суммарно 10 часов',
  },
  {
    id: 'recordBreak1',
    tier: 2,
    en: 'Record breaker',
    ru: 'Рекордсмен',
    enHint: 'Beat a world record on a campaign level',
    ruHint: 'Обновите мировой рекорд на уровне кампании',
  },
  {
    id: 'recordBreak10',
    tier: 4,
    en: 'Ten records',
    ru: 'Десять рекордов',
    enHint: 'Beat 10 world records on campaign levels',
    ruHint: 'Обновите 10 мировых рекордов на уровнях кампании',
  },
]

export function achievementCopy(id: AchievementId, lang: Lang) {
  const item = ACHIEVEMENTS.find((entry) => entry.id === id) ?? ACHIEVEMENTS[0]
  return lang === 'ru'
    ? { title: item.ru, hint: item.ruHint }
    : { title: item.en, hint: item.enHint }
}
