import type { Metadata } from 'next'
import { localeTag, type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'
import { SITE_ORIGIN, siteUrl } from './site'

export function publicMetadata(
  lang: Lang,
  opts: { title: string; description: string; path: string },
): Metadata {
  const t = STRINGS[lang]
  const url = siteUrl(opts.path)
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: localeTag(lang).replaceAll('-', '_'),
      url,
      siteName: t.title,
      title: opts.title,
      description: opts.description,
    },
    twitter: {
      card: 'summary',
      title: opts.title,
      description: opts.description,
    },
  }
}

export function homeMetadata(lang: Lang): Metadata {
  const t = STRINGS[lang]
  return {
    metadataBase: new URL(SITE_ORIGIN),
    applicationName: t.title,
    icons: { icon: '/favicon.svg' },
    title: { default: t.title, template: `%s · ${t.title}` },
    description: t.subtitle,
    alternates: { canonical: SITE_ORIGIN },
    openGraph: {
      type: 'website',
      locale: localeTag(lang).replaceAll('-', '_'),
      url: SITE_ORIGIN,
      siteName: t.title,
      title: t.title,
      description: t.subtitle,
    },
    twitter: {
      card: 'summary',
      title: t.title,
      description: t.subtitle,
    },
  }
}
