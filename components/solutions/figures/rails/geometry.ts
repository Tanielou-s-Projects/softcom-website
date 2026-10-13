/*
 * Fig 01 · Shared rails — the Digital Infrastructure figure.
 *
 * A rail yard on a bench plate. Tokens (the participants) leave a magazine
 * and run one shared track through three stations, which are the three parts
 * of an operation the Solutions copy names: a gate that verifies them
 * (identity and access), a stamp over a counter that records them (records
 * and operations) and a till whose drawer pays out (services and
 * transactions). Every station is built on the same rails: the base layer.
 *
 * World units are ~1 px; x runs along the track, y across it, z up.
 * Everything here is static and computed once, on the server.
 */
import * as k from "@/components/iso/iso-kit"
import type { Plan, Point3 } from "@/components/iso/iso-kit"

export const WIDTH = 600
export const HEIGHT = 360

/* The bench. */
export const BASE: Plan = { x: -152, y: -48, w: 304, d: 96, r: 8 }
const BASE_H = 10
const FOOT_H = 5

/* The track: two rails on ties, from the magazine to the tray. */
export const RAIL_TOP = 4
const RAIL_FROM = -116
const RAIL_TO = 112

/* Station positions along the track, and where the token rests. */
export const AT = { magazine: -131, gate: -70, stamp: 0, till: 70, tray: 128 }

/* The token's carriage, built at x = 0 and moved along the track. */
const CARRIAGE: Plan = { x: -10, y: -9, w: 20, d: 18, r: 2.5 }
export const CARRIAGE_TOP = RAIL_TOP + 4
export const PUCK_TOP = CARRIAGE_TOP + 2.5

/* Moving parts' travel. */
export const BAR_LIFT = 11
export const STAMP_DIP = 4.4
export const DRAWER_OUT = 7

const corners3 = (plan: Plan, z0: number, z1: number) =>
  k.boxCorners(plan, z0, z1)

export const P = k.fitProjection(
  [
    ...corners3(BASE, -BASE_H - FOOT_H, 0),
    [0, -20, 52] as Point3,
    [-131, 0, 44] as Point3,
  ],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 40 }
)

const at = (point: Point3) => k.iso(point, P)
const byDepth = (points: [number, number][]) =>
  [...points].sort(
    (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P)
  )
const quad = (points: Point3[]) =>
  `M${points
    .map((p) =>
      at(p)
        .map((v) => Math.round(v * 10) / 10)
        .join(" ")
    )
    .join("L")}Z`

/* ── Base: plate on feet, groove, screws, ruler strip, label plate ── */
const STRIP: Plan = { x: -128, y: BASE.y + BASE.d - 12, w: 256, d: 6, r: 1 }
const LABEL: Plan = { x: 102, y: -42, w: 40, d: 12, r: 1.5 }
const rulerTicks = k.topTicks(
  STRIP.x + 4,
  STRIP.x + STRIP.w - 4,
  4,
  5,
  STRIP.y + 0.6,
  0.6,
  [2, 3.6],
  P
)

export const BASE_ART = {
  halo: k.haloOf(BASE, -BASE_H - FOOT_H, 12, P),
  feet: byDepth(k.corners(BASE, 20)).map(([x, y]) => [
    k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28),
    k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28),
  ]),
  slab: k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6),
  groove: k.planOutline(k.insetPlan(BASE, 5), 0, P),
  screwRings: k
    .corners(BASE, 10)
    .map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16))
    .join(""),
  screws: k.pointsAt(
    k.corners(BASE, 10).map(([x, y]) => [x, y, 0] as Point3),
    P
  ),
  strip: k.slabOf(STRIP, 0, 0.6, P, 3),
  ticksMinor: rulerTicks.minor,
  ticksMajor: rulerTicks.major,
  label: k.slabOf(LABEL, 0, 0.8, P, 4),
  labelInset: k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P),
  labelRules: [
    k.lineOnTop(
      [LABEL.x + 5, LABEL.y + 4],
      [LABEL.x + 30, LABEL.y + 4],
      0.8,
      P
    ),
    k.lineOnTop(
      [LABEL.x + 5, LABEL.y + 6.4],
      [LABEL.x + 24, LABEL.y + 6.4],
      0.8,
      P
    ),
    k.lineOnTop(
      [LABEL.x + 5, LABEL.y + 8.8],
      [LABEL.x + 33, LABEL.y + 8.8],
      0.8,
      P
    ),
  ].join(""),
  labelScrews: k.pointsAt(
    [
      [LABEL.x + 2.4, LABEL.y + LABEL.d / 2, 0.8],
      [LABEL.x + LABEL.w - 2.4, LABEL.y + LABEL.d / 2, 0.8],
    ],
    P
  ),
}

