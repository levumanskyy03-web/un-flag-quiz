import type { L11 } from '../math'
import type { ThemeTier } from '../theme'

export type FoodDish = {
  id: string
  tier: ThemeTier
  name: L11
  country: L11
  ck: string
  ing: L11
  sig?: boolean
  photo?: string
}
