# «Империя» — экономика сайта

Дизайн-документ. Описывает idle-игру «Империя» (`/empire`), которая заменяет Company, State, недельный рынок/контракты/сейф и Shop одной серверной экономикой, и то, как она связана с викторинами и остальным сайтом. Код по этому документу пишется отдельными PR (см. раздел 11).

Статус: черновик для реализации. Все числа — стартовый баланс, подлежат подстройке после первых недель.

---

## 1. Цель и границы

**Что делаем.** Одна игровая петля для всего сайта:

> сыграл раунд викторины → получил специалистов, монеты и ресурс мира → построил/улучшил здание → страна производит больше → открыл новую эпоху и новые коллекции → снова играешь, чтобы расти дальше.

**Что заменяем (удаляется):**

| Сейчас | Файлы | Что с этим будет |
| --- | --- | --- |
| Токены, магазин рамок/бустов | `src/lib/tokenStore.ts`, `src/data/tokens.ts`, `src/components/ShopScreen.tsx`, `src/features/play/ShopPlay.tsx`, `src/app/(play)/shop/page.tsx` | Токены конвертируются в монеты. Косметика и бусты переезжают в Империю. `/shop` → редирект на `/empire`. |
| Company (знания, стадии, искры, HQ) | `src/lib/companyStore.ts`, `src/data/company.ts`, `src/components/CompanyScreen.tsx`, `src/features/play/CompanyPlay.tsx`, `src/app/(play)/company/page.tsx` | Знания конвертируются в монеты, стадии — в кристаллы. `/company` → редирект. |
| State (министерства, служащие, башня) | `src/lib/stateStore.ts`, `src/data/state.ts`, `src/components/StateScreen.tsx`, `src/features/play/StatePlay.tsx`, `src/app/(play)/state/page.tsx` | Министерства → стартовые уровни зданий, служащие → специалисты. `/state` → редирект. |
| Недельный рынок, контракты, сейф с маркой | `src/lib/economyStore.ts`, `src/data/economy.ts` | Удаляется. Марка из сейфа возвращается в альбом. |

**Что остаётся без изменений:**

- Марки (`src/lib/stamps.ts`, `stampCatalog.ts`) — коллекция сохраняется, поверх добавляются редкости и наборы (раздел 5).
- XP, уровни, кампании, мировые рекорды (`src/lib/xp.ts`, leaderboard).
- Рейтинг дуэлей (`/api/duel/ratings`, `src/features/duel/`).
- Ежедневное задание (`src/lib/dailyChallenge.ts`) — становится источником наград Империи.
- Аккаунты (`src/lib/authStore.ts`) — Империя привязана к `PublicAccount.id`.

**Не делаем сейчас:** реальные платежи, обмен между игроками, кланы. Архитектурно закладываем кристаллы как будущую платную валюту (раздел 9) и подписку «Империя+» как флаг в состоянии игрока без способа его купить (раздел 4.8).

**Принцип доступа.** Большая часть контента закрыта. Бесплатно и без условий открыт только «вход»: свободная игра на `easy`/`medium`, первые уровни кампании, daily, первые две коллекции каждого мира и первая эпоха Империи. Всё остальное открывается одним из двух способов — подпиской (когда появится) или внутренней валютой: монетами, ресурсом мира или кристаллами. Оба пути ведут к одному и тому же контенту; подписка лишь снимает необходимость копить. Полная карта гейтов — раздел 4.8.

---

## 2. Ресурсы

Три слоя валюты. Все значения — целые числа.

### 2.1 Монеты (`coins`)

Общая валюта страны. Единственное, чем платят за подсказки в викторине и за большинство улучшений.

| Источник | Куда тратится |
| --- | --- |
| Раунды викторин (раздел 4.1) | Уровни зданий (основная стоимость) |
| Пассивное производство всех зданий | Подсказка / пропуск / жизнь в викторине |
| Дуэли, daily, достижения | Косметика (рамки, темы шаринга) |
| Продажа излишков ресурса мира в Сокровищнице | Разблокировка коллекций (альтернативный способ) |

### 2.2 Кристаллы (`gems`)

Премиум-валюта. Зарабатываются редко, не производятся пассивно, не покупаются за монеты. Полный список источников и трат — раздел 9.

### 2.3 Ресурсы миров (`res[world]`)

По одному на каждый из девяти `QUIZ_WORLDS` (`src/lib/quiz/core.ts:305`). Нужны, чтобы улучшать здание своего мира, открывать коллекции своего мира и переходить в следующую эпоху (эпоха требует все девять).

| `QuizWorld` | Ресурс | Ключ | Здание-производитель |
| --- | --- | --- | --- |
| `geo` | Карты | `maps` | Картографическая палата |
| `leaders` | Печати | `seals` | Сенат |
| `football` | Билеты | `tickets` | Стадион |
| `olympics` | Медали | `medals` | Арена |
| `biology` | Семена | `seeds` | Ботанический сад |
| `math` | Чертежи | `blueprints` | Академия |
| `astronomy` | Звёздная пыль | `stardust` | Обсерватория |
| `cs` | Чипы | `chips` | Вычислительный центр |
| `food` | Специи | `spices` | Рынок специй |

Названия ресурсов и зданий — i18n-ключи (раздел 10), в коде используются только `world` и ключ ресурса.

### 2.4 Специалисты (`specialists[world]`)

Не валюта, а население. Приходят только из викторин, никуда не тратятся, постоянны. Каждый специалист привязан к миру и работает в здании своего мира. Лимит — вместимость Жилья (раздел 3.3).

---

## 3. Здания и эпохи

### 3.1 Список зданий

Девять мировых зданий (таблица 2.3) плюс пять общих:

| Здание | Ключ | Роль |
| --- | --- | --- |
| Ратуша | `hall` | Уровень ратуши определяет эпоху. Единственное здание, которое стоит все девять ресурсов. |
| Жильё | `housing` | Вместимость специалистов. |
| Склад | `storage` | Кап накопления ресурсов и офлайн-часов. |
| Сокровищница | `treasury` | Кап монет, курс продажи ресурсов миров за монеты. |
| Библиотека | `library` | Скидка на подсказки в викторине, бесплатные заряды подсказок в день. |
| Пантеон | `pantheon` | Открывается только финалом миссии «Полиглот знаний» (раздел 9.1). Производит все девять ресурсов по формуле мирового здания с `S = Σ specialists / 9`. |

Максимальный уровень любого здания в эпохе `E` равен `5 × E` (в 8-й эпохе — 40).

### 3.2 Стоимость улучшения

Улучшение с уровня `L` на `L+1` (уровень 0 = не построено):

```
coinCost(L)   = round(50 × 1.18^L)
resCost(L)    = round(10 × 1.15^L)          # ресурс своего мира; для общих зданий — не требуется
hallCost(L)   = round(30 × 1.22^L)          # каждого из девяти ресурсов
```

Ориентиры: уровень 10 ≈ 260 монет + 40 ресурса; уровень 20 ≈ 1 370 монет + 165 ресурса; уровень 40 ≈ 37 000 монет + 2 700 ресурса.

