/*
 * Digital Infrastructure — the city block.
 *
 * Drawn after the client's reference (Palantir's Ontology page): the subject
 * itself in fine isometric line, composed by hand rather than on a grid. A
 * deck of two layers (the shared rails) carries uneven districts joined by a
 * road and by data links: a registration office with a queue and a kiosk
 * (identity and access), a data hall with record platters and document stacks
 * (records and operations), and a bank, a clinic, market stalls and a
 * delivery truck (services and transactions), with housing in front.
 *
 * World units are ~1 px; x and y on the ground, z up. With the camera at
 * azimuth 45, +x+y is toward the viewer and the faces at x + w and y + d are
 * the ones seen. Static, computed once on the server.
 */
import * as k from "@/components/iso/iso-kit"
import type {
  Flat,
  Plan,
  Plane,
  Point3,
  SolidPaths,
} from "@/components/iso/iso-kit"

export const WIDTH = 720
export const HEIGHT = 520

export type Zone = "identity" | "records" | "services"

/* The deck: a thick top layer over a thinner, wider one. */
const DECK: Plan = { x: -180, y: -120, w: 360, d: 240, r: 14 }
const UNDER: Plan = { x: -186, y: -126, w: 372, d: 252, r: 18 }

export const P = k.fitProjection(
  [...k.boxCorners(UNDER, -22, 54)],
  WIDTH,
  HEIGHT,
  { pad: 20, azimuth: 45, elevation: 30 }
)

const at = (point: Point3): Flat => k.iso(point, P)
const depth = (x: number, y: number) => k.depthOf([x, y, 0], P)
/*
 * Things on the deck stand taller than their footprints suggest, so the
 * buildings carry the drawing the way the reference's do.
 */
const ZS = 1.5
const box = (plan: Plan, z: number, h: number, bevel = 0.4): SolidPaths =>
  k.slabOf(plan, z * ZS, h * ZS, P, plan.r ? 6 : 0, bevel)
const disc = (x: number, y: number, r: number, z: number, h: number) =>
  k.cylinder(x, y, r, z * ZS, h * ZS, P, 36)
/** The deck itself is not stretched. */
const deckBox = (plan: Plan, z: number, h: number, bevel = 0.4): SolidPaths =>
  k.slabOf(plan, z, h, P, plan.r ? 6 : 0, bevel)
const rect = (x: number, y: number, w: number, d: number, r = 0): Plan => ({
  x,
  y,
  w,
  d,
  r,
})

/** Window strokes on a box's two seen faces. */
function windows(plan: Plan, z: number, h: number, rows: number, cols: number) {
  const out: string[] = []
  const pad = 2.5
  for (let row = 0; row < rows; row++) {
    const zz = (z + pad + ((h - pad * 2) * (row + 0.5)) / rows) * ZS
    const spanX = (plan.w - pad * 2) / cols
    const spanY =
      (plan.d - pad * 2) / Math.max(1, Math.round(cols * (plan.d / plan.w)))
    for (let c = 0; c < cols; c++) {
      const x0 = plan.x + pad + spanX * c + spanX * 0.22
      out.push(
        k.segment(
          [x0, plan.y + plan.d, zz],
          [x0 + spanX * 0.56, plan.y + plan.d, zz],
          P
        )
      )
    }
    const colsY = Math.max(1, Math.round(cols * (plan.d / plan.w)))
    for (let c = 0; c < colsY; c++) {
      const y0 = plan.y + pad + spanY * c + spanY * 0.22
      out.push(
        k.segment(
          [plan.x + plan.w, y0, zz],
          [plan.x + plan.w, y0 + spanY * 0.56, zz],
          P
        )
      )
    }
  }
  return out.join("")
}

/* ── Things on the deck: each a set of solids and lines, sorted by depth ── */
export type Thing = {
  zone?: Zone
  parts: { paths: SolidPaths; lit?: boolean }[]
  lines?: string
  depth: number
}
const things: Thing[] = []
const add = (
  x: number,
  y: number,
  parts: Thing["parts"],
  zone?: Zone,
  lines?: string
) => things.push({ zone, parts, lines, depth: depth(x, y) })

