import { PACK_MODEL_TEXT_CHARS, PACK_VISION_BATCH, PACK_VISION_CARDS, PACK_VISION_IMAGE_DATA_CHARS } from '@/data/pack'

export const runtime = 'nodejs'
export const maxDuration = 60

type PhotoIn = { id: string; mime: string; data: string }
type CardOut = {
  id?: string
  title?: string
  definition?: string
  date?: string
  group?: string
  expr?: string
  value?: string
  kind?: 'photo' | 'diagram'
}

type Body = {
  text?: string
  photos?: PhotoIn[]
  scan?: boolean
}

function modelKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY
}

export async function GET() {
  if (!modelKey()) return Response.json({ error: 'no_key' }, { status: 503 })
  return Response.json({ ok: true })
}

export async function POST(request: Request) {
  const key = modelKey()
  if (!key) return Response.json({ error: 'no_key' }, { status: 503 })
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 })
  }

  const photos = (body.photos ?? [])
    .slice(0, PACK_VISION_BATCH)
    .filter((photo) => photo.id && photo.data && photo.data.length < PACK_VISION_IMAGE_DATA_CHARS)
  const text = (body.text ?? '').slice(0, PACK_MODEL_TEXT_CHARS)
  if (photos.length === 0 && text.trim().length < 80) {
    return Response.json({ cards: [] })
  }

  const scanPrompt = [
    'These images are scanned textbook/lecture pages, not the quiz answers.',
    'OCR what is written. Extract quiz facts from the content.',
    'JSON only: {"cards":[{title,definition,expr,value,date,group}]}',
    'Keep the source language. Do not invent. Skip blank covers.',
    'title = term, theorem, or concept (2-8 words). NEVER a page number or file name.',
    'definition = one short sentence from the page.',
    'For formulas: expr = the formula, value = meaning or result, title = name if given.',
    `Do not set id. Max ${PACK_VISION_CARDS} cards.`,
  ]

  const photoPrompt = [
    'Extract quiz cards. JSON only: {"cards":[{id,title,definition,date,group,kind,expr,value}]}',
    'title 2-8 words. definition one short sentence. kind photo|diagram for portraits/figures.',
    `Do not invent. Keep source language. Max ${PACK_VISION_CARDS} cards.`,
    photos.length ? `Photo ids in order: ${photos.map((photo) => photo.id).join(',')}` : '',
  ]

  const parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }> = [
    {
      text: [...(body.scan ? scanPrompt : photoPrompt), text ? `Notes:\n${text}` : ''].filter(Boolean).join('\n'),
    },
  ]
  for (const photo of photos) {
    parts.push({ text: body.scan ? `page source id=${photo.id} (not a card id)` : `id=${photo.id}` })
    parts.push({
      inline_data: {
        mime_type: photo.mime === 'image/png' ? 'image/png' : 'image/jpeg',
        data: photo.data,
      },
    })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, maxOutputTokens: body.scan ? 8192 : 2048 },
      }),
    })
    if (!res.ok) return Response.json({ error: 'model' }, { status: 502 })
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''
    const cards = parseCards(raw)
    return Response.json({ cards })
  } catch {
    return Response.json({ error: 'model' }, { status: 502 })
  }
}

function parseCards(text: string): CardOut[] {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (!match) return []
  try {
    const parsed: unknown = JSON.parse(match[0])
    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === 'object' && Array.isArray((parsed as { cards?: unknown }).cards)
        ? (parsed as { cards: unknown[] }).cards
        : []
    return list.filter((row): row is CardOut => Boolean(row) && typeof row === 'object')
  } catch {
    return []
  }
}
