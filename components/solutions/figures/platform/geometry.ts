/*
 * Fig 01 · Digital Infrastructure — one platform, many institutions.
 *
 * Drawn the way the client's reference (Palantir's Ontology page) draws: the
 * subject itself in fine isometric line, not a machine standing in for it.
 * A platform of three layers (the shared rails) carries the institutions an
 * operation connects (a ministry that verifies identity, a clinic that
 * delivers a service, a bank that settles payment, a market, homes and a
 * field agent), each on its own plot and joined by paths to one shared
 * record at the centre.
 *
 * World units are ~1 px; x and y on the ground, z up. With the camera at
 * azimuth 45, +x+y is toward the viewer, so the faces at x + w and y + d are
 * the ones seen. Everything here is static and computed once, on the server.
 */
import * as k from "@/components/iso/iso-kit"
import type {
  Flat,
  Plan,
  Plane,
  Point3,
  SolidPaths,
} from "@/components/iso/iso-kit"

export const WIDTH = 640
export const HEIGHT = 420

/* The platform: three layers, the top one carrying everything. */
const DECK: Plan = { x: -114, y: -114, w: 228, d: 228, r: 12 }
const LAYER_H = 6
const LAYER_GAP = 5
const LAYERS = [0, 1, 2].map(
  (index) => -(index + 1) * LAYER_H - index * LAYER_GAP
)

export const P = k.fitProjection(
  [...k.boxCorners(DECK, LAYERS[2], 30)],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 45, elevation: 30 }
)

const at = (point: Point3): Flat => k.iso(point, P)
const box = (plan: Plan, z: number, h: number, bevel = 0): SolidPaths =>
  k.slabOf(plan, z, h, P, plan.r ? 6 : 0, bevel)
const disc = (x: number, y: number, r: number, z: number, h: number) =>
  k.cylinder(x, y, r, z, h, P, 40)

/** Window rows on a box's two seen faces, as short horizontal strokes. */
function windows(plan: Plan, z: number, h: number, rows: number, cols: number) {
  const out: string[] = []
  const pad = 3
  const rowAt = (row: number) => z + pad + ((h - pad * 2) * (row + 0.5)) / rows
  for (let row = 0; row < rows; row++) {
    const zz = rowAt(row)
    // Face at y = y + d, running along x.
    for (let col = 0; col < cols; col++) {
      const span = (plan.w - pad * 2) / cols
      const x0 = plan.x + pad + span * col + span * 0.2
      const x1 = x0 + span * 0.6
      out.push(
        k.segment([x0, plan.y + plan.d, zz], [x1, plan.y + plan.d, zz], P)
      )
    }
    // Face at x = x + w, running along y.
    for (let col = 0; col < cols; col++) {
      const span = (plan.d - pad * 2) / cols
      const y0 = plan.y + pad + span * col + span * 0.2
      const y1 = y0 + span * 0.6
      out.push(
        k.segment([plan.x + plan.w, y0, zz], [plan.x + plan.w, y1, zz], P)
      )
    }
  }
  return out.join("")
}

/** A person: a body and a head, standing at (x, y). */
const person = (x: number, y: number) => [
  disc(x, y, 1.9, 0, 5.2),
  disc(x, y, 1.4, 5.8, 2.6),
]

/* ── The platform ── */
export const PLATFORM = {
  halo: k.haloOf(DECK, LAYERS[2], LAYER_H, P),
  layers: [...LAYERS].reverse().map((z) => box(DECK, z, LAYER_H, 1.2)),
  /** A seam inset on the top deck, like a tray's lip. */
  lip: k.planOutline(k.insetPlan(DECK, 6), 0, P),
  /** Corner screws on the deck. */
  screws: k.pointsAt(
    k.corners(DECK, 11).map(([x, y]) => [x, y, 0] as Point3),
    P
  ),
}

/* ── Plots: one round pad per institution, the record at the hub ── */
export type PlotId =
  | "record"
  | "ministry"
  | "clinic"
  | "bank"
  | "market"
  | "homes"
  | "agent"

const RING = 76
const PLOT_R = 24
const angleOf = (degrees: number): Plane => [
  Math.cos((degrees * Math.PI) / 180) * RING,
  Math.sin((degrees * Math.PI) / 180) * RING,
]

/** Plot centres. Far plots (small x + y) sit at the back of the deck. */
export const PLOTS: Record<PlotId, Plane> = {
  record: [0, 0],
  ministry: angleOf(225),
  clinic: angleOf(285),
  bank: angleOf(345),
  market: angleOf(45),
  homes: angleOf(105),
  agent: angleOf(165),
}

type Site = Exclude<PlotId, "record">
const ORDER: Site[] = ["ministry", "clinic", "bank", "market", "homes", "agent"]

