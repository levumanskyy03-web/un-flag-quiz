import { useState } from 'react'
import { ACHIEVEMENTS, achievementCopy, type AchievementId } from '../data/achievements'
import { STRINGS, type Lang } from '../i18n/strings'
import { AchievementMark } from './AchievementMark'

interface AchievementGalleryProps {
  lang: Lang
  unlockedIds: readonly AchievementId[]
}

export function AchievementGallery({ lang, unlockedIds }: AchievementGalleryProps) {
  const t = STRINGS[lang]
  const unlocked = new Set(unlockedIds)
  const [focus, setFocus] = useState<AchievementId | null>(null)

  return (
    <>
      <p className="setting-hint">
        {t.achievementsUnlocked(unlocked.size, ACHIEVEMENTS.length)}
      </p>
      <div className="achievement-grid">
        {ACHIEVEMENTS.map((info) => {
          const copy = achievementCopy(info.id, lang)
          const on = unlocked.has(info.id)
          return (
            <button
              key={info.id}
              type="button"
              className={`achievement-pick is-tier-${info.tier} ${on ? 'is-on' : ''} ${focus === info.id ? 'is-active' : ''}`}
              aria-pressed={on}
              aria-label={copy.title}
              onClick={() => setFocus(info.id)}
            >
              <AchievementMark id={info.id} />
            </button>
          )
        })}
      </div>
      {focus ? (
        <div className="achievement-detail">
          <p className="mode-stats-name">{achievementCopy(focus, lang).title}</p>
          <p className="setting-hint">{achievementCopy(focus, lang).hint}</p>
        </div>
      ) : (
        <p className="setting-hint">{t.achievementTap}</p>
      )}
    </>
  )
}
