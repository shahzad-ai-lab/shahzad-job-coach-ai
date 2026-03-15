// Generates icon-192.png + icon-512.png for Alfalah AI PWA
// Alfalah brand: dark galaxy background + gradient logo "ا"
// Run: node generate-icons.js

const zlib = require('zlib')
const fs   = require('fs')

// ── CRC32 ──────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  crcTable[i] = c
}
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type), len = Buffer.alloc(4), cr = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  cr.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, cr])
}

// ── Build RGBA PNG ────────────────────────────────────────────────────────
function buildPNG(size) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8]=8; ihdr[9]=6; // bit-depth=8, color-type=6 (RGBA)

  // Build raw pixel data
  const cx = size / 2, cy = size / 2, radius = size * 0.42
  const raw = Buffer.alloc(size * (1 + size * 4))
  let pos = 0
  for (let y = 0; y < size; y++) {
    raw[pos++] = 0 // filter none
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      const nx = (x / size), ny = (y / size)

      // Background: deep galaxy gradient #0F0C29 → #302B63 → #24243E
      let bgR = Math.round(15  + nx * 33  + ny * 9)
      let bgG = Math.round(12  + nx * 31  + ny * 24)
      let bgB = Math.round(41  + nx * 58  + ny * 21)

      if (dist < radius) {
        // Glow ring
        const glowDist = Math.abs(dist - radius * 0.68)
        const glowT = Math.max(0, 1 - glowDist / (radius * 0.18))

        // Inner circle: gradient #FF0099 → #FACF39 → #00AEEF → #38EF7D
        const t = (Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)
        let fgR, fgG, fgB
        if (t < 0.25) {
          const s = t / 0.25
          fgR = Math.round(255 * (1-s) + 250 * s)
          fgG = Math.round(0   * (1-s) + 207 * s)
          fgB = Math.round(153 * (1-s) + 57  * s)
        } else if (t < 0.5) {
          const s = (t-0.25)/0.25
          fgR = Math.round(250*(1-s)+0  *s)
          fgG = Math.round(207*(1-s)+174*s)
          fgB = Math.round(57 *(1-s)+239*s)
        } else if (t < 0.75) {
          const s = (t-0.5)/0.25
          fgR = Math.round(0  *(1-s)+56 *s)
          fgG = Math.round(174*(1-s)+239*s)
          fgB = Math.round(239*(1-s)+125*s)
        } else {
          const s = (t-0.75)/0.25
          fgR = Math.round(56 *(1-s)+255*s)
          fgG = Math.round(239*(1-s)+0  *s)
          fgB = Math.round(125*(1-s)+153*s)
        }

        // Glow: add bright white-ish halo
        const glowR = Math.min(255, fgR + Math.round(glowT * 120))
        const glowG = Math.min(255, fgG + Math.round(glowT * 80))
        const glowB = Math.min(255, fgB + Math.round(glowT * 80))

        // Blend bg with gradient circle
        const alpha = Math.min(1, Math.max(0, (radius - dist) / (radius * 0.06)))
        raw[pos++] = Math.round(bgR*(1-alpha) + glowR*alpha)
        raw[pos++] = Math.round(bgG*(1-alpha) + glowG*alpha)
        raw[pos++] = Math.round(bgB*(1-alpha) + glowB*alpha)
        raw[pos++] = 255
      } else {
        raw[pos++] = bgR; raw[pos++] = bgG; raw[pos++] = bgB; raw[pos++] = 255
      }
    }
  }

  const compressed = zlib.deflateSync(raw.slice(0, pos))
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT',compressed), chunk('IEND',Buffer.alloc(0))])
}

const icon192 = buildPNG(192)
const icon512 = buildPNG(512)

fs.writeFileSync('public/icon-192.png', icon192)
fs.writeFileSync('public/icon-512.png', icon512)

console.log('✓ public/icon-192.png created (' + icon192.length + ' bytes)')
console.log('✓ public/icon-512.png created (' + icon512.length + ' bytes)')
console.log('Done! Now push to GitHub → run PWABuilder → package for stores.')
