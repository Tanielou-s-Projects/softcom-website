/*
 * Fig 03 · Reaching people — the Powering Initiatives figure.
 *
 * A delivery line on a bench. Participants leave a hopper on a belt and pass
 * three stations an initiative runs: enrolment (an arch with a scanner),
 * training (a booth whose screen fills as they pass) and payment (a dispenser
 * that drops a coin onto each one). The belt ends at a tally whose dial
 * counts the people reached — the result, not just the system.
 *
 * World units are ~1 px; x along the belt, y across it, z up. Static.
 */
import * as k from "@/components/iso/iso-kit"
import type { Plan, Plane, Point3 } from "@/components/iso/iso-kit"

export const WIDTH = 600
export const HEIGHT = 360

const BASE: Plan = { x: -164, y: -54, w: 328, d: 108, r: 8 }
const BASE_H = 10
const FOOT_H = 5

/* The belt. */
export const BELT_TOP = 11
export const BELT_FROM = -122
export const BELT_TO = 120
const BELT: Plan = { x: -134, y: -10, w: 262, d: 20, r: 9 }

/* Stations along the belt. */
export const AT = { enrol: -62, train: -2, pay: 58 }

/* A participant: a peg on the belt. */
const PEG_R = 3.4
const HEAD_R = 2.7
export const PEG_TOP = BELT_TOP + 13

/* The coin's drop at the pay station. */
export const COIN_REST = 30
export const COIN_DROP = COIN_REST - PEG_TOP - 0.2

/* The tally's dial. */
const TALLY: Plan = { x: 126, y: -22, w: 34, d: 44, r: 3 }
const TALLY_H = 15
export const DIAL = { x: 143, y: 0, r: 13, top: TALLY_H + 6 }

export const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [AT.pay, -26, 48] as Point3,
    [AT.enrol, 0, 42] as Point3,
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 40 }
)

const at = (point: Point3) => k.iso(point, P)
const quad = (points: Point3[]) =>
  `M${points
    .map((p) =>
      at(p)
        .map((v) => Math.round(v * 10) / 10)
        .join(" ")
    )
    .join("L")}Z`

/* ── Bench ── */
const STRIP: Plan = { x: -140, y: BASE.y + BASE.d - 12, w: 250, d: 6, r: 1 }
const ruler = k.topTicks(
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
  feet: [...k.corners(BASE, 20)]
    .sort(
      (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P)
    )
    .map(([x, y]) => [
      k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28),
      k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28),
    ]),
  slab: k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6),
  groove: k.planOutline(k.insetPlan(BASE, 5), 0, P),
  screws: k.pointsAt(
    k.corners(BASE, 10).map(([x, y]) => [x, y, 0] as Point3),
    P
  ),
  strip: k.slabOf(STRIP, 0, 0.6, P, 3),
  ticksMinor: ruler.minor,
  ticksMajor: ruler.major,
}

/* ── Conveyor: legs, belt with cleats, guard rails ── */
const LEGS: Plan[] = [-118, -40, 40, 112].flatMap((x) => [
  { x: x - 2.5, y: -13, w: 5, d: 4, r: 1 },
  { x: x - 2.5, y: 9, w: 5, d: 4, r: 1 },
])
export const CONVEYOR_ART = {
  backLegs: LEGS.filter((leg) => leg.y < 0).map((leg) =>
    k.slabOf(leg, 0, BELT_TOP - 3, P, 2, 0.3)
  ),
  frontLegs: LEGS.filter((leg) => leg.y > 0).map((leg) =>
    k.slabOf(leg, 0, BELT_TOP - 3, P, 2, 0.3)
  ),
  bed: k.slabOf(k.insetPlan(BELT, -2), BELT_TOP - 3, 1.4, P, 8, 0.4),
  belt: k.slabOf(BELT, BELT_TOP - 1.6, 1.6, P, 8, 0.4),
  cleats: (() => {
    const lines: string[] = []
    for (let x = BELT.x + 12; x < BELT.x + BELT.w - 10; x += 8)
      lines.push(
        k.lineOnTop([x, BELT.y + 2.5], [x, BELT.y + BELT.d - 2.5], BELT_TOP, P)
      )
    return lines.join("")
  })(),
  backGuard: k.slabOf(
    { x: BELT.x + 8, y: -13.5, w: BELT.w - 16, d: 2, r: 0.8 },
    BELT_TOP,
    4,
    P,
    2,
    0.3
  ),
  frontGuard: k.slabOf(
    { x: BELT.x + 8, y: 11.5, w: BELT.w - 16, d: 2, r: 0.8 },
    BELT_TOP,
    4,
    P,
    2,
    0.3
  ),
}

