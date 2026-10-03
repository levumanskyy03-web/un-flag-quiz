# Карта сайта

Снимок того, как устроен продукт: маршруты, миры, семьи режимов, общие экраны и слабые места. Источник правды по числам и составу режимов — код (`src/lib/quiz`, `src/lib/modeFamilies.ts`). Экономика Империи подробно в `docs/economy.md` (там черновик баланса, здесь только место Империи в сайте).

Языки интерфейса: `ru`, `en`, `de`, `zh`, `es`, `hi`, `ar`, `bn`, `pt`, `ja`, `he`. Стрелка в названиях режимов в коде всегда `→`; для `ar` и `he` она переворачивается сама.

## Как устроена игра

Страницы викторины (`src/app/(play)/**/page.tsx`) почти пустые. Оболочка одна: `PlayLayout` монтирует `PlayApp`, а URL только выбирает мир. Публичные страницы (страны, подборки, «сегодня», юридические) рендерятся сами.

Общий цикл раунда:

1. Хаб мира: свободная игра, уровни, училка, подборки, ошибки, альбом.
2. Настройки: семья режима, конкретный режим, сложность, микс.
3. Раунд → экран результата → XP, марки, награда Империи.

Пути раунда (`PlayPath`): `pool` (свободная), `levels`, `learn`, `mistakes`, `list`, `daily`.

Сложность: `easy`, `medium`, `hard`, `hardcore`. Для большинства гео-режимов `medium` в пуле вопросов поднимается до `hard` (`difficultyForMode`). Факты, языки, сторона движения, религия, лидеры, математика, астрономия, тематические миры и фото игроков/тренеров сложность не поднимают. `hardcore` в пуле ведёт себя как `hard`.

Микс (`easy` / `hard` / `custom`) есть у каждого мира. Лёгкий микс — короткий набор очевидных режимов. Тяжёлый — почти весь каталог мира, с вырезанными «фактовыми» и частью фото-режимов (см. слабые места).

Вкладки хаба: уровни, свободная игра, училка, подборки, ошибки, альбом. Тип вкладки `map` в коде есть, в сетке хаба она отфильтрована.

Движки вопросов по мирам: `src/lib/quiz/geo.ts`, `football.ts`, `leaders.ts`, `math.ts`, `astro.ts`, `theme.ts`. Общие типы — `core.ts`. UI мира: `GeoPlay`, `FootballPlay`, `LeadersPlay`, `MathPlay`, `AstroPlay`. Биология, олимпиада, информатика, физика и еда идут через один `ThemePlay`.

## Маршруты

| URL | Что это |
| --- | --- |
| `/` | Выбор мира, дневное задание, вход в «Моё» |
| `/geo` | География |
| `/codes` | Постоянный редирект на `/geo`. Коды стран — семья внутри географии |
| `/football` | Футбол |
| `/leaders` | Лидеры |
| `/math` | Математика |
| `/astronomy` | Астрономия |
| `/biology`, `/olympics`, `/cs`, `/physics`, `/food` | Тематические миры на общем движке |
| `/mine` | Свой маршрут из закреплённых викторин |
| `/multiplayer` | Запуск дуэли |
| `/duel/[code]` | Комната 1v1, состояние комнаты живёт здесь, не в `PlayApp` |
| `/studio` | Свои наборы: текст/файлы → каталог → черновик → игра |
| `/empire` | Экономика поверх всех викторин |
| `/profile` | Профиль внутри оболочки игры |
| `/today` | Страна дня |
| `/countries`, `/country/[iso]` | Каталог и паспорт страны |
| `/languages`, `/language/[id]` | Языки |
| `/lists`, `/lists/[world]`, `/lists/[world]/[id]` | Редакционные подборки |
| `/dish/[id]` | Карточка блюда |
| `/about`, `/contacts`, `/terms`, `/privacy`, `/cookies` | Служебные страницы |

Постоянные редиректы: `/company`, `/shop`, `/state` → `/empire`. `/music`, `/melody`, `/transport` → `/`. `/codes` → `/geo`.

Миры викторин (`QUIZ_WORLDS`), в этом порядке на пикере: география, лидеры, футбол, олимпиада, биология, математика, астрономия, информатика, физика, еда.

## География — `/geo`

Самый полный мир. Кампания уровней — общий набор стран (`LEVEL_COUNT`, последний уровень финальный с жизнями 20 / 10 / 3 / 1). Училка, ошибки, альбом марок (до 5 марок на страну из засчитанной игры), паспорта, рейтинги стран.

Семьи (`GEO_FAMILIES`). В сетку обычной игры не входит только `mix`.