Улучшение мгновенное в эпохах 1–2. С 3-й эпохи появляется таймер стройки:

```
buildMs(L, E) = max(0, E - 2) × L × 30_000       # эпоха 3, уровень 10 → 5 мин; эпоха 8, уровень 40 → 2 ч
```

Одна стройка за раз; вторая очередь открывается Ратушей уровня 15. Таймер можно пропустить за кристаллы (раздел 9).

### 3.3 Производство

Для мирового здания уровня `L` с `S` специалистами своего мира в эпохе `E`:

```
resPerHour(L, S, E)   = 6 × L × (1 + 0.2 × S) × eraMult(E)
coinsPerHour(L, S, E) = 4 × L × (1 + 0.2 × S) × eraMult(E)
```

Суммарные монеты в час = сумма по девяти зданиям. Общие здания монет не производят.

Вместимость Жилья и капы:

```
housingCap(L)   = 9 + 6 × L               # всего специалистов по всем мирам
storageCap(L)   = 200 × (1 + L) × eraMult # кап каждого ресурса мира
treasuryCap(L)  = 1000 × (1 + L) × eraMult
offlineHours(L) = min(24, 8 + 2 × L)      # Склад: 8 ч базово, 24 ч с уровня 8
sellRate(L)     = 1 + 0.1 × L             # монет за 1 единицу ресурса при продаже
libraryOff(L)   = min(0.4, 0.05 × L)      # скидка на подсказки, до 40 %
libraryFree(L)  = floor(L / 5)            # бесплатных подсказок в день
```

Офлайн-тик считается сервером по `lastTickAt`:

```
elapsed = min(now - lastTickAt, offlineHours × 3600_000)
gain    = ratePerHour × elapsed / 3600_000       # для каждого ресурса и монет, с округлением вниз и накоплением остатка в `carry`
```

Первые 30 минут офлайна идут с коэффициентом 1.0, дальше — 0.6 (аналог `COMPANY_OFFLINE_FACTOR`), чтобы активная игра оставалась выгоднее.

### 3.4 Эпохи

Восемь эпох, без сброса. Переход — действие `advanceEra`, доступное, когда выполнены все условия строки.

| E | Эпоха | Ключ | `eraMult` | Ратуша ≥ | Σ уровней зданий ≥ | Каждого ресурса ≥ | Ориентир времени |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Поселение | `settlement` | 1.0 | — | — | — | старт |
| 2 | Античность | `antiquity` | 1.5 | 3 | 20 | 60 | 2–3 дня |
| 3 | Средневековье | `medieval` | 2.2 | 6 | 50 | 200 | 1 неделя |
| 4 | Новое время | `earlyModern` | 3.2 | 10 | 100 | 600 | 3 недели |
| 5 | Индустрия | `industrial` | 4.6 | 15 | 170 | 1 500 | 6 недель |
| 6 | Электричество | `electric` | 6.5 | 20 | 260 | 3 500 | 3 месяца |
| 7 | Цифровая эпоха | `digital` | 9.0 | 27 | 370 | 8 000 | 4,5 месяца |
| 8 | Космос | `space` | 12.5 | 35 | 500 | 18 000 | 6+ месяцев |

При переходе: ресурсы, указанные в столбце «каждого ресурса ≥», списываются; `eraMult` растёт; максимальный уровень зданий поднимается; меняются спрайты (раздел 12); начисляется 5 кристаллов.

---

## 4. Интеграция с сайтом

Это главный раздел: что именно меняется в существующем коде.

### 4.1 Награды за раунд викторины

Единая точка — новая функция `empireOnRound(ctx)` в `src/lib/empireStore.ts`, вызывается вместо тройки `companyOnRound` + `economyOnRound` + `realmOnRound`:

- `src/features/play/PlayApp.tsx:582-588` (уровень пройден), `:614-620` (уровень провален), `:641-647` (свободная игра / коллекция / daily);
- `grantRoundTokens` в `PlayApp.tsx:1470-1481` — удаляется целиком, `setEarnedTokens` заменяется на `setEarnedEmpire(reward)`.

Контекст: `world`, `path: PlayPath`, `endedBy`, `correct`, `total`, `difficulty`, `hardcore`, `perfect`, `deltaXp`, `worldRecord`.

| `PlayPath` / исход | Специалисты мира | Монеты | Ресурс мира | Кристаллы |
| --- | --- | --- | --- | --- |
| `pool`, `complete` | +1 (+1 если `hardcore`) | `perCorrect(diff) × correct` | `2 × correct` | +1 если `perfect` и `diff ≥ hard` |
| `pool`, `lives`/`timeout` | 0 | `perCorrect(diff) × correct` / 2 | `correct` | 0 |
| `list`, `complete` | +1 | как `pool` × 1.25 | `3 × correct` | +1 если `perfect` |
| `daily`, `complete` | +2 | как `pool` × 1.5 | `4 × correct` | +1 (один раз в день) |
| `levels`, пройден | +1 (+1 если `levelHardcore`) | `ceil(deltaXp / 20) + 25 × worldRecord` | `total` | +1 если `worldRecord` |
| `levels`, провален | 0 | 0 | `floor(correct / 2)` | 0 |
| `learn`, `mistakes` | 0 | `correct` (макс. 20 за раунд) | 0 | 0 |

```
perCorrect(easy) = 1, perCorrect(hard) = 2, perCorrect(hardcore) = 3   # прежний tokensPerCorrect
```

Дневной кап монет из раундов: `300 + 100 × E`. Специалисты за пределами `housingCap` не начисляются, а откладываются в `pendingSpecialists[world]` (максимум 10 на мир) и заселяются, когда игрок улучшает Жильё — так раунд не пропадает.

Множители `eraMult` к наградам за раунд **не** применяются: раунд — источник специалистов, а не денег. Иначе поздние эпохи обесценивают пассив.

### 4.2 Дуэли и рейтинг

`src/features/duel/DuelApp.tsx:249-251` — `awardPlayTokens(tokensForDuel(...))` и `awardAchievementTokens(...)` заменяются на `empireOnDuel({ youWon })`:

| Исход | Монеты | Кристаллы |
| --- | --- | --- |
| Победа | 20 | +1 за каждую 5-ю победу подряд |
| Ничья | 8 | 0 |
| Поражение | 4 | 0 |

Дуэль не даёт специалистов и ресурсов — иначе фарм в режиме «поддавков».

### 4.3 Ежедневное задание

`saveDailyComplete` (`PlayApp.tsx:687`) остаётся. Дополнительно, при `path === 'daily'` и `complete`, Империя начисляет награду по строке `daily` из таблицы 4.1 и отмечает `dailyClaimedDay` в `EmpireState`, чтобы кристалл выдавался один раз в день даже при перезаходе.

Серия daily: 7 дней подряд → +3 кристалла, 30 дней → +10.

### 4.4 Подсказка, пропуск, жизнь

Сейчас: `powerTokenCost(kind)` из `economyStore` и `spendTokens` в `PlayApp.tsx:1495`, `:1504`, `:1513`; отображение в `QuizScreen.tsx:599-618`.

