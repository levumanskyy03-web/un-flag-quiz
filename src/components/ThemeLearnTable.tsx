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
  const cards = isos.flatMap((iso) => {
    const item = themeById(iso)
    if (!item) return []
    return [{ iso, line: themeLearnLine(item, lang) }]
  })
  if (cards.some((row) => row.line.note)) {
    return (
      <div className="learn-grid is-notes">
        {cards.map(({ iso, line }) => (
          <article key={iso} className="learn-card is-note">
            <p className="learn-card-name">{line.prompt}</p>
            {hideAnswers ? (
              <p className="learn-card-meta">{t.leaderHiddenName}</p>
            ) : (
              <>
                <p className="learn-card-meta">{line.answer}</p>
                {line.note ? <p className="learn-card-bio">{line.note}</p> : null}
              </>
            )}
          </article>
        ))}
      </div>
    )
  }
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
