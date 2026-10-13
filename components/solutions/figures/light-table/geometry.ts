/*
 * Fig 02 · Connected evidence — the Applied Intelligence figure.
 *
 * A light table with records scattered on its glass: two documents, two
 * bank statements, two datasets. A gantry runs over it, and a loupe on the
 * gantry's carriage visits each record in turn. When it has seen both halves
 * of a match, a thread is pinned between them: fragmented information,
 * examined in depth and connected.
 *
 * World units are ~1 px; x and y on the table, z up. Static, computed once.
 */
import * as k from "@/components/iso/iso-kit"
import type { Flat, Plan, Plane, Point3 } from "@/components/iso/iso-kit"

export const WIDTH = 600
export const HEIGHT = 380

/* The table: a cabinet on feet with a glass top set into a frame. */
const TABLE: Plan = { x: -128, y: -84, w: 256, d: 168, r: 8 }
const TABLE_H = 14
const FOOT_H = 5
const GLASS: Plan = k.insetPlan(TABLE, 12)
export const GLASS_TOP = 0.6

/* The gantry: four posts, two rails along x, a bridge and a carriage. */
const RAIL_Y = 78
const RAIL_Z = 40
const POSTS: Plane[] = [
  [-118, -RAIL_Y],
  [118, -RAIL_Y],
  [-118, RAIL_Y],
  [118, RAIL_Y],
]
export const BRIDGE_Z = RAIL_Z + 4
/** The loupe hangs on the carriage's near side (+x), in front of the bridge. */
export const LOUPE_OFFSET = 12
const LENS_R = 11
const LENS_Z = 14

export type Card = {
  kind: "doc" | "statement" | "dataset"
  at: Plane
  w: number
  d: number
  /** Degrees, about the card's centre. */
  turn: number
}

/* The records, and the order the loupe visits them; pairs are the matches. */
export const CARDS: Card[] = [
  { kind: "doc", at: [-74, -40], w: 34, d: 44, turn: -8 },
  { kind: "statement", at: [-18, 34], w: 42, d: 30, turn: -6 },
  { kind: "statement", at: [-10, -46], w: 42, d: 30, turn: 7 },
  { kind: "dataset", at: [72, 30], w: 40, d: 42, turn: 5 },
  { kind: "dataset", at: [66, -42], w: 44, d: 34, turn: -4 },
  { kind: "doc", at: [-80, 36], w: 30, d: 40, turn: 10 },
]
/** Matches found as the loupe goes: each pair is two consecutive visits. */
export const LINKS: [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 5],
]

const CARD_H = 0.8
const PIN_H = 3.2

export const P = k.fitProjection(
  [
    ...k.boxCorners(TABLE, -TABLE_H - FOOT_H, 0),
    ...k.boxCorners(
      { x: -122, y: -RAIL_Y - 4, w: 244, d: RAIL_Y * 2 + 8, r: 0 },
      0,
      BRIDGE_Z + 12
    ),
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 38 }
)

const at = (point: Point3) => k.iso(point, P)
const round = (v: number) => Math.round(v * 10) / 10
const byDepth = <T extends { at: Plane }>(list: T[]) =>
  [...list].sort(
    (a, b) =>
      k.depthOf([a.at[0], a.at[1], 0], P) - k.depthOf([b.at[0], b.at[1], 0], P)
  )

/** A point on a card, in its own turned frame (u across, v down). */
function onCard(card: Card, u: number, v: number): Plane {
  const t = (card.turn * Math.PI) / 180
  const x = u - card.w / 2
  const y = v - card.d / 2
  return [
    card.at[0] + x * Math.cos(t) - y * Math.sin(t),
    card.at[1] + x * Math.sin(t) + y * Math.cos(t),
  ]
}
const lineOn = (card: Card, from: Plane, to: Plane, z: number) =>
  k.onTop([onCard(card, ...from), onCard(card, ...to)], z, P)

