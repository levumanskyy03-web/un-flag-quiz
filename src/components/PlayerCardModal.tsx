import { useEffect } from 'react'
import { footballClub } from '../data/footballClubs'
import { playerClubName, type FootballPlayer } from '../data/footballPlayers'
import { footballTeamCountry } from '../data/worldCup'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { LeaderPortrait } from './LeaderPortrait'

interface PlayerCardModalProps {
  player: FootballPlayer
  lang: Lang
  onClose: () => void
}

function unique(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))]
}

export function PlayerCardModal({ player, lang, onClose }: PlayerCardModalProps) {
  const t = STRINGS[lang]
  const name = lang === 'ru' ? player.ru : player.en
  const lived = player.died ? `${player.born}–${player.died}` : `${player.born}–${t.present}`
  const nation = countryName(footballTeamCountry(player.nation), lang)
  const bornNation = countryName(footballTeamCountry(player.bornNation), lang)
  const clubs = player.clubs.map((id) => playerClubName(id, lang === 'ru' ? 'ru' : 'en')).join(', ')
  const clubCountries = unique(player.clubs.map((id) => footballClub(id)?.nation ?? '').filter(Boolean)).map((iso) =>
    countryName(footballTeamCountry(iso), lang),
  )
  const trophies: string[] = []
  if (player.wcWins.length) trophies.push(`FIFA ${player.wcWins.join(', ')}`)
  if (player.euroWins.length) trophies.push(`UEFA ${player.euroWins.join(', ')}`)
  if (player.copaWins.length) trophies.push(`Copa ${player.copaWins.join(', ')}`)
  if (player.afconWins.length) trophies.push(`CAF ${player.afconWins.join(', ')}`)
  if (player.uclWins.length) trophies.push(`UCL ${player.uclWins.join(', ')}`)
  const honours: string[] = []
  if (player.ballonDor.length) honours.push(`Ballon d’Or ${player.ballonDor.join(', ')}`)
  if (player.goldenBoot) honours.push(t.playerFactGoldenBoot)
  if (player.wcCaptain) honours.push(t.playerFactWcCaptain)
  const facts: string[] = []
  if (player.clubs.includes('barca') && player.clubs.includes('real')) facts.push(t.playerFactBothClasico)
  if (player.number10) facts.push(t.playerFactNumber10)
  if (player.wcFinalGoal) facts.push(t.playerFactWcFinalGoal)
  if (player.leftFoot) facts.push(t.playerFactLeftFoot)
  if (player.wcYears.length) facts.push(t.playerFactWcCount(player.wcYears.length === 0 ? 0 : player.wcYears.length === 1 ? 1 : player.wcYears.length === 2 ? 2 : 3))
  const pos =
    player.position === 'gk'
      ? t.playerPositionGk
      : player.position === 'df'
        ? t.playerPositionDf
        : player.position === 'mf'
          ? t.playerPositionMf
          : t.playerPositionFw
  const foot =
    player.foot === 'left' || player.leftFoot ? t.playerFootLeft : player.foot === 'both' ? t.playerFootBoth : player.foot === 'right' ? t.playerFootRight : null

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="passport-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet leader-bio-sheet player-card-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-card-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        <LeaderPortrait name={name} wiki={player.wiki} size="hero" />
        <h2 id="player-card-title" className="passport-title">
          {name}
        </h2>
        <p className="learn-card-meta">
          {player.era === 'legend' ? t.playerEraLegend : t.playerEraActive}
          {' · '}
          {pos}
        </p>
        <dl className="player-card-dl">
          <div>
            <dt>{player.died ? t.playerCardLived : t.playerCardBorn}</dt>
            <dd>{player.died ? lived : player.born}</dd>
          </div>
          <div>
            <dt>{t.playerCardNation}</dt>
            <dd>{nation}</dd>
          </div>
          {player.bornNation !== player.nation ? (
            <div>
              <dt>{t.playerCardBornIn}</dt>
              <dd>{bornNation}</dd>
            </div>
          ) : null}
          {player.heightCm ? (
            <div>
              <dt>{t.playerCardHeight}</dt>
              <dd>{player.heightCm} cm</dd>
            </div>
          ) : null}
          {foot ? (
            <div>
              <dt>{t.playerCardFoot}</dt>
              <dd>{foot}</dd>
            </div>
          ) : null}
          {player.number ? (
            <div>
              <dt>{t.playerCardNumber}</dt>
              <dd>{player.number}</dd>
            </div>
          ) : null}
          {player.caps !== undefined ? (
            <div>
              <dt>{t.playerCardCaps}</dt>
              <dd>
                {player.caps}
                {player.intlGoals !== undefined ? ` / ${player.intlGoals}` : ''}
              </dd>
            </div>
          ) : null}
          {clubs ? (
            <div className="is-wide">
              <dt>{t.playerCardClubs}</dt>
              <dd>{clubs}</dd>
            </div>
          ) : null}
          {clubCountries.length > 0 ? (
            <div className="is-wide">
              <dt>{t.playerCardClubCountries}</dt>
              <dd>{clubCountries.join(', ')}</dd>
            </div>
          ) : null}
          {trophies.length > 0 ? (
            <div className="is-wide">
              <dt>{t.playerCardTrophies}</dt>
              <dd>{trophies.join(' · ')}</dd>
            </div>
          ) : null}
          {honours.length > 0 ? (
            <div className="is-wide">
              <dt>{t.playerCardHonours}</dt>
              <dd>{honours.join(' · ')}</dd>
            </div>
          ) : null}
        </dl>
        {facts.length > 0 ? (
          <div className="player-card-facts">
            <p className="player-card-facts-title">{t.playerCardFacts}</p>
            <ul>
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
