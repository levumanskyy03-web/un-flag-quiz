import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { themeById, themeLearnLine } from '../lib/quiz'
import { LeaderPortrait } from './LeaderPortrait'

export function ThemeLearnTable({
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
            <th>{t.start}</th>
            <th>{hideAnswers ? t.leaderHiddenName : t.start}</th>
          </tr>
        </thead>
        <tbody>
          {isos.map((iso) => {
            const item = themeById(iso)
            if (!item) return null
            const line = themeLearnLine(item, lang)
            const photo = item.wikiFile && item.mode === 'csPhotoToName'
            return (
              <tr key={iso}>
                <td>{modeLabel(item.mode, lang)}</td>
                <td>
                  {photo ? (
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
