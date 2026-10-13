import * as React from "react"

/*
 * The site's dither, as SVG fills for the anatomy figures: each face's tone
 * becomes a density of square dots laid in 4×4 ordered (Bayer) order — the
 * same order every dot effect on the site resolves in (lib/dither.ts) —
 * instead of a flat grey. Outlines stay crisp lines over it.
 *
 * Mount once inside a figure's <svg>; `softcom.css` points the kit's fills
 * at these ids under `.softcom-dither`.
 */

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

/** One dot every CELL units, DOT units square. */
const CELL = 2.6
const DOT = 1.7

function Pattern({
  id,
  density,
  color,
}: {
  id: string
  density: number
  color: string
}) {
  const dots: React.ReactNode[] = []
  BAYER4.forEach((row, y) =>
    row.forEach((t, x) => {
      if ((t + 0.5) / 16 >= density) return
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

/** Densities for the four side tones (darkest first), the top and lit. */
export function DitherDefs() {
  return (
    <defs>
      <Pattern id="sd-shade-0" density={0.07} color="var(--dither-ink)" />
      <Pattern id="sd-shade-1" density={0.13} color="var(--dither-ink)" />
      <Pattern id="sd-shade-2" density={0.2} color="var(--dither-ink)" />
      <Pattern id="sd-shade-3" density={0.28} color="var(--dither-ink)" />
      <Pattern id="sd-top" density={0.19} color="var(--dither-top)" />
      <Pattern id="sd-base" density={0.13} color="var(--dither-base)" />
      <Pattern id="sd-lit" density={0.56} color="var(--dither-lit)" />
      <Pattern id="sd-lit-top" density={0.75} color="var(--dither-lit)" />
    </defs>
  )
}
