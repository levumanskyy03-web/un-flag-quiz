import { ANGLE_KIND, mathById, mathCountry, rememberMathItem, type MathItem, type MathTier } from '../../data/math'
import {
  MATH_LEVEL_QUESTIONS,
  type MathMode,
} from './mathModes'
import { shuffle, type Question, type QuizDifficulty } from './core'

type Rng = () => number

function hashSeed(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
  return hash >>> 0
}

function rngOf(seed: string): Rng {
  let state = hashSeed(seed) || 1
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length) % list.length]
}

function int(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

function tierOf(difficulty?: QuizDifficulty, level?: number): MathTier {
  if (level !== undefined) {
    if (level <= 5) return 'easy'
    if (level <= 12) return 'medium'
    return 'hard'
  }
  if (difficulty === 'hard' || difficulty === 'hardcore') return 'hard'
  if (difficulty === 'medium') return 'medium'
  return 'easy'
}

function nearby(value: number, rng: Rng): number[] {
  const extras = [
    value + 1,
    value - 1,
    value + 2,
    value - 2,
    value + 10,
    value - 10,
    value * 2,
    Math.round(value / 2),
    value + int(rng, 3, 9),
    Math.abs(value - int(rng, 3, 12)),
  ]
  return extras.filter((item) => Number.isFinite(item) && item !== value)
}

function uniqueNums(correct: number, rng: Rng, extra: number[] = []): string[] {
  const seen = new Set<string>([String(correct)])
  const out: string[] = []
  for (const candidate of [...extra, ...nearby(correct, rng), ...nearby(correct, rng)]) {
    const label = String(candidate)
    if (seen.has(label)) continue
    seen.add(label)
    out.push(label)
    if (out.length === 3) break
  }
  let guard = 0
  while (out.length < 3 && guard < 40) {
    guard += 1
    const label = String(correct + int(rng, 1, 25) * (rng() < 0.5 ? 1 : -1))
    if (seen.has(label)) continue
    seen.add(label)
    out.push(label)
  }
  return out
}

function makeItem(
  id: string,
  mode: MathMode,
  tier: MathTier,
  prompt: string,
  answer: MathItem['answer'],
  key: string,
): MathItem {
  const item: MathItem = { id, mode, tier, prompt, answer, key }
  rememberMathItem(item)
  return item
}

function packQuestion(item: MathItem, distractors: MathItem[]): Question {
  return {
    country: mathCountry(item),
    mode: item.mode,
    options: shuffle([mathCountry(item), ...distractors.map(mathCountry)]),
  }
}

interface Built {
  prompt: string
  answer: string
  key: string
  distractors: string[]
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const next = x % y
    x = y
    y = next
  }
  return x || 1
}

function buildExpr(tier: MathTier, rng: Rng): Built {
  if (tier === 'easy') {
    if (rng() < 0.45) {
      const a = int(rng, 2, 12)
      const b = int(rng, 2, 12)
      const answer = a * b
      return { prompt: `${a} × ${b}`, answer: String(answer), key: `${a}*${b}`, distractors: uniqueNums(answer, rng, [a + b, a * (b + 1), a * (b - 1)]) }
    }
    if (rng() < 0.5) {
      const a = int(rng, 6, 40)
      const b = int(rng, 1, 20)
      const answer = a + b
      return { prompt: `${a} + ${b}`, answer: String(answer), key: `${a}+${b}`, distractors: uniqueNums(answer, rng, [a - b, a + b + 1]) }
    }
    const a = int(rng, 10, 40)
    const b = int(rng, 1, a - 1)
    const answer = a - b
    return { prompt: `${a} − ${b}`, answer: String(answer), key: `${a}-${b}`, distractors: uniqueNums(answer, rng, [a + b, b - a]) }
  }
  if (tier === 'medium') {
    if (rng() < 0.55) {
      const a = int(rng, 6, 19)
      const b = int(rng, 6, 19)
      const answer = a * b
      return { prompt: `${a} × ${b}`, answer: String(answer), key: `${a}*${b}`, distractors: uniqueNums(answer, rng, [a * (b + 1), (a + 1) * b]) }
    }
    const a = int(rng, 20, 90)
    const b = int(rng, 10, 90)
    const answer = a + b
    return { prompt: `${a} + ${b}`, answer: String(answer), key: `${a}+${b}`, distractors: uniqueNums(answer, rng) }
  }
  const a = int(rng, 12, 39)
  const b = int(rng, 11, 29)
  const answer = a * b
  return { prompt: `${a} × ${b}`, answer: String(answer), key: `${a}*${b}`, distractors: uniqueNums(answer, rng, [(a - 1) * b, a * (b - 1)]) }
}

