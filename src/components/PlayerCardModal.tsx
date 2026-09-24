import { useEffect } from 'react'
import { footballClub } from '../data/footballClubs'
import { greatClub } from '../data/footballGreatClubs'
import { playerClubName, playerCurrentClubId, playerDisplayName, type FootballPlayer } from '../data/footballPlayers'
import { footballTeamCountry } from '../data/worldCup'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { LeaderPortrait } from './LeaderPortrait'
import { PlayerCatalogNo } from './PlayerCatalogNo'

interface PlayerCardModalProps {
  player: FootballPlayer
  lang: Lang
  onClose: () => void
  onOpenClub?: (clubId: string) => void
}

function unique(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))]
}

export function PlayerCardModal({ player, lang, onClose, onOpenClub }: PlayerCardModalProps) {
  const t = STRINGS[lang]
  const name = playerDisplayName(player, lang)
  const lived = player.died ? `${player.born}–${player.died}` : `${player.born}–${t.present}`
  const nation = countryName(footballTeamCountry(player.nation), lang)
  const bornNation = countryName(footballTeamCountry(player.bornNation), lang)
  const currentClubId = playerCurrentClubId(player)
  const pastClubIds = unique(player.clubs.filter((id) => id !== currentClubId))
  const currentClub = currentClubId ? playerClubName(currentClubId, lang) : ''
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
  const clubName = (id: string) => playerClubName(id, lang)
  const clubLink = (id: string) =>
    onOpenClub && greatClub(id) ? (
      <button type="button" className="player-card-club-link" onClick={() => onOpenClub(id)}>
        {clubName(id)}
      </button>
    ) : (
      <span>{clubName(id)}</span>
    )

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
        <div className="player-portrait-wrap">
          <PlayerCatalogNo id={player.id} onPhoto />
          <LeaderPortrait name={name} wiki={player.wiki} file={player.wikiFile} flagIso={player.nation} size="hero" />
        </div>
        <PlayerCatalogNo id={player.id} />
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
          {currentClub || pastClubIds.length > 0 ? (
            <div className="is-wide">
              <dt>{t.playerCardClubs}</dt>
              <dd>
                <div className="player-card-clubs">
                  {pastClubIds.length > 0 ? (
                    <p className="player-card-clubs-past">
                      {pastClubIds.map((id, index) => (
                        <span key={id}>
                          {index > 0 ? ' · ' : null}
                          {clubLink(id)}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  {currentClub ? (
                    <p className="player-card-club-now">
                      {clubLink(currentClubId!)}
                      <span className="player-card-club-badge">
                        {player.era === 'legend' ? t.playerClubBadgeLast : t.playerClubBadgeNow}
                      </span>
                    </p>
                  ) : null}
                </div>
              </dd>
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