Станет: `powerCoinCost(kind)` и `spendCoins(kind)` из `empireStore`:

```
base = { hint: 12, skip: 18, life: 25 }
powerCoinCost(kind) = max(6, round(base[kind] × (1 - libraryOff(library.level))))
```

Порядок списания: сначала бесплатные заряды Библиотеки (`libraryFree` в день, только для `hint`), затем монеты. `QuizScreen` показывает `t.quizHint · 12` как сейчас, но с иконкой монеты, а при наличии заряда — `t.quizHint · free`.

Подсказки, как и раньше, доступны только на `path === 'pool'` (`powerEnabled`).

### 4.5 Бонус времени и XP-буст

- `stateTimeBonusMs` (`PlayApp.tsx:145`) → `empireTimeBonusMs(world)`: `+1 500 мс × floor(level(world) / 10)`, максимум +6 с в 8-й эпохе.
- `tokenXpMultiplier` (`PlayApp.tsx:631`) → `empireXpMultiplier()`: 1.5 пока активен купленный XP-буст (раздел 4.7).
- `stateBoostPower(..., 'tokens', 'geo')` (`PlayApp.tsx:1130`) — условие «показывать ли подсказку о государстве» удаляется вместе с State.

### 4.6 Марки

`awardRoundStamps` (`PlayApp.tsx:762`) и `stamps.ts` не меняются. Поверх альбома Империя читает `loadWorldStampAlbums()` и считает пассивные множители (раздел 5). Сейф и залог марки (`pledgeStamp`, `takeStampCopy` в `economyStore`) удаляются; при миграции копия возвращается в альбом.

### 4.7 Косметика и бусты (бывший Shop)

Переезжают в вкладку «Казна» на `/empire`. Владение хранится в `EmpireState.cosmetics`, экипировка — там же. Читают его `ResultsShareShot.tsx` и `SettingsModal.tsx` (сейчас через `useTokens`).

| Предмет | Было (токены) | Станет |
| --- | --- | --- |
| Рамки `laurel / gold / night / orbit` | 80 / 120 / 160 / 200 | монеты 200 / 400 / 800 / 1 500; `orbit` требует эпоху ≥ 4 |
| Темы шаринга `ink / gold / night` | 60 / 90 / 120 | монеты 150 / 300 / 600 |
| Буст знаний 5 мин | 40 | удаляется (знаний больше нет) |
| XP-буст ×1.5 на 15 мин | 50 | 60 монет, или 1 кристалл на 2 часа |
| Скин HQ | 300, 80 стадий | заменяется скинами Ратуши по эпохе (бесплатно с эпохой) |

### 4.8 Гейты: что закрыто и как открывается

Единая функция доступа `access(feature, state): 'open' | 'locked'` в `src/lib/empire/rules.ts`. Любой гейт открывается **либо** подпиской (`state.plus.until > now`), **либо** внутренней валютой / прогрессом. Подписка — только флаг; экрана покупки нет, есть заглушка «скоро» (`empirePlusSoon`). Купленные за валюту разблокировки — постоянные, хранятся в `state.unlocks`.

Карта гейтов (`requires` — достаточно любого из перечисленных):

| Контент | Где проверяется | Бесплатно | Подписка | За валюту / прогресс |
| --- | --- | --- | --- | --- |
| Свободная игра `easy`, `medium` | — | да | — | — |
| Свободная игра `hard` | `PlayApp` при старте `pool`, `QuizScreen` пикер сложности | нет | да | эпоха ≥ 2, или разово 300 монет |
| Свободная игра `hardcore` | там же | нет | да | эпоха ≥ 3, или разово 5 кристаллов |
| Кампания: уровни 1–10 каждого мира | `LevelsScreen` | да | — | — |
| Кампания: уровни 11–25 | `LevelsScreen`, `PlayApp` при `path === 'levels'` | нет | да | здание мира ≥ 5, или разово 200 ресурса мира |
| Кампания: уровни 26 – `CAMPAIGN_LEVELS` и финал | там же | нет | да | здание мира ≥ 15, или разово 800 ресурса мира |
| Хардкор-режим уровней (`levelHardcore`) | там же | нет | да | эпоха ≥ 3 |
| Learn (таблицы) | `LearnScreen` | первые 30 строк каждой таблицы | да | здание мира ≥ 3, или 150 монет за мир |
| Mistakes (тренажёр ошибок) | `PlayApp` при `path === 'mistakes'` | 1 запуск в день | да | Библиотека ≥ 5 |
| Коллекции `/lists`: индекс 0–1 в мире | — | да | — | — |
| Коллекции `/lists`: индекс ≥ 2 | `lists/[world]/[id]/page.tsx`, `roundReward` | нет | да | здание мира ≥ `requiredLevel(i)`, или `40 × requiredLevel(i)` ресурса |
| Daily | — | да | — | — |
| Дуэли: быстрый матч | `MultiplayerPlay` | да | — | — |
| Дуэли: приватная комната с кодом, выбор мира и сложности | `MultiplayerPlay`, `/api/duel/create` | нет | да | эпоха ≥ 2, или 400 монет |
| Свои материалы `/studio` (создание и правка паков) | `StudioPlay`, `/api/pack/analyze`, `/api/pack/fix` | просмотр и игра в уже созданные паки | да | Академия (`math`) ≥ 10 **и** Библиотека ≥ 10, или разово 15 кристаллов |
| Gemini-исправление пака (`/api/pack/fix`) | сервер | нет | да (лимит 20/день) | 1 кристалл за вызов |
| Империя: эпоха 2 | `advanceEra` | нет | — | условия таблицы 3.4 (валютой не покупается) |
| Империя: 2-й строительный слот, офлайн 24 ч | `build`, `tick` | нет | да (постоянно) | кристаллы по разделу 9 |
| Косметика: рамки `night`, `orbit`, темы шаринга `gold`, `night` | `buyCosmetic` | нет | да | монеты по таблице 4.7 |
| Скины Ратуши прошлых эпох | `equip` | текущая эпоха | все | 3 кристалла за скин |
| Экспорт результата с флагом страны Империи (`ResultsShareShot`) | клиент | нет | да | эпоха ≥ 4 |
| Лидерборд Империи: полный топ-100 и профили | `/api/empire/board` | топ-10 без профилей | да | эпоха ≥ 3 |
| Статистика: история раундов старше 7 дней, графики | `SettingsModal` / профиль | 7 дней | да | Сокровищница ≥ 5 |

```
requiredLevel(i) = 2 + 2 × (i - 2)                 # для коллекций с индексом i ≥ 2
```

Правила применения:

- Клиент прячет или блюрит закрытое и показывает плашку `lockedBy`: «Империя+ (скоро)» и второй вариант «открыть за X / построить Y». Плашка ведёт на `/empire` к нужному зданию.
- Сервер повторяет проверку там, где есть серверная точка: `roundReward` (сложность, уровень, коллекция, mistakes), `/api/duel/create`, `/api/pack/*`, `/api/empire/board`. Раунд по закрытому контенту награду не даёт и в `nonce` не пишется.
- Публичные страницы (`/country/*`, `/lists/*` обзор, `/today`, `/countries`) остаются полностью открытыми и индексируемыми — закрывается только игра.
- Ежедневная коллекция (`dailyCollection`) все гейты игнорирует.
- Гость (раздел 8) видит те же гейты; подписки у него быть не может, покупка за валюту в пробе недоступна.

