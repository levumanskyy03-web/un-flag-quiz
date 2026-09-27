import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DishCardView } from '../../../components/DishCardView'
import { LegalShell } from '../../../components/LegalShell'
import { allFoodDishes, foodDishById } from '../../../data/food/rows'
import { pickL } from '../../../data/math'
import { requestLang } from '../../../i18n/requestLang'
import { STRINGS } from '../../../i18n/strings'
import { publicMetadata } from '../../../lib/pageMeta'

export function generateStaticParams() {
  return allFoodDishes().map((dish) => ({ id: dish.id }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const lang = await requestLang()
  const { id } = await params
  const dish = foodDishById(id)
  const t = STRINGS[lang]
  if (!dish) {
    return publicMetadata(lang, { title: t.food, description: t.foodSubtitle, path: '/food' })
  }
  const name = pickL(dish.name, lang)
  const country = pickL(dish.country, lang)
  return publicMetadata(lang, {
    title: name,
    description: `${name}: ${country}. ${pickL(dish.ing, lang)}`,
    path: `/dish/${dish.id}`,
  })
}

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dish = foodDishById(id)
  if (!dish) notFound()
  return (
    <LegalShell backHref="/food">
      <DishCardView dish={dish} />
    </LegalShell>
  )
}
