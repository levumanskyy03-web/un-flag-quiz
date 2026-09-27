import { EMPIRE_RESOURCE_BY_WORLD } from '../data/empire'
import { STRINGS, type Lang } from '../i18n/strings'
import type { DuelReward, EmpireRoundReward } from '../lib/empire/rules'
import type { QuizWorld } from '../lib/quiz'
import { resourceTitle } from './EmpireScreen'

/** Одна строка на экране результатов: что раунд принёс Империи. */
export function EmpireRewardLine({ lang, reward, world }: { lang: Lang; reward: EmpireRoundReward; world: QuizWorld }) {
  const t = STRINGS[lang]
  const parts: string[] = []
  if (reward.specialists > 0) parts.push(t.empireRewardSpecialists(reward.specialists))
  if (reward.coins > 0) parts.push(t.empireRewardCoins(reward.coins))
  if (reward.resource > 0) parts.push(t.empireRewardResource(reward.resource, resourceTitle(EMPIRE_RESOURCE_BY_WORLD[world], t).toLocaleLowerCase(lang)))
  if (reward.gems > 0) parts.push(t.empireRewardGem(reward.gems))
  if ((reward.masteryDelta ?? 0) > 0) parts.push(t.empireRewardMastery(reward.masteryDelta ?? 0))
  if ((reward.farm ?? 0) > 0) parts.push(t.empireRewardFarm(reward.farm ?? 0, resourceTitle(EMPIRE_RESOURCE_BY_WORLD[world], t).toLocaleLowerCase(lang)))
  for (const note of reward.notes ?? []) {
    if (note === 'focus') parts.push(t.empireRewardFocus)
    if (note === 'tax') parts.push(t.empireRewardTax)
    if (note === 'scholar') parts.push(t.empireRewardScholar)
    if (note === 'expert') parts.push(t.empireRewardExpert)
    if (note === 'contract') parts.push(t.empireRewardContract)
  }
  if (parts.length === 0 && !reward.capped) return null
  return (
    <p className="score-xp score-empire">
      {parts.length > 0 ? `${t.empireRewardTitle}: ${parts.join(' · ')}` : null}
      {reward.capped ? <small> {t.empireRewardCapped}</small> : null}
    </p>
  )
}

export function EmpireDuelRewardLine({ lang, reward }: { lang: Lang; reward: DuelReward }) {
  const t = STRINGS[lang]
  const parts = [t.empireRewardCoins(reward.coins)]
  if (reward.gems > 0) parts.push(t.empireRewardGem(reward.gems))
  if (reward.streak > 1) parts.push(t.empireDuelStreak(reward.streak))
  return <p className="score-xp score-empire">{`${t.empireRewardTitle}: ${parts.join(' · ')}`}</p>
}
