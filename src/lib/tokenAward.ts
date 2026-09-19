import { tokensPerCorrect } from '../data/tokens'
import { isCorrect, type QuizDifficulty, type RoundAnswer, type RoundEnd } from './quiz'

export function tokensForFreePlay(
  answers: RoundAnswer[],
  difficulty: QuizDifficulty,
  endedBy: RoundEnd,
): number {
  if (answers.length === 0) return 0
  const per = tokensPerCorrect(difficulty)
  let total = 0
  for (const answer of answers) {
    if (!isCorrect(answer)) continue
    total += per
  }
  if (endedBy === 'complete') {
    total += answers.length
    if (answers.every(isCorrect)) total += answers.length
  }
  return total
}