Подписка в состоянии: `plus: { until: number; source: 'none' | 'grant' | 'store' }`. Единственный способ выставить сейчас — админское действие `grantPlus` для тестов (раздел 7.3). Когда появится оплата, `store` заполняется через тот же `receipt`-механизм, что и `grantGems`.

### 4.8.1 Свои материалы (`/studio`)

Режим закрывается целиком как создание: кнопки «новый пак», «из текста/файла», редактор и `analyze`/`fix` требуют `access('studio')`. Уже созданные паки остаются играбельны у автора и по ссылке — иначе пропадёт контент, который люди уже сделали. На экране `/studio` без доступа: список своих паков (если есть) + плашка `studioLocked` с двумя путями: «Империя+ (скоро)» / «Академия 10 + Библиотека 10, или 15 кристаллов». Рядом строка `studioWhy`: «Свои паки — это ваш учебный класс. Он открывается, когда страна выучилась сама».

### 4.9 Навигация и роуты

- Новый роут `src/app/(play)/empire/page.tsx` → `src/features/play/EmpirePlay.tsx` → `src/components/EmpireScreen.tsx`.
- `WorldPickScreen.tsx`: плитка `is-state` (`:120-126`) и вкладки дока `onCompany` / `onShop` (`:131-138`) заменяются одной плиткой `is-empire` с названием страны и текущей эпохой. Пропсы `onCompany`, `onShop`, `onState` → `onEmpire`.
- `next.config.ts` `redirects()`: `/company`, `/state`, `/shop` → `/empire` (`permanent: true`).
- `src/app/sitemap.ts:22-24`: три URL заменяются на `/empire`.
- `.cursor/rules/play-structure.mdc`: строки про Company / Shop / State заменяются на Empire.
- Тур (`src/i18n/tourCopy.ts`, `data-tour="state"`) → шаг про Империю.

### 4.10 Что удаляется

Файлы: `src/lib/economyStore.ts`, `stateStore.ts`, `companyStore.ts`, `tokenStore.ts`; `src/data/economy.ts`, `state.ts`, `company.ts`, `tokens.ts`; `src/components/CompanyScreen.tsx`, `StateScreen.tsx`, `ShopScreen.tsx`; `src/features/play/CompanyPlay.tsx`, `StatePlay.tsx`, `ShopPlay.tsx`; три `page.tsx`.

Остаются нужные типы из `tokens.ts` — `CardFrameId`, `ShareThemeId`, `isCardFrameId`, `isShareThemeId` — переезжают в `src/data/cosmetics.ts`.

i18n: ключи с префиксами `company*`, `state*`, `shop*`, `token*`, `economy*`, `vault*`, `contract*`, `market*` в `strings.ts` / `extra.ts` и файлы `stateCopy.ts`, `tokenCopy.ts` удаляются после того, как их последний потребитель исчез. Ключи `quizHint`, `quizSkip`, `quizExtraLife` остаются.

---

## 5. Марки: редкости и наборы

Альбом не меняется, добавляется прочтение поверх.

**Редкость** страны/карточки — детерминированная функция от `id`: 70 % обычные, 22 % редкие, 7 % эпические, 1 % легендарные. Хранить не нужно, считается `stampRarity(id)`.

**Наборы** — регионы для `geo` (по `region` страны), лиги/сборные для `football`, группы `StampGroupId` для остальных миров.

Пассивные множители к `resPerHour` соответствующего мира:

```
albumMult(world) = 1 + 0.002 × countriesWithStamp(world)         # до +0.4 при полном гео-альбоме (193 страны)
                     + 0.05 × completedSets(world)                # полный набор = все id набора имеют ≥ 1 марку
                     + 0.01 × epicOrLegendaryOwned(world)
```

Полный набор дополнительно даёт разовые 3 кристалла (флаг в `EmpireState.setBonusClaimed`).

---

## 6. Миграция

Один раз, при первом открытии сайта после релиза, на клиенте (`migrateLegacyToEmpire()`), результат отправляется на сервер как часть `import` (раздел 8) и там повторно валидируется по капам.

| Старое | Формула | Куда |
| --- | --- | --- |
| `TokenState.balance` | ×1 | `coins` |
| `CompanyState.knowledge` | ÷4, округление вниз | `coins` |
| `CompanyState.claimed` (стадии) | ÷10, округление вниз | `gems` |
| `RealmState.ministries[k]` | сумма уровней `Σ` | `coins += 40 × Σ`; здание `hall` получает `min(3, floor(Σ / 10))` |
| `RealmState.servants` | ×1 | `specialists.geo` (в пределах `housingCap(0) = 9`, остаток в `pendingSpecialists.geo`) |
| `EconomyState.vaultIso` | — | `returnStampCopy(iso)` в альбом |
| Активные контракты со ставкой | ставка возвращается | `coins` |
| `TokenState.ownedFrames`, `ownedShare`, `frame`, `shareTheme` | как есть | `cosmetics` |
| `TokenState.xpBoostUntil` | как есть | `boosts.xpUntil` |
| `hqSkin`, `knowledgeBoostUntil`, `CompanyState.hq` | — | отбрасываются |

После конверсии: старые ключи `localStorage` (`un-flag-quiz-tokens`, `-company`, `-state`, `-economy`) удаляются, ставится `un-flag-quiz-empire-migrated` (JSON grant до подтверждения сервером, затем `1`). На сервере в `EmpireState.legacyAt` пишется время; повторное `legacy` отвечает 409 `exists`.

Стартовый бонус для всех (и новых, и мигрирующих): 100 монет и по 10 каждого ресурса, чтобы первое здание строилось сразу.

---

## 7. Сервер и данные

### 7.1 Хранение

Upstash Redis через тот же `redisCommand` (`src/lib/authStore.ts:561`), но не один общий blob, а ключ на игрока:

| Ключ | Тип | Содержимое |
| --- | --- | --- |
| `empire:state:{accountId}` | string (JSON) | `EmpireState` |
| `empire:board` | sorted set | `score → accountId`, обновляется при каждом изменении `score` |
| `empire:roundNonce:{accountId}` | set с TTL 24 ч | id уже зачтённых раундов |
| `empire:import:{accountId}` | string | `1`, если legacy-импорт уже был |

Локальный fallback для `next dev` без Redis — файл `data/empire/{accountId}.json`, как в `leaderboardStore.ts:353`.

### 7.2 Схема

