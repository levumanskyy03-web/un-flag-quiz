import { mulberry32, seedFrom } from './countryFacts'
import type { DuelAnswer, DuelPlayer, DuelQuestionWire } from './duelTypes'
import {
  factsClueTimeMs,
  factsWrongLimit,
} from './factsRules'
import {
  isFactsToName,
  isFootballYearChoice,
  isQuizMode,
  questionLimitMs,
  type QuizDifficulty,
} from './quiz'

const BOT_NAMES = [
  'Mira',
  'Omar',
  'Lena',
  'Kenji',
  'Sofia',
  'Pavel',
  'Aisha',
  'Luca',
  'Nora',
  'Wei',
  'Diego',
  'Hanna',
  'Yusuf',
  'Ines',
  'Theo',
  'Anika',
  'Ravi',
  'Elise',
  'Farid',
  'Mai',
  'Jonas',
  'Priya',
  'Hugo',
  'Tara',
  'Nabil',
  'Eva',
  'Soren',
  'Lila',
  'Amir',
  'Kate',
  'Yuna',
  'Carlos',
  'Dina',
  'Felix',
  'Noa',
  'Igor',
  'Hana',
  'Malik',
  'Zoe',
  'Nina',
]

export const BOT_FILL_MS = 15_000

export function isBotPlayer(player: DuelPlayer | null | undefined): boolean {
  return player?.kind === 'bot'
}

export function makeBotPlayer(
  room: { code: string; createdAt: number; difficulty: QuizDifficulty },
  total: number,
): DuelPlayer {
  const rng = mulberry32(seedFrom(`${room.code}:bot:${room.createdAt}`))
  return {
    id: crypto.randomUUID(),
    name: BOT_NAMES[Math.floor(rng() * BOT_NAMES.length)] ?? 'Alex',
    kind: 'bot',
    elo: botEloFor(room.difficulty, rng),
    answers: Array.from({ length: total }, () => null),
    wrongs: Array.from({ length: total }, () => 0),
  }
}

export function botEloFor(difficulty: QuizDifficulty, rng: () => number): number {
  const base = difficulty === 'easy' ? 930 : difficulty === 'medium' ? 1090 : difficulty === 'hard' ? 1255 : 1340
  return base + Math.floor(rng() * 41) - 20
}

export function rematchDelayMs(room: { code: string; playStartedAt: number }): number {
  const rng = mulberry32(seedFrom(`${room.code}:rematch:${room.playStartedAt}`))
  return 1_100 + Math.floor(rng() * 1_700)
}

export function maybeAnswerAsBot(
  room: BotRoom,
  now: number,
  helpers: {
    questionMode: (room: BotRoom) => ReturnType<typeof questionModeOfLoose>
    isFactsRoom: (room: BotRoom) => boolean
    duelCorrectIso: (question: DuelQuestionWire) => string
    acceptIso: (
      iso: string | null,
      optionIsos: string[],
      mode: ReturnType<typeof questionModeOfLoose>,
      question?: DuelQuestionWire | null,
    ) => string | null
    bothAnswered: (room: BotRoom) => boolean
    revealMs: (room: BotRoom) => number
  },
): void {
  const bot = [room.host, room.guest].find((player) => isBotPlayer(player))
  if (!bot || room.phase !== 'question') return
  if (bot.answers[room.index]) {
    room.botAnswerAt = 0
    return
  }
  const question = room.questions[room.index]
  if (!question) return
  const mode = helpers.questionMode(room)
  const facts = helpers.isFactsRoom(room)
  const limitMs = facts
    ? factsClueTimeMs(room.facts, room.factIndex)
    : questionLimitMs(mode, { region: room.region })
  if (!room.botAnswerAt) {
    room.botAnswerAt = room.questionStartedAt + thinkMs(room.difficulty, limitMs, room, bot.id)
  }
  if (now < room.botAnswerAt) return

  const correct = helpers.duelCorrectIso(question)
  const rng = mulberry32(seedFrom(`${room.code}:${room.index}:${room.factIndex}:${bot.id}:${room.botAnswerAt}`))
  const hit = rng() < accuracy(room.difficulty)
  const raw = hit ? correct : wrongPick(question, correct, mode, rng)
  const pick = helpers.acceptIso(raw, question.optionIsos ?? [], mode, question)
  const elapsed = Math.max(0, now - room.questionStartedAt)

  if (facts) {
    if (!pick) return
    if (pick === correct) {
      bot.answers[room.index] = { iso: pick, timeMs: elapsed }
      room.botAnswerAt = 0
    } else {
      bot.wrongs[room.index] = (bot.wrongs[room.index] ?? 0) + 1
      if (bot.wrongs[room.index] >= factsWrongLimit(room.facts)) {
        bot.answers[room.index] = { iso: null, timeMs: elapsed }
        room.botAnswerAt = 0
      } else {
        room.botAnswerAt = now + 700 + Math.floor(rng() * 1_100)
      }
    }
    if (helpers.bothAnswered(room)) {
      room.phase = 'reveal'
      room.revealUntil = now + helpers.revealMs(room)
      room.botAnswerAt = 0
    }
    return
  }

  bot.answers[room.index] = { iso: pick, timeMs: elapsed } satisfies DuelAnswer
  room.botAnswerAt = 0
  if (helpers.bothAnswered(room)) {
    room.phase = 'reveal'
    room.revealUntil = now + helpers.revealMs(room)
  }
}

export interface BotRoom {
  code: string
  createdAt: number
  difficulty: QuizDifficulty
  region: import('./quiz').RegionFilter
  facts?: import('./factsRules').FactsDuelConfig
  host: DuelPlayer
  guest: DuelPlayer | null
  phase: 'waiting' | 'question' | 'reveal' | 'done'
  questions: DuelQuestionWire[]
  index: number
  factIndex: number
  questionStartedAt: number
  playStartedAt: number
  revealUntil: number
  botAnswerAt: number
  mode: import('./quiz').QuizMode
}

function questionModeOfLoose(room: BotRoom) {
  const mode = room.questions[room.index]?.mode
  return isQuizMode(mode) ? mode : room.mode
}

function thinkMs(difficulty: QuizDifficulty, limitMs: number, room: BotRoom, botId: string): number {
  const rng = mulberry32(seedFrom(`${room.code}:think:${room.index}:${room.playStartedAt}:${botId}`))
  const span =
    difficulty === 'easy'
      ? [3_200, 7_200]
      : difficulty === 'medium'
        ? [1_600, 4_200]
        : difficulty === 'hard'
          ? [700, 2_200]
          : [500, 1_600]
  const [min, max] = span
  const raw = min + Math.floor(rng() * (max - min + 1))
  return Math.max(420, Math.min(raw, Math.max(500, limitMs - 350)))
}

function accuracy(difficulty: QuizDifficulty): number {
  if (difficulty === 'easy') return 0.52
  if (difficulty === 'medium') return 0.72
  if (difficulty === 'hard') return 0.9
  return 0.94
}

function wrongPick(
  question: DuelQuestionWire,
  correct: string,
  mode: ReturnType<typeof questionModeOfLoose>,
  rng: () => number,
): string {
  const pool = (
    isFootballYearChoice(mode)
      ? (question.yearOptions ?? []).map(String)
      : question.waterOptions && question.waterOptions.length > 0
        ? question.waterOptions
        : question.optionIsos
  ).filter((iso) => iso !== correct)
  if (pool.length === 0) {
    if (isFactsToName(mode) || mode === 'nameToMap') return correct
    return correct
  }
  return pool[Math.floor(rng() * pool.length)] ?? correct
}
