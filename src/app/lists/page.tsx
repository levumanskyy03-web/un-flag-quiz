import type { Metadata } from 'next'
import { ListsPageView } from '../../components/ListsPages'
import { PAGE_COPY } from '../../i18n/pages'
import { requestLang } from '../../i18n/requestLang'
import { publicMetadata } from '../../lib/pageMeta'

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang()
  const copy = PAGE_COPY[lang]
  return publicMetadata(lang, {
    title: copy.listsTitle,
    description: copy.listsLead,
    path: '/lists',
  })
}

export default function ListsPage() {
  return <ListsPageView />
}
