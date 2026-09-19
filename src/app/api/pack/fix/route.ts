import { type NextRequest } from 'next/server'
import type { PackItem } from '../../../../data/pack'
import type { PackFormatId } from '../../../../data/pack'
import type { ModelItemPatch } from '../../../../lib/packFix'

export const runtime = 'nodejs'

const ALLOWED: Array<keyof ModelItemPatch> = [
  'title',
  'definition',
  'date',
  'number',
  'ordinal',
  'order',
  'code',
  'kind',
  'place',
  'expr',
  'value',
  'pairWith',
  'extra',
  'group',
  'hidden',
  'note',
]

type Body = {
  item?: PackItem
  excerpt?: string
  format?: PackFormatId
  note?: string
}

export async function POST(request: NextRequest) {
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!key) {
    return Response.json({ error: 'no_key' }, { status: 503 })
  }
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 })
  }
  const note = body.note?.trim() ?? ''
  if (!body.item || note.length < 4 || note.length > 800) {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const prompt = [
    'Fix one quiz card from a student pack. Return JSON only.',
    'Change only fields that must change. Do not invent sources. Do not add new cards.',
    `Format: ${body.format ?? ''}`,
    `Excerpt: ${body.excerpt ?? ''}`,
    `Card: ${JSON.stringify({
      title: body.item.title,
      definition: body.item.definition,
      date: body.item.date,
      number: body.item.number,
      kind: body.item.kind,
      place: body.item.place,
      extra: body.item.extra,
      group: body.item.group,
    })}`,
    `User: ${note}`,
    'JSON keys allowed: title, definition, date, number, ordinal, order, code, kind, place, expr, value, pairWith, extra, group, hidden, note.',
  ].join('\n')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
    })
    if (!res.ok) {
      return Response.json({ error: 'model' }, { status: 502 })
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''
    const patch = parsePatch(text)
    if (!patch) return Response.json({ error: 'parse' }, { status: 502 })
    return Response.json({ patch })
  } catch {
    return Response.json({ error: 'model' }, { status: 502 })
  }
}

function parsePatch(text: string): ModelItemPatch | null {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    const raw: unknown = JSON.parse(match[0])
    if (!raw || typeof raw !== 'object') return null
    const patch: ModelItemPatch = {}
    for (const key of ALLOWED) {
      if (key in (raw as object)) (patch as Record<string, unknown>)[key] = (raw as Record<string, unknown>)[key]
    }
    return Object.keys(patch).length ? patch : null
  } catch {
    return null
  }
}
