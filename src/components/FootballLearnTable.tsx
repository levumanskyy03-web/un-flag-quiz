import { EURO_WINNERS } from '../data/euros'
import {
  euroFinal,
  finalCity,
  formatFinalScore,
  worldCupFinal,
  type FootballFinal,
} from '../data/footballFinals'
import {
  WORLD_CUP_HOSTS,
  WORLD_CUP_WINNERS,
  footballTeamCountry,
  wcHostAnswerId,
} from '../data/worldCup'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName, type FootballMode } from '../lib/quiz'
import { TeamFlag } from './Flag'

interface FootballLearnTableProps {
  mode: FootballMode
  lang: Lang
  years?: readonly number[]
}

interface Row {
  year: number
  winnerId?: string
  runnerUpId?: string
  hostIds?: string[]
  final?: FootballFinal
}

function yearOk(year: number, years?: readonly number[]) {
  return !years || years.length === 0 || years.includes(year)
}

function rowsFor(mode: FootballMode, years?: readonly number[]): Row[] {
  if (mode === 'euroWinners') {
    return EURO_WINNERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      winnerId: item.winnerId,
      runnerUpId: item.runnerUpId,
      final: euroFinal(item.year),
    }))
  }
  if (mode === 'wcHosts') {
    return WORLD_CUP_HOSTS.filter((item) => yearOk(item.year, years)).map((item) => {
      const cup = WORLD_CUP_WINNERS.find((winner) => winner.year === item.year)
      const final = worldCupFinal(item.year)
      return {
        year: item.year,
        hostIds: item.hostIds,
        winnerId: final ? cup?.winnerId : undefined,
        runnerUpId: final ? cup?.runnerUpId : undefined,
        final,
      }
    })
  }
  return WORLD_CUP_WINNERS.filter((item) => yearOk(item.year, years) && worldCupFinal(item.year)).map((item) => ({
    year: item.year,
    winnerId: item.winnerId,
    runnerUpId: item.runnerUpId,
    final: worldCupFinal(item.year),
  }))
}

function TeamCell({ id, lang }: { id: string; lang: Lang }) {
  const country = footballTeamCountry(id)
  const name = countryName(country, lang)
  return (
    <span className="football-learn-team">
      <TeamFlag iso={country.iso} name={name} size="thumb" />
      <span>{name}</span>
    </span>
  )
}

function MatchCell({ winnerId, runnerUpId, lang }: { winnerId?: string; runnerUpId?: string; lang: Lang }) {
  if (!winnerId || !runnerUpId) return <span className="football-learn-empty">—</span>
  return (
    <span className="football-learn-match">
      <TeamCell id={winnerId} lang={lang} />
      <span className="football-learn-vs">–</span>
      <TeamCell id={runnerUpId} lang={lang} />
    </span>
  )
}

export function FootballLearnTable({ mode, lang, years }: FootballLearnTableProps) {
  if (mode === 'wcTitleYears') return null
  const t = STRINGS[lang]
  const rows = rowsFor(mode, years)
  if (rows.length === 0) return null
  const scoreLabels = {
    aet: t.footballAet,
    pens: t.footballPens,
    replay: t.footballReplay,
    golden: t.footballGolden,
  }
  const showWinner = mode === 'wcWinners' || mode === 'euroWinners'
  const showRunnerUp = mode === 'wcWinners' || mode === 'euroWinners'
  const showMatch = mode === 'wcFinalists' || mode === 'wcHosts'
  const showHost = mode === 'wcHosts'
  const showVenue = mode === 'wcHosts'

  return (
    <div className="football-learn-table-wrap">
      <table className="football-learn-table">
        <thead>
          <tr>
            <th>{t.footballTableYear}</th>
            {showHost ? <th>{t.footballTableHost}</th> : null}
            {showWinner ? <th>{t.footballTableWinner}</th> : null}
            {showRunnerUp ? <th>{t.footballTableRunnerUp}</th> : null}
            {showMatch ? <th>{t.footballTableMatch}</th> : null}
            <th>{t.footballTableScore}</th>
            {showVenue ? <th>{t.footballTableVenue}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year}>
              <td className="football-learn-year">{row.year}</td>
              {showHost ? (
                <td>{row.hostIds ? <TeamCell id={wcHostAnswerId(row.hostIds)} lang={lang} /> : '—'}</td>
              ) : null}
              {showWinner ? <td>{row.winnerId ? <TeamCell id={row.winnerId} lang={lang} /> : '—'}</td> : null}
              {showRunnerUp ? (
                <td>{row.runnerUpId ? <TeamCell id={row.runnerUpId} lang={lang} /> : '—'}</td>
              ) : null}
              {showMatch ? (
                <td>
                  <MatchCell winnerId={row.winnerId} runnerUpId={row.runnerUpId} lang={lang} />
                </td>
              ) : null}
              <td className="football-learn-score">
                {row.final ? formatFinalScore(row.final, scoreLabels) : '—'}
              </td>
              {showVenue ? <td>{row.final ? finalCity(row.final, lang) : '—'}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