/* ── Track: ties, two rails, an end stop ── */
const TIES: Plan[] = []
for (let x = RAIL_FROM + 6; x <= RAIL_TO - 4; x += 16)
  TIES.push({ x: x - 2.5, y: -13, w: 5, d: 26, r: 1 })

export const TRACK_ART = {
  bed: k.slabOf(
    { x: RAIL_FROM, y: -15, w: RAIL_TO - RAIL_FROM, d: 30, r: 3 },
    0,
    0.8,
    P,
    4
  ),
  ties: TIES.map((plan) => k.slabOf(plan, 0.8, 0.9, P, 2)),
  tieSpikes: k.pointsAt(
    TIES.flatMap(
      (t) =>
        [
          [t.x + 2.5, -10.5, 1.7],
          [t.x + 2.5, 10.5, 1.7],
        ] as Point3[]
    ),
    P
  ),
  rails: [-7.5, 4.5].map((y) =>
    k.slabOf(
      { x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 3, r: 0.8 },
      1.7,
      RAIL_TOP - 1.7,
      P,
      2,
      0.4
    )
  ),
  railJoins: [-80, -10, 60]
    .map(
      (x) =>
        k.lineOnTop([x, -7.5], [x, -4.5], RAIL_TOP, P) +
        k.lineOnTop([x, 4.5], [x, 7.5], RAIL_TOP, P)
    )
    .join(""),
}

/* ── Tray at the far end: where settled tokens come to rest ── */
const TRAY: Plan = { x: RAIL_TO, y: -15, w: 34, d: 30, r: 3 }
export const TRAY_ART = {
  floor: k.slabOf(TRAY, 0, 1.6, P, 4, 0.6),
  lip: k.planOutline(k.insetPlan(TRAY, 2.4), 1.6, P),
  stop: k.slabOf(
    { x: TRAY.x + TRAY.w - 4, y: -13, w: 4, d: 26, r: 1 },
    1.6,
    7,
    P,
    3,
    0.5
  ),
  stopScrews: k.pointsAt(
    [
      [TRAY.x + TRAY.w - 2, -8, 8.6],
      [TRAY.x + TRAY.w - 2, 8, 8.6],
    ],
    P
  ),
}

/* ── Magazine: the stack the tokens leave from ── */
const MAG: Plan = { x: -147, y: -14, w: 31, d: 28, r: 3 }
const MAG_H = 16
const TUBE_R = 9
const TUBE_TOP = MAG_H + 26
export const MAGAZINE_ART = {
  block: k.slabOf(MAG, 0, MAG_H, P, 4, 0.8),
  seam: k.sideSeam(MAG, MAG_H - 4, P, 4),
  // The mouth the token slides out of, on the face toward the track.
  mouth: quad([
    [MAG.x + MAG.w, -10.5, 0.8],
    [MAG.x + MAG.w, 10.5, 0.8],
    [MAG.x + MAG.w, 10.5, CARRIAGE_TOP + 3],
    [MAG.x + MAG.w, -10.5, CARRIAGE_TOP + 3],
  ]),
  screws: k.pointsAt(
    k.corners(MAG, 4).map(([x, y]) => [x, y, MAG_H] as Point3),
    P
  ),
  collar: k.cylinder(AT.magazine, 0, TUBE_R + 2, MAG_H, 2.4, P, 40),
  tube: k.cylinder(
    AT.magazine,
    0,
    TUBE_R,
    MAG_H + 2.4,
    TUBE_TOP - MAG_H - 2.4,
    P,
    40
  ),
  tubeSeams: [MAG_H + 10, MAG_H + 18]
    .map((z) => k.sideArc(AT.magazine, 0, TUBE_R, z, P, 28))
    .join(""),
  cap: k.cylinder(AT.magazine, 0, TUBE_R + 1.2, TUBE_TOP, 2.6, P, 40, 0.5),
  capKnurl: k.knurl(
    AT.magazine,
    0,
    TUBE_R + 1.2,
    TUBE_TOP,
    TUBE_TOP + 2.6,
    44,
    P
  ),
}