```ts
type EmpireState = {
  v: 1
  name: string                                   // название страны, как RealmState.name
  era: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  coins: number
  gems: number
  res: Record<EmpireResource, number>            // maps, seals, tickets, medals, seeds, blueprints, stardust, chips, spices
  carry: Record<EmpireResource | 'coins', number> // дробные остатки производства
  buildings: Record<EmpireBuilding, { level: number; buildUntil: number | null }>
  specialists: Record<QuizWorld, number>
  pendingSpecialists: Record<QuizWorld, number>
  unlockedLists: string[]                        // `${world}/${id}`
  unlocks: string[]                              // разовые покупки гейтов: 'hard', 'hardcore', 'levels2:geo', 'learn:football', 'studio', 'duelRoom', …
  plus: { until: number; source: 'none' | 'grant' | 'store' }   // подписка «Империя+»; пока только grant
  legacy: {                                      // прогресс долгих миссий (раздел 9.1)
    progress: Record<LegacyMissionId, number>
    stage: Record<LegacyMissionId, number>       // сколько ступеней уже получено
    claimed: LegacyMissionId[]                   // финал получен
  }
  lifetime: {                                    // счётчики для миссий, только растут
    rounds: number; perfectRounds: number; hardcoreRounds: number
    correctByWorld: Record<QuizWorld, number>
    dailyDays: number; dailyBestStreak: number
    duelWins: number; duelBestStreak: number
    coinsEarned: number; resEarned: Record<EmpireResource, number>
    buildsDone: number; gemsEarned: number
    activeDays: number                           // дней с хотя бы одним раундом
    listsCleared: string[]                       // `${world}/${id}` пройденные идеально
  }
  cosmetics: {
    frames: CardFrameId[]; frame: CardFrameId | null
    shares: ShareThemeId[]; share: ShareThemeId | null
  }
  boosts: { xpUntil: number }
  daily: { day: string; coinsFromRounds: number; hintsUsed: number; gemClaimed: boolean; streak: number }
  setBonusClaimed: string[]
  duelStreak: number
  lastTickAt: number
  createdAt: number
  migratedAt: number | null      // импорт пробы с клиента
  legacyAt: number | null        // конверсия токенов/Компании/Государства (один раз на аккаунт)
  lifetime: EmpireLifetime       // счётчики Наследия (§9.1), только растут
  legacy: { stage: Record<LegacyMissionId, number>; claimed: LegacyMissionId[] }
  titles: LegacyTitleId[]; title: LegacyTitleId | null
  score: number                                  // денормализовано для лидерборда
}
```

`score` (раздел 7.5) пересчитывается на сервере после каждого действия.

### 7.3 API

Один роут `src/app/api/empire/route.ts`, авторизация через `accountFromRequest`.

| Метод | Тело | Ответ | Что делает |
| --- | --- | --- | --- |
| `GET /api/empire` | — | `EmpireState` после тика | Читает, применяет офлайн-тик, сохраняет. |
| `POST /api/empire` | `{ action, ... }` | `EmpireState` + `reward?` | Валидирует и применяет действие. |

Действия (`action`):

| Действие | Параметры | Проверки сервера |
| --- | --- | --- |
| `tick` | — | Только пересчёт производства. Клиент вызывает при возврате фокуса. |
| `build` | `building` | Уровень < макс. для эпохи; нет активной стройки (или открыта вторая очередь); хватает монет и ресурса. |
| `finishBuild` | `building` | `buildUntil ≤ now` — или списание кристаллов за пропуск. |
| `advanceEra` | — | Условия таблицы 3.4. |
| `rename` | `name` | Правила `parseAccountName`. |
| `buyPower` | `kind: 'hint' \| 'skip' \| 'life'` | Хватает монет или есть заряд Библиотеки. Возвращает `granted: true`. |
| `unlockList` | `world`, `id` | Коллекция существует, ещё не открыта, хватает ресурса. |
| `unlock` | `feature` (ключ из таблицы 4.8) | Гейт покупаем за валюту, ещё не куплен, хватает монет / ресурса / кристаллов. |
| `claimLegacy` | `mission` | Прогресс ≥ порога следующей ступени (раздел 9.1). Награда начисляется сервером. |
| `grantPlus` | `days` | Только для аккаунтов из `EMPIRE_ADMIN_IDS` (env). Тестовая подписка. |
| `buyCosmetic` / `equip` | `id` | Владение, эпоха для `orbit`. |
| `buyBoost` | `kind: 'xp'`, `pay: 'coins' \| 'gems'` | — |
| `roundReward` | `RatedRoundInput` + `path`, `nonce` | Раздел 7.4. |
| `duelReward` | `code`, `youWon` | Комната завершена и игрок в ней (`duelStore`). Один раз на `code`. |
| `import` | `legacy` (локальный снапшот), `trial` (локальная проба) | Раздел 8. Один раз. |

Ограничение частоты — `consumeRateLimit('empire', 60, 60)` на аккаунт (60 действий в минуту); `roundReward` дополнительно `RATING_ROUND_LIMIT` / `RATING_ROUND_WINDOW_SEC` из `ratingRound.ts:36-37`.

### 7.4 Валидация раунда

Клиент присылает тот же `RatedRoundInput`, что и в `/api/leaderboard` (`parseRatedRound`, `scoreRatedRound`), плюс `path` и `nonce` (uuid раунда). Сервер:

1. Проверяет подпись/структуру через `scoreRatedRound` — вопросы и ответы должны сходиться с генератором.
2. `nonce` не встречался в `empire:roundNonce:{accountId}` за 24 ч.
3. Если `path === 'list'` — коллекция открыта (раздел 4.8).
4. Считает награду по таблице 4.1 самостоятельно; клиентские числа не принимаются.
5. Применяет дневной кап монет, `housingCap`, `storageCap`, `treasuryCap`.

Клиент показывает результат оптимистично из локального расчёта той же функцией `empireRoundReward(ctx, state)`, затем заменяет на серверный ответ. Расхождение более чем на кап — сброс к серверному состоянию без сообщения.

### 7.5 Лидерборд

```
score = Σ level(b) × era + stampCountryCount(all worlds) + floor(Σ specialists / 10)
```

`GET /api/empire/board?limit=50` возвращает топ из `empire:board` с публичными профилями через `publicProfileById`. Ранг игрока — `ZREVRANK`. Отображается на вкладке «Мир» экрана Империи. Никаких недельных сбросов; кристаллы за топ не выдаются в первой версии.

### 7.6 Клиентский store

`src/lib/empireStore.ts` — `useSyncExternalStore`, как остальные store, но снапшот приходит с сервера. Локально хранится последнее серверное состояние в `un-flag-quiz-empire` (для мгновенного рендера и офлайн-показа). Между тиками клиент интерполирует производство сам, чтобы цифры «капали» без запросов; сервер — истина при каждом действии.

Экспорт, который использует остальной сайт:

```
useEmpire(), loadEmpire()
empireOnRound(ctx), empireOnDuel(ctx)
powerCoinCost(kind), spendPower(kind)
empireTimeBonusMs(world), empireXpMultiplier()
isListUnlocked(world, id), listRequirement(world, id)
```

---

## 8. Игра без аккаунта

Гость открывает `/empire` и играет локально: тот же `EmpireState` в `localStorage`, тот же расчёт (общий чистый модуль `src/lib/empire/rules.ts` используется и клиентом, и сервером).

