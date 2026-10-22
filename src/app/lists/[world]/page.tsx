import { notFound } from 'next/navigation'
import { StaticRedirect } from '../../../components/StaticRedirect'
import { isQuizWorldId } from '../../../data/collections'
import { SITE_LISTS, isListId } from '../../../data/lists'
import { QUIZ_WORLDS } from '../../../lib/quiz/core'

export function generateStaticParams() {
  return [
    ...QUIZ_WORLDS.map((world) => ({ world })),
    ...SITE_LISTS.map((list) => ({ world: list.id })),
  ]
}

export const dynamicParams = false

export default async function ListsWorldPage({ params }: { params: Promise<{ world: string }> }) {
  const { world } = await params
  if (isListId(world)) return <StaticRedirect href={`/lists/geo/${world}`} />
  if (isQuizWorldId(world)) return <StaticRedirect href="/lists" />
  notFound()
}
