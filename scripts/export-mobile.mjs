import { spawn } from 'node:child_process'
import { access, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const holdRoot = path.join(root, '.cap-hold')
const todayPath = path.join(root, 'src/app/today/page.tsx')
const todayMarker = 'export const dynamic = "force-dynamic";\n'

const held = []
let todayOriginal = null
let restored = false

async function hold(rel) {
  const src = path.join(root, rel)
  const dest = path.join(holdRoot, rel)
  await mkdir(path.dirname(dest), { recursive: true })
  await rename(src, dest)
  held.push({ src, dest })
}

async function holdIfPresent(rel) {
  try {
    await access(path.join(root, rel))
  } catch {
    return
  }
  await hold(rel)
}

async function restore() {
  if (restored) return
  restored = true
  if (todayOriginal != null) await writeFile(todayPath, todayOriginal)
  for (const item of [...held].reverse()) {
    await mkdir(path.dirname(item.src), { recursive: true })
    await rename(item.dest, item.src)
  }
  await rm(holdRoot, { recursive: true, force: true })
}

process.on('SIGINT', () => {
  restore().finally(() => process.exit(1))
})
process.on('SIGTERM', () => {
  restore().finally(() => process.exit(1))
})

try {
  todayOriginal = await readFile(todayPath, 'utf8')
  if (!todayOriginal.includes(todayMarker)) {
    throw new Error('today page no longer has the force-dynamic marker')
  }
  await writeFile(todayPath, todayOriginal.replace(todayMarker, ''))
  await hold('src/app/api')
  await hold('src/app/facts-dump')
  await hold('src/proxy.ts')
  await hold('src/app/duel/[code]')
  await holdIfPresent('scripts/_len.mts')

  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        CAP_EXPORT: '1',
        NEXT_PUBLIC_CAP_EXPORT: '1',
        NEXT_PUBLIC_API_ORIGIN: 'https://www.geoguiz.online',
      },
    })
    child.on('exit', (status) => resolve(status ?? 1))
  })
  if (code !== 0) throw new Error(`next build exited ${code}`)
} finally {
  await restore()
}
