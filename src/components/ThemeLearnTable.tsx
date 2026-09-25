import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { isThemePhotoMode, themeById, themeLearnLine } from '../lib/quiz'
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
            const photo = Boolean(item.wiki || item.wikiFile)
            const photoPrompt = isThemePhotoMode(item.mode)
            return (
              <tr key={iso}>
                <td>{modeLabel(item.mode, lang)}</td>
                <td>
                  {photo ? (
                    <span className="theme-learn-prompt">
                      <LeaderPortrait name={photoPrompt ? line.answer : line.prompt} wiki={item.wiki ?? ''} file={item.wikiFile} size="thumb" compact />
                      {photoPrompt ? null : line.prompt}
                    </span>
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
