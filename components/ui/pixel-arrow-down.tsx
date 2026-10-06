import type { SVGProps } from "react"

import { bayer8, field, lightsAt } from "@/lib/dither"

/** The whole cascade, first pixel to last. */
const CASCADE_MS = 420
const ROWS = 8

/**
 * When a pixel lands: the shared dither order (lib/dither.ts) on the arrow's
 * own 2px grid, so it assembles the way every other dot effect resolves.
 */
function cascadeDelay(x: number, row: number) {
  const col = (x - 1) / 2
  const up = ROWS - 1 - row
  return Math.round(
    lightsAt(field(col, up, up / (ROWS - 1)), bayer8(col, up)) * CASCADE_MS
  )
}

/** Pixelarticons arrow-down; MIT © Gerrit Halfmann.
 * Source: https://github.com/halfmage/pixelarticons/blob/master/svg/arrow-down.svg
 * License: public/licenses/pixelarticons.txt. Use multiples of 24px. */
export function PixelArrowDown({
  cascade = false,
  ...props
}: SVGProps<SVGSVGElement> & { cascade?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {cascade ? (
        // The same silhouette, separated into 2×2 pixels for a staggered reveal.
        [
          [11],
          [11],
          [11],
          [11],
          [5, 7, 9, 11, 13, 15, 17],
          [7, 9, 11, 13, 15],
          [9, 11, 13],
          [11],
        ].flatMap((columns, row) =>
          columns.map((x) => (
            <rect
              key={`${row}-${x}`}
              x={x}
              y={4 + row * 2}
              width="2"
              height="2"
              style={{ animationDelay: `${cascadeDelay(x, row)}ms` }}
            />
          ))
        )
      ) : (
        <path d="M13 12h6v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h6V4h2v8Z" />
      )}
    </svg>
  )
}