| Семья | Режимы |
| --- | --- |
| Микс | Лёгкий: флаг→страна, страна→флаг, страна→столица. Тяжёлый: флаги, столица, валюта, население, основание, соседи, карта, силуэт, факты, язык, движение, религия, строй, моря и реки, все коды |
| Флаги | `flagToName`, `nameToFlag` |
| Столица | `nameToCapital` |
| Валюта | `nameToCurrency` |
| Население | `nameToPopulation` |
| Основание | `nameToFounded` |
| Соседи | `neighborsToName` |
| Карта | `nameToMap`, `mapToName` |
| Силуэт | `silhouetteToName`, `nameToSilhouette` |
| Факты | `factsToName` |
| Вода | `mapToSea`, `seaToName`, `mapToRiver`, `riverToName` |
| Язык | `nameToLanguage`, `languageToName` |
| Движение | `nameToDriving`, `drivingToName` |
| Религия | `nameToReligion`, `religionToName` |
| Строй | `nameToGov` |
| Коды | `tldToName`, `nameToTld`, `callingToName`, `nameToCalling`, `carToName`, `nameToCar` |
| Рейтинги | `rankGdp`, `rankGdpPc`, `rankArea`, `rankGdpPpp`, `rankGini`, `rankMillionaires`, `rankBillionaires`, `rankHappiness`, `rankPopulation`, `rankHdi`, `rankLife`, `rankPress`, `rankCpi`, `rankPassport`, `rankPeace`, `rankCo2`, `rankOlympics`, `rankHeritage` |

## Лидеры — `/leaders`

Четыре линейки: США, папы, Россия, Великобритания. Вопрос бывает про годы, номер и фото. У России и Британии номера в каталоге режимов нет.

| Тема | Режимы |
| --- | --- |
| США | `usYearsToName`, `usNumberToName`, `usPhotoToName` |
| Папы | `popeYearsToName`, `popeNumberToName`, `popePhotoToName` |
| Россия | `rusYearsToName`, `rusPhotoToName` |
| Великобритания | `ukYearsToName`, `ukPhotoToName` |

`isLeadersMode` дополнительно принимает `rusNumberToName`, хотя этого id нет в `LEADERS_MODES`. Сложность лидеров в типах обрезана до easy / medium / hard.

## Футбол — `/football`

Паритет с гео по дуэли, уровням, училке и ошибкам. Кампания своя, по режиму (`footballCampaignLevels`).

| Семья | Режимы |
| --- | --- |
| Микс | Лёгкий: победители ЧМ и Евро, хозяева ЧМ, победители ЛЧ. Тяжёлый: все футбольные режимы, кроме `playerFactsToName` |
| Игроки | `playerPhotoToName`, `playerFactsToName`, `playerToNation`, `playerToClub`, `playerClubToName`, `playerShirtToName`, `ballonDorWinners`, `goldenBallWinners` |
| Тренеры | `managerPhotoToName` |
| Клубы | `uclWinners`, `uclFinalists`, `uclTitleYears`, `europaWinners`, `libertadoresWinners`, `leagueWinners`, `clubCrestToName`, `stadiumToClub` |
| ЧМ | `wcWinners`, `wcFinalists`, `wcHosts`, `wcTitleYears`, `wcScorers`, `wcPenalties` |
| Евро | `euroWinners`, `euroFinalists`, `euroHosts`, `euroTitleYears` |
| Кубок Америки | `copaWinners`, `copaFinalists`, `copaHosts` |
| Кубок Африки | `afconWinners`, `afconFinalists`, `afconHosts` |
| Другие кубки | `asianCupWinners`, `goldCupWinners`, `nationsLeagueWinners` |

## Математика — `/math`

Часть арифметики генерируется (`mathIsGenerated`), пул большой. Кампания есть только у арифметики: 20 уровней по 8 вопросов.

| Семья | Режимы |
| --- | --- |
| Микс | Лёгкий: выражение→значение, дробь/десятичная, фигура→имя, символ→смысл. Тяжёлый: все, кроме `mathFactsToName` |
| Арифметика | `exprToValue`, `valueToExpr`, `fractionDecimal`, `percentToValue`, `powerToValue`, `orderOfOps` |
| Геометрия | `shapeToName`, `nameToShape`, `angleToKind`, `formulaToQuantity`, `unitsConvert` |
| Символы | `symbolToMeaning`, `constantToValue`, `siPrefixToFactor` |
| Люди | `mathPhotoToName`, `mathFactsToName`, `mathPersonToPlace`, `theoremToAuthor` |
| Цифры | Не викторина. Кнопка на экране математики открывает тренажёр знаков после запятой |