/* ── Table ── */
const rulerTicks = k.topTicks(
  TABLE.x + 16,
  TABLE.x + TABLE.w - 16,
  4,
  5,
  TABLE.y + TABLE.d - 7.4,
  0,
  [1.6, 3],
  P
)
export const TABLE_ART = {
  halo: k.haloOf(TABLE, -TABLE_H - FOOT_H, 12, P),
  feet: [...k.corners(TABLE, 18)]
    .sort(
      (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P)
    )
    .map(([x, y]) => [
      k.cylinder(x, y, 7, -TABLE_H - FOOT_H, 1.6, P, 28),
      k.cylinder(x, y, 5.4, -TABLE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28),
    ]),
  cabinet: k.slabOf(TABLE, -TABLE_H, TABLE_H, P, 8, 1.4),
  seam: k.sideSeam(TABLE, -TABLE_H + 4, P, 8),
  glass: k.slabOf(GLASS, 0, GLASS_TOP, P, 6),
  glassGrid: (() => {
    const lines: string[] = []
    for (let x = GLASS.x + 20; x < GLASS.x + GLASS.w; x += 20)
      lines.push(
        k.lineOnTop([x, GLASS.y], [x, GLASS.y + GLASS.d], GLASS_TOP, P)
      )
    for (let y = GLASS.y + 20; y < GLASS.y + GLASS.d; y += 20)
      lines.push(
        k.lineOnTop([GLASS.x, y], [GLASS.x + GLASS.w, y], GLASS_TOP, P)
      )
    return lines.join("")
  })(),
  ticksMinor: rulerTicks.minor,
  ticksMajor: rulerTicks.major,
  screws: k.pointsAt(
    k.corners(TABLE, 6).map(([x, y]) => [x, y, 0] as Point3),
    P
  ),
}

/* ── Records ── */
const z0 = GLASS_TOP
const top = z0 + CARD_H
function cardArt(card: Card) {
  const ring: Plane[] = [
    onCard(card, 0, 0),
    onCard(card, card.w, 0),
    onCard(card, card.w, card.d),
    onCard(card, 0, card.d),
  ]
  const rules: string[] = []
  if (card.kind === "doc") {
    rules.push(lineOn(card, [5, 6], [card.w * 0.6, 6], top))
    for (let v = 12; v < card.d - 5; v += 4)
      rules.push(lineOn(card, [5, v], [card.w - 5 - ((v * 7) % 9), v], top))
  } else if (card.kind === "statement") {
    rules.push(lineOn(card, [5, 5], [card.w * 0.45, 5], top))
    for (let v = 10; v < card.d - 3; v += 3.4) {
      rules.push(lineOn(card, [5, v], [card.w * 0.55, v], top))
      rules.push(lineOn(card, [card.w * 0.7, v], [card.w - 5, v], top))
    }
  } else {
    // A dataset: a ruled grid of cells.
    for (let v = 5; v <= card.d - 5; v += 6)
      rules.push(lineOn(card, [4, v], [card.w - 4, v], top))
    for (let u = 4; u <= card.w - 4; u += (card.w - 8) / 4)
      rules.push(
        lineOn(card, [u, 5], [u, card.d - 5 - ((card.d - 10) % 6)], top)
      )
  }
  const pin = onCard(card, card.w - 5, 5)
  return {
    halo: k.extrude(ring, z0 - 0.2, 0.4, P).fill,
    body: k.extrude(ring, z0, CARD_H, P, { bevel: 0.3 }),
    rules: rules.join(""),
    pinBase: k.cylinder(pin[0], pin[1], 1.8, top, 0.6, P, 16),
    pin: k.cylinder(pin[0], pin[1], 1, top + 0.6, PIN_H - 0.6, P, 14),
    head: at([pin[0], pin[1], top + PIN_H]),
    centre: card.at,
  }
}
export const CARD_ART = byDepth(
  CARDS.map((card, index) => ({ ...card, index }))
).map((card) => ({
  index: card.index,
  ...cardArt(card),
}))
/** Each record's pin head, by visit order, for the threads. */
const HEADS: Flat[] = CARDS.map((card) => cardArt(card).head)
export const THREADS = LINKS.map(([a, b]) => ({ from: HEADS[a], to: HEADS[b] }))
/** Where the loupe stands over each record, by visit order. */
export const VISITS: Plane[] = CARDS.map((card) => card.at)

