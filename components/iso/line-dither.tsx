import * as React from "react"

/*
 * The site's dither for the line figures, kept to two jobs: the lit district
 * resolves in the hero's ordered weave rather than a flat wash, and the deck
 * casts a dithered shadow rather than a blur. Everything else stays line.
 *
 * The patterns are Bayer 4×4 thresholds, so a denser step contains every dot
 * of the sparser ones: stacking steps reads as one weave filling in, exactly
 * how the hero and page transition resolve (lib/dither.ts).
 *
 * Mounted once per page, in an SVG that takes no space: a pattern inside a
 * hidden figure (the rail renders its cards twice) would leave every other
 * reference to it blank.
 */

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

const CELL = 2.8
const DOT = 1.8

function Pattern({
  id,
  from,
  to,
  color,
}: {
  id: string
  /** The weave's threshold band this step adds, 0–1. */
  from: number
  to: number
  color: string
}) {
  const dots: React.ReactNode[] = []
  BAYER4.forEach((row, y) =>
    row.forEach((t, x) => {
      const threshold = (t + 0.5) / 16
      if (threshold < from || threshold >= to) return
      dots.push(
        <rect
          key={`${x}-${y}`}
          x={x * CELL + (CELL - DOT) / 2}
          y={y * CELL + (CELL - DOT) / 2}
          width={DOT}
          height={DOT}
          style={{ fill: color }}
        />
      )
    })
  )
  return (
    <pattern
      id={id}
      width={CELL * 4}
      height={CELL * 4}
      patternUnits="userSpaceOnUse"
    >
      {dots}
    </pattern>
  )
}

/** Steps of the lit weave, and of the shadow's falloff, sparsest first. */
export const LIT_STEPS = [
  [0, 0.13],
  [0.13, 0.26],
  [0.26, 0.44],
] as const
export const SHADOW_STEPS = [
  [0, 0.13],
  [0.13, 0.26],
  [0.26, 0.4],
] as const

export function LineDitherDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {LIT_STEPS.map(([from, to], index) => (
          <Pattern
            key={`lit-${index}`}
            id={`ld-lit-${index}`}
            from={from}
            to={to}
            color="var(--line-dither, #00ffff)"
          />
        ))}
        {SHADOW_STEPS.map(([from, to], index) => (
          <Pattern
            key={`shadow-${index}`}
            id={`ld-shadow-${index}`}
            from={from}
            to={to}
            color="var(--line-shadow, #004bff)"
          />
        ))}
      </defs>
    </svg>
  )
}