export const PADS = {
  rings: (Object.keys(PLOTS) as PlotId[]).map((id) => ({
    id,
    d: k.ring(
      PLOTS[id][0],
      PLOTS[id][1],
      id === "record" ? 30 : PLOT_R,
      0,
      P,
      56
    ),
  })),
}

/*
 * Paths: each plot to the hub, as two straight legs along the deck's axes so
 * they read as laid on the platform, not drawn over it. Each runs rim to rim.
 */
function legOf(id: Site): Plane[] {
  const [px, py] = PLOTS[id]
  const corner: Plane = Math.abs(px) > Math.abs(py) ? [px, 0] : [0, py]
  const start = towardRim([px, py], corner, PLOT_R)
  const end = towardRim([0, 0], corner, 30)
  return [start, corner, end]
}
function towardRim(from: Plane, to: Plane, r: number): Plane {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const length = Math.hypot(dx, dy) || 1
  return [from[0] + (dx / length) * r, from[1] + (dy / length) * r]
}

export const ROUTES: Record<
  Exclude<PlotId, "record">,
  Plane[]
> = Object.fromEntries(ORDER.map((id) => [id, legOf(id)])) as Record<
  Exclude<PlotId, "record">,
  Plane[]
>

export const PATHS = {
  lines: ORDER.map((id) => k.onTop(ROUTES[id], 0, P)).join(""),
  /** Junction dots where each path turns and where it meets a rim. */
  nodes: k.pointsAt(
    ORDER.flatMap((id) => ROUTES[id].map(([x, y]) => [x, y, 0] as Point3)),
    P
  ),
}

/** A route in screen space, for the live pulse: hub rim → plot rim. */
export const SCREEN_ROUTES = Object.fromEntries(
  ORDER.map((id) => [
    id,
    [...ROUTES[id]].reverse().map(([x, y]) => at([x, y, 0])),
  ])
) as Record<Exclude<PlotId, "record">, Flat[]>

/* ── Buildings ── */
type Part = { paths: SolidPaths; lit?: boolean }
type Building = { id: PlotId; parts: Part[]; lines?: string; depth: number }

const offset = (
  id: PlotId,
  plan: Omit<Plan, "x" | "y"> & { dx?: number; dy?: number }
): Plan => ({
  x: PLOTS[id][0] - plan.w / 2 + (plan.dx ?? 0),
  y: PLOTS[id][1] - plan.d / 2 + (plan.dy ?? 0),
  w: plan.w,
  d: plan.d,
  r: plan.r,
})

function record(): Building {
  const [x, y] = PLOTS.record
  // The shared record: a stack of data platters on a plinth.
  const plinth = offset("record", { w: 30, d: 30, r: 4 })
  const parts: Part[] = [{ paths: box(plinth, 0, 3, 0.6) }]
  for (let i = 0; i < 4; i++)
    parts.push({ paths: disc(x, y, 11, 3 + i * 5.5, 4.2), lit: i === 3 })
  return { id: "record", parts, depth: k.depthOf([x, y, 0], P) }
}

function ministry(): Building {
  const [x, y] = PLOTS.ministry
  const hall = offset("ministry", { w: 34, d: 26, r: 0 })
  const steps = offset("ministry", { w: 20, d: 6, r: 0, dy: 15 })
  return {
    id: "ministry",
    parts: [
      { paths: box(steps, 0, 2) },
      { paths: box(hall, 0, 20, 0.5) },
      { paths: box(k.insetPlan(hall, 2), 20, 2) },
      { paths: disc(x, y, 8, 22, 4) },
      { paths: disc(x, y, 6, 26, 4) },
      { paths: disc(x, y, 3.4, 30, 3) },
      { paths: disc(x, y, 0.6, 33, 7) },
    ],
    lines: windows(hall, 0, 20, 3, 5),
    depth: k.depthOf([x, y, 0], P),
  }
}

function clinic(): Building {
  const [x, y] = PLOTS.clinic
  const block = offset("clinic", { w: 30, d: 30, r: 0 })
  const wing = offset("clinic", { w: 14, d: 14, r: 0, dx: 4, dy: 18 })
  return {
    id: "clinic",
    parts: [
      { paths: box(block, 0, 14, 0.5) },
      { paths: box(wing, 0, 7, 0.4) },
      // The cross on the roof, as two flat bars.
      { paths: box({ x: x - 7, y: y - 2, w: 14, d: 4, r: 0 }, 14, 1.4) },
      { paths: box({ x: x - 2, y: y - 7, w: 4, d: 14, r: 0 }, 14, 1.4) },
    ],
    lines: windows(block, 0, 14, 2, 4),
    depth: k.depthOf([x, y, 0], P),
  }
}