Ограничения пробы:

- построено не более 3 зданий (уровень ≥ 1);
- накопленное активное время на экране Империи не более 30 минут;
- эпоха 1, без лидерборда, без `unlockList` и `unlock`, без кристаллов, без прогресса Наследия;
- все гейты таблицы 4.8 действуют — гость играет только на `easy`/`medium`, уровни 1–10, первые две коллекции.

При достижении лимита — модалка «Войди, чтобы сохранить страну» с кнопками входа/регистрации (открывает блок аккаунта в существующем `SettingsModal.tsx`). После входа клиент отправляет `import { trial }`; сервер клампует значения по лимитам пробы (макс. 3 здания уровня ≤ 5, монеты ≤ 600, специалисты ≤ 9) и создаёт `EmpireState`. Если у аккаунта уже есть Империя — берётся серверная, проба отбрасывается.

Раунды викторин у гостя тоже начисляют награду локально (без `roundReward`), но эти начисления при импорте попадают под тот же кламп.

---

## 9. Кристаллы

| Источник | Сколько |
| --- | --- |
| Идеальный раунд `pool` на hard/hardcore, `list` | 1 |
| Daily выполнен | 1 в день; серия 7 → +3, 30 → +10 |
| Уровень пройден с мировым рекордом | 1 |
| Переход в новую эпоху | 5 |
| Полный набор марок | 3 |
| Каждая 5-я победа подряд в дуэлях | 1 |
| Достижения (`achievements.ts`, tier 3 / 5) | 2 / 5, вместо прежних токенов |

| Трата | Цена |
| --- | --- |
| Пропуск стройки | `ceil(remainingMinutes / 30)`, минимум 1 |
| XP-буст ×1.5 на 2 часа | 1 |
| Расширение офлайна до 24 ч на 7 дней | 3 |
| Второй строительный слот на 7 дней | 4 |
| Косметика «за кристаллы» (рамка `era`, тема шаринга с флагом эпохи) | 5–10 |

| Разовые разблокировки из таблицы 4.8 (`hardcore`, `studio`, скины Ратуши, Gemini-fix) | 1–15 |

Ожидаемый доход честного игрока — 3–6 кристаллов в неделю. Архитектурно платёж — это `POST /api/empire { action: 'grantGems', receipt }` с серверной проверкой чека; в первой версии действие не реализуется, но `gems` хранится отдельно от монет и не конвертируется обратно.

### 9.1 Наследие: очень долгие миссии

Пять миссий, рассчитанных на месяцы и годы. Нужны, чтобы у игрока, прошедшего все эпохи, оставалась дальняя цель. Каждая имеет ступени (промежуточные награды) и финал. Прогресс считается сервером из `lifetime`-счётчиков, обнуления нет, подпиской не ускоряется и за валюту не покупается — это единственный контент, который нельзя обойти.

Экран: вкладка «Наследие» на `/empire`. Показывает пять полос прогресса, текущую ступень и время «в среднем темпе» до следующей.

| Миссия | Ключ | Что считаем | Ступени (порог → награда) | Финал | Ориентир при 5 раундах в день |
| --- | --- | --- | --- | --- | --- |
| Атлас мира | `atlas` | Идеально пройденные коллекции (`listsCleared`), каждую — на `hard` или выше | 10 → 5 кристаллов; 25 → рамка `atlas`; 50 → +5 % `resPerHour` всех зданий | **Все коллекции всех миров идеально** → титул «Картограф» у имени в лидерборде и дуэлях, +10 % `resPerHour` навсегда, скин Ратуши `atlas` | 1–2 года (число коллекций растёт вместе с сайтом; финал пересчитывается) |
| Тысяча дней | `thousandDays` | `activeDays` — дни с хотя бы одним завершённым раундом | 30 → 3 кристалла; 100 → тема шаринга `veteran`; 365 → офлайн 24 ч навсегда; 730 → второй строительный слот навсегда | **1000 дней** → титул «Хранитель», флаг страны Империи получает золотую кайму на всех экранах | 2 года 9 месяцев минимум; пропуски не сбрасывают, но и не считаются |
| Безупречный | `flawless` | `perfectRounds` на `hardcore` (одна жизнь, ни одной ошибки) | 50 → 5 кристаллов; 250 → рамка `flawless`; 1000 → скидка Библиотеки +10 п. п. | **5000 идеальных хардкор-раундов** → титул «Безупречный», анимированная рамка | 3+ года; при 5 раундах в день и 60 % успеха — 4,5 года |
| Полиглот знаний | `polymath` | `min(correctByWorld[w])` по всем девяти мирам — считается **слабейший** мир | 500 → 3 кристалла; 2000 → +1 специалист за каждый раунд; 5000 → все мировые здания +1 к макс. уровню | **10 000 правильных ответов в каждом из девяти миров** → титул «Полимат», десятое здание «Пантеон» (производит все девять ресурсов) | 90 000 ответов, ~8 в раунде → 11 000 раундов → 6 лет при 5/день |
| Вечная стройка | `builder` | `buildsDone` — завершённые улучшения зданий | 100 → 3 кристалла; 500 → таймеры стройки −10 %; 1500 → второй строительный слот навсегда | **Все 14 зданий на максимуме 8-й эпохи (уровень 40) и Пантеон 40** → титул «Зодчий», сцена страны получает ночной режим с подсветкой | 600 улучшений минимум; по монетам — ~4 млн, при пассиве 8-й эпохи это 1,5–2 года после её достижения |

Правила:

- Ступени и финалы забираются кнопкой (`claimLegacy`), а не автоматически — чтобы момент был заметен. Незабранное не сгорает.
- Титул — одна строка рядом с именем; активным можно сделать один (`state.title`). Он виден в лидерборде Империи, в дуэлях (`DuelResults`) и на карточке результата.
- Постоянные бонусы («навсегда») записываются в `unlocks` как `legacy:*` и не зависят от подписки.
- Порог финала `atlas` = `COLLECTIONS.length` на момент проверки; когда добавляются новые коллекции, прогресс сохраняется, а финал отодвигается. Игрок, уже получивший титул, его не теряет.
- Один раунд может двигать несколько миссий сразу; это нормально.
- Гость миссии видит, но прогресс в пробе не копится (иначе при импорте пришлось бы клампить историю).

Дополнительно — пять «маленьких» долгих достижений в существующей системе `achievements.ts`, tier 6, чтобы вкладка достижений не заканчивалась: «10 000 раундов», «Все 193 страны с 5 марками», «365 daily подряд», «1000 побед в дуэлях», «Все марки всех миров хотя бы по одной». Каждое даёт 10 кристаллов.

---

## 10. i18n

Все строки — во всех 11 языках (`ru en de zh es hi ar bn pt ja he`). Квиз-хром — в `strings.ts` + `extra.ts`; прозу экрана Империи выносим в новый `src/i18n/empireCopy.ts` по образцу `stateCopy.ts`.

Список ключей (без текстов):