/* ── Hopper: where participants join ── */
const HOPPER: Plan = { x: -156, y: -18, w: 32, d: 36, r: 3 }
export const HOPPER_ART = {
  box: k.slabOf(HOPPER, 0, 30, P, 4, 0.8),
  seam: k.sideSeam(HOPPER, 22, P, 4),
  mouth: quad([
    [HOPPER.x + HOPPER.w, -9, BELT_TOP],
    [HOPPER.x + HOPPER.w, 9, BELT_TOP],
    [HOPPER.x + HOPPER.w, 9, PEG_TOP + 3],
    [HOPPER.x + HOPPER.w, -9, PEG_TOP + 3],
  ]),
  // A funnel lip on top, with the waiting pegs' heads showing.
  lip: k.slabOf(k.insetPlan(HOPPER, -3), 30, 3, P, 4, 0.5),
  well: k.planOutline(k.insetPlan(HOPPER, 4), 33, P),
  waiting: (
    [
      [-146, -6],
      [-138, 4],
      [-145, 7],
      [-136, -8],
    ] as Plane[]
  ).map(([x, y]) => k.cylinder(x, y, HEAD_R, 30, 3.2, P, 20)),
  screws: k.pointsAt(
    k
      .corners(k.insetPlan(HOPPER, -3), 2.5)
      .map(([x, y]) => [x, y, 33] as Point3),
    P
  ),
}

/* ── Enrolment: an arch with a scanner bar and a lamp ── */
const ARCH_TOP = 36
const archPost = (y: number) =>
  k.slabOf(
    { x: AT.enrol - 3, y: y - 2.5, w: 6, d: 5, r: 1.2 },
    0,
    ARCH_TOP,
    P,
    3,
    0.5
  )
export const ENROL_ART = {
  back: archPost(-20),
  front: archPost(20),
  beam: k.slabOf(
    { x: AT.enrol - 4.5, y: -23, w: 9, d: 46, r: 1.8 },
    ARCH_TOP,
    5,
    P,
    3,
    0.6
  ),
  scanner: k.slabOf(
    { x: AT.enrol - 3, y: -12, w: 6, d: 24, r: 1 },
    ARCH_TOP - 4,
    4,
    P,
    2,
    0.4
  ),
  scanSlit: k.lineOnTop([AT.enrol, -10], [AT.enrol, 10], ARCH_TOP - 4, P),
  screws: k.pointsAt(
    [
      [AT.enrol, -19.5, ARCH_TOP + 5],
      [AT.enrol, 19.5, ARCH_TOP + 5],
    ],
    P
  ),
  lamp: at([AT.enrol + 4.5, 15, ARCH_TOP + 2.5]),
}

