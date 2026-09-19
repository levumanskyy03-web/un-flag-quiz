export async function shareResultFile(input: {
  score: string
  percent?: string
  theme: string
  challenge: string
  url: string
  success: boolean
}): Promise<File | null> {
  if (typeof document === 'undefined') return null
  const size = 1080
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#f4f0e8'
  ctx.fillRect(0, 0, size, size)

  const frame = 48
  const innerTop = 56
  const innerBottom = 250
  roundRect(ctx, frame, innerTop, size - frame * 2, size - innerTop - innerBottom, 18)
  ctx.fillStyle = input.success ? '#173528' : '#3a1c1c'
  ctx.fill()

  const accent = input.success ? '#5ee0a0' : '#ff8a8a'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#c9d6c8'
  ctx.font = '700 36px system-ui, sans-serif'
  wrapCentered(ctx, input.theme, size / 2, 160, size - 160, 44)

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 150px system-ui, sans-serif'
  ctx.fillText(input.score, size / 2, 400)

  if (input.percent) {
    ctx.fillStyle = accent
    ctx.font = '700 64px system-ui, sans-serif'
    ctx.fillText(input.percent, size / 2, 490)
  }

  ctx.fillStyle = '#f0d36a'
  ctx.font = '800 52px system-ui, sans-serif'
  wrapCentered(ctx, input.challenge, size / 2, 600, size - 180, 62)

  ctx.fillStyle = '#6b5d4d'
  ctx.font = '800 42px system-ui, sans-serif'
  wrapCentered(ctx, input.challenge, size / 2, 900, size - 120, 50)
  ctx.fillStyle = '#3d342b'
  ctx.font = '600 28px system-ui, sans-serif'
  wrapCentered(ctx, input.url, size / 2, 980, size - 100, 36)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return null
  return new File([blob], 'geoguiz-result.png', { type: 'image/png' })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth) {
      line = next
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  lines.slice(0, 3).forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight))
}
