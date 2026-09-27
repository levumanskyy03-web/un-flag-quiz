'use client'

import { foodCourse, foodCourseLabel } from '../data/food/course'
import { dishPhotoSrc } from '../data/food/dishPhoto'
import { scaledRecipe } from '../data/food/recipe'
import { pickL } from '../data/math'
import { allFoodDishes } from '../data/food/rows'
import type { FoodDish } from '../data/food/types'
import { STRINGS } from '../i18n/strings'
import { useSiteLang } from '../i18n/siteLang'
import { countryByIso, countryPath } from '../lib/countryCatalog'
import { getPassport } from '../data/passports'
import { Flag } from './Flag'
import { HelpTip } from './HelpTip'

function formatGrams(n: number): string {
  if (n < 1) {
    const text = n.toFixed(1)
    return text.endsWith('.0') ? text.slice(0, -2) : text
  }
  return String(Math.round(n))
}

export function DishCardView({ dish }: { dish: FoodDish }) {
  const { lang } = useSiteLang()
  const t = STRINGS[lang]
  const dishes = allFoodDishes()
  const index = dishes.findIndex((item) => item.id === dish.id)
  const prev = dishes[(index - 1 + dishes.length) % dishes.length]
  const next = dishes[(index + 1) % dishes.length]
  const name = pickL(dish.name, lang)
  const country = pickL(dish.country, lang)
  const ingredients = pickL(dish.ing, lang)
  const recipe = scaledRecipe(dish.id, lang)
  const origin = countryByIso(dish.ck)
  const originHref = origin && getPassport(origin.iso) ? countryPath(origin.iso) : undefined
  const photo = dishPhotoSrc(dish, 640)

  return (
    <div className="country-passport">
      <p className="country-kicker">{t.dishCardKicker}</p>
      {photo ? (
        <span className="flag flag-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="flag-img dish-hero" src={photo} alt="" />
        </span>
      ) : (
        <Flag iso={dish.ck} name={country} size="hero" />
      )}
      <h1 className="country-title">{name}</h1>
      {lang !== 'en' ? <p className="country-title-en">{pickL(dish.name, 'en')}</p> : null}
      <p className="dish-origin">
        <span>{t.dishOrigin}</span>
        {originHref ? <a href={originHref}>{country}</a> : country}
      </p>
      <p className="dish-origin">
        <span>{t.dishCourse}</span>
        {pickL(foodCourseLabel(foodCourse(dish.id)), lang)}
      </p>
      {recipe ? (
        <section className="dish-sheet">
          <h2>
            {t.dishIngredients}
            <HelpTip text={t.dishScaleNote} />
          </h2>
          <table className="dish-table">
            <thead>
              <tr>
                <th scope="col">{t.dishIngredients}</th>
                <th scope="col">{t.dishPortion}</th>
                <th scope="col">{t.dishPerKilo}</th>
              </tr>
            </thead>
            <tbody>
              {recipe.rows.map((row, index) => (
                <tr key={`${index}-${row.name}`}>
                  <td>{row.name}</td>
                  <td>
                    {formatGrams(row.g)} {t.dishGram}
                  </td>
                  <td>
                    {formatGrams(row.perKg)} {t.dishGram}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>{t.dishMethod}</h2>
          <ol className="dish-steps">
            {recipe.steps.map((step, index) => (
              <li key={`${index}-${step}`}>{step}</li>
            ))}
          </ol>
        </section>
      ) : (
        <p className="dish-note">{ingredients}</p>
      )}
      <nav className="country-adjacent">
        {prev ? <a href={`/dish/${prev.id}`}>← {pickL(prev.name, lang)}</a> : <span />}
        {next ? <a href={`/dish/${next.id}`}>{pickL(next.name, lang)} →</a> : <span />}
      </nav>
    </div>
  )
}
