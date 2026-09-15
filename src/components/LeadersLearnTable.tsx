import { formatTermNumber, termById, yearsLabel } from '../data/leaders'
import { portraitFileForTerm } from '../data/leaderPortraitFiles'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName, type Country } from '../lib/quiz'
import { LeaderNoteMark } from './LeaderNoteMark'
import { LeaderPortrait } from './LeaderPortrait'

export function LeadersLearnTable({
  countries,
  lang,
  showNumber,
  hideNames,
  revealed,
  onReveal,
  onOpen,
}: {
  countries: Country[]
  lang: Lang
  showNumber: boolean
  hideNames: boolean
  revealed: ReadonlySet<string>
  onReveal: (id: string) => void
  onOpen: (id: string) => void
}) {
  const t = STRINGS[lang]
  return (
    <div className="football-learn-table-wrap leaders-learn-table-wrap">
      <table className="football-learn-table leaders-learn-table">
        <thead>
          <tr>
            <th>{showNumber ? t.leaderAskNumber : t.leaderAskYears}</th>
            <th>{t.leaderLearnName}</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => {
            const term = termById(country.iso)
            if (!term) return null
            const name = countryName(country, lang)
            const open = !hideNames || revealed.has(term.id)
            return (
              <tr key={country.iso}>
                <td className="football-learn-year">
                  <span className="leaders-learn-cue">
                    <LeaderPortrait name={name} wiki={term.wiki} file={portraitFileForTerm(term.id)} size="thumb" compact />
                    <span className="leaders-learn-years">
                      {showNumber ? formatTermNumber(term) : yearsLabel(term.from, term.to, t.present)}
                    </span>
                  </span>
                </td>
                <td className="leaders-learn-name-cell">
                  {open ? (
                    <button type="button" className="leaders-learn-name" onClick={() => onOpen(term.id)}>
                      {name}
                    </button>
                  ) : (
                    <button type="button" className="leaders-learn-name is-hidden" onClick={() => onReveal(term.id)}>
                      {t.leaderHiddenName}
                    </button>
                  )}
                  {open ? <LeaderNoteMark term={term} lang={lang} /> : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
