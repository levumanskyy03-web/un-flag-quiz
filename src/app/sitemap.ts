import type { MetadataRoute } from 'next'
import { COUNTRIES } from '../data/countries'

const BASE = 'https://un-flag-quiz.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now },
    { url: `${BASE}/about`, lastModified: now },
    { url: `${BASE}/privacy`, lastModified: now },
    { url: `${BASE}/contacts`, lastModified: now },
    { url: `${BASE}/countries`, lastModified: now },
    { url: `${BASE}/today`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]
  for (const country of COUNTRIES) {
    pages.push({ url: `${BASE}/country/${country.iso}`, lastModified: now })
  }
  return pages
}
