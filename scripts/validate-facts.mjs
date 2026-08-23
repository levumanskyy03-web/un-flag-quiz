import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COUNTRIES } from '../src/data/countries.ts'
import { factQuota } from '../src/data/facts/quota.ts'
import { PASSPORTS } from '../src/data/passports.ts'

const factsFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'facts', 'all.json')
const facts = JSON.parse(await readFile(factsFile, 'utf8'))

let ok = true
for (const country of COUNTRIES) {
  const rows = facts[country.iso] ?? []
  const want = factQuota(country.iso)
  const passport = PASSPORTS[country.iso]
  if (rows.length !== want) {
    ok = false
    console.log(`${country.iso}: have ${rows.length}, want ${want}`)
  }
  for (const [i, row] of rows.entries()) {
    if (!Array.isArray(row) || row.length !== 2 || !row[0] || !row[1]) {
      ok = false
      console.log(`${country.iso}[${i}]: bad pair`)
    } else {
      if (row[0].length > 220 || row[1].length > 240) {
        console.log(`${country.iso}[${i}]: long (${row[0].length}/${row[1].length})`)
      }
    }
  }
  if (passport && rows.some(([en]) => en === passport.factEn)) {
    // fine
  }
}

if (!ok) {
  process.exitCode = 1
} else {
  console.log(`ok: ${COUNTRIES.length} countries`)
}
