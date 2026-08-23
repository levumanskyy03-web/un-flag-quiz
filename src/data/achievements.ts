export const ACHIEVEMENT_IDS = [
  'firstRound',
  'firstHit',
  'sharp',
  'perfect',
  'perfect10',
  'perfect20',
  'sprinter',
  'flagToName',
  'nameToFlag',
  'nameToCapital',
  'nameToCurrency',
  'nameToPopulation',
  'nameToFounded',
  'neighborsToName',
  'nameToMap',
  'mapToName',
  'allModes',
  'campaign1',
  'campaign5',
  'campaign10',
  'campaign20',
  'hardcore',
  'threeRegions',
  'fiveRegions',
  'tenRounds',
] as const

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

export interface AchievementInfo {
  id: AchievementId
  mark: string
  en: string
  ru: string
  enHint: string
  ruHint: string
}

export const ACHIEVEMENTS: AchievementInfo[] = [
  { id: 'firstRound', mark: '1', en: 'First step', ru: 'Первый шаг', enHint: 'Finish any round', ruHint: 'Завершите любой раунд' },
  { id: 'firstHit', mark: '+', en: 'On the board', ru: 'Есть попадание', enHint: 'Score at least one correct answer', ruHint: 'Ответьте верно хотя бы раз' },
  { id: 'sharp', mark: '80', en: 'Sharp', ru: 'Точность', enHint: 'Finish a round with 80% or better', ruHint: 'Завершите раунд на 80% или выше' },
  { id: 'perfect', mark: '★', en: 'Clean sheet', ru: 'Без ошибок', enHint: 'Finish a round with a perfect score', ruHint: 'Пройдите раунд без ошибок' },
  { id: 'perfect10', mark: '10', en: 'Ten of ten', ru: 'Десять из десяти', enHint: 'Score 10/10', ruHint: 'Наберите 10 из 10' },
  { id: 'perfect20', mark: '20', en: 'Twenty of twenty', ru: 'Двадцать из двадцати', enHint: 'Score 20/20', ruHint: 'Наберите 20 из 20' },
  { id: 'sprinter', mark: '⏱', en: 'Sprinter', ru: 'Спринт', enHint: 'Finish a round in under 45 seconds', ruHint: 'Завершите раунд быстрее 45 секунд' },
  { id: 'flagToName', mark: '⚑', en: 'Flag reader', ru: 'Читатель флагов', enHint: 'Play Flag → country', ruHint: 'Сыграйте «Флаг → страна»' },
  { id: 'nameToFlag', mark: '▣', en: 'Flag picker', ru: 'Выбор флага', enHint: 'Play Country → flag', ruHint: 'Сыграйте «Страна → флаг»' },
  { id: 'nameToCapital', mark: '★', en: 'Capitals', ru: 'Столицы', enHint: 'Play Country → capital', ruHint: 'Сыграйте «Страна → столица»' },
  { id: 'nameToCurrency', mark: '¤', en: 'Currencies', ru: 'Валюты', enHint: 'Play Country → currency', ruHint: 'Сыграйте «Страна → валюта»' },
  { id: 'nameToPopulation', mark: '∑', en: 'Population', ru: 'Население', enHint: 'Play Country → population', ruHint: 'Сыграйте «Страна → население»' },
  { id: 'nameToFounded', mark: 'YR', en: 'Founded', ru: 'Год основания', enHint: 'Play Country → founding year', ruHint: 'Сыграйте «Страна → год основания»' },
  { id: 'neighborsToName', mark: '⬡', en: 'Neighbors', ru: 'Соседи', enHint: 'Play Neighbors → country', ruHint: 'Сыграйте «Соседи → страна»' },
  { id: 'nameToMap', mark: '▦', en: 'Cartographer', ru: 'Картограф', enHint: 'Play Country → map', ruHint: 'Сыграйте «Страна → карта»' },
  { id: 'mapToName', mark: '⌖', en: 'Locator', ru: 'Локатор', enHint: 'Play Map → country', ruHint: 'Сыграйте «Карта → страна»' },
  { id: 'allModes', mark: '9', en: 'All modes', ru: 'Все режимы', enHint: 'Play every quiz mode at least once', ruHint: 'Сыграйте каждый режим хотя бы раз' },
  { id: 'campaign1', mark: 'I', en: 'Campaign start', ru: 'Старт кампании', enHint: 'Clear campaign level 1', ruHint: 'Пройдите 1-й уровень кампании' },
  { id: 'campaign5', mark: 'V', en: 'Five levels', ru: 'Пять уровней', enHint: 'Clear 5 campaign levels in one mode', ruHint: 'Пройдите 5 уровней кампании в одном режиме' },
  { id: 'campaign10', mark: 'X', en: 'Ten levels', ru: 'Десять уровней', enHint: 'Clear 10 campaign levels in one mode', ruHint: 'Пройдите 10 уровней кампании в одном режиме' },
  { id: 'campaign20', mark: 'XX', en: 'Campaign done', ru: 'Кампания', enHint: 'Clear the last campaign level', ruHint: 'Пройдите последний уровень кампании' },
  { id: 'hardcore', mark: '!', en: 'Hardcore', ru: 'Хардкор', enHint: 'Finish a hardcore round or level', ruHint: 'Завершите раунд или уровень в хардкоре' },
  { id: 'threeRegions', mark: '3', en: 'Three regions', ru: 'Три региона', enHint: 'Play three different continents', ruHint: 'Сыграйте в трёх разных регионах' },
  { id: 'fiveRegions', mark: '5', en: 'World tour', ru: 'Вокруг света', enHint: 'Play all five regions separately', ruHint: 'Сыграйте во всех пяти регионах отдельно' },
  { id: 'tenRounds', mark: '10', en: 'Ten rounds', ru: 'Десять раундов', enHint: 'Finish 10 rounds', ruHint: 'Завершите 10 раундов' },
]

export function achievementCopy(id: AchievementId, lang: 'ru' | 'en') {
  const item = ACHIEVEMENTS.find((entry) => entry.id === id) ?? ACHIEVEMENTS[0]
  return lang === 'ru'
    ? { title: item.ru, hint: item.ruHint, mark: item.mark }
    : { title: item.en, hint: item.enHint, mark: item.mark }
}
