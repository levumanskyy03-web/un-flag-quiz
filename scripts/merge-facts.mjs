import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'facts')
const jsonDir = join(root, 'json')
const outFile = join(root, 'all.json')

const files = (await readdir(jsonDir)).filter((name) => name.endsWith('.json')).sort()
const merged = {}

for (const file of files) {
  const raw = JSON.parse(await readFile(join(jsonDir, file), 'utf8'))
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') {
    console.warn(`skip ${file}: expected an object of iso → facts`)
    continue
  }
  for (const [iso, rows] of Object.entries(raw)) {
    if (!/^[a-z]{2}$/.test(iso) || !Array.isArray(rows)) continue
    merged[iso] = rows
  }
}

await writeFile(outFile, `${JSON.stringify(merged)}\n`)
console.log(`merged ${files.length} files, ${Object.keys(merged).length} countries → ${outFile}`)