## Астрономия — `/astronomy`

Кампания: 12 уровней по 8 вопросов. Люди в кампанию не входят.

| Семья | Режимы |
| --- | --- |
| Микс | Лёгкий: порядок планет, луна→планета, созвездие, миссия→цель. Тяжёлый: все, кроме `astroFactsToName` |
| Планеты | `planetToOrder`, `orderToPlanet`, `planetToKind`, `planetFactsToName` |
| Луны | `moonToPlanet`, `planetToMoon`, `moonFactsToName` |
| Небо | `starToClass`, `constelToName`, `deepSkyFactsToName` |
| Исследования | `missionToTarget`, `missionFactsToName`, `telescopeFactsToName` |
| Люди | `astroPhotoToName`, `astroFactsToName` |

## Тематические миры

Один движок, одни экраны, разные ряды вопросов. Кампания: 12 уровней по 8 вопросов, если режим входит в `THEME_CAMPAIGN_MODES`. Сложность ряда внутри данных: `easy` / `medium` / `hard` (`ThemeTier`), это не то же самое, что сложность раунда.

### Биология — `/biology`

Клетка: `organelleToRole`, `roleToOrganelle`. Тело: `organToSystem`, `systemToOrgan`, `photoStepToName`, `nameToProcess`. Жизнь: `kingdomToExample`, `exampleToKingdom`, `animalToClass`, `classToAnimal`. Дикая природа: `bioPhotoToName`, `bioPhotoToClass`, `speciesToHabitat`, `habitatToSpecies`. Лаборатория: `bioScientistPhoto`, `bioScientistToIdea`, `bioIdeaToScientist`.

### Олимпиада — `/olympics`

Хозяева (летние и зимние, год, страна, число): `olyYearToHost`, `olyHostToYear`, `olyHostCount`, `hostToCountry`, `olyYearToCountry`, `winterYearToHost`, `winterHostToYear`, `winterHostToCountry`. Виды спорта: категория, дебют, снаряд, площадка, федерация, сезон, страна, спортсмен — `sportToCategory`, `categoryToSport`, `sportToDebut`, `eventToSport`, `equipmentToSport`, `sportToEquipment`, `athleteToSport`, `debutToSport`, `sportToFederation`, `federationToSport`, `venueToSport`, `sportToVenue`, `countryToOlySport`, `seasonToSport`, `sportToSeason`. НОК: `nocToName`, `nameToNoc`, `countryToGolds`. Звёзды: `athleteToNoc`, `sportToAthlete`, `olyPhotoToName`. Символы: `olySymbolToMeaning`, `olyMeaningToSymbol`.

`olyPhotoToName` вырезан из тяжёлого микса.

### Информатика — `/cs`

Термины: `csTermToMeaning`, `meaningToCsTerm`. Сленг: `slangToMeaning`, `meaningToSlang`. Потоки: `stepToNext`, `nextToStep`, `stepToFlow`. Язык по коду: `codeToLang`. Структуры: `structToUse`, `useToStruct`. Двоичные: `decToBinary`, `binaryToDec`. Люди: `csPhotoToName`, `personToWork`, `workToPerson`.

`csPhotoToName` нет ни в тяжёлом миксе, ни в кампании.

### Физика — `/physics`

Восемь пар. Единицы, буквы, законы и имена собираются в `src/data/physics/rows.ts`, постоянные, приборы, частицы и спектр — в `src/data/physics/extraRows.ts`. Прямой и обратный вопрос выходят из одной связки:

- единицы: `qtyToUnit`, `unitToQty`
- буквы: `symbolToQty`, `qtyToSymbol`
- законы: `lawToFormula`, `formulaToLaw`
- имена: `effectToPerson`, `personToEffect`
- постоянные: `constToValue`, `valueToConst`
- приборы: `meterToQty`, `qtyToMeter`
- частицы: `particleToTrait`, `traitToParticle`
- спектр: `bandToRole`, `roleToBand`

### Еда — `/food`

Блюда: `dishToCuisine`, `cuisineToDish`, `dishToCourse`, `dishToMain`. Происхождение: `foodToOrigin`, `dishToIngredients`, `ingredientsToCountry`. Фото: `foodPhotoToDish`, `foodPhotoToCuisine`, `foodPhotoToIngredients`, `foodPhotoToCourse`. У блюд есть публичные карточки `/dish/[id]`.

## Сводные вещи, не миры

