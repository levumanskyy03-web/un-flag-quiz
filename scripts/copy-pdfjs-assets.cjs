const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const workerSrc = path.join(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
const wasmSrc = path.join(root, 'node_modules/pdfjs-dist/wasm')
const publicDir = path.join(root, 'public')
const wasmDest = path.join(publicDir, 'pdfjs-wasm')

fs.mkdirSync(publicDir, { recursive: true })
fs.copyFileSync(workerSrc, path.join(publicDir, 'pdf.worker.min.mjs'))
fs.mkdirSync(wasmDest, { recursive: true })
for (const name of fs.readdirSync(wasmSrc)) {
  fs.copyFileSync(path.join(wasmSrc, name), path.join(wasmDest, name))
}
