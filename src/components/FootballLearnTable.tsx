import { AFCON_WINNERS } from '../data/afcon'
import { COPA_WINNERS } from '../data/copaAmerica'
import { EURO_HOSTS, EURO_WINNERS } from '../data/euros'
import {
  euroFinal,
  finalCity,
  formatFinalScore,
  worldCupFinal,
  type FootballFinal,
} from '../data/footballFinals'
import { UCL_WINNERS } from '../data/ucl'
import { WC_SCORERS, scorerName, wcScorerAnswerId } from '../data/wcScorers'
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
  clubId?: string
  player?: string
  goals?: number
  final?: FootballFinal
}

function yearOk(year: number, years?: readonly number[]) {
  return !years || years.length === 0 || years.includes(year)
}

function rowsFor(mode: FootballMode, lang: Lang, years?: readonly number[]): Row[] {
  if (mode === 'euroWinners' || mode === 'euroFinalists') {
    return EURO_WINNERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      winnerId: item.winnerId,
      runnerUpId: item.runnerUpId,
      final: euroFinal(item.year),
    }))
  }
  if (mode === 'euroHosts') {
    return EURO_HOSTS.filter((item) => yearOk(item.year, years)).map((item) => {
      const cup = EURO_WINNERS.find((winner) => winner.year === item.year)
      const final = euroFinal(item.year)
      return {
        year: item.year,
        hostIds: item.hostIds,
        winnerId: cup?.winnerId,
        runnerUpId: cup?.runnerUpId,
        final,
      }
    })
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
  if (mode === 'wcScorers') {
    return WC_SCORERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      winnerId: wcScorerAnswerId(item),
      player: scorerName(item, lang),
      goals: item.goals,
    }))
  }
  if (mode === 'uclWinners') {
    return UCL_WINNERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      clubId: item.clubId,
    }))
  }
  if (mode === 'copaWinners') {
    return COPA_WINNERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      winnerId: item.winnerId,
      runnerUpId: item.runnerUpId,
    }))
  }
  if (mode === 'afconWinners') {
    return AFCON_WINNERS.filter((item) => yearOk(item.year, years)).map((item) => ({
      year: item.year,
      winnerId: item.winnerId,
      runnerUpId: item.runnerUpId,
    }))
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
  if (mode === 'wcTitleYears' || mode === 'euroTitleYears' || mode === 'playerPhotoToName' || mode === 'playerFactsToName') {
    return null
  }
  const t = STRINGS[lang]
  const rows = rowsFor(mode, lang, years)
  if (rows.length === 0) return null
  const scoreLabels = {
    aet: t.footballAet,
    pens: t.footballPens,
    replay: t.footballReplay,
    golden: t.footballGolden,
  }
  const showWinner = mode === 'wcWinners' || mode === 'euroWinners' || mode === 'copaWinners' || mode === 'afconWinners'
  const showRunnerUp = showWinner
  const showMatch = mode === 'wcFinalists' || mode === 'wcHosts' || mode === 'euroFinalists' || mode === 'euroHosts'
  const showHost = mode === 'wcHosts' || mode === 'euroHosts'
  const showVenue = showHost
  const showScore = mode === 'wcWinners' || mode === 'wcFinalists' || mode === 'wcHosts' || mode === 'euroWinners' || mode === 'euroFinalists' || mode === 'euroHosts'
  const showPlayer = mode === 'wcScorers'
  const showClub = mode === 'uclWinners'
  const showCountry = mode === 'wcScorers'

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
            {showClub ? <th>{t.footballTableWinner}</th> : null}
            {showPlayer ? <th>{t.footballTablePlayer}</th> : null}
            {showCountry ? <th>{t.footballTableCountry}</th> : null}
            {showPlayer ? <th>{t.footballTableGoals}</th> : null}
            {showScore ? <th>{t.footballTableScore}</th> : null}
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
              {showClub ? <td>{row.clubId ? <TeamCell id={row.clubId} lang={lang} /> : '—'}</td> : null}
              {showPlayer ? <td>{row.player ?? '—'}</td> : null}
              {showCountry ? <td>{row.winnerId ? <TeamCell id={row.winnerId} lang={lang} /> : '—'}</td> : null}
              {showPlayer ? <td className="football-learn-score">{row.goals ?? '—'}</td> : null}
              {showScore ? (
                <td className="football-learn-score">
                  {row.final ? formatFinalScore(row.final, scoreLabels) : '—'}
                </td>
              ) : null}
              {showVenue ? <td>{row.final ? finalCity(row.final, lang) : '—'}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
