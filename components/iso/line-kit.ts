/*
 * The line-figure kit: everything a Softcom line illustration is built from,
 * bound to one camera. A figure is a deck (or a tile) carrying lots, ground
 * lines, data links and things (solids sorted back to front), plus HTML tags
 * and callout cards laid over the drawing. `line-scene.tsx` renders it.
 *
 * Conventions every figure keeps, so a set reads as one hand:
 * - World units are ~1 px; x and y on the ground, z up. At azimuth 45, +x+y
 *   is toward the viewer, so the faces at x + w and y + d are the seen ones.
 * - Things stand `zScale` taller than their footprints (default 1.5), as the
 *   reference's buildings do; the deck itself is never stretched.
 * - Lit is rare: one or two parts per figure take `lit`, and one lot or link
 *   may be `on` (it fills with the dither weave and takes the accent).
 * - `zone` ties lots, links, things and a callout to a scroll step: a parent
 *   sets `data-focus` to that zone id and the CSS lights it (line.css).
 */
import * as k from "@/components/iso/iso-kit"
import type {
  Flat,
  Plan,
  Plane,
  Point3,
  SolidPaths,
} from "@/components/iso/iso-kit"

export type Part = { paths: SolidPaths; lit?: boolean }
export type Thing = {
  parts: Part[]
  lines?: string
  zone?: string
  on?: boolean
  depth: number
}
export type Lot = { d: string; zone?: string; on?: boolean }
export type Link = { d: string; zone?: string; on?: boolean }
export type GroundLine = {
  d: string
  tone: "lo" | "faint" | "mid"
  dashed?: boolean
}
/** Where an HTML overlay sits, as percentages of the drawing. */
export type Anchor = { left: string; top: string }
export type Tag = { label: string; at: Anchor; on?: boolean; zone?: string }
export type Callout = {
  title: string
  rows: [string, string][]
  zone?: string
  /** Pinned near a corner of the drawing rather than a point in it. */
  corner?: "tl" | "tr" | "bl" | "br"
  at?: Anchor
}

export type Scene = {
  width: number
  height: number
  label: string
  base: { shadow: string[]; slabs: SolidPaths[]; lip: string; screws: Flat[] }
  lots: Lot[]
  ground: GroundLine[]
  links: Link[]
  nodes: Flat[]
  things: Thing[]
  tags: Tag[]
  callouts: Callout[]
}

