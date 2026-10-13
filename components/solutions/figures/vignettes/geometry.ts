/*
 * Small line vignettes for the Applied Intelligence rail: one per kind of
 * intelligence, each the subject itself on a square tile, in the same fine
 * isometric line as the city block. Static, computed once on the server.
 */
import * as k from "@/components/iso/iso-kit"
import type {
  Flat,
  Plan,
  Point3,
  Projection,
  SolidPaths,
} from "@/components/iso/iso-kit"

export const WIDTH = 320
export const HEIGHT = 240

const TILE: Plan = { x: -60, y: -60, w: 120, d: 120, r: 8 }

const P: Projection = k.fitProjection(
  [...k.boxCorners(TILE, -6, 52)],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: 45, elevation: 30 }
)

const depth = (x: number, y: number) => k.depthOf([x, y, 0], P)
const rect = (x: number, y: number, w: number, d: number, r = 0): Plan => ({
  x,
  y,
  w,
  d,
  r,
})
const box = (plan: Plan, z: number, h: number, bevel = 0.4): SolidPaths =>
  k.slabOf(plan, z, h, P, plan.r ? 5 : 0, bevel)
const disc = (x: number, y: number, r: number, z: number, h: number) =>
  k.cylinder(x, y, r, z, h, P, 32)

export type Part = { paths: SolidPaths; lit?: boolean }
export type Item = { parts: Part[]; lines?: string; depth: number }
export type Vignette = {
  tile: SolidPaths
  halo: string
  shadow: string[]
  ground: string
  dots: Flat[]
  items: Item[]
}

function vignette(
  build: (
    add: (x: number, y: number, parts: Part[], lines?: string) => void
  ) => {
    ground?: string
    dots?: Point3[]
  }
): Vignette {
  const items: Item[] = []
  const extra = build((x, y, parts, lines) =>
    items.push({ parts, lines, depth: depth(x, y) })
  )
  return {
    tile: box(TILE, -6, 6, 1),
    halo: k.haloOf(TILE, -6, 6, P),
    shadow: [12, 7, 2].map((grow) =>
      k.planOutline(
        {
          ...TILE,
          x: TILE.x + 4,
          y: TILE.y + 4,
          w: TILE.w + grow,
          d: TILE.d + grow,
          r: TILE.r + grow / 2,
        },
        -6,
        P
      )
    ),
    ground: [
      k.planOutline(k.insetPlan(TILE, 5), 0, P),
      extra.ground ?? "",
    ].join(""),
    dots: k.pointsAt(extra.dots ?? [], P),
    items: items.sort((a, b) => a.depth - b.depth),
  }
}

const person = (x: number, y: number): Part[] => [
  { paths: disc(x, y, 2.4, 0, 7) },
  { paths: disc(x, y, 1.8, 8, 3.4) },
]

/** Ledgers stacked on a review desk, one open, a checklist board beside. */
export const AUDIT = vignette((add) => {
  add(-12, -8, [
    { paths: box(rect(-40, -30, 56, 40), 0, 14) },
    { paths: box(rect(-42, -32, 60, 44), 14, 2) },
  ])
  ;[
    [-32, -24, 4],
    [-18, -22, 6],
  ].forEach(([x, y, n]) => {
    const parts: Part[] = []
    for (let i = 0; i < n; i++)
      parts.push({
        paths: box(rect(x - 5, y - 7, 11, 15, 0.6), 16 + i * 2.6, 2.2, 0),
      })
    add(x, y, parts)
  })
  add(0, -10, [
    { paths: box(rect(-6, -18, 16, 20, 0.6), 16, 1.2, 0), lit: true },
  ])
  add(
    30,
    20,
    [
      { paths: box(rect(26, 6, 4, 30), 0, 34) },
      { paths: box(rect(30, 6, 1, 30), 34 - 26, 26, 0) },
    ],
    [0, 1, 2, 3]
      .map((i) => k.segment([31, 12, 30 - i * 6], [31, 30, 30 - i * 6], P))
      .join("")
  )
  add(0, 34, person(0, 34))
  return {}
})

