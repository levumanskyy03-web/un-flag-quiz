import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { mathById, mathLearnLine } from '../lib/quiz'
import { MathShape } from './MathShape'
import { LeaderPortrait } from './LeaderPortrait'

export function MathLearnTable({
  isos,
  lang,
  hideAnswers,
}: {
  isos: string[]
  lang: Lang
  hideAnswers?: boolean
}) {
  const t = STRINGS[lang]
  return (
    <div className="football-learn-table-wrap">
      <table className="football-learn-table">
        <thead>
          <tr>
            <th>{t.mode}</th>
            <th>{t.mathExprPrompt}</th>
            <th>{hideAnswers ? t.leaderHiddenName : t.start}</th>
          </tr>
        </thead>
        <tbody>
          {isos.map((iso) => {
            const item = mathById(iso)
            if (!item) return null
            const line = mathLearnLine(item, lang)
            return (
              <tr key={iso}>
                <td>{modeLabel(item.mode, lang)}</td>
                <td>
                  {item.shape && item.mode === 'shapeToName' ? <MathShape id={item.shape} size={40} /> : line.prompt}
                </td>
                <td>
                  {hideAnswers ? (
                    t.leaderHiddenName
                  ) : item.wikiFile && item.mode === 'mathPhotoToName' ? (
                    <LeaderPortrait name={line.answer} wiki={item.wiki ?? ''} file={item.wikiFile} size="thumb" compact />
                  ) : (
                    line.answer
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