function decimalOf(num: number, den: number): string {
  const value = num / den
  if (Number.isInteger(value)) return String(value)
  const text = value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
  if (den === 3 || den === 6 || den === 9 || den === 7) {
    if (Math.abs(value - 1 / 3) < 1e-9) return '0.333…'
    if (Math.abs(value - 2 / 3) < 1e-9) return '0.666…'
    if (Math.abs(value - 1 / 6) < 1e-9) return '0.166…'
    if (Math.abs(value - 1 / 7) < 1e-9) return '0.142…'
    if (Math.abs(value - 1 / 9) < 1e-9) return '0.111…'
  }
  return text
}

function buildFraction(tier: MathTier, rng: Rng): Built {
  const dens = tier === 'easy' ? [2, 4, 5, 10] : tier === 'medium' ? [5, 8, 10, 20, 25] : [3, 6, 7, 8, 9, 12]
  const den = pick(rng, dens)
  const num = tier === 'hard' && rng() < 0.35 ? int(rng, den + 1, den * 2) : int(rng, 1, den - 1)
  const g = gcd(num, den)
  const n = num / g
  const d = den / g
  const frac = `${n}/${d}`
  const dec = decimalOf(n, d)
  if (rng() < 0.5) {
    return { prompt: frac, answer: dec, key: `f:${frac}`, distractors: uniqueNums(n / d, rng).map(String) }
  }
  return {
    prompt: dec,
    answer: frac,
    key: `d:${frac}`,
    distractors: [
      `${n + 1}/${d}`,
      `${n}/${d + 1}`,
      `${Math.max(1, n - 1)}/${d}`,
    ],
  }
}

function buildPercent(tier: MathTier, rng: Rng): Built {
  const pct =
    tier === 'easy' ? pick(rng, [10, 20, 25, 50]) : tier === 'medium' ? pick(rng, [5, 15, 30, 40, 75]) : pick(rng, [12, 18, 35, 60, 125])
  const base =
    tier === 'easy' ? pick(rng, [20, 40, 50, 80, 100]) : tier === 'medium' ? pick(rng, [40, 60, 80, 120, 200]) : pick(rng, [80, 160, 200, 250, 400])
  const answer = (pct * base) / 100
  if (!Number.isInteger(answer) && tier !== 'hard') {
    return buildPercent(tier, rng)
  }
  const shown = Number.isInteger(answer) ? String(answer) : String(Number(answer.toFixed(2)))
  return {
    prompt: `${pct}% × ${base}`,
    answer: shown,
    key: `${pct}:${base}`,
    distractors: uniqueNums(Number(shown), rng, [(pct * base) / 10, base - pct]),
  }
}