export function lineScene({
  width,
  height,
  floor,
  layers = 2,
  zScale = 1.5,
  headroom = 54,
  pad = 20,
  azimuth = 45,
  elevation = 30,
}: {
  width: number
  height: number
  /** The top deck's plan. */
  floor: Plan
  /** 1 = a single tile; 2 = a deck on a wider under-layer (default). */
  layers?: 1 | 2
  zScale?: number
  /** World height the camera fits above the deck. */
  headroom?: number
  pad?: number
  azimuth?: number
  elevation?: number
}) {
  const under: Plan =
    layers === 2
      ? {
          x: floor.x - 6,
          y: floor.y - 6,
          w: floor.w + 12,
          d: floor.d + 12,
          r: floor.r + 4,
        }
      : floor
  const bottom = layers === 2 ? -22 : -6
  const P = k.fitProjection(
    [...k.boxCorners(under, bottom, headroom)],
    width,
    height,
    {
      pad,
      azimuth,
      elevation,
    }
  )

  const ZS = zScale
  const at = (point: Point3): Flat => k.iso(point, P)
  const depth = (x: number, y: number) => k.depthOf([x, y, 0], P)
  const rect = (x: number, y: number, w: number, d: number, r = 0): Plan => ({
    x,
    y,
    w,
    d,
    r,
  })
  const box = (plan: Plan, z: number, h: number, bevel = 0.4): SolidPaths =>
    k.slabOf(plan, z * ZS, h * ZS, P, plan.r ? 6 : 0, bevel)
  const disc = (x: number, y: number, r: number, z: number, h: number) =>
    k.cylinder(x, y, r, z * ZS, h * ZS, P, 36)
  /** A segment between world points, z in unscaled units. */
  const seg = (a: Point3, b: Point3) =>
    k.segment([a[0], a[1], a[2] * ZS], [b[0], b[1], b[2] * ZS], P)
  const pct = ([x, y]: Flat): Anchor => ({
    left: `${((x / width) * 100).toFixed(2)}%`,
    top: `${((y / height) * 100).toFixed(2)}%`,
  })
  /** An overlay anchor at a world point (z unscaled). */
  const anchor = (x: number, y: number, z = 0): Anchor =>
    pct(at([x, y, z * ZS]))

  /** Window strokes on a box's two seen faces. */
  function windows(
    plan: Plan,
    z: number,
    h: number,
    rows: number,
    cols: number
  ) {
    const out: string[] = []
    const padW = 2.5
    const colsY = Math.max(1, Math.round(cols * (plan.d / plan.w)))
    for (let row = 0; row < rows; row++) {
      const zz = z + padW + ((h - padW * 2) * (row + 0.5)) / rows
      const spanX = (plan.w - padW * 2) / cols
      const spanY = (plan.d - padW * 2) / colsY
      for (let c = 0; c < cols; c++) {
        const x0 = plan.x + padW + spanX * c + spanX * 0.22
        out.push(
          seg(
            [x0, plan.y + plan.d, zz],
            [x0 + spanX * 0.56, plan.y + plan.d, zz]
          )
        )
      }
      for (let c = 0; c < colsY; c++) {
        const y0 = plan.y + padW + spanY * c + spanY * 0.22
        out.push(
          seg(
            [plan.x + plan.w, y0, zz],
            [plan.x + plan.w, y0 + spanY * 0.56, zz]
          )
        )
      }
    }
    return out.join("")
  }

  /** Rule lines on the top of a slab, like printed rows on a sheet. */
  function rowsOnTop(plan: Plan, z: number, count: number, inset = 2) {
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      const y = plan.y + inset + ((plan.d - inset * 2) * (i + 0.5)) / count
      out.push(
        k.lineOnTop(
          [plan.x + inset, y],
          [plan.x + plan.w - inset * 1.8 - (i % 3) * 2, y],
          z * ZS,
          P
        )
      )
    }
    return out.join("")
  }

  const things: Thing[] = []
  const lots: Lot[] = []
  const links: Link[] = []
  const ground: GroundLine[] = []
  const nodes: Point3[] = []
  const tags: Tag[] = []
  const callouts: Callout[] = []

  type Opts = { zone?: string; on?: boolean; lines?: string }
  const add = (x: number, y: number, parts: Part[], opts: Opts = {}) =>
    things.push({
      parts,
      lines: opts.lines,
      zone: opts.zone,
      on: opts.on,
      depth: depth(x, y),
    })
  const person = (x: number, y: number, opts: Opts = {}) =>
    add(
      x,
      y,
      [
        { paths: disc(x, y, 1.7, 0, 4.8) },
        { paths: disc(x, y, 1.3, 5.4, 2.4) },
      ],
      opts
    )
  const stack = (
    x: number,
    y: number,
    w: number,
    d: number,
    count: number,
    opts: Opts & { litTop?: boolean } = {}
  ) => {
    const parts: Part[] = []
    for (let i = 0; i < count; i++)
      parts.push({
        paths: box(rect(x - w / 2, y - d / 2, w, d, 0.6), i * 1.4, 1.1, 0),
        lit: opts.litTop && i === count - 1,
      })
    add(x, y, parts, opts)
  }
  const lot = (plan: Plan, opts: { zone?: string; on?: boolean } = {}) =>
    lots.push({ d: k.planOutline(plan, 0, P), ...opts })
  const link = (
    points: Plane[],
    opts: { zone?: string; on?: boolean; ends?: boolean } = {}
  ) => {
    links.push({ d: k.onTop(points, 0.2, P), zone: opts.zone, on: opts.on })
    if (opts.ends !== false) {
      nodes.push([...points[0], 0.2])
      nodes.push([...points[points.length - 1], 0.2])
    }
  }
  const line = (
    points: Plane[],
    tone: GroundLine["tone"] = "lo",
    dashed = false
  ) => ground.push({ d: k.onTop(points, 0, P), tone, dashed })
  const tag = (
    label: string,
    x: number,
    y: number,
    z = 0,
    opts: { on?: boolean; zone?: string } = {}
  ) => tags.push({ label, at: anchor(x, y, z), ...opts })
  const callout = (c: Callout) => callouts.push(c)

  function build(label: string): Scene {
    const shadowOf = (grow: number): string =>
      k.planOutline(
        {
          ...under,
          x: under.x + 6,
          y: under.y + 6,
          w: under.w + grow,
          d: under.d + grow,
          r: under.r + grow / 2,
        },
        bottom,
        P
      )
    const slabs =
      layers === 2
        ? [
            k.slabOf(under, -22, 8, P, 6, 1),
            k.slabOf(floor, -10, 10, P, 6, 1.2),
          ]
        : [k.slabOf(floor, -6, 6, P, 6, 1)]
    return {
      width,
      height,
      label,
      base: {
        shadow: [18, 10, 3].map(shadowOf),
        slabs,
        lip: k.planOutline(k.insetPlan(floor, 5), 0, P),
        screws: k.pointsAt(
          k.corners(floor, 9).map(([x, y]) => [x, y, 0] as Point3),
          P
        ),
      },
      lots,
      ground,
      links,
      nodes: k.pointsAt(nodes, P),
      things: [...things].sort((a, b) => a.depth - b.depth),
      tags,
      callouts,
    }
  }

  return {
    P,
    ZS,
    at,
    anchor,
    depth,
    rect,
    box,
    disc,
    seg,
    windows,
    rowsOnTop,
    add,
    person,
    stack,
    lot,
    link,
    line,
    tag,
    callout,
    build,
  }
}
