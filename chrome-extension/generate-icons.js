/**
 * Génère les icônes PNG de l'extension TOML (lettre T blanche sur fond noir).
 * Usage : node generate-icons.js
 * Requiert uniquement les modules Node.js natifs (zlib, fs).
 */
const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

// ── CRC32 ──────────────────────────────────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

// ── PNG chunk ──────────────────────────────────────────────────────────────
function chunk(type, data) {
  const t    = Buffer.from(type, 'ascii')
  const len  = Buffer.alloc(4); len.writeUInt32BE(data.length, 0)
  const crc  = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

// ── Build PNG ──────────────────────────────────────────────────────────────
function buildPNG(size, drawFn) {
  const pixels = Buffer.alloc(size * size * 4)
  drawFn(pixels, size)

  // Row bytes: 1 filter byte + RGBA per pixel
  const stride  = 1 + size * 4
  const rawRows = Buffer.alloc(size * stride)
  for (let y = 0; y < size; y++) {
    rawRows[y * stride] = 0 // filter: None
    pixels.copy(rawRows, y * stride + 1, y * size * 4, (y + 1) * size * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(rawRows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Draw T (blanc sur fond noir) ───────────────────────────────────────────
function drawT(pixels, size) {
  // Fond noir opaque
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 255
  }

  const pad = Math.max(2, Math.round(size * 0.16))
  const sw  = Math.max(1, Math.round(size * 0.15)) // épaisseur du trait

  function white(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) return
    const i = (y * size + x) * 4
    pixels[i] = 255; pixels[i + 1] = 255; pixels[i + 2] = 255; pixels[i + 3] = 255
  }

  // Barre horizontale (chapeau du T)
  for (let y = pad; y < pad + sw; y++)
    for (let x = pad; x < size - pad; x++)
      white(x, y)

  // Barre verticale (pied du T), centrée
  const cx = Math.floor((size - sw) / 2)
  for (let y = pad; y < size - pad; y++)
    for (let x = cx; x < cx + sw; x++)
      white(x, y)
}

// ── Main ───────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

for (const size of [16, 48, 128]) {
  const file = path.join(outDir, `icon${size}.png`)
  fs.writeFileSync(file, buildPNG(size, drawT))
  console.log(`✓ ${file}`)
}