function buildPower(tier: MathTier, rng: Rng): Built {
  if (rng() < 0.4) {
    const roots = tier === 'easy' ? [4, 9, 16, 25, 36, 49, 64, 81, 100] : tier === 'medium' ? [121, 144, 169, 196, 225] : [256, 289, 324, 361, 400]
    const n = pick(rng, roots)
    const answer = Math.round(Math.sqrt(n))
    return { prompt: `√${n}`, answer: String(answer), key: `sqrt:${n}`, distractors: uniqueNums(answer, rng, [n / 2, answer + 1]) }
  }
  const base = tier === 'easy' ? pick(rng, [2, 3, 4, 5, 10]) : tier === 'medium' ? pick(rng, [2, 3, 5, 6, 10]) : pick(rng, [2, 3, 5, 7, 10])
  const exp = tier === 'easy' ? int(rng, 2, 4) : tier === 'medium' ? int(rng, 3, 5) : int(rng, 3, 6)
  const answer = base ** exp
  if (answer > 100000) return buildPower('medium', rng)
  return { prompt: `${base}${toSup(exp)}`, answer: String(answer), key: `${base}^${exp}`, distractors: uniqueNums(answer, rng, [base * exp, base ** (exp - 1)]) }
}

function toSup(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
  return String(n).replace(/[0-9]/g, (ch) => map[ch] ?? ch)
}

function buildOrder(tier: MathTier, rng: Rng): Built {
  if (tier === 'easy') {
    const a = int(rng, 1, 9)
    const b = int(rng, 2, 9)
    const c = int(rng, 2, 9)
    if (rng() < 0.5) {
      const answer = a + b * c
      return { prompt: `${a} + ${b} × ${c}`, answer: String(answer), key: `s:${a}+${b}*${c}`, distractors: uniqueNums(answer, rng, [(a + b) * c, a * b + c]) }
    }
    const answer = (a + b) * c
    return { prompt: `(${a} + ${b}) × ${c}`, answer: String(answer), key: `p:${a}+${b}*${c}`, distractors: uniqueNums(answer, rng, [a + b * c]) }
  }
  const a = int(rng, 2, 8)
  const b = int(rng, 2, 8)
  const c = int(rng, 2, 6)
  if (rng() < 0.5) {
    const answer = a ** 2 + b
    return { prompt: `${a}² + ${b}`, answer: String(answer), key: `sq:${a}+${b}`, distractors: uniqueNums(answer, rng, [(a + b) ** 2, a * 2 + b]) }
  }
  const answer = a * (b + c)
  return { prompt: `${a} × (${b} + ${c})`, answer: String(answer), key: `g:${a}*${b}+${c}`, distractors: uniqueNums(answer, rng, [a * b + c]) }
}

function buildAngle(tier: MathTier, rng: Rng): Built {
  const kind =
    rng() < 0.28 ? 'acute' : rng() < 0.5 ? 'right' : rng() < 0.78 ? 'obtuse' : 'straight'
  const deg =
    kind === 'right'
      ? 90
      : kind === 'straight'
        ? 180
        : kind === 'acute'
          ? tier === 'easy'
            ? pick(rng, [30, 45, 60])
            : int(rng, 1, 89)
          : tier === 'easy'
            ? pick(rng, [120, 135, 150])
            : int(rng, 91, 179)
  const answer =
    kind === 'acute'
      ? 'acute'
      : kind === 'right'
        ? 'right'
        : kind === 'obtuse'
          ? 'obtuse'
          : 'straight'
  const names = ['acute', 'right', 'obtuse', 'straight'].filter((item) => item !== answer)
  return {
    prompt: `${deg}°`,
    answer,
    key: kind,
    distractors: names,
  }
}

const UNIT_ROWS: Array<{ prompt: (n: number) => string; answer: (n: number) => string; n: (rng: Rng, tier: MathTier) => number }> = [
  { prompt: (n) => `${n} km`, answer: (n) => `${n * 1000} m`, n: (rng, tier) => (tier === 'easy' ? int(rng, 1, 9) : int(rng, 2, 25)) },
  { prompt: (n) => `${n} m`, answer: (n) => `${n * 100} cm`, n: (rng, tier) => (tier === 'easy' ? int(rng, 1, 12) : int(rng, 2, 40)) },
  { prompt: (n) => `${n} kg`, answer: (n) => `${n * 1000} g`, n: (rng) => int(rng, 1, 8) },
  { prompt: (n) => `${n} h`, answer: (n) => `${n * 3600} s`, n: (rng, tier) => (tier === 'hard' ? int(rng, 2, 5) : int(rng, 1, 3)) },
  { prompt: (n) => `${n} L`, answer: (n) => `${n * 1000} mL`, n: (rng) => int(rng, 1, 9) },
  { prompt: (n) => `${n} cm`, answer: (n) => `${n * 10} mm`, n: (rng) => int(rng, 1, 20) },
]

