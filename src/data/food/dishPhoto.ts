import { commonsThumbWidth } from '../../lib/commonsFile'
import photos from './dishPhotos.json'

const FILES = photos as Record<string, string>

function commonsThumb(url: string, px: number): string {
  px = commonsThumbWidth(px)
  const clean = url.split('?')[0]
  const sized = clean.match(/^(https:\/\/thumb\.wikimedia\.org\/wikipedia\/commons\/thumb\/.+\/)\d+px-(.+)$/)
  if (sized) return `${sized[1]}${px}px-${sized[2]}`
  const upload = clean.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/i)
  if (!upload) return clean
  const file = upload[3]
  const base = file.split('/').pop() ?? file
  return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${upload[1]}/${upload[2]}/${file}/${px}px-${base}`
}

/** Local studio photo, or a Commons thumb. `px` is the longest edge for remote shots. */
export function dishPhotoSrc(dish: { id: string; photo?: string }, px = 500): string | null {
  if (dish.photo) return `/food/${dish.photo}.jpg`
  const raw = FILES[dish.id]
  return raw ? commonsThumb(raw, px) : null
}