/* ── Training: a booth beside the belt with a screen on its face ── */
const BOOTH: Plan = { x: AT.train - 16, y: 22, w: 32, d: 16, r: 2.4 }
export const TRAIN_ART = {
  booth: k.slabOf(BOOTH, 0, 30, P, 4, 0.8),
  seam: k.sideSeam(BOOTH, 4, P, 4),
  cap: k.slabOf(k.insetPlan(BOOTH, -1.5), 30, 2.4, P, 4, 0.5),
  vents: [6, 9, 12]
    .map((u) =>
      k.lineOnTop(
        [BOOTH.x + u, BOOTH.y + 4],
        [BOOTH.x + u, BOOTH.y + 11],
        32.4,
        P
      )
    )
    .join(""),
  // The screen, in the plane of the booth's front face.
  face: k.sideMatrix([AT.train, BOOTH.y + BOOTH.d], 0, P, "left"),
}

/* ── Payment: a post, an arm and a dispenser over the belt ── */
export const PAY_ART = {
  postBase: k.cylinder(AT.pay, -28, 4.6, 0, 2.4, P, 28, 0.4),
  post: k.cylinder(AT.pay, -28, 3, 2.4, 44 - 2.4, P, 24),
  arm: k.slabOf(
    { x: AT.pay - 3.5, y: -31, w: 7, d: 34, r: 1.6 },
    44,
    4,
    P,
    3,
    0.5
  ),
  armScrews: k.pointsAt(
    [
      [AT.pay, -28, 48],
      [AT.pay, 0, 48],
    ],
    P
  ),
  dispenser: k.cylinder(
    AT.pay,
    0,
    6.5,
    COIN_REST + 2,
    44 - COIN_REST - 2,
    P,
    32,
    0.5
  ),
  dispenserSeams: [36, 40]
    .map((z) => k.sideArc(AT.pay, 0, 6.5, z, P, 24))
    .join(""),
  // The coin, built resting in the dispenser's mouth and dropped live.
  coin: k.cylinder(AT.pay, 0, 3.2, COIN_REST, 1.2, P, 24, 0.3),
}

/* ── A participant ── */
export const PEG_ART = {
  halo: k.haloOf(
    { x: -PEG_R, y: -PEG_R, w: PEG_R * 2, d: PEG_R * 2, r: PEG_R },
    BELT_TOP - 0.4,
    0.6,
    P
  ),
  body: k.cylinder(0, 0, PEG_R, BELT_TOP, 8, P, 24, 0.3),
  band: k.sideArc(0, 0, PEG_R, BELT_TOP + 5, P, 16),
  neck: k.cylinder(0, 0, 1.4, BELT_TOP + 8, 1.6, P, 12),
  head: k.cylinder(
    0,
    0,
    HEAD_R,
    BELT_TOP + 9.6,
    PEG_TOP - BELT_TOP - 9.6,
    P,
    20,
    0.3
  ),
}

/* ── Tally: a box at the belt's end with a dial on top ── */
export const TALLY_ART = {
  box: k.slabOf(TALLY, 0, TALLY_H, P, 4, 0.8),
  seam: k.sideSeam(TALLY, 4, P, 4),
  chute: quad([
    [TALLY.x, -9, BELT_TOP - 2],
    [TALLY.x, 9, BELT_TOP - 2],
    [TALLY.x, 9, TALLY_H - 2],
    [TALLY.x, -9, TALLY_H - 2],
  ]),
  puck: k.cylinder(DIAL.x, DIAL.y, DIAL.r, TALLY_H, 6, P, 64, 0.8),
  knurl: k.knurl(DIAL.x, DIAL.y, DIAL.r, DIAL.top - 2.6, DIAL.top, 80, P, 0.3),
  bezel: k.ring(DIAL.x, DIAL.y, DIAL.r - 2, DIAL.top, P, 64),
  ...(() => {
    const t = k.radialTicks(
      DIAL.x,
      DIAL.y,
      DIAL.r - 2.6,
      40,
      5,
      DIAL.top,
      [1.2, 2.6],
      P
    )
    return { minor: t.minor, major: t.major }
  })(),
  hub: k.ring(DIAL.x, DIAL.y, 1.4, DIAL.top, P, 16),
}

export const along = (by: Point3) => k.translateAlong(P, by)
