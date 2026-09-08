/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { FOUNDED, stats } from "@/components/landing/content"
import { VariantSwitch } from "@/components/variants/variant-switch"

/* Geometry shared by every mark — see the HeroMark comment for provenance. */
const CAPSULE_PATH = "M88.3209 593.756L837.821 148.756"
const CAPSULE_STROKE = 346
/* The stroke's own viewBox, and the composition box the marks are drawn in. */
const STROKE_BOX = { w: 926.142, h: 742.512 }
const BLOB_A_FROM = {
  "--blob-from-x": "-108.75%",
  "--blob-from-y": "64.57%",
} as React.CSSProperties
const BLOB_B_FROM = {
  "--blob-from-x": "108.75%",
  "--blob-from-y": "-64.57%",
} as React.CSSProperties
const blobA =
  "softcom-hero-blob absolute top-0 left-[68.504%] h-[43.642%] w-[31.497%]"
const blobB =
  "softcom-hero-blob absolute top-[56.357%] left-0 h-[43.642%] w-[31.497%]"
const capsuleSvg = "absolute top-[2.982%] left-[7.674%] h-[94.035%] w-[84.649%]"

/*
 * Deterministic pseudo-random, integer-only (Math.imul is exact 32-bit), so
 * server and client generate byte-identical markup — a transcendental hash
 * risks a hydration mismatch across engines.
 */
function rand(i: number, salt: number) {
  const x = Math.imul(i + salt * 7919 + 1, 1664525) + 1013904223
  return ((x >>> 8) % 100000) / 100000
}

function CapsuleGradient({ id }: { id: string }) {
  return (
    <linearGradient
      id={id}
      x1="74.8753"
      y1="396.543"
      x2="817.194"
      y2="396.543"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#004BFF" />
      <stop offset="1" stopColor="#00FFFF" />
    </linearGradient>
  )
}

/**
 * The brand mark: a 346px-thick gradient-stroked line with a solid circle at
 * each end, matching the stroke width so the pair reads as one capsule.
 *
 * Figma expresses this through nested flip+rotate wrappers that cancel out, so
 * rather than transplant that transform stack we rebuild the composition from
 * the exported path's own coordinates. Percentages are derived from the tight
 * bounding box of stroke + circles (1094.1 x 789.61), which was verified
 * against a full-resolution render of node 210:41.
 */
function HeroMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative aspect-[1094.1/789.61]", className)}
    >
      {/*
       * Exported from Figma as `Vector 2`, inlined verbatim so the draw-on can
       * animate `stroke-dasharray`. The viewBox is the stroke's bounding box,
       * hence the offset from the composition's origin.
       */}
      <svg
        className={capsuleSvg}
        viewBox={`0 0 ${STROKE_BOX.w} ${STROKE_BOX.h}`}
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <CapsuleGradient id="softcom-hero-gradient" />
        </defs>
        <path
          className="softcom-hero-capsule"
          d={CAPSULE_PATH}
          pathLength="1"
          stroke="url(#softcom-hero-gradient)"
          strokeWidth={CAPSULE_STROKE}
        />
      </svg>

      {/*
       * Both circles start overlapped at the line's midpoint and separate to its
       * endpoints. Offsets are expressed relative to each circle's own size so
       * they hold at every breakpoint.
       */}
      <img
        src="/brand/hero-blob-a.svg"
        alt=""
        className={blobA}
        style={BLOB_A_FROM}
      />
      <img
        src="/brand/hero-blob-b.svg"
        alt=""
        className={blobB}
        style={BLOB_B_FROM}
      />
    </div>
  )
}

/* ── Variant `convergence` ──────────────────────────────────────────────── */

const FIELD = { w: 1094.1, h: 789.61 }
const FIELD_CENTRE = { x: FIELD.w / 2, y: FIELD.h / 2 }
const RAY_COUNT = 56
/* Just past the box's half-height, so the longest rays graze the edge rather than being cut mid-run. */
const RAY_MAX = 430

/*
 * A radial field: every ray runs out from one point. The brand reading is the
 * conduit's, restated — many institutions, one piece of infrastructure they
 * all route through. Angles are evenly spaced with a bounded jitter so the
 * field reads as surveyed rather than mechanical.
 */
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => {
  const step = (Math.PI * 2) / RAY_COUNT
  const angle = i * step + (rand(i, 1) - 0.5) * step * 0.9
  const length = RAY_MAX * (0.42 + rand(i, 2) * 0.58)
  return {
    x2: FIELD_CENTRE.x + Math.cos(angle) * length,
    y2: FIELD_CENTRE.y + Math.sin(angle) * length,
    /* Squares on the long rays, dots on the short ones — two weights of node. */
    node: rand(i, 3) > 0.55 ? 3 + rand(i, 4) * 6 : 0,
    dot: 1.6 + rand(i, 5) * 2.6,
    /* Delay sweeps around the field rather than firing all at once. */
    delay: (i / RAY_COUNT) * 0.55,
  }
})