**Моё (`/mine`).** Игрок закрепляет викторины из каталога всех миров. Маршрут стартует, когда закреплено хотя бы 5 викторин из 3 миров. Станции чередуются по мирам, а не идут блоком одной темы. Прогресс станции и «нога» маршрута лежат в `localStorage`, к аккаунту не привязаны.

**Мультиплеер.** `/multiplayer` только собирает режимы и создаёт матч. Комната, опрос и счёт — `/duel/[code]`.

**Студия (`/studio`).** Первый срез авторских наборов: источник (текст или файлы) → каталог → черновик. Дальше набор играется теми же путями, что мир: игра, училка, уровни, ошибки. Починка через модель — запасной путь, не основной редактор.

**Империя (`/empire`).** Мета-петля на все десять миров: раунд даёт монеты, ресурс мира и специалистов; здания и эпохи тратят их; косметика, бусты и рамки живут здесь. `/company`, `/shop`, `/state` больше не существуют. Гейты, кристаллы и подписка описаны в `docs/economy.md`; купить подписку сейчас нельзя.

**Подборки.** Внутри хаба — игровые коллекции (`src/data/collections.ts`) по мирам. Снаружи — редакционные страницы `/lists`.

**День.** На пикере миров есть дневное задание. Отдельная публичная страница страны дня — `/today`.

**Альбом.** Марки в основном из засчитанной географии. В Империи поверх альбома есть редкости и наборы.

**Профиль.** Экран внутри `PlayApp`. Сама `page.tsx` возвращает `null`, как и остальные страницы оболочки.

## Слабые места

Номера прежние. Порядок — от простого исправления к тяжёлому.

3. Семья «цифры» — не викторина. В сетке режимов её нет; кнопка на экране математики открывает тренажёр знаков. `settingsForMathFamily('digits')` больше не подменяет её арифметикой.
14. `/transport` и `/codes` — постоянные редиректы в `next.config.ts` (`/` и `/geo`), отдельных страниц в `app/` нет. Карта географии — обычная вкладка хаба, не боковая кнопка.
8. Рейтинги входят в семьи гео и в переключатель режимов. Из окна семьи можно выбрать рейтинг и начать раунд. Училка, ошибки и дуэль их тоже показывают.
6. Тяжёлый микс включает факты, язык, движение, религию и строй в гео, факты игроков, математиков и астрономов, портреты олимпиады и информатики.
7. `medium` остаётся средним пулом. У флагов, карт, столиц и кодов средний пул — отдельная полоса стран, не тот же набор, что `hard`. `hardcore` берёт более узкий пул, чем `hard`: худшая половина стран, старые годы турниров, сложный ярус лидеров и тематических рядов.
4. Лидеры — четыре страны и несимметричные вопросы: номер есть у США и пап, нет у России и Британии. `rusNumberToName` распознаётся проверкой режима и отсутствует в каталоге.
5. Тренеры в футболе — один фото-режим. «Другие кубки» — только победители, без финалистов и хозяев, в отличие от ЧМ, Евро, Кубка Америки и Кубка Африки.
2. Кампании дырявые. У математики уровни только у арифметики. У астрономии люди вне кампании. У информатики фото людей вне кампании и вне тяжёлого микса. У географии уровни общие на страну, а не на каждый режим: «уровень 7 по религии» и «уровень 7 по флагу» — не одна и та же идея.
13. Оболочка игры не отдаёт HTML страницы: поисковик и «открыть без JS» видят пустой `page.tsx`. В индекс попадают паспорта, подборки, страна дня, языки и блюда. Хабы миров туда не входят.
15. Одиннадцать языков обязательны для любой новой строки. Узкие миры повторяют одну строку на всех языках (`same()` в физике для символов) или требуют перевода там, где смысл международный. Качество копий расходится быстрее, чем игровой дизайн.
10. Тематические миры делят один UI. Отличие мира — иконка, цвета и таблица пар. Ошибки, училка и уровни ощущаются копией.
1. Олимпиада, биология, информатика, еда и физика играют одним шаблоном «термин ↔ ответ». Физика — самый тонкий мир: четыре пары и сгенерированные ряды, без своего движка. Еда и информатика узкие по типам вопроса.
9. «Моё» — локальный список, не кампания с автором станций. Смена браузера обнуляет маршрут. Чередование миров механическое: пять случайных закрепов не складываются в маршрут с нарастанием.
11. Студия останавливается на черновике из текста и файлов. Это не редактор курса и не общий каталог чужих наборов.
12. Баланс Империи в `docs/economy.md` всё ещё черновик, кристаллы не покупаются, подписка — флаг без кассы. Игрок может упереться в гейт без понятного второго пути.
16. Сознательно нет: гимны, массовые гербы, новости, чат.