const person = (x: number, y: number, zone?: Zone) =>
  add(
    x,
    y,
    [{ paths: disc(x, y, 1.7, 0, 4.8) }, { paths: disc(x, y, 1.3, 5.4, 2.4) }],
    zone
  )

/* Districts: lots outlined on the deck, uneven on purpose. */
const LOTS: { zone?: Zone; plan: Plan }[] = [
  { zone: "identity", plan: rect(-168, -108, 104, 92, 8) },
  { zone: "records", plan: rect(-46, -108, 116, 70, 8) },
  { zone: "services", plan: rect(84, -108, 84, 96, 8) },
  { zone: "services", plan: rect(-168, 22, 92, 86, 8) },
  { plan: rect(-56, 18, 126, 90, 8) },
  { zone: "services", plan: rect(84, 42, 84, 66, 8) },
]

/* The road: one avenue along x, one street along y, as kerb lines. */
const ROAD_Y: [number, number] = [-4, 10]
const ROAD_X: [number, number] = [70, 80]

/* ── Identity: registration office, queue, kiosk ── */
{
  const office = rect(-150, -96, 46, 34)
  add(
    -127,
    -79,
    [
      { paths: box(office, 0, 20) },
      { paths: box(rect(-152, -98, 50, 38), 20, 2) },
      { paths: box(rect(-146, -62, 30, 6), 9, 1.2) },
    ],
    "identity",
    windows(office, 0, 20, 3, 6)
  )
  // A flagpole by the door.
  add(
    -108,
    -58,
    [
      { paths: disc(-108, -58, 1.6, 0, 1.2) },
      { paths: disc(-108, -58, 0.45, 1.2, 26) },
      { paths: box(rect(-108, -58.5, 9, 1, 0), 21, 5, 0) },
    ],
    "identity"
  )
  // The queue, leading to the door.
  ;[
    [-132, -50],
    [-132, -43],
    [-131, -36],
    [-129, -29],
    [-125, -23],
  ].forEach(([x, y]) => person(x, y, "identity"))
  // A self-service kiosk with its screen.
  add(
    -86,
    -40,
    [
      { paths: box(rect(-90, -44, 8, 8, 1), 0, 13) },
      { paths: box(rect(-89, -43, 6, 2, 0.4), 13, 0.6), lit: true },
    ],
    "identity"
  )
  person(-82, -30, "identity")
}

/* ── Records: data hall, platters, document stacks ── */
{
  const hall = rect(-30, -98, 54, 32)
  add(
    -3,
    -82,
    [
      { paths: box(hall, 0, 12) },
      { paths: box(rect(-24, -92, 10, 8), 12, 4) },
      { paths: box(rect(-10, -92, 10, 8), 12, 4) },
      { paths: box(rect(4, -92, 10, 8), 12, 4) },
    ],
    "records",
    windows(hall, 0, 12, 1, 7)
  )
  // The shared record: platters on a plinth.
  const platters: Thing["parts"] = [
    { paths: box(rect(36, -96, 26, 26, 4), 0, 3) },
  ]
  for (let i = 0; i < 4; i++)
    platters.push({ paths: disc(49, -83, 10, 3 + i * 5, 3.8), lit: i === 3 })
  add(49, -83, platters, "records")
  // Document stacks, the evidence the record keeps.
  ;[
    [-28, -56],
    [-16, -54],
  ].forEach(([x, y]) => {
    const sheets: Thing["parts"] = []
    for (let i = 0; i < 5; i++)
      sheets.push({
        paths: box(rect(x - 4, y - 5, 9, 11, 0.6), i * 1.6, 1.3, 0),
      })
    add(x, y, sheets, "records")
  })
  person(8, -52, "records")
}