function HeroMarkConvergence({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${FIELD.w} ${FIELD.h}`}
      className={cn("block w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="softcom-hero-field-gradient"
          cx={FIELD_CENTRE.x}
          cy={FIELD_CENTRE.y}
          r={RAY_MAX}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFFF" />
          <stop offset="0.55" stopColor="#0B6BFF" />
          <stop offset="1" stopColor="#004BFF" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* One slow rotation carries the whole field, so the rays never desync. */}
      <g
        className="softcom-hero-field"
        style={{ transformBox: "view-box", transformOrigin: "center" }}
      >
        {RAYS.map((ray, i) => (
          <g key={i} stroke="url(#softcom-hero-field-gradient)">
            <line
              className="softcom-hero-ray"
              x1={FIELD_CENTRE.x}
              y1={FIELD_CENTRE.y}
              x2={ray.x2}
              y2={ray.y2}
              pathLength="1"
              strokeWidth="1.15"
              style={{ animationDelay: `${ray.delay}s` }}
            />
            {ray.node > 0 ? (
              <rect
                className="softcom-hero-node"
                x={ray.x2 - ray.node / 2}
                y={ray.y2 - ray.node / 2}
                width={ray.node}
                height={ray.node}
                fill="url(#softcom-hero-field-gradient)"
                stroke="none"
                style={{ animationDelay: `${0.35 + ray.delay}s` }}
              />
            ) : (
              <circle
                className="softcom-hero-node"
                cx={ray.x2}
                cy={ray.y2}
                r={ray.dot}
                fill="url(#softcom-hero-field-gradient)"
                stroke="none"
                style={{ animationDelay: `${0.35 + ray.delay}s` }}
              />
            )}
          </g>
        ))}
      </g>

      {/* The convergence point itself: the brand dot, at full strength. */}
      <circle
        className="softcom-hero-core"
        cx={FIELD_CENTRE.x}
        cy={FIELD_CENTRE.y}
        r="9"
        fill="#00FFFF"
      />
    </svg>
  )
}

/* ── Variant `matrix` ───────────────────────────────────────────────────── */

const MX = { cols: 36, rows: 26 }
const BANDS = 12
/* The capsule as a segment + radius, so coverage is analytic — no asset, no sampling. */
const SEG = {
  ax: 88.32,
  ay: 593.76,
  bx: 837.82,
  by: 148.76,
  r: CAPSULE_STROKE / 2,
}

/**
 * Distance from the capsule's centre line, in the stroke's own units.
 * Standard point-to-segment: project onto AB, clamp to the segment, measure.
 */
function capsuleDistance(px: number, py: number) {
  const dx = SEG.bx - SEG.ax
  const dy = SEG.by - SEG.ay
  const len2 = dx * dx + dy * dy
  const t = Math.max(
    0,
    Math.min(1, ((px - SEG.ax) * dx + (py - SEG.ay) * dy) / len2)
  )
  const cx = SEG.ax + t * dx
  const cy = SEG.ay + t * dy
  return { d: Math.hypot(px - cx, py - cy), t }
}

/*
 * The mark rendered as the same dot matrix the sector cards use: a uniform
 * grid where dot size carries the shape. It makes the hero and the sector
 * marks one system rather than two unrelated devices.
 */
const MX_CELLS = Array.from({ length: MX.cols * MX.rows }, (_, i) => {
  const col = i % MX.cols
  const row = Math.floor(i / MX.cols)
  const px = ((col + 0.5) / MX.cols) * STROKE_BOX.w
  const py = ((row + 0.5) / MX.rows) * STROKE_BOX.h
  const { d, t } = capsuleDistance(px, py)
  /* A soft 130-unit band at the edge, so the capsule has a halftone falloff. */
  const cover = Math.max(0, Math.min(1, (SEG.r + 30 - d) / 130))
  return {
    cx: px,
    cy: py,
    r: 3 + cover * 11,
    inside: cover > 0.02,
    /* Banded by position along the capsule: the shape resolves end to end. */
    band: Math.min(BANDS - 1, Math.floor(t * BANDS)),
  }
})

function HeroMarkMatrix({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative aspect-[1094.1/789.61]", className)}
    >
      <svg
        className={capsuleSvg}
        viewBox={`0 0 ${STROKE_BOX.w} ${STROKE_BOX.h}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <CapsuleGradient id="softcom-hero-gradient-matrix" />
        </defs>

        {/* The field the shape sits in — uniform, quiet, no animation. */}
        <g fill="currentColor" className="text-foreground/12">
          {MX_CELLS.filter((c) => !c.inside).map((c, i) => (
            <circle key={i} cx={c.cx} cy={c.cy} r="3" />
          ))}
        </g>

        {/*
         * One group per band rather than a delay per dot: 12 style attributes
         * instead of ~900, same staggered resolve.
         */}
        {Array.from({ length: BANDS }, (_, band) => (
          <g
            key={band}
            className="softcom-hero-band"
            fill="url(#softcom-hero-gradient-matrix)"
            style={{ animationDelay: `${band * 0.075}s` }}
          >
            {MX_CELLS.filter((c) => c.inside && c.band === band).map((c, i) => (
              <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
            ))}
          </g>
        ))}
      </svg>

      {/* The two brand circles still anchor the ends, as in the original mark. */}
      <img
        src="/brand/hero-blob-a.svg"
        alt=""
        className={blobA}
        style={BLOB_A_FROM}
      />
      <img
        src="/brand/hero-blob-b.svg"
        alt=""
        className={blobB}
        style={BLOB_B_FROM}
      />
    </div>
  )
}

