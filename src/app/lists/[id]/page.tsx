import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteListPageView } from '../../../components/ListsPages'
import { LIST_IDS, isListId } from '../../../data/lists'
import { PAGE_COPY } from '../../../i18n/pages'
import { requestLang } from '../../../i18n/requestLang'
import { publicMetadata } from '../../../lib/pageMeta'

export function generateStaticParams() {
  return LIST_IDS.map((id) => ({ id }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const lang = await requestLang()
  const copy = PAGE_COPY[lang]
  const { id } = await params
  if (!isListId(id)) {
    return publicMetadata(lang, {
      title: copy.listsTitle,
      description: copy.listsLead,
      path: '/lists',
    })
  }
  const item = copy.listsCopy[id]
  return publicMetadata(lang, {
    title: item.title,
    description: item.lead,
    path: `/lists/${id}`,
  })
}

export default async function ListIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isListId(id)) notFound()
  return <SiteListPageView id={id} />
}