/* ── Services: bank and clinic ── */
{
  const plinth = rect(94, -98, 40, 30)
  const parts: Thing["parts"] = [
    { paths: box(plinth, 0, 2.5) },
    { paths: box(rect(97, -95, 32, 22), 2.5, 15, 0) },
  ]
  const cols: Plane[] = []
  for (let i = 0; i < 6; i++)
    cols.push([plinth.x + 3.6 + i * 6.6, plinth.y + plinth.d - 2.4])
  for (let i = 0; i < 4; i++)
    cols.push([plinth.x + plinth.w - 2.4, plinth.y + 4 + i * 7])
  cols
    .sort((a, b) => depth(...a) - depth(...b))
    .forEach(([cx, cy]) => parts.push({ paths: disc(cx, cy, 1.2, 2.5, 15) }))
  parts.push({ paths: box(rect(92, -100, 44, 34), 17.5, 2.4) })
  parts.push({ paths: box(rect(98, -94, 32, 22), 19.9, 3) })
  add(114, -83, parts, "services")
  // An ATM by the steps.
  add(
    140,
    -60,
    [
      { paths: box(rect(137, -64, 6, 8, 0.6), 0, 11) },
      { paths: box(rect(138, -59, 4, 2, 0.3), 11, 0.5), lit: true },
    ],
    "services"
  )

  const clinic = rect(100, -50, 40, 32)
  add(
    120,
    -34,
    [
      { paths: box(clinic, 0, 16) },
      { paths: box(rect(112, -36.5, 16, 5), 16, 1.4, 0) },
      { paths: box(rect(117.5, -42, 5, 16), 16, 1.4, 0) },
    ],
    "services",
    windows(clinic, 0, 16, 3, 6)
  )
  const annex = rect(140, -46, 14, 20)
  add(
    147,
    -36,
    [{ paths: box(annex, 0, 8) }],
    "services",
    windows(annex, 0, 8, 1, 2)
  )
  person(152, -18, "services")
}

/* ── Services, front-left: a market and a delivery truck ── */
{
  ;[
    [-150, 40],
    [-128, 40],
    [-150, 62],
    [-128, 62],
  ].forEach(([sx, sy]) => {
    const parts: Thing["parts"] = [
      { paths: box(rect(sx - 7, sy - 5, 14, 10), 0, 5) },
      { paths: box(rect(sx - 5, sy - 3, 4, 3, 0.6), 5, 2.4) },
      { paths: disc(sx + 3, sy + 1, 1.5, 5, 2) },
    ]
    k.corners(rect(sx - 8, sy - 6, 16, 12), 1)
      .sort((a, b) => depth(...a) - depth(...b))
      .forEach(([px, py]) => parts.push({ paths: disc(px, py, 0.45, 0, 11) }))
    parts.push({ paths: box(rect(sx - 9, sy - 7, 18, 14), 11, 1.2) })
    add(sx, sy, parts, "services")
  })
  ;[
    [-160, 82],
    [-140, 88],
    [-118, 76],
    [-104, 52],
  ].forEach(([x, y]) => person(x, y, "services"))
  // The delivery truck on the avenue: cargo box, cab, chassis.
  add(
    -100,
    3,
    [
      { paths: box(rect(-122, -2, 36, 10), 1.5, 1.5, 0) },
      { paths: box(rect(-121, -2, 24, 10, 0.6), 3, 12) },
      { paths: box(rect(-96, -1.5, 9, 9, 1.2), 3, 8) },
    ],
    "services"
  )
}

/* ── Housing, front-centre ── */
{
  ;[
    [-40, 34, 14, 10],
    [-20, 30, 12, 16],
    [0, 36, 14, 8],
    [-38, 62, 12, 12],
    [-14, 66, 16, 9],
    [14, 60, 12, 14],
    [40, 34, 16, 22],
    [44, 72, 14, 10],
  ].forEach(([x, y, s, h]) => {
    const plan = rect(x - s / 2, y - s / 2, s, s)
    add(
      x,
      y,
      [
        { paths: box(plan, 0, h) },
        { paths: box(k.insetPlan(plan, 1.4), h, 1.2, 0) },
      ],
      undefined,
      windows(plan, 0, h, Math.max(1, Math.round(h / 7)), 2)
    )
  })
  person(-4, 86)
  person(24, 90)
}

/* ── Services, front-right: a pharmacy and a payment agent ── */
{
  const shop = rect(96, 52, 34, 24)
  add(
    113,
    64,
    [{ paths: box(shop, 0, 11) }, { paths: box(rect(94, 74, 38, 5), 8, 1, 0) }],
    "services",
    windows(shop, 0, 11, 1, 4)
  )
  add(
    150,
    70,
    [
      { paths: box(rect(144, 64, 12, 12, 1), 0, 7) },
      { paths: box(rect(142, 62, 16, 16, 1), 7, 1.2) },
    ],
    "services"
  )
  person(150, 86, "services")
  person(140, 92, "services")
}

