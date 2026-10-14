/**
 * The site's one dither language. Every dot effect — the hero dissolve, the
 * page transition, the sector marks — resolves the same way:
 *
 * - **One dot.** Square cells on a 6px grid; coarser effects use a multiple.
 * - **One order.** Cells switch in 8×8 Bayer order against a rising field
 *   (bottom first, broken up by low-frequency noise), so a resolve always
 *   reads as the same weave, never a random scatter or a straight wipe.
 * - **One edge.** Cells near the front show brand cyan before settling into
 *   their final colour.
 * - **One input.** Progress 0 → 1. Scroll, hover, a route change or a clock
 *   only decide how progress moves.
 *
 * The maths exists twice — `GLSL_DITHER` for WebGL, the functions below for
 * SVG/DOM — and the two are line-for-line ports, so a cell lights at the same
 * progress whichever renderer draws it.
 */

/** CSS pixels per cell for full-bleed effects. */
export const CELL = 6

/** Brand anchors, 0–1 RGB: #004bff and #00ffff. */
export const BLUE = [0, 75 / 255, 1] as const
export const CYAN = [0, 1, 1] as const

/** Width of the front, as a share of the field — how soft the edge is. */
export const SPREAD = 0.35
/** The field's maximum: 0.75 of height plus 0.35 of noise. */
export const FIELD_MAX = 1.1
/** Below this coverage a lit cell is still at the front, so it shows cyan. */
export const FRONT = 0.5

const fract = (x: number) => x - Math.floor(x)

function bayer2(x: number, y: number) {
  x = Math.floor(x)
  y = Math.floor(y)
  return fract(x / 2 + y * y * 0.75)
}
const bayer4 = (x: number, y: number) =>
  bayer2(0.5 * x, 0.5 * y) * 0.25 + bayer2(x, y)

/** 8×8 ordered-dither threshold for a cell, in [0, 1). */
export const bayer8 = (x: number, y: number) =>
  bayer4(0.5 * x, 0.5 * y) * 0.25 + bayer2(x, y)

function hash(x: number, y: number) {
  // Matches the shader; Math.fround keeps the sin() input in float range.
  return fract(Math.sin(Math.fround(x * 127.1 + y * 311.7)) * 43758.5453)
}

function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

/**
 * The rising field for a cell: `fromBottom` is 0 at the bottom edge, 1 at the
 * top. Noise is sampled per cell so neighbouring cells arrive together.
 * `seed` shifts the noise so several fields on one page don't share a
 * silhouette; 0 is what the shader draws.
 */
export const field = (col: number, row: number, fromBottom: number, seed = 0) =>
  fromBottom * 0.75 + noise(col * 0.06 + seed, row * 0.06 + seed) * 0.35

/** The progress at which a cell lights — the shared order, as a number. */
export const lightsAt = (fieldValue: number, threshold: number) =>
  (fieldValue + threshold * SPREAD) / (FIELD_MAX + SPREAD)

/** How resolved the field is at a cell, 0–1, for overall progress 0–1. */
export const coverage = (progress: number, fieldValue: number) =>
  Math.max(
    0,
    Math.min(1, (progress * (FIELD_MAX + SPREAD) - fieldValue) / SPREAD)
  )

export type CellState = "rest" | "front" | "on"

/** What a cell shows at a given progress — the DOM renderers' whole contract. */
export function cellState(
  progress: number,
  fieldValue: number,
  threshold: number
): CellState {
  const cover = coverage(progress, fieldValue)
  if (threshold >= cover) return "rest"
  return cover < FRONT ? "front" : "on"
}

/** The same definitions for a fragment shader; `u_cell` is the cell in px. */
export const GLSL_DITHER = `
const float SPREAD = ${SPREAD.toFixed(2)};
const float FIELD_MAX = ${FIELD_MAX.toFixed(2)};
const float FRONT = ${FRONT.toFixed(2)};

float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float ditherField(vec2 cell, float fromBottom) {
  return fromBottom * 0.75 + noise(cell * 0.06) * 0.35;
}

float ditherCoverage(float progress, float fieldValue) {
  return clamp((progress * (FIELD_MAX + SPREAD) - fieldValue) / SPREAD, 0.0, 1.0);
}
`

/*
 * The tech layer: data fragments glimpsed in the front. Only cells at the
 * front ever show a glyph, so text marks the moment of change and settled
 * areas stay calm. Each position always shows the same character (static),
 * laid out in reading order so whole fragments line up when a front passes.
 * Spaces render as plain cells — not every node carries text.
 */
export const GLYPH_STREAM =
  "0x4B ff 1010 0x004BFF 200 OK ▲ 6.52N 3.38E 0110 4B 1101 ff 0x00 SYNC 0011 ACK 2007 0xFF 1001 ▲ LAGOS 404 0x1F 0101 "

/** Glyphs need room to read: never smaller than this, in CSS px. */
export const GLYPH_MIN = 12
/** Row stride through the stream, so stacked rows don't repeat in columns. */
const GLYPH_STRIDE = 29

/** The character at a glyph-grid position (`up` counts from the bottom). */
export function glyphAt(gx: number, gyUp: number) {
  const n = GLYPH_STREAM.length
  return GLYPH_STREAM[(((gx + gyUp * GLYPH_STRIDE) % n) + n) % n]
}

/** GLSL twin of glyphAt's index, for sampling a one-row glyph atlas. */
export const GLSL_GLYPH = `
float glyphIndex(vec2 g, float count) {
  return mod(g.x + g.y * ${GLYPH_STRIDE.toFixed(1)}, count);
}
`
