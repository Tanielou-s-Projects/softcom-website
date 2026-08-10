// crop.mjs <in.png> <out.png> <x> <y> <w> <h>  — decode, crop, re-encode.
import fs from "node:fs"
import zlib from "node:zlib"

function decode(buf) {
  let p = 8, w = 0, h = 0, depth = 0, ctype = 0
  const idat = []
  while (p < buf.length) {
    const len = buf.readUInt32BE(p)
    const type = buf.toString("ascii", p + 4, p + 8)
    const data = buf.subarray(p + 8, p + 8 + len)
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ctype = data[9] }
    else if (type === "IDAT") idat.push(data)
    else if (type === "IEND") break
    p += 12 + len
  }
  if (depth !== 8) throw new Error("depth " + depth)
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype]
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = w * ch
  const out = Buffer.alloc(h * stride)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = out.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0
      let v = src[i]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      cur[i] = v & 0xff
    }
  }
  return { w, h, ch, data: out }
}

function crc32(b) {
  let c = ~0
  for (let i = 0; i < b.length; i++) { c ^= b[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)) }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, "ascii"), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function encode(w, h, ch, data) {
  const ctype = ch === 4 ? 6 : ch === 3 ? 2 : ch === 2 ? 4 : 0
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8; ihdr[9] = ctype
  const stride = w * ch
  const raw = Buffer.alloc(h * (stride + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ])
}

const [, , inp, outp, X, Y, W, H] = process.argv
const img = decode(fs.readFileSync(inp))
const x = +X, y = +Y
const w = Math.min(+W, img.w - x), h = Math.min(+H, img.h - y)
const cropped = Buffer.alloc(w * h * img.ch)
for (let r = 0; r < h; r++) {
  img.data.copy(cropped, r * w * img.ch, ((y + r) * img.w + x) * img.ch, ((y + r) * img.w + x + w) * img.ch)
}
fs.writeFileSync(outp, encode(w, h, img.ch, cropped))
console.log(`${inp} ${img.w}x${img.h} -> ${outp} ${w}x${h} @ ${x},${y}`)
