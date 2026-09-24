import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteCollectionPageView } from '../../../../components/ListsPages'
import { collectionById, collectionParams, isQuizWorldId } from '../../../../data/collections'
import { collectionCopyOf } from '../../../../i18n/collectionCopy'
import { PAGE_COPY } from '../../../../i18n/pages'
import { requestLang } from '../../../../i18n/requestLang'
import { publicMetadata } from '../../../../lib/pageMeta'

export function generateStaticParams() {
  return collectionParams()
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; id: string }>
}): Promise<Metadata> {
  const lang = await requestLang()
  const copy = PAGE_COPY[lang]
  const { world, id } = await params
  if (!isQuizWorldId(world) || !collectionById(world, id)) {
    return publicMetadata(lang, {
      title: copy.listsTitle,
      description: copy.listsLead,
      path: '/lists',
    })
  }
  const item = collectionCopyOf(id, lang)
  return publicMetadata(lang, {
    title: item.title,
    description: item.lead,
    path: `/lists/${world}/${id}`,
  })
}

export default async function CollectionPage({ params }: { params: Promise<{ world: string; id: string }> }) {
  const { world, id } = await params
  if (!isQuizWorldId(world) || !collectionById(world, id)) notFound()
  return <SiteCollectionPageView world={world} id={id} />
}
