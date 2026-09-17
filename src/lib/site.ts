export const SITE_ORIGIN = 'https://www.geoguiz.online'
export const SITE_HOST = 'www.geoguiz.online'
export const SITE_UA = `PassportCountry/1.0 (${SITE_ORIGIN}; levumanskyy03@gmail.com)`

export function siteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
