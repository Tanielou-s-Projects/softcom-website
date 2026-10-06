import type { SVGProps } from "react"

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
              style={{
                animationDelay: `${row * 70 + Math.abs(11 - x) * 10}ms`,
              }}
            />
          ))
        )
      ) : (
        <path d="M13 12h6v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h6V4h2v8Z" />
      )}
    </svg>
  )
}
