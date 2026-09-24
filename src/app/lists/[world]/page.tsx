import { notFound, redirect } from 'next/navigation'
import { isListId } from '../../../data/lists'
import { isQuizWorldId } from '../../../data/collections'

export default async function ListsWorldPage({ params }: { params: Promise<{ world: string }> }) {
  const { world } = await params
  if (isListId(world)) redirect(`/lists/geo/${world}`)
  if (isQuizWorldId(world)) redirect('/lists')
  notFound()
}
