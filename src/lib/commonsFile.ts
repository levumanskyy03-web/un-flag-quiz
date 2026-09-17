import type { WikiPortrait } from './wikiPortrait'

const THUMB_WIDTH = {
  hero: 500,
  card: 330,
  thumb: 120,
} as const

export type PortraitSize = keyof typeof THUMB_WIDTH

export function portraitThumbWidth(size: PortraitSize = 'card'): number {
  return THUMB_WIDTH[size]
}

export function commonsFileName(file: string): string {
  return file.trim().replace(/ /g, '_')
}

export function commonsFilePage(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(commonsFileName(fileName))}`
}

export function md5Hex(text: string): string {
  return md5Bytes(new TextEncoder().encode(text))
}

function commonsUploadThumb(fileName: string, width: number, project: 'commons' | 'en'): string {
  const file = commonsFileName(fileName)
  const hash = md5Hex(file)
  const encoded = encodeURIComponent(file)
  const thumb = /\.svg$/i.test(file) ? `${width}px-${file}.png` : `${width}px-${file}`
  return `https://upload.wikimedia.org/wikipedia/${project}/thumb/${hash[0]}/${hash.slice(0, 2)}/${encoded}/${encodeURIComponent(thumb)}`
}

export function commonsThumbCandidates(fileName: string, width = 480): string[] {
  const file = commonsFileName(fileName)
  if (!file) return []
  const params = new URLSearchParams({ f: file, w: String(width) })
  return [
    commonsUploadThumb(file, width, 'commons'),
    commonsUploadThumb(file, width, 'en'),
    `https://commons.wikimedia.org/w/thumb.php?${params}`,
    `https://en.wikipedia.org/w/thumb.php?${params}`,
  ]
}

export function portraitFromFileHint(file: string | undefined, width = 480): WikiPortrait | null {
  const name = file?.trim()
  if (!name) return null
  const url = commonsThumbCandidates(name, width)[0]
  if (!url) return null
  return {
    url,
    credit: 'Wikimedia Commons',
    compactCredit: 'Wikimedia Commons',
    filePage: commonsFilePage(name),
    license: 'Wikimedia Commons',
  }
}