/* ── Gantry ── */
const postArt = ([x, y]: Plane) => [
  k.cylinder(x, y, 4.2, 0, 2.4, P, 28, 0.4),
  k.cylinder(x, y, 2.8, 2.4, RAIL_Z - 2.4, P, 24),
]
const railArt = (y: number) =>
  k.slabOf({ x: -124, y: y - 3, w: 248, d: 6, r: 1.4 }, RAIL_Z, 4, P, 3, 0.5)
const railTicks = (y: number) => {
  const t = k.topTicks(-116, 116, 4, 5, y - 2.4, RAIL_Z + 4, [1.2, 2.2], P)
  return t.minor + t.major
}
export const GANTRY_ART = {
  backPosts: POSTS.filter(([, y]) => y < 0).map(postArt),
  frontPosts: POSTS.filter(([, y]) => y > 0).map(postArt),
  backRail: railArt(-RAIL_Y),
  frontRail: railArt(RAIL_Y),
  backTicks: railTicks(-RAIL_Y),
  frontTicks: railTicks(RAIL_Y),
  railScrews: k.pointsAt(
    POSTS.map(([x, y]) => [x, y, RAIL_Z + 4] as Point3),
    P
  ),
  // Bridge, built at x = 0 and moved along the rails.
  bridgeEnds: [-RAIL_Y, RAIL_Y].map((y) =>
    k.slabOf(
      { x: -6, y: y - 5, w: 12, d: 10, r: 1.6 },
      RAIL_Z + 4,
      5,
      P,
      3,
      0.5
    )
  ),
  bridge: k.slabOf(
    { x: -3.5, y: -RAIL_Y, w: 7, d: RAIL_Y * 2, r: 1.4 },
    BRIDGE_Z + 1,
    4,
    P,
    3,
    0.5
  ),
  bridgeTicks: (() => {
    const t = k.topTicks(
      -RAIL_Y + 8,
      RAIL_Y - 8,
      4,
      5,
      -2.8,
      BRIDGE_Z + 5,
      [1.2, 2.2],
      P,
      "y"
    )
    return t.minor + t.major
  })(),
  // Carriage and loupe, built at (0, 0) and moved along the bridge.
  carriage: k.slabOf(
    { x: -6, y: -7, w: 12 + LOUPE_OFFSET, d: 14, r: 2 },
    BRIDGE_Z + 5,
    5,
    P,
    3,
    0.6
  ),
  knob: k.cylinder(-2, 0, 2.6, BRIDGE_Z + 10, 3, P, 20),
  knobKnurl: k.knurl(-2, 0, 2.6, BRIDGE_Z + 10, BRIDGE_Z + 13, 22, P),
  rod: k.cylinder(
    LOUPE_OFFSET,
    0,
    1.4,
    LENS_Z + 3,
    BRIDGE_Z + 5 - LENS_Z - 3,
    P,
    14
  ),
  collar: k.cylinder(LOUPE_OFFSET, 0, 2.6, LENS_Z + 2, 4, P, 18),
  lens: k.cylinder(LOUPE_OFFSET, 0, LENS_R, LENS_Z, 2, P, 48, 0.5),
  glassRing: k.ring(LOUPE_OFFSET, 0, LENS_R - 2.2, LENS_Z + 2, P, 40),
  /** Where the loupe sits over the table when the carriage is at (0, 0). */
  lensFoot: [LOUPE_OFFSET, 0] as Plane,
}

export const along = (by: Point3) => k.translateAlong(P, by)
export { round }
