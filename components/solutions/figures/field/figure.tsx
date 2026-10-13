/*
 * Powering Initiatives · an initiative in the field.
 *
 * One deck, five working areas, composed by hand: a training hall with a
 * class seated in its courtyard, a field team enrolling people under a tent
 * with tablets, a deployment truck unloading kit, a payment point with its
 * queue, and the results office that every area reports into. Data links run
 * from each area to the office; the payment point is lit in the dither weave,
 * where the initiative reaches its participants.
 */
import { lineScene, type Part } from "@/components/iso/line-kit"
import { LineFigurePanel, LineScene } from "@/components/iso/line-scene"

const s = lineScene({
  width: 720,
  height: 520,
  floor: { x: -170, y: -120, w: 340, d: 240, r: 14 },
})
const { rect, box, disc, add, person, stack, link, lot, tag, windows } = s

type XY = [number, number]
const byDepth = (points: XY[]) =>
  [...points].sort((a, b) => s.depth(...a) - s.depth(...b))

/** Four posts and a flat roof over a plan. */
function canopy(x: number, y: number, w: number, d: number, h: number) {
  const parts: Part[] = byDepth([
    [x + 1.5, y + 1.5],
    [x + w - 1.5, y + 1.5],
    [x + 1.5, y + d - 1.5],
    [x + w - 1.5, y + d - 1.5],
  ]).map(([px, py]) => ({ paths: disc(px, py, 0.6, 0, h) }))
  parts.push({ paths: box(rect(x - 1, y - 1, w + 2, d + 2), h, 1.2) })
  add(x + w, y + d, parts)
}

/* ── Training: the hall, and a class in its courtyard ── */
lot(rect(-160, -110, 104, 112, 8))
{
  const hall = rect(-152, -102, 56, 40)
  add(
    -124,
    -82,
    [
      { paths: box(hall, 0, 16) },
      { paths: box(rect(-154, -104, 60, 44), 16, 1.4) },
      { paths: box(rect(-146, -98, 20, 14), 17.4, 3) },
    ],
    { lines: windows(hall, 0, 16, 2, 7) }
  )
  // The instructor's board, facing the class.
  add(-80, -54, [{ paths: box(rect(-84, -62, 3, 16), 0, 14) }])
  // The class: three rows on benches.
  for (let r = 0; r < 3; r++) {
    // Each bench sorts at its back corner, so its sitters draw over it.
    add(-142, -46 + r * 17, [
      { paths: box(rect(-142, -46 + r * 17, 36, 4), 0, 2.6) },
    ])
    for (let c = 0; c < 3; c++) person(-136 + c * 12, -39 + r * 17)
  }
  person(-90, -52)
}

/* ── Results: the office every area reports into ── */
lot(rect(-40, -110, 104, 64, 8))
{
  const office = rect(-30, -102, 46, 40)
  add(
    -7,
    -82,
    [
      { paths: box(office, 0, 22) },
      { paths: box(rect(-32, -104, 50, 44), 22, 1.4) },
      { paths: disc(-20, -94, 0.6, 23.4, 14) },
      { paths: disc(-20, -94, 3.4, 30, 0.8) },
    ],
    { lines: windows(office, 0, 22, 4, 6) }
  )
  const stores: Part[] = [{ paths: box(rect(26, -98, 30, 30, 4), 0, 2.4) }]
  ;[0, 1, 2].forEach((i) =>
    stores.push({ paths: s.disc(41, -83, 9, 2.4 + i * 4, 3.4), lit: i === 2 })
  )
  add(41, -83, stores)
}

