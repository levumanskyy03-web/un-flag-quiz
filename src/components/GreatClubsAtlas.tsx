import { useEffect, useMemo, useState } from 'react'
import { footballClub, footballClubName, clubWiki } from '../data/footballClubs'
import { GREAT_CLUBS } from '../data/footballGreatClubs'
import {
  GREAT_CLUBS_UNIQUE_PLAYER_COUNT,
  clubSquadStats,
  groupSquad,
  squadForYear,
  type ClubSquadFile,
  type ClubSquadStint,
  type SquadPos,
} from '../data/footballClubSquads'
import { playerById } from '../data/footballPlayers'
import { footballTeamCountry } from '../data/worldCup'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import { FitText } from './FitText'
import { LeaderPortrait } from './LeaderPortrait'
import { PlayerCardModal } from './PlayerCardModal'

const NOW = new Date().getFullYear()

function posLabel(pos: SquadPos | undefined, lang: Lang): string {
  const t = STRINGS[lang]
  if (pos === 'gk') return t.playerPositionGk
  if (pos === 'df') return t.playerPositionDf
  if (pos === 'mf') return t.playerPositionMf
  if (pos === 'fw') return t.playerPositionFw
  return t.clubCardSquad
}

export function GreatClubsAtlas({ lang }: { lang: Lang }) {
  const t = STRINGS[lang]
  const [openId, setOpenId] = useState<string | null>(null)
  const open = GREAT_CLUBS.find((club) => club.id === openId)

  return (
    <section className="great-clubs-atlas">
      <h2>{t.greatClubsTitle}</h2>
      <div className="learn-grid is-leaders">
        {GREAT_CLUBS.map((club) => {
          const row = footballClub(club.id)
          if (!row) return null
          const name = footballClubName(club.id, lang)
          return (
            <button key={club.id} type="button" className="learn-card is-leader" onClick={() => setOpenId(club.id)}>
              <LeaderPortrait name={name} wiki={clubWiki(club.id)} flagIso={row.nation} size="card" />
              <p className="learn-card-name">
                <FitText>{name}</FitText>
              </p>
              <p className="learn-card-meta">
                {t.clubCardFounded} {club.founded}
              </p>
            </button>
          )
        })}
      </div>
      {open ? (
        <ClubCardModal
          key={open.id}
          clubId={open.id}
          founded={open.founded}
          lang={lang}
          onClose={() => setOpenId(null)}
          onOpenClub={setOpenId}
        />
      ) : null}
    </section>
  )
}

export function ClubCardModal({
  clubId,
  founded,
  lang,
  onClose,
  onOpenClub,
}: {
  clubId: string
  founded: number
  lang: Lang
  onClose: () => void
  onOpenClub?: (clubId: string) => void
}) {
  const t = STRINGS[lang]
  const club = footballClub(clubId)
  const name = footballClubName(clubId, lang)
  const nation = club ? countryName(footballTeamCountry(club.nation), lang) : ''
  const years = useMemo(() => {
    const list: number[] = []
    for (let year = NOW; year >= founded; year -= 1) list.push(year)
    return list
  }, [founded])
  const [year, setYear] = useState(years[0] ?? founded)
  const [file, setFile] = useState<ClubSquadFile | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const player = playerId ? playerById(playerId) : undefined

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (playerId) setPlayerId(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, playerId])

  useEffect(() => {
    let gone = false
    fetch(`/football/squads/${clubId}.json`)
      .then((res) => (res.ok ? res.json() : { clubId, stints: [] }))
      .then((data: ClubSquadFile) => {
        if (!gone) setFile(data)
      })
      .catch(() => {
        if (!gone) setFile({ clubId, stints: [] })
      })
    return () => {
      gone = true
    }
  }, [clubId])

  const squad = useMemo(() => squadForYear(file?.stints ?? [], year), [file, year])
  const groups = useMemo(() => groupSquad(squad), [squad])
  const stats = useMemo(() => clubSquadStats(file?.stints ?? []), [file])
  const formatCount = (value: number) => value.toLocaleString(lang)
  const dataPeriod = stats.from != null && stats.to != null ? `${stats.from}–${stats.to}` : '—'

  return (
    <>
      <div className="passport-overlay club-card-overlay" onClick={onClose} role="presentation">
        <div
          className="passport-sheet leader-bio-sheet player-card-sheet club-card-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="club-card-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="btn-ghost passport-close" onClick={onClose}>
            {t.close}
          </button>
          <header className="club-card-hero">
            <div className="club-card-crest">
              <LeaderPortrait name={name} wiki={clubWiki(clubId)} flagIso={club?.nation} size="hero" />
            </div>
            <div className="club-card-identity">
              {nation ? <p className="club-card-country">{nation}</p> : null}
              <h2 id="club-card-title" className="passport-title">
                {name}
              </h2>
              <p className="club-card-founded">
                {t.clubCardFounded} <strong>{founded}</strong>
              </p>
            </div>
          </header>
          <section className="club-card-overview">
            <p className="club-card-about">{t.clubCardAbout}</p>
            <div className="club-card-stats">
              <div>
                <span>{t.clubCardUniquePlayers}</span>
                <strong>{file ? formatCount(stats.uniquePlayers) : '—'}</strong>
              </div>
              <div>
                <span>{t.clubCardDataPeriod}</span>
                <strong>{file ? dataPeriod : '—'}</strong>
              </div>
              <div>
                <span>{t.clubCardAllClubsPlayers}</span>
                <strong>{formatCount(GREAT_CLUBS_UNIQUE_PLAYER_COUNT)}</strong>
              </div>
            </div>
            <p className="club-card-stats-note">{t.clubCardStatsNote}</p>
          </section>
          <div className="club-card-controls">
            <label className="club-card-year">
              <span>{t.clubCardYear}</span>
              <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <div className="club-card-roster-stat" aria-label={`${t.clubCardSquad}: ${squad.length}`}>
              <span>{t.clubCardSquad}</span>
              <strong>{file ? squad.length : '—'}</strong>
            </div>
          </div>
          <div className="club-card-squad">
            <p className="club-card-section-title">{t.clubCardSquad}</p>
            {!file ? (
              <div className="club-card-loading" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {file && groups.length === 0 ? <p className="learn-card-meta">{t.clubCardSquadEmpty}</p> : null}
            {groups.map((group) => (
              <div key={group.pos ?? 'other'} className="club-card-pos">
                <p className="club-card-pos-title">
                  <span>{posLabel(group.pos, lang)}</span>
                  <strong>{group.rows.length}</strong>
                </p>
                <ul>
                  {group.rows.map((row, index) => (
                    <SquadRow key={`${row.id ?? row.wiki ?? row.name}:${index}`} row={row} lang={lang} onOpen={setPlayerId} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {player ? (
        <PlayerCardModal
          player={player}
          lang={lang}
          onClose={() => setPlayerId(null)}
          onOpenClub={(nextClubId) => {
            setPlayerId(null)
            onOpenClub?.(nextClubId)
          }}
        />
      ) : null}
    </>
  )
}

function SquadRow({
  row,
  lang,
  onOpen,
}: {
  row: ClubSquadStint
  lang: Lang
  onOpen: (id: string) => void
}) {
  const t = STRINGS[lang]
  if (row.id && playerById(row.id)) {
    return (
      <li>
        <button type="button" className="club-squad-link" onClick={() => onOpen(row.id!)} aria-label={`${row.name}. ${t.clubCardPlayer}`}>
          {row.name}
        </button>
      </li>
    )
  }
  return <li>{row.name}</li>
}