/* ── Compositions ───────────────────────────────────────────────────────── */

/**
 * The split composition. On desktop it is a fixed-aspect box (1440 × 1024, the
 * Figma frame) that *scales to fit the fold*: its width is the smaller of the
 * page and what the viewport height allows once the sub-hero is reserved, so
 * hero + sub-hero always share the first screen and the internal percentages
 * hold at every size. Nothing inside is a pixel.
 */
function HeroSplit({ mark }: { mark: React.ReactNode }) {
  return (
    <section
      className={cn(
        "relative -mt-6 flex w-full flex-col gap-10 overflow-clip px-6 pt-10 pb-16",
        "lg:@container lg:mx-auto lg:-mt-[200px] lg:block lg:aspect-[1440/1024] lg:h-auto lg:p-0",
        "lg:w-[min(100%,calc((100svh-var(--hero-fold-reserve))*1440/1024))]"
      )}
      /* Header + gap + sub-hero (net of the header overlap), so both sit in the first viewport. */
      style={{ "--hero-fold-reserve": "13rem" } as React.CSSProperties}
    >
      {/* 64px at the 1440 frame = 4.444cqw: the type scales with the box, so it can't clip. */}
      <h1
        className={cn(
          displayText,
          "order-1 text-foreground",
          "lg:absolute lg:top-[19.629%] lg:left-[10.069%] lg:z-10 lg:w-[37.153%] lg:text-[4.444cqw]"
        )}
      >
        Technology for Organisations.
      </h1>

      <p
        className={cn(
          displayText,
          "order-3 self-end text-right text-foreground",
          "lg:absolute lg:top-[77.637%] lg:left-[61.944%] lg:z-10 lg:w-[28.958%] lg:text-left lg:text-[4.444cqw]"
        )}
      >
        Progress for Society.
      </p>

      {mark}
    </section>
  )
}

/**
 * Variant `ledger`: no illustration at all. A mono masthead, the statement in
 * two weights, a faint drafting ground, and the proof numbers pulled up into
 * the fold — which is the client's "depict scale and two decades" note
 * answered with facts instead of a photograph.
 */
function HeroLedger() {
  return (
    <section
      className={cn(
        "softcom-hero-ledger relative -mt-6 flex w-full flex-col justify-between gap-16 overflow-clip px-6 pt-10 pb-6",
        "lg:mx-auto lg:-mt-[200px] lg:min-h-[calc(100svh-13rem)] lg:gap-24 lg:pt-[16svh]"
      )}
    >
      <div className="relative flex flex-col gap-8 lg:gap-12">
        <p className="font-mono text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase">
          Softcom — Est. {FOUNDED} — Lagos, Nigeria
        </p>

        {/*
         * One statement, two registers: the claim in foreground, its
         * consequence a step back, so the pair reads as a single sentence
         * rather than two competing headlines.
         */}
        <h1
          className={cn(
            displayText,
            "max-w-[19ch] text-balance text-foreground lg:text-[min(7.5rem,8.4vw)] lg:leading-[0.94]"
          )}
        >
          Technology for Organisations.{" "}
          <span className="text-muted-foreground">Progress for Society.</span>
        </h1>
      </div>

      <dl className="relative grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5">
            <dd className="font-heading text-3xl leading-none text-foreground lg:text-5xl">
              {stat.value}
            </dd>
            <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-muted-foreground uppercase">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

const markClass = cn(
  "order-2 w-full",
  "lg:absolute lg:top-[15.527%] lg:left-[11.667%] lg:w-[75%]"
)

/* The radial field is centred on the whole composition, not the capsule's slot. */
const fieldClass = cn("order-2 w-full", "lg:absolute lg:inset-0 lg:h-full")

function Hero() {
  return (
    <VariantSwitch
      variant="hero"
      cases={{
        conduit: <HeroSplit mark={<HeroMark className={markClass} />} />,
        convergence: (
          <HeroSplit mark={<HeroMarkConvergence className={fieldClass} />} />
        ),
        matrix: <HeroSplit mark={<HeroMarkMatrix className={markClass} />} />,
        ledger: <HeroLedger />,
      }}
    />
  )
}

export { Hero, HeroMark }