- Название и навигация: `empire`, `empireTagline`, `empireEra`, `empireOpen`.
- Эпохи: `empireEra_settlement … empireEra_space` (8).
- Ресурсы: `empireRes_maps … empireRes_spices` (9), `empireCoins`, `empireGems`, `empireSpecialists`.
- Здания: `empireBuilding_geo … empireBuilding_food` (9), `empireBuilding_hall`, `_housing`, `_storage`, `_treasury`, `_library`; описания `empireBuildingDesc_*` (14).
- Действия: `empireBuild`, `empireUpgrade`, `empireBuilding`, `empireFinishNow`, `empireAdvanceEra`, `empireRename`, `empireSell`, `empireUnlockList`, `empireEquip`, `empireOwned`.
- Состояния: `empireMaxLevel`, `empireNeedEra`, `empireNeedResource`, `empireHousingFull`, `empirePending`, `empireOffline`, `empireOfflineGain`.
- Награды за раунд (экран результатов): `empireRewardTitle`, `empireRewardSpecialists`, `empireRewardCoins`, `empireRewardResource`, `empireRewardGem`, `empireRewardCapped`.
- Подсказки: `quizPowerFree` (заряд Библиотеки), `quizPowerCoins`.
- Гейты: `lockedBy`, `lockedPlus`, `lockedOr`, `unlockFor`, `unlocked`, `listLockedLevel`, `listUnlockFor`, `empirePlus`, `empirePlusSoon`, `empirePlusActive`, `studioLocked`, `studioWhy`, `learnLockedRows`, `mistakesDailyUsed`, `duelRoomLocked`, `difficultyLocked`.
- Наследие: `empireLegacy`, `empireLegacy_atlas / thousandDays / flawless / polymath / builder` (название + описание каждой, 10 ключей), `empireLegacyStage`, `empireLegacyClaim`, `empireLegacyFinal`, `empireLegacyEta`, `empireTitle_cartographer / keeper / flawless / polymath / architect`, `empireTitleActive`, `empireBuilding_pantheon`.
- Гость: `empireTrialTitle`, `empireTrialBody`, `empireTrialLimit`.
- Миграция: `empireMigratedTitle`, `empireMigratedBody`.
- Лидерборд: `empireBoard`, `empireScore`, `empireYourRank`.
- Марки: `empireRarity_common / rare / epic / legendary`, `empireSetComplete`.
- Тур: `tourEmpire`.

Названия эпох и зданий в RTL не содержат стрелок; `rtlModeArrows` не затрагивается.

---

## 11. План реализации

Каждый шаг — отдельный PR, сайт остаётся рабочим между ними.

