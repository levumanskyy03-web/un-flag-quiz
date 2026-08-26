import { EURO_WINNERS } from '../src/data/euros'
import { footballOptionClashes, wcWinYearsFor, WORLD_CUP_HOSTS, WORLD_CUP_WINNERS } from '../src/data/worldCup'
import { countryName, createFootballRound, FOOTBALL_MODES, type QuizDifficulty } from '../src/lib/quiz'

const diffs: QuizDifficulty[] = ['easy', 'hard', 'hardcore']
const problems: string[] = []

function note(message: string) {
  problems.push(message)
}

for (let i = 0; i < 400; i += 1) {
  for (const mode of FOOTBALL_MODES) {
    const needDiff = mode === 'wcHosts' || mode === 'euroWinners'
    const roundDiffs = needDiff ? diffs : (['easy'] as QuizDifficulty[])
    for (const difficulty of roundDiffs) {
      const questions = createFootballRound(mode, 20, difficulty)
      for (const question of questions) {
        if (mode === 'wcTitleYears') {
          const years = question.yearOptions ?? []
          if (new Set(years).size !== years.length) note(`${mode} ${question.year}: duplicate years ${years}`)
          const wins = new Set(wcWinYearsFor(question.country.iso))
          const extra = years.filter((year) => year !== question.year && wins.has(year))
          if (extra.length > 0) {
            note(`${mode} ${question.country.iso} ${question.year}: extra win years ${extra}`)
          }
          if (!years.includes(question.year ?? -1)) note(`${mode} ${question.year}: missing correct year`)
          if (years.length !== 4) note(`${mode} ${question.year}: ${years.length} year options`)
          continue
        }
        if (question.options.length !== 4) note(`${mode} ${question.year}: ${question.options.length} options`)
        const isos = question.options.map((option) => option.iso)
        if (new Set(isos).size !== isos.length) note(`${mode} ${question.year}: duplicate isos ${isos}`)
        const clashes = question.options.filter((option) => footballOptionClashes(option.iso, question.country.iso))
        if (clashes.length > 0) {
          note(`${mode} ${question.year}: overlapping ${clashes.map((item) => item.iso)} vs ${question.country.iso}`)
        }
        const names = question.options.map((option) => countryName(option, 'ru'))
        if (new Set(names).size !== names.length) note(`${mode} ${question.year}: duplicate names ${names}`)
        const correct = question.options.filter((option) => option.iso === question.country.iso)
        if (correct.length !== 1) note(`${mode} ${question.year}: ${correct.length} correct isos`)
      }
    }
  }
}

for (const cup of WORLD_CUP_WINNERS) {
  const wins = wcWinYearsFor(cup.winnerId)
  if (new Set(wins).size !== wins.length) note(`duplicate win years for ${cup.winnerId}`)
}
for (const cup of WORLD_CUP_HOSTS) {
  const answer = cup.hostIds.length === 1 ? cup.hostIds[0] : [...cup.hostIds].sort().join('+')
  for (const other of WORLD_CUP_HOSTS) {
    if (other.year === cup.year) continue
    const otherId = other.hostIds.length === 1 ? other.hostIds[0] : [...other.hostIds].sort().join('+')
    if (otherId === answer) continue
  }
}
for (const cup of EURO_WINNERS) {
  const sameYear = EURO_WINNERS.filter((item) => item.year === cup.year)
  if (sameYear.length !== 1) note(`euro ${cup.year} has ${sameYear.length} winners`)
}

if (problems.length > 0) {
  console.error(problems.slice(0, 40).join('\n'))
  console.error(`\n${problems.length} problems`)
  process.exit(1)
}
console.log('football options: one correct answer each')