function bank(): Building {
  const [x, y] = PLOTS.bank
  const plinth = offset("bank", { w: 34, d: 28, r: 0 })
  const body = offset("bank", { w: 28, d: 20, r: 0, dx: -2, dy: -2 })
  const roof = offset("bank", { w: 34, d: 28, r: 0 })
  const parts: Part[] = [
    { paths: box(plinth, 0, 2.5, 0.4) },
    { paths: box(body, 2.5, 14) },
  ]
  // Columns along the seen faces, front edge of the plinth.
  const front = plinth.y + plinth.d - 2.6
  const side = plinth.x + plinth.w - 2.6
  const cols: Plane[] = []
  for (let i = 0; i < 5; i++) cols.push([plinth.x + 4 + i * 6.5, front])
  for (let i = 0; i < 3; i++) cols.push([side, plinth.y + 5 + i * 7])
  cols
    .sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
    .forEach(([cx, cy]) => parts.push({ paths: disc(cx, cy, 1.3, 2.5, 14) }))
  parts.push({ paths: box(roof, 16.5, 2.5, 0.4) })
  parts.push({ paths: box(k.insetPlan(roof, 4), 19, 2.5) })
  return { id: "bank", parts, depth: k.depthOf([x, y, 0], P) }
}

function market(): Building {
  const [x, y] = PLOTS.market
  const parts: Part[] = []
  // Two stalls: a table under an awning on four posts.
  const stalls: Plane[] = [
    [x - 9, y + 9],
    [x + 9, y - 9],
  ]
  stalls
    .sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
    .forEach(([sx, sy]) => {
      const table: Plan = { x: sx - 7, y: sy - 5, w: 14, d: 10, r: 0 }
      const posts = k.corners({ ...table, x: table.x, y: table.y }, 1)
      parts.push({ paths: box(table, 0, 5) })
      parts.push({
        paths: box({ x: sx - 5, y: sy - 3, w: 4, d: 3, r: 0.6 }, 5, 2.4),
      })
      parts.push({ paths: disc(sx + 3, sy + 1, 1.6, 5, 2) })
      posts
        .sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
        .forEach(([px, py]) => parts.push({ paths: disc(px, py, 0.5, 0, 12) }))
      parts.push({
        paths: box({ x: sx - 8, y: sy - 6, w: 16, d: 12, r: 0 }, 12, 1.2),
        lit: false,
      })
    })
  ;[
    [x - 10, y - 8],
    [x + 6, y + 14],
  ].forEach(([px, py]) =>
    person(px, py).forEach((paths) => parts.push({ paths }))
  )
  return { id: "market", parts, depth: k.depthOf([x, y, 0], P) }
}

function homes(): Building {
  const [x, y] = PLOTS.homes
  const parts: Part[] = []
  const lots: [number, number, number][] = [
    [x - 9, y - 9, 12],
    [x + 9, y - 6, 9],
    [x - 6, y + 9, 8],
  ]
  lots
    .sort(
      (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P)
    )
    .forEach(([hx, hy, h]) => {
      const house: Plan = { x: hx - 6, y: hy - 6, w: 12, d: 12, r: 0 }
      parts.push({ paths: box(house, 0, h, 0.4) })
      parts.push({ paths: box(k.insetPlan(house, 1.5), h, 1.4) })
    })
  person(x + 11, y + 10).forEach((paths) => parts.push({ paths }))
  return { id: "homes", parts, depth: k.depthOf([x, y, 0], P) }
}

function agent(): Building {
  const [x, y] = PLOTS.agent
  const parts: Part[] = []
  // A field office: a cabin with a mast, and an agent with a tablet.
  const cabin = offset("agent", { w: 20, d: 14, r: 0, dx: -3, dy: -4 })
  parts.push({ paths: box(cabin, 0, 11, 0.4) })
  parts.push({ paths: box(k.insetPlan(cabin, 1), 11, 1.2) })
  parts.push({ paths: disc(cabin.x + 4, cabin.y + 4, 0.6, 12.2, 16) })
  parts.push({ paths: disc(cabin.x + 4, cabin.y + 4, 2, 26, 1) })
  person(x + 9, y + 9).forEach((paths) => parts.push({ paths }))
  parts.push({
    paths: box({ x: x + 10.6, y: y + 6.6, w: 3.2, d: 4.4, r: 0.4 }, 4.6, 0.6),
    lit: true,
  })
  return {
    id: "agent",
    parts,
    lines: windows(cabin, 0, 11, 1, 2),
    depth: k.depthOf([x, y, 0], P),
  }
}

/** Every building, back to front. */
export const BUILDINGS: Building[] = [
  record(),
  ministry(),
  clinic(),
  bank(),
  market(),
  homes(),
  agent(),
].sort((a, b) => a.depth - b.depth)

export const HUB_DEPTH = k.depthOf([0, 0, 0], P)

/** Where the participant card points from: above the homes plot. */
export const ANCHORS = {
  homes: at([...PLOTS.homes, 18]),
  ministry: at([...PLOTS.ministry, 36]),
  clinic: at([...PLOTS.clinic, 18]),
  bank: at([...PLOTS.bank, 24]),
}