/* ── Deployment: a truck unloading kit ── */
lot(rect(76, -110, 84, 120, 8))
{
  add(118, -64, [
    { paths: box(rect(88, -100, 44, 18), 1.5, 1.5, 0) },
    { paths: box(rect(89, -100, 30, 18, 0.6), 3, 14) },
    { paths: box(rect(120, -99, 12, 16, 1.4), 3, 10) },
  ])
  ;[
    [96, -64, 3],
    [110, -66, 2],
    [100, -46, 2],
    [124, -52, 1],
  ].forEach(([x, y, n]) => {
    const crates: Part[] = []
    for (let i = 0; i < n; i++)
      crates.push({ paths: box(rect(x - 5, y - 5, 10, 10), i * 5, 5) })
    add(x, y, crates)
  })
  person(138, -40)
  person(116, -26)
  stack(146, -16, 9, 12, 3)
}

/* ── Enrolment: a field team with tablets under a tent ── */
lot(rect(-160, 16, 104, 94, 8))
{
  canopy(-150, 22, 46, 34, 13)
  add(-127, 36, [
    { paths: box(rect(-144, 30, 34, 9), 0, 5) },
    { paths: box(rect(-138, 32, 6, 4, 0.4), 5, 0.5), lit: true },
    { paths: box(rect(-124, 32, 6, 4, 0.4), 5, 0.5) },
  ])
  person(-136, 26)
  person(-120, 26)
  // The queue to enrol.
  ;[
    [-130, 48],
    [-128, 60],
    [-124, 72],
    [-118, 84],
    [-110, 96],
  ].forEach(([x, y]) => person(x, y))
  // An agent enrolling a household on foot.
  person(-82, 70)
  person(-74, 82)
  add(-80, 74, [{ paths: box(rect(-82, 72, 4, 5, 0.3), 5.4, 0.5) }])
}

/* ── Payments: the payment point and its queue (lit) ── */
lot(rect(-30, 34, 140, 76, 8), { on: true })
{
  const point = rect(60, 40, 36, 26)
  add(
    78,
    53,
    [
      { paths: box(point, 0, 12) },
      { paths: box(rect(58, 38, 40, 30), 12, 1.4) },
      { paths: box(rect(58, 66, 40, 5), 8, 1, 0) },
    ],
    { lines: windows(point, 0, 12, 1, 4) }
  )
  add(102, 76, [
    { paths: box(rect(98, 72, 8, 8, 1), 0, 13) },
    { paths: box(rect(99, 78, 6, 2, 0.4), 13, 0.5) },
  ])
  ;[
    [74, 78],
    [62, 84],
    [48, 88],
    [34, 90],
    [20, 92],
    [6, 92],
  ].forEach(([x, y]) => person(x, y))
  person(-14, 52)
  person(-6, 62)
  stack(-18, 80, 9, 12, 3)
}

/* A local shop beside the payment point, where the payment is spent. */
lot(rect(118, 34, 42, 76, 8))
{
  const shop = rect(124, 44, 28, 30)
  add(
    138,
    59,
    [
      { paths: box(shop, 0, 11) },
      { paths: box(rect(124, 74, 30, 5), 8, 1, 0) },
    ],
    { lines: windows(shop, 0, 11, 1, 3) }
  )
  person(142, 94)
}

/* Every area reports to the results office. */
link([
  [-56, -60],
  [-40, -60],
])
link([
  [64, -76],
  [76, -76],
])
link(
  [
    [-108, 2],
    [-108, 8],
    [-50, 8],
    [-50, -46],
  ],
  { ends: true }
)
link([
  [30, 30],
  [30, -46],
])

tag("Training", -124, -82, 26)
tag("Results", -7, -82, 34)
tag("Deployment", 112, -78, 26)
tag("Enrolment", -127, 36, 22)
tag("Payments", 78, 53, 22, { on: true })

const SCENE = s.build(
  "An initiative in the field on one deck: a training hall with a class seated outside, a field team enrolling a queue of people with tablets under a tent, a truck unloading crates of kit, a payment point with a line of participants, and a results office with data stores that every area reports into."
)

/** Powering Initiatives: the parts of an initiative, working on one deck. */
export function FieldFigure({ fig }: { fig?: string }) {
  return (
    <LineFigurePanel fig={fig} title="An initiative in the field">
      <LineScene scene={SCENE} />
    </LineFigurePanel>
  )
}
