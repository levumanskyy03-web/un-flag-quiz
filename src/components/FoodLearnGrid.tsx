import { dishPhotoSrc } from '../data/food/dishPhoto'
import { pickL } from '../data/math'
import { dishIdFromThemeItem, foodDishById } from '../data/food/rows'
import type { FoodDish } from '../data/food/types'
import type { Lang } from '../i18n/lang'
import { rememberDishReturn, type DishReturn } from '../lib/dishReturn'
import { Flag } from './Flag'

export function FoodLearnGrid({ isos, lang, returnTo }: { isos: string[]; lang: Lang; returnTo: DishReturn }) {
  const seen = new Set<string>()
  const dishes: FoodDish[] = []
  for (const iso of isos) {
    const id = dishIdFromThemeItem(iso)
    if (!id || seen.has(id)) continue
    const dish = foodDishById(id)
    if (!dish) continue
    seen.add(id)
    dishes.push(dish)
  }

  return (
    <section className="learn-grid">
      {dishes.map((dish) => {
        const name = pickL(dish.name, lang)
        const country = pickL(dish.country, lang)
        const photo = dishPhotoSrc(dish, 320)
        return (
          <a key={dish.id} className="learn-card" href={`/dish/${dish.id}`} onClick={() => rememberDishReturn(returnTo)}>
            {photo ? (
              <span className="flag flag-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="flag-img" src={photo} alt="" decoding="async" loading="lazy" />
              </span>
            ) : (
              <Flag iso={dish.ck} name={country} size="card" />
            )}
            <p className="learn-card-name">{name}</p>
            <p className="learn-card-meta">{country}</p>
          </a>
        )
      })}
    </section>
  )
}