1. **Правила и типы.** — сделано. `src/lib/empire/rules.ts` (чистые функции: стоимость, производство, тик, награда за раунд, гейт, score), `src/data/empire.ts` (таблицы эпох/зданий/ресурсов), юнит-тесты на формулы. Ни один экран не меняется.
2. **Сервер.** — сделано. `src/lib/empireServerStore.ts`, `/api/empire` (GET, POST: tick/build/advanceEra/sell/rename/roundReward/import) и `/api/empire/board`, Redis-ключи `empire:state:{id}` / `empire:board` / `empire:nonce:*`, файловый fallback `.data/empire/`, валидация раунда через `parseRatedRound`/`scoreRatedRound`, лимит 60 действий/мин. Клиент (`empireStore.ts`) гибридный: без аккаунта — localStorage, с аккаунтом — сервер как источник истины, оптимистичные обновления, импорт пробы при первом входе. Вкладка «Мир» показывает статус синхронизации и таблицу.
3. **Клиентский store и экран.** — сделано частично (экран, роут, плитка, гость, импорт; спрайты — в PR 9). `src/lib/empireStore.ts`, `EmpireScreen` (вкладки: Страна / Казна / Мир), `EmpirePlay`, роут `/empire`, плитка в `WorldPickScreen`, гость и импорт пробы. Спрайты эпохи 1–2.
4. **Переключение викторин.** — сделано. `empireOnRound` в `PlayApp` (награда показывается строкой `EmpireRewardLine` на результатах), подсказка/пропуск/жизнь за монеты (`buyPower`, заряды Библиотеки — `quizPowerFree`), `DuelApp` → `empireOnDuel` (сервер проверяет комнату через `readDuel`/`viewFor`, один раз на `code`), серия daily (`daily.lastDailyDay`, 7 → +3, 30 → +10 кристаллов), бонус времени `empireTimeBonusMs`, XP-буст `empireXpMultiplier` / `buyBoost`. Токены, Компания, Казначейство больше не начисляются за раунды; State-раунды пока живут до PR 6.
5. **Гейты.** — сделано (кроме косметики и статистики — они переезжают вместе с Казной в PR 6–7). `src/lib/empire/gates.ts`: `GateFeature`, `gateInfo`, `access`, `unlock`, `listGateOf` (ежедневные коллекции гейты игнорируют), `noteMistakesRun` (`daily.mistakesRuns`), `grantPlus`, `parseGateFeature`. Плашка `src/components/EmpireLock.tsx` («Империя+ (скоро)» / прогресс → `/empire` / разовая покупка; гость в пробе не покупает). Встроено: `ModeSetupModal` (hard/hardcore), `LevelsScreen` + `playLevel`/`playFinalLevel` (11–25, 26+, хардкор), `LearnScreen` (первые 30 строк), `MistakesScreen` + `empireStartMistakes` (1 запуск в день), `CollectionsScreen` + `startCollectionRound`, `MultiplayerScreen` (приватная комната), `StudioPlay` (создание/правка паков). Сервер: `roundReward` проверяет гейт раунда (`roundGate`, 403 `locked`), `requireGate` в `/api/duel/create`, `/api/pack/analyze`, `/api/pack/fix` (401 без аккаунта, 403 при гейте), `/api/empire/board` отдаёт топ-10 без id/аватаров до эпохи 3. Действия API: `unlock`, `mistakesRun`, `grantPlus` (`EMPIRE_ADMIN_IDS`).
6. **Миграция и удаление.** — сделано. `src/lib/empire/migrate.ts`: `legacyGrant` (таблица §6 + `grandfatherUnlocks` по пройденным уровням: 11+ → `levels:{world}:2`, 26+ → `levels:{world}:3`, хардкор → `levelHardcore`), `applyLegacyGrant` (разово, `state.legacyAt`), `clampLegacyGrant` (серверные капы: 20 000 монет, 30 кристаллов, ратуша ≤ 3, 60 специалистов). Клиент `empireStore.migrateLegacy` при первом `loadEmpire()` читает `un-flag-quiz-tokens/-company/-state/-economy`, возвращает марку из сейфа, удаляет ключи, пишет grant в `un-flag-quiz-empire-migrated` до подтверждения сервером (`syncLegacy` → `POST legacy`, 409 `exists` если аккаунт уже конвертирован). Косметика: `EmpireState.cosmetics`, `src/data/cosmetics.ts` (цены 4.7), `buyCosmetic`/`equipCosmetic`, действия `buyCosmetic`/`equip`, блок в Казне вместе с XP-бустом; `ResultsShareShot` и `SettingsModal` читают Империю. Удалены Company/State/Shop (файлы 4.10, копии `companyCopy`/`stateCopy`/`tokenCopy`, ~150 ключей i18n; `quizHint/quizSkip/quizExtraLife` переехали в `empireCopy`). `next.config.ts`: 308 `/company` `/shop` `/state` → `/empire`. Sitemap, пикер (без дока Компании/Магазина), тур (шаг «Империя» вместо «Государства»), `play-structure.mdc`, `dataExport` обновлены.
7. **Марки и кристаллы.** — сделано. `src/lib/empire/album.ts` (клиент): `stampRarity(world, id)` (FNV-1a, 70/22/7/1 %), `stampSets` (гео — регионы, остальные — группы каталога ≥ 3 карточек), `albumSummary`, `albumReport`. Сервер альбом не хранит — только сводку `EmpireState.album[world] = {countries, sets, rare}` (капы 600/12/≤countries) через действие `album {report, sets}`; за каждый новый полный набор `setBonusClaimed` +3 кристалла, не больше заявленных `sets`. `albumMult` входит в `resPerHour`, `albumCountries` — в `empireScore`. Клиент шлёт сводку после `awardRoundStamps` и при открытии `/empire` (`empireSyncAlbum`). Пропуск стройки `skipBuild` (`ceil(остаток/30 мин)` кристаллов, кнопка на карточке здания). Перки `EMPIRE_PERKS` (`offline24` 3 кристалла / 7 дн., `slot2` 4 / 7 дн.) → `state.perks`, учитываются в `offlineHours`/`buildSlots`. Достижения: `claimAchievements` (tier 3 → 2, tier 5 → 5 кристаллов, `achievementsClaimed`), клиент вызывает после `saveRound`. Редкость подсвечена в обоих альбомах (`.stamp-card.is-rare/-epic/-legendary`).
8. **Наследие.** — сделано. `src/data/empireLegacy.ts` (пять миссий, ступени и финалы из таблицы 9.1, `LegacyUnlock`), `EmpireState.lifetime` (rounds/perfectRounds/hardcoreRounds/flawlessRounds/correctByWorld/dailyDays/dailyBestStreak/duelWins/duelBestStreak/coinsEarned/gemsEarned/buildsDone/activeDays/listsCleared; заполняется в `applyRoundReward`, `applyDuelReward`, `finishBuilds`/`skipBuild`, `tick`, `advanceEra`), `legacy: {stage, claimed}`, `titles`/`title`. Правила: `legacyProgress`/`legacyOverview` (финал `atlas` = `COLLECTIONS.length`, `builder` — все здания на уровне 40), `claimLegacy` (одна ступень за вызов, финал даёт титул и `finalRewards`), `setTitle`. Эффекты `legacy:*` в правилах: `res5`/`res10` → `legacyResMult` в `resPerHour`, `library10` → `libraryOff`, `specialist` → +1 в `applyRoundReward`, `maxLevel` → `buildingMax`, `buildFast` → `buildMs(…, fast)`, `pantheon` → `buildingsOf(state)` включает Пантеон (стоимость как у Ратуши, `pantheonResPerHour` со всеми девятью ресурсами и `S = Σ/9`), `night` → класс `is-night` сцены, `goldFlag` → `flag-gold` в лидерборде. Косметика Наследия: рамки `atlas`/`flawless`, тема `veteran` (`SHOP_*` списки отделяют продаваемое; `cosmeticPrice` → `null`). API: `claimLegacy {id}` (409 `locked`/`done`), `setTitle {title|null}` (409 `locked`), `roundReward` принимает `listId`; `/api/empire/board` отдаёт `title` и `goldFlag`. Экран: вкладка «Наследие» (полосы прогресса, следующая награда, ETA по среднему темпу с `createdAt`, кнопка «Забрать», выбор титула), титул у имени в шапке, в таблице Мира, в `DuelResults` и на карточке результата. Пять tier-6 достижений (`roundsTenK`, `allStampsFive`, `dailyYear`, `duelThousand`, `allWorldsStamps`) по 10 кристаллов (`EMPIRE_ACHIEVEMENT_GEMS[6]`).
9. **Спрайты эпох 3–8**, Пантеон, ночной режим сцены — сделано в CSS (без PNG-набора §12): `Tower` принимает любое здание и ступень внешнего вида `is-tier-1/2/3` (уровни 1–9 / 10–24 / 25+ → ширина и карниз), крыши по эпохам через `.empire-tower-roof` (3 — зубцы, 4 — двускатная, 5 — труба с дымом, 6 — антенна с маячком, 7 — стеклянный фасад, 8 — купола и звёзды), Пантеон — десятая колонна скайлайна с колоннадой и фронтоном, ночной режим `is-night` (`legacy:night`) с звёздами и подсветкой окон. PNG-спрайты по таблице §12 и полировка баланса по метрикам — после релиза, когда появятся данные о реальном темпе прохождения эпох.

---

## 12. Спрайты

Пиксель-арт, генерируется заранее, PNG в `public/empire/`. Единый масштаб: тайл 64 × 64, здания 64 × 96 (высокие — 64 × 128). Палитра — 32 цвета, без антиалиасинга, прозрачный фон.

| Группа | Файлы | Количество |
| --- | --- | --- |
| Фон сцены по эпохе | `bg/{era}.png` (960 × 320) | 8 |
| Ратуша по эпохе | `hall/{era}.png` | 8 |
| Мировые здания, 3 ступени внешнего вида (уровни 1–9 / 10–24 / 25+) × 8 эпох | `{world}/{era}-{tier}.png` | 9 × 8 × 3 = 216 |
| Общие здания (housing, storage, treasury, library), 3 ступени × 8 эпох | `{building}/{era}-{tier}.png` | 4 × 8 × 3 = 96 |
| Специалист по миру, idle-анимация 4 кадра | `specialist/{world}.png` (спрайт-лист 4 × 32 × 32) | 9 |
| Иконки ресурсов | `res/{key}.png` (32 × 32) | 9 + монета + кристалл = 11 |
| Стройка (леса) | `construction/{era}.png` | 8 |
| Пантеон (эпохи 6–8, 3 ступени) | `pantheon/{era}-{tier}.png` | 9 |
| Ночной режим сцены (финал «Вечной стройки») | `bg/8-night.png`, `hall/8-night.png` | 2 |
| Иконки миссий и титулов | `legacy/{mission}.png`, `title/{title}.png` (32 × 32) | 10 |
| Замок гейта | `lock.png`, `lock-plus.png` (24 × 24) | 2 |

Итого около 360 файлов. Для первого релиза достаточно эпох 1–2 (≈ 90 файлов); остальное — по мере прохождения игроками.

Базовый промпт для генерации: «pixel art, 64×96 sprite, isometric-free front view, {название здания}, {эпоха} era, 32-color palette, no anti-aliasing, transparent background, clean outline, consistent 45° top light». Для фонов — «pixel art panorama 960×320, {эпоха} landscape, empty foreground plots, sky gradient, no buildings».