function md5Bytes(bytes: Uint8Array): string {
  const original = bytes.length
  const bitLen = original * 8
  const paddedLen = (((original + 8) >> 6) + 1) << 6
  const buf = new Uint8Array(paddedLen)
  buf.set(bytes)
  buf[original] = 0x80
  const view = new DataView(buf.buffer)
  view.setUint32(paddedLen - 8, bitLen, true)
  view.setUint32(paddedLen - 4, Math.floor(bitLen / 0x100000000), true)

  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878

  for (let i = 0; i < paddedLen; i += 64) {
    const words = new Int32Array(16)
    for (let j = 0; j < 16; j += 1) words[j] = view.getInt32(i + j * 4, true)
    const aa = a
    const bb = b
    const cc = c
    const dd = d
    a = ff(a, b, c, d, words[0], 7, -680876936)
    d = ff(d, a, b, c, words[1], 12, -389564586)
    c = ff(c, d, a, b, words[2], 17, 606105819)
    b = ff(b, c, d, a, words[3], 22, -1044525330)
    a = ff(a, b, c, d, words[4], 7, -176418897)
    d = ff(d, a, b, c, words[5], 12, 1200080426)
    c = ff(c, d, a, b, words[6], 17, -1473231341)
    b = ff(b, c, d, a, words[7], 22, -45705983)
    a = ff(a, b, c, d, words[8], 7, 1770035416)
    d = ff(d, a, b, c, words[9], 12, -1958414417)
    c = ff(c, d, a, b, words[10], 17, -42063)
    b = ff(b, c, d, a, words[11], 22, -1990404162)
    a = ff(a, b, c, d, words[12], 7, 1804603682)
    d = ff(d, a, b, c, words[13], 12, -40341101)
    c = ff(c, d, a, b, words[14], 17, -1502002290)
    b = ff(b, c, d, a, words[15], 22, 1236535329)
    a = gg(a, b, c, d, words[1], 5, -165796510)
    d = gg(d, a, b, c, words[6], 9, -1069501632)
    c = gg(c, d, a, b, words[11], 14, 643717713)
    b = gg(b, c, d, a, words[0], 20, -373897302)
    a = gg(a, b, c, d, words[5], 5, -701558691)
    d = gg(d, a, b, c, words[10], 9, 38016083)
    c = gg(c, d, a, b, words[15], 14, -660478335)
    b = gg(b, c, d, a, words[4], 20, -405537848)
    a = gg(a, b, c, d, words[9], 5, 568446438)
    d = gg(d, a, b, c, words[14], 9, -1019803690)
    c = gg(c, d, a, b, words[3], 14, -187363961)
    b = gg(b, c, d, a, words[8], 20, 1163531501)
    a = gg(a, b, c, d, words[13], 5, -1444681467)
    d = gg(d, a, b, c, words[2], 9, -51403784)
    c = gg(c, d, a, b, words[7], 14, 1735328473)
    b = gg(b, c, d, a, words[12], 20, -1926607734)
    a = hh(a, b, c, d, words[5], 4, -378558)
    d = hh(d, a, b, c, words[8], 11, -2022574463)
    c = hh(c, d, a, b, words[11], 16, 1839030562)
    b = hh(b, c, d, a, words[14], 23, -35309556)
    a = hh(a, b, c, d, words[1], 4, -1530992060)
    d = hh(d, a, b, c, words[4], 11, 1272893353)
    c = hh(c, d, a, b, words[7], 16, -155497632)
    b = hh(b, c, d, a, words[10], 23, -1094730640)
    a = hh(a, b, c, d, words[13], 4, 681279174)
    d = hh(d, a, b, c, words[0], 11, -358537222)
    c = hh(c, d, a, b, words[3], 16, -722521979)
    b = hh(b, c, d, a, words[6], 23, 76029189)
    a = hh(a, b, c, d, words[9], 4, -640364487)
    d = hh(d, a, b, c, words[12], 11, -421815835)
    c = hh(c, d, a, b, words[15], 16, 530742520)
    b = hh(b, c, d, a, words[2], 23, -995338651)
    a = ii(a, b, c, d, words[0], 6, -198630844)
    d = ii(d, a, b, c, words[7], 10, 1126891415)
    c = ii(c, d, a, b, words[14], 15, -1416354905)
    b = ii(b, c, d, a, words[5], 21, -57434055)
    a = ii(a, b, c, d, words[12], 6, 1700485571)
    d = ii(d, a, b, c, words[3], 10, -1894986606)
    c = ii(c, d, a, b, words[10], 15, -1051523)
    b = ii(b, c, d, a, words[1], 21, -2054922799)
    a = ii(a, b, c, d, words[8], 6, 1873313359)
    d = ii(d, a, b, c, words[15], 10, -30611744)
    c = ii(c, d, a, b, words[6], 15, -1560198380)
    b = ii(b, c, d, a, words[13], 21, 1309151649)
    a = ii(a, b, c, d, words[4], 6, -145523070)
    d = ii(d, a, b, c, words[11], 10, -1120210379)
    c = ii(c, d, a, b, words[2], 15, 718787259)
    b = ii(b, c, d, a, words[9], 21, -343485551)
    a = (a + aa) | 0
    b = (b + bb) | 0
    c = (c + cc) | 0
    d = (d + dd) | 0
  }

  return [a, b, c, d].map(cmnHex).join('')
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
  return (rotl((a + q + x + t) | 0, s) + b) | 0
}

function rotl(value: number, n: number) {
  return (value << n) | (value >>> (32 - n))
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & c) | (~b & d), a, b, x, s, t)
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t)
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(b ^ c ^ d, a, b, x, s, t)
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(c ^ (b | ~d), a, b, x, s, t)
}

function cmnHex(value: number) {
  const hex = (value >>> 0).toString(16).padStart(8, '0')
  return hex.slice(6, 8) + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2)
}
