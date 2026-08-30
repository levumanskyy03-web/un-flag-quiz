import type { FactClue } from './countryFacts'
import type { FactsDuelConfig } from './factsRules'
import type { QuizDifficulty, QuizMode, RegionFilter } from './quiz'

export interface DuelQuestionWire {
  countryIso: string
  optionIsos: string[]
  mode?: QuizMode
  facts?: FactClue[]
  year?: number
  yearOptions?: number[]
  waterId?: string
  waterOptions?: string[]
}

export interface DuelView {
  code: string
  you: 'host' | 'guest'
  phase: 'waiting' | 'question' | 'reveal' | 'done'
  mode: QuizMode
  modes: QuizMode[]
  region: RegionFilter
  difficulty: QuizDifficulty
  roundSize: number
  index: number
  total: number
  remainingMs: number
  roundMs: number
  host: { name: string; score: number }
  guest: { name: string; score: number } | null
  youName: string
  opponentName: string | null
  youScore: number
  opponentScore: number | null
  youAnswer: string | null | undefined
  opponentReady: boolean
  opponentAnswer: string | null | undefined
  question: DuelQuestionWire | null
  youWon: boolean | null
  youRematch: boolean
  opponentRematch: boolean
  includeExtras?: boolean
  facts?: FactsDuelConfig
  factIndex?: number
  youWrongs?: number
  factsMax?: number
  factsWrongLimit?: number
}
