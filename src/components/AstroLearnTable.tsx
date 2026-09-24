import { STRINGS, astroQuestionPrompt, modeLabel, type Lang } from '../i18n/strings'
import { astroById, astroLearnLine } from '../lib/quiz'
import { LeaderPortrait } from './LeaderPortrait'

export function AstroLearnTable({
  isos,
  lang,
  hideAnswers,
}: {
  isos: string[]
  lang: Lang
  hideAnswers?: boolean
}) {
  const t = STRINGS[lang]
  const first = isos[0] ? astroById(isos[0]) : undefined
  const promptLabel = first ? astroQuestionPrompt(first.mode, lang) : null
  return (
    <div className="football-learn-table-wrap">
      <table className="football-learn-table">
        <thead>
          <tr>
            <th>{t.mode}</th>
            <th>{promptLabel ?? t.astroPlanetPrompt}</th>
            <th>{hideAnswers ? t.leaderHiddenName : t.start}</th>
          </tr>
        </thead>
        <tbody>
          {isos.map((iso) => {
            const item = astroById(iso)
            if (!item) return null
            const line = astroLearnLine(item, lang)
            return (
              <tr key={iso}>
                <td>{modeLabel(item.mode, lang)}</td>
                <td>
                  {item.wikiFile && item.mode === 'astroPhotoToName' ? (
                    <LeaderPortrait name={line.answer} wiki={item.wiki ?? ''} file={item.wikiFile} size="thumb" compact />
                  ) : (
                    line.prompt
                  )}
                </td>
                <td>{hideAnswers ? t.leaderHiddenName : line.answer}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