/** Accounts as posts on the tile, joined by money flows; one loop lit. */
export const FINANCIAL = vignette((add) => {
  const nodes: [number, number, number][] = [
    [-36, -30, 18],
    [10, -40, 12],
    [38, -6, 22],
    [16, 30, 14],
    [-30, 20, 10],
    [-4, -4, 26],
  ]
  nodes.forEach(([x, y, h], index) =>
    add(x, y, [
      { paths: disc(x, y, 6, 0, 2) },
      { paths: disc(x, y, 3.2, 2, h), lit: index === 5 },
    ])
  )
  const link = (a: number, b: number) =>
    k.lineOnTop([nodes[a][0], nodes[a][1]], [nodes[b][0], nodes[b][1]], 0.2, P)
  return {
    ground: [
      link(0, 5),
      link(5, 1),
      link(1, 2),
      link(2, 3),
      link(3, 5),
      link(4, 5),
      link(4, 0),
    ].join(""),
    dots: nodes.map(([x, y]) => [x, y, 0.2] as Point3),
  }
})

/** Shopfronts along a street, with a bar chart rising beside them. */
export const MARKET = vignette((add) => {
  ;[
    [-44, -36, 12],
    [-28, -36, 16],
    [-12, -36, 10],
  ].forEach(([x, y, h]) =>
    add(x + 6, y + 8, [
      { paths: box(rect(x, y, 14, 16), 0, h) },
      { paths: box(rect(x - 1, y + 16, 16, 4), h - 4, 1, 0) },
    ])
  )
  ;[
    [14, 4, 10],
    [24, 4, 18],
    [34, 4, 26],
    [44, 4, 38],
  ].forEach(([x, y, h], index) =>
    add(x + 3, y + 20, [
      { paths: box(rect(x, y, 7, 32), 0, h), lit: index === 3 },
    ])
  )
  add(-24, 26, person(-24, 26))
  add(-10, 34, person(-10, 34))
  return {
    ground: k.lineOnTop([-54, -14], [8, -14], 0, P),
  }
})

/** A regulator's building with columns, and filing cabinets brought to it. */
export const REGULATORY = vignette((add) => {
  const plinth = rect(-46, -46, 52, 40)
  const parts: Part[] = [
    { paths: box(plinth, 0, 4) },
    { paths: box(rect(-42, -42, 44, 30), 4, 18) },
  ]
  const cols: [number, number][] = []
  for (let i = 0; i < 6; i++)
    cols.push([plinth.x + 4 + i * 8.8, plinth.y + plinth.d - 3])
  cols
    .sort((a, b) => depth(...a) - depth(...b))
    .forEach(([x, y]) => parts.push({ paths: disc(x, y, 1.6, 4, 18) }))
  parts.push({ paths: box(rect(-49, -49, 58, 46), 22, 3) })
  parts.push({ paths: box(rect(-40, -40, 40, 28), 25, 4) })
  add(-20, -26, parts)
  ;[
    [22, 6],
    [36, 6],
    [22, 24],
  ].forEach(([x, y], index) =>
    add(
      x + 5,
      y + 6,
      [{ paths: box(rect(x, y, 11, 12), 0, 22), lit: index === 0 }],
      [0, 1, 2]
        .map((d) =>
          k.segment([x + 11, y + 3, 4 + d * 7], [x + 11, y + 9, 4 + d * 7], P)
        )
        .join("")
    )
  )
  add(-8, 30, person(-8, 30))
  return {}
})

/** Regions as a terrain of blocks at different heights: a society, mapped. */
export const SOCIETAL = vignette((add) => {
  const heights = [
    [6, 12, 4, 18, 8],
    [10, 22, 14, 6, 12],
    [4, 16, 30, 20, 6],
    [8, 6, 18, 10, 14],
    [12, 4, 8, 16, 4],
  ]
  heights.forEach((row, j) =>
    row.forEach((h, i) => {
      const x = -50 + i * 20
      const y = -50 + j * 20
      add(x + 9, y + 9, [
        { paths: box(rect(x, y, 18, 18), 0, h), lit: i === 2 && j === 2 },
      ])
    })
  )
  return {}
})