function buildUnit(tier: MathTier, rng: Rng): Built {
  const row = pick(rng, UNIT_ROWS)
  const n = row.n(rng, tier)
  const answer = row.answer(n)
  const others = UNIT_ROWS.filter((item) => item !== row).map((item) => item.answer(n))
  return { prompt: row.prompt(n), answer, key: `${row.prompt(n)}:${answer}`, distractors: others.slice(0, 3) }
}

function buildProblem(mode: MathMode, tier: MathTier, rng: Rng): Built {
  if (mode === 'valueToExpr') {
    const inner = buildExpr(tier, rng)
    const wrong: string[] = []
    const seen = new Set([inner.prompt])
    let guard = 0
    while (wrong.length < 3 && guard < 20) {
      guard += 1
      const other = buildExpr(tier, rng)
      if (seen.has(other.prompt) || other.answer === inner.answer) continue
      seen.add(other.prompt)
      wrong.push(other.prompt)
    }
    return { prompt: inner.answer, answer: inner.prompt, key: `v:${inner.key}`, distractors: wrong }
  }
  if (mode === 'fractionDecimal') return buildFraction(tier, rng)
  if (mode === 'percentToValue') return buildPercent(tier, rng)
  if (mode === 'powerToValue') return buildPower(tier, rng)
  if (mode === 'orderOfOps') return buildOrder(tier, rng)
  if (mode === 'angleToKind') return buildAngle(tier, rng)
  if (mode === 'unitsConvert') return buildUnit(tier, rng)
  return buildExpr(tier, rng)
}

function materialize(mode: MathMode, tier: MathTier, built: Built, id: string): Question {
  if (mode === 'angleToKind') {
    const kind = built.answer as keyof typeof ANGLE_KIND
    const item = makeItem(id, mode, tier, built.prompt, ANGLE_KIND[kind], built.key)
    const distractors = built.distractors.map((name, index) =>
      makeItem(
        `${id}-d${index}`,
        mode,
        tier,
        built.prompt,
        ANGLE_KIND[name as keyof typeof ANGLE_KIND],
        `${id}:${name}`,
      ),
    )
    return packQuestion(item, distractors)
  }
  const item = makeItem(id, mode, tier, built.prompt, built.answer, built.key)
  const distractors = built.distractors.map((answer, index) =>
    makeItem(`${id}-d${index}`, mode, tier, built.prompt, answer, `${id}:${answer}`),
  )
  return packQuestion(item, distractors)
}

export function generateMathQuestions(
  mode: MathMode,
  count: number,
  difficulty?: QuizDifficulty,
  seed = `${mode}:${Date.now()}:${Math.random()}`,
  level?: number,
): Question[] {
  const rng = rngOf(seed)
  const questions: Question[] = []
  const used = new Set<string>()
  const tier = tierOf(difficulty, level)
  let guard = 0
  while (questions.length < count && guard < count * 20) {
    guard += 1
    const built = buildProblem(mode, tier, rng)
    if (used.has(built.key)) continue
    used.add(built.key)
    questions.push(materialize(mode, tier, built, `mg-${hashSeed(seed).toString(36)}-${questions.length}`))
  }
  return questions
}

export function generateMathLevelRound(mode: MathMode, level: number): Question[] {
  return generateMathQuestions(mode, MATH_LEVEL_QUESTIONS, undefined, `lvl:${mode}:${level}`, level)
}

export function generateMathLearnItems(mode: MathMode, count = 36): MathItem[] {
  const questions = generateMathQuestions(mode, count, undefined, `learn:${mode}`)
  return questions
    .map((question) => mathById(question.country.iso))
    .filter((item): item is MathItem => Boolean(item))
}
