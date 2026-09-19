import type { Pack } from '../data/pack'

const DB_NAME = 'un-flag-quiz-packs'
const STORE = 'packs'
const LS_KEY = 'un-flag-quiz-packs-fallback'

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null)
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null)
  })
}

function readFallback(): Pack[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isPack) : []
  } catch {
    return []
  }
}

function writeFallback(packs: Pack[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(packs))
}

function isPack(value: unknown): value is Pack {
  if (!value || typeof value !== 'object') return false
  const row = value as Pack
  return typeof row.id === 'string' && Array.isArray(row.items)
}

export async function listPacks(): Promise<Pack[]> {
  const db = await openDb()
  if (!db) {
    return readFallback().sort((a, b) => b.updatedAt - a.updatedAt)
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => {
      const rows = (req.result as Pack[]).filter(isPack).sort((a, b) => b.updatedAt - a.updatedAt)
      resolve(rows)
    }
    req.onerror = () => resolve(readFallback())
  })
}

export async function getPack(id: string): Promise<Pack | null> {
  const db = await openDb()
  if (!db) return readFallback().find((pack) => pack.id === id) ?? null
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(isPack(req.result) ? req.result : null)
    req.onerror = () => resolve(null)
  })
}

export async function savePack(pack: Pack): Promise<void> {
  const next = { ...pack, updatedAt: Date.now() }
  const db = await openDb()
  if (!db) {
    const packs = readFallback().filter((item) => item.id !== next.id)
    packs.unshift(next)
    writeFallback(packs.slice(0, 20))
    return
  }
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(next)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function deletePack(id: string): Promise<void> {
  const db = await openDb()
  if (!db) {
    writeFallback(readFallback().filter((pack) => pack.id !== id))
    return
  }
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