/* ── Gate: two posts and a beam, a bar that lifts, a reader with a lamp ── */
const GATE_POSTS: [number, number][] = [
  [AT.gate, -17],
  [AT.gate, 17],
]
const GATE_TOP = 27
const post = ([x, y]: [number, number]) => [
  k.cylinder(x, y, 3.8, 0, 2.4, P, 28, 0.4),
  k.cylinder(x, y, 2.4, 2.4, GATE_TOP - 2.4, P, 24),
]
const READER: Plan = { x: AT.gate - 18, y: 20, w: 9, d: 7, r: 1.5 }
export const GATE_ART = {
  back: post(GATE_POSTS[0]),
  front: post(GATE_POSTS[1]),
  postSeams: GATE_POSTS.map(([x, y]) => k.sideArc(x, y, 2.4, 14, P, 16)).join(
    ""
  ),
  beam: k.slabOf(
    { x: AT.gate - 3.5, y: -21, w: 7, d: 42, r: 1.6 },
    GATE_TOP,
    4,
    P,
    3,
    0.5
  ),
  beamScrews: k.pointsAt(
    GATE_POSTS.map(([x, y]) => [x, y, GATE_TOP + 4] as Point3),
    P
  ),
  // The bar, built closed (resting across the track) and lifted live.
  bar: k.slabOf(
    { x: AT.gate - 1.6, y: -13.5, w: 3.2, d: 27, r: 1 },
    CARRIAGE_TOP + 1,
    3,
    P,
    2,
    0.4
  ),
  barStripes: [-9, -3, 3, 9]
    .map((y) =>
      k.lineOnTop(
        [AT.gate - 1.6, y],
        [AT.gate + 1.6, y + 2],
        CARRIAGE_TOP + 4,
        P
      )
    )
    .join(""),
  reader: k.slabOf(READER, 0, 10, P, 3, 0.5),
  readerSlit: k.planOutline(
    { x: READER.x + 2, y: READER.y + 2.4, w: 5, d: 1.2, r: 0.5 },
    10,
    P
  ),
  lamp: at([READER.x + READER.w - 2.2, READER.y + READER.d - 2.2, 10]),
}