/** Everything on the deck, back to front. */
export const THINGS = things.sort((a, b) => a.depth - b.depth)

/* ── The deck, its lots, the road and the data links ── */
export const DECK_ART = {
  halo: k.haloOf(UNDER, -22, 8, P),
  /** The dithered shadow, cast toward the viewer: widest (sparsest) first. */
  shadow: [18, 10, 3].map((grow) =>
    k.planOutline(
      {
        ...UNDER,
        x: UNDER.x + 6,
        y: UNDER.y + 6,
        w: UNDER.w + grow,
        d: UNDER.d + grow,
        r: UNDER.r + grow / 2,
      },
      -22,
      P
    )
  ),
  under: deckBox(UNDER, -22, 8, 1),
  deck: deckBox(DECK, -10, 10, 1.2),
  lip: k.planOutline(k.insetPlan(DECK, 5), 0, P),
  screws: k.pointsAt(
    k.corners(DECK, 9).map(([x, y]) => [x, y, 0] as Point3),
    P
  ),
}

export const LOT_ART = LOTS.map(({ zone, plan }, index) => ({
  key: index,
  zone,
  d: k.planOutline(plan, 0, P),
}))

export const ROAD_ART = {
  kerbs: [
    k.lineOnTop(
      [DECK.x + 6, ROAD_Y[0]],
      [DECK.x + DECK.w - 6, ROAD_Y[0]],
      0,
      P
    ),
    k.lineOnTop(
      [DECK.x + 6, ROAD_Y[1]],
      [DECK.x + DECK.w - 6, ROAD_Y[1]],
      0,
      P
    ),
    k.lineOnTop(
      [ROAD_X[0], DECK.y + 6],
      [ROAD_X[0], DECK.y + DECK.d - 6],
      0,
      P
    ),
    k.lineOnTop(
      [ROAD_X[1], DECK.y + 6],
      [ROAD_X[1], DECK.y + DECK.d - 6],
      0,
      P
    ),
  ].join(""),
  centre: [
    k.lineOnTop([DECK.x + 10, 3], [DECK.x + DECK.w - 10, 3], 0, P),
    k.lineOnTop([75, DECK.y + 10], [75, DECK.y + DECK.d - 10], 0, P),
  ].join(""),
}

/*
 * Data links: identity to records, records to each service, laid on the deck
 * as right-angled runs between the lots. Each belongs to the stage it carries.
 */
const run = (points: Plane[]) => k.onTop(points, 0.2, P)
export const LINK_ART: { zone: Zone; d: string }[] = [
  {
    zone: "identity",
    d: run([
      [-64, -60],
      [-46, -60],
    ]),
  },
  {
    zone: "records",
    d: run([
      [12, -38],
      [12, -14],
      [-40, -14],
      [-40, 18],
    ]),
  },
  {
    zone: "services",
    d: run([
      [70, -70],
      [84, -70],
    ]),
  },
  {
    zone: "services",
    d: run([
      [30, -38],
      [30, -24],
      [-122, -24],
      [-122, 22],
    ]),
  },
  {
    zone: "services",
    d: run([
      [50, -38],
      [50, 30],
      [84, 30],
      [84, 60],
    ]),
  },
]
export const LINK_NODES = k.pointsAt(
  (
    [
      [-64, -60],
      [-46, -60],
      [12, -38],
      [-40, 18],
      [70, -70],
      [84, -70],
      [30, -38],
      [-122, 22],
      [50, -38],
      [84, 60],
    ] as Plane[]
  ).map(([x, y]) => [x, y, 0.2] as Point3),
  P
)

/*
 * Where each stage's callout card points, as a fraction of the drawing, so
 * the HTML card can be placed over the SVG at any width.
 */
const pct = ([x, y]: Flat) => ({
  left: `${((x / WIDTH) * 100).toFixed(2)}%`,
  top: `${((y / HEIGHT) * 100).toFixed(2)}%`,
})
export const ANCHORS: Record<Zone, { left: string; top: string }> = {
  identity: pct(at([-127, -96, 24])),
  records: pct(at([49, -96, 24])),
  services: pct(at([114, -100, 26])),
}
