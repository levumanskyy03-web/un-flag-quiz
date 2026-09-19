import type { MetadataRoute } from 'next'
import { COUNTRIES } from '../data/countries'
import { languagesIndex } from '../data/languages'
import { SITE_ORIGIN } from '../lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, lastModified: now },
    { url: `${SITE_ORIGIN}/geo`, lastModified: now },
    { url: `${SITE_ORIGIN}/football`, lastModified: now },
    { url: `${SITE_ORIGIN}/leaders`, lastModified: now },
    { url: `${SITE_ORIGIN}/math`, lastModified: now },
    { url: `${SITE_ORIGIN}/astronomy`, lastModified: now },
    { url: `${SITE_ORIGIN}/biology`, lastModified: now },
    { url: `${SITE_ORIGIN}/olympics`, lastModified: now },
    { url: `${SITE_ORIGIN}/cs`, lastModified: now },
    { url: `${SITE_ORIGIN}/food`, lastModified: now },
    { url: `${SITE_ORIGIN}/multiplayer`, lastModified: now },
    { url: `${SITE_ORIGIN}/studio`, lastModified: now },
    { url: `${SITE_ORIGIN}/company`, lastModified: now },
    { url: `${SITE_ORIGIN}/shop`, lastModified: now },
    { url: `${SITE_ORIGIN}/about`, lastModified: now },
    { url: `${SITE_ORIGIN}/privacy`, lastModified: now },
    { url: `${SITE_ORIGIN}/terms`, lastModified: now },
    { url: `${SITE_ORIGIN}/contacts`, lastModified: now },
    { url: `${SITE_ORIGIN}/countries`, lastModified: now },
    { url: `${SITE_ORIGIN}/languages`, lastModified: now },
    { url: `${SITE_ORIGIN}/lists`, lastModified: now },
    { url: `${SITE_ORIGIN}/lists/microstates`, lastModified: now },
    { url: `${SITE_ORIGIN}/today`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]
  for (const country of COUNTRIES) {
    pages.push({ url: `${SITE_ORIGIN}/country/${country.iso}`, lastModified: now })
  }
  for (const item of languagesIndex()) {
    pages.push({ url: `${SITE_ORIGIN}/language/${item.id}`, lastModified: now })
  }
  return pages
}
