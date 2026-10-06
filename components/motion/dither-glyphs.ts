import {
  bayer8,
  cellState,
  GLYPH_MIN,
  GLYPH_STREAM,
  glyphAt,
} from "@/lib/dither"

/** The site's mono face (next/font sets --font-mono on <html>). */
export function monoFamily() {
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-mono")
    .trim()
  return family || "ui-monospace, monospace"
}

/**
 * A one-row atlas of GLYPH_STREAM for the WebGL renderers: white glyphs on
 * transparent, `size` px per glyph. Spaces are drawn as solid squares so the
 * shader renders them as plain cells.
 */
export function glyphAtlas(size = 32) {
  const canvas = document.createElement("canvas")
  canvas.width = GLYPH_STREAM.length * size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  ctx.fillStyle = "#fff"
  ctx.font = `600 ${Math.round(size * 0.78)}px ${monoFamily()}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ;[...GLYPH_STREAM].forEach((char, i) => {
    if (char === " ") ctx.fillRect(i * size, 0, size, size)
    else ctx.fillText(char, i * size + size / 2, size / 2 + size * 0.04)
  })
  return canvas
}

/**
 * Canvas 2D twin of the shader's tech layer, drawn over a finished dither
 * pass: every glyph cell (≥ GLYPH_MIN px) whose centre sits in the front band
 * is cleared and shows its data glyph whole. `fieldAt` is the renderer's own
 * field at a point in dither-cell units (`up` from the bottom).
 */
export function paintGlyphs(
  ctx: CanvasRenderingContext2D,
  {
    progress,
    cell,
    ratio,
    color,
    fieldAt,
  }: {
    progress: number
    cell: number
    ratio: number
    color: string
    fieldAt: (col: number, up: number) => number
  }
) {
  if (progress <= 0) return
  const { width, height } = ctx.canvas
  const glyph = Math.max(cell, GLYPH_MIN * ratio)
  const cols = Math.ceil(width / glyph)
  const rows = Math.ceil(height / glyph)
  ctx.fillStyle = color
  ctx.font = `600 ${Math.round(glyph * 0.78)}px ${monoFamily()}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (let gyUp = 0; gyUp < rows; gyUp++) {
    for (let gx = 0; gx < cols; gx++) {
      const centre = (n: number) => ((n + 0.5) * glyph) / cell
      const f = fieldAt(Math.floor(centre(gx)), Math.floor(centre(gyUp)))
      if (cellState(progress, f, bayer8(gx, gyUp)) !== "front") continue
      const char = glyphAt(gx, gyUp)
      if (char === " ") continue
      const left = gx * glyph
      const top = height - (gyUp + 1) * glyph
      ctx.clearRect(left, top, glyph, glyph)
      ctx.fillText(char, left + glyph / 2, top + glyph / 2 + glyph * 0.04)
    }
  }
}