/* ── Stamp: a portal over the track, a plunger that dips, a counter ── */
const PORTAL_TOP = 40
const STAMP_POSTS: Plan[] = [
  { x: AT.stamp - 3, y: -21, w: 6, d: 5, r: 1.2 },
  { x: AT.stamp - 3, y: 16, w: 6, d: 5, r: 1.2 },
]
const COUNTER: Plan = { x: AT.stamp - 13, y: 24, w: 26, d: 11, r: 2 }
export const COUNTER_FACE_Y = COUNTER.y + COUNTER.d
export const STAMP_ART = {
  back: k.slabOf(STAMP_POSTS[0], 0, PORTAL_TOP, P, 3, 0.5),
  front: k.slabOf(STAMP_POSTS[1], 0, PORTAL_TOP, P, 3, 0.5),
  feet: STAMP_POSTS.map((plan) =>
    k.slabOf(k.insetPlan(plan, -2), 0, 2, P, 3, 0.4)
  ),
  beam: k.slabOf(
    { x: AT.stamp - 4.5, y: -22, w: 9, d: 44, r: 1.8 },
    PORTAL_TOP,
    5,
    P,
    3,
    0.6
  ),
  beamScrews: k.pointsAt(
    [
      [AT.stamp, -18.5, PORTAL_TOP + 5],
      [AT.stamp, 18.5, PORTAL_TOP + 5],
    ],
    P
  ),
  actuator: k.cylinder(AT.stamp, 0, 4.4, PORTAL_TOP + 5, 7, P, 32, 0.5),
  actuatorKnurl: k.knurl(
    AT.stamp,
    0,
    4.4,
    PORTAL_TOP + 8,
    PORTAL_TOP + 12,
    36,
    P
  ),
  // Plunger, built at rest and dipped live: a rod into the beam, a head.
  rod: k.cylinder(
    AT.stamp,
    0,
    1.5,
    PUCK_TOP + STAMP_DIP + 3,
    PORTAL_TOP - PUCK_TOP - STAMP_DIP - 3 + 4,
    P,
    16
  ),
  rodMarks: [24, 30].map((z) => k.sideArc(AT.stamp, 0, 1.5, z, P, 10)).join(""),
  head: k.cylinder(AT.stamp, 0, 5, PUCK_TOP + STAMP_DIP, 3, P, 32, 0.5),
  headRing: k.ring(AT.stamp, 0, 3.2, PUCK_TOP + STAMP_DIP + 3, P, 24),
  counter: k.slabOf(COUNTER, 0, 15, P, 4, 0.8),
  counterSeam: k.sideSeam(COUNTER, 3, P, 4),
  counterScrews: k.pointsAt(
    [
      [COUNTER.x + 2.6, COUNTER.y + 2.6, 15],
      [COUNTER.x + COUNTER.w - 2.6, COUNTER.y + 2.6, 15],
    ],
    P
  ),
  // The counter's display, laid in the plane of its front face.
  face: k.sideMatrix([AT.stamp, COUNTER_FACE_Y], 0, P, "left"),
}

/* ── Till: a box beside the track with a drawer that pays out ── */
const TILL: Plan = { x: AT.till - 13, y: 20, w: 26, d: 17, r: 2 }
const DRAWER: Plan = {
  x: AT.till - 10,
  y: TILL.y + TILL.d - 9,
  w: 20,
  d: 9,
  r: 1,
}
export const TILL_ART = {
  box: k.slabOf(TILL, 0, 14, P, 4, 0.8),
  slot: k.planOutline(
    { x: AT.till - 6, y: TILL.y + 5, w: 12, d: 2, r: 0.8 },
    14,
    P
  ),
  screws: k.pointsAt(
    [
      [TILL.x + 2.6, TILL.y + 2.6, 14],
      [TILL.x + TILL.w - 2.6, TILL.y + 2.6, 14],
    ],
    P
  ),
  // The drawer, built shut (front flush with the box) and opened live.
  drawer: k.slabOf(DRAWER, 2, 6.5, P, 2, 0.4),
  pull: k.slabOf(
    { x: AT.till - 4, y: DRAWER.y + DRAWER.d, w: 8, d: 1.6, r: 0.6 },
    4,
    2.4,
    P,
    2
  ),
}

/* ── The token: a carriage on the rails with the lit puck on top ── */
export const TOKEN_ART = {
  halo: k.haloOf(CARRIAGE, RAIL_TOP - 0.5, 2, P),
  carriage: k.slabOf(CARRIAGE, RAIL_TOP, CARRIAGE_TOP - RAIL_TOP, P, 3, 0.6),
  rivets: k.pointsAt(
    k.corners(CARRIAGE, 2.6).map(([x, y]) => [x, y, CARRIAGE_TOP] as Point3),
    P
  ),
  puck: k.cylinder(
    0,
    0,
    5.5,
    CARRIAGE_TOP,
    PUCK_TOP - CARRIAGE_TOP,
    P,
    32,
    0.6
  ),
  puckRing: k.ring(0, 0, 3.4, PUCK_TOP, P, 24),
}

/** Screen offset for a world move, for the live layer. */
export const along = (by: Point3) => k.translateAlong(P, by)
