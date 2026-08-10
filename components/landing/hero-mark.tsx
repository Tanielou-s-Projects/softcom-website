"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Geometry, in the composition's own coordinates (1094.102 x 789.602).
 *
 * Figma nests the mark under flip+rotate wrappers that cancel out, and exports
 * the bar and the two circles as three assets in three coordinate spaces.
 * Rather than transplant that, the composition is rebuilt from the exported
 * path: the bar runs between the two circle centres, and the tight bounding box
 * of a 346-wide butt-capped stroke plus the two r=172.301 circles comes to
 * exactly 1094.102 x 789.602 — which is what node 210:41 renders at.
 */
const BOX = { w: 1094.102, h: 789.602 }
const AXIS = { x1: 172.301, y1: 617.301, x2: 921.801, y2: 172.301 }
const R = 172.301
const STROKE = 346

/** Figma's colour ramp is horizontal rather than axis-aligned. */
const RAMP = { x1: 158.855, x2: 901.174, y: 420.088 }

/*
 * A 4x4 clustered-dot screen: the ramp spirals out from the centre of the cell,
 * so a cell reads as one soft dot rather than as four scattered pixels.
 *
 * Which family this comes from is the whole character of the texture, and it is
 * measurable. Autocorrelating node 210:41 gives +0.44 at a lag of one pixel and
 * +0.50 at four: neighbouring pixels resemble each other, in a figure that
 * turns over every 4px. That is a clustered screen. The obvious first guess, a
 * dispersed Bayer matrix, gives -0.53 instead — it is built to anti-correlate
 * neighbours precisely so the texture disappears, which is the opposite of what
 * is wanted here. It measured correctly on every channel statistic and still
 * read as a flat wash.
 *
 * Nothing is rotated: at this scale a rotation only lands cells off the pixel
 * grid and blurs them back into that same wash.
 */
const SCREEN = [
  [12, 5, 6, 13],
  [4, 0, 1, 7],
  [11, 3, 2, 8],
  [15, 10, 9, 14],
]
const TILE = SCREEN.length

/*
 * How far the screen pushes green, out of 128.
 *
 * Sampling node 210:41 shows the dither only ever moves the green channel: red
 * sits at 0 and blue at 255 across the whole mark, and no background shows
 * through anywhere. It swings green about +/-100 at the blue end and closes to
 * nothing by the cyan end.
 *
 * An `overlay` blend is exactly that shape. It leaves 0 and 255 untouched, so
 * red and blue survive it and the texture dissolves on its own as the ramp
 * warms — no second gradient to keep in sync. 128 is its neutral point, hence
 * the grey, and the matrix is symmetric about it so the mark keeps its mean.
 */
const AMP = 100
const step = (v: number) =>
  `rgb(128, ${128 + Math.round(AMP * ((2 * (v + 0.5)) / TILE ** 2 - 1))}, 128)`

/**
 * Composition units per rendered CSS pixel.
 *
 * A dither only survives at one scale: its own. The mark is responsive, so its
 * user units land on fractions of a pixel — at the hero's own size, 1094.102
 * units across 1080px — and a cell that straddles two pixels gets averaged with
 * its neighbours until the matrix is a flat wash. Measuring lets each cell be
 * exactly one pixel wide whatever the mark is scaled to.
 *
 * Deliberately CSS pixels rather than device pixels: the design's own export is
 * 1x, and matching it is what keeps the grain the size it was drawn at.
 */
function useUnitScale(ref: React.RefObject<SVGSVGElement | null>) {
  // 1 is the desktop case to within 1.3%, so the first paint is already close.
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width > 0) setScale(BOX.w / width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return scale
}

/**
 * The brand mark: a 346-unit gradient-stroked conduit with a solid circle at
 * each end, the pair reading as one capsule, under a drifting ordered dither.
 *
 * The dither is a fill treatment, not a knockout — it never punches to the page
 * behind. That also rules out a shader: `foreignObject` contributes nothing to
 * an SVG mask's luminance, so a canvas cannot participate in masking the mark.
 */
function HeroMark({ className }: { className?: string }) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const uid = React.useId()
  const id = (name: string) => `${uid}-${name}`

  const unit = useUnitScale(svgRef)
  const tile = TILE * unit

  /*
   * Drawn twice — once in ink, once in white to clip the screen to the mark.
   * Sharing one definition is what keeps the two copies animating in lockstep;
   * a mask that lagged the paint by even a frame would fringe the edges.
   */
  const conduit = (paint: boolean) => (
    <>
      <path
        className="softcom-hero-capsule"
        d={`M${AXIS.x1} ${AXIS.y1}L${AXIS.x2} ${AXIS.y2}`}
        pathLength="1"
        stroke={paint ? `url(#${id("ink")})` : "#FFFFFF"}
        strokeWidth={STROKE}
      />
      {/*
       * Both circles start overlapped at the conduit's midpoint and separate to
       * its ends. Offsets are user units, the same units the viewBox is in, so
       * they hold at every rendered size.
       */}
      <circle
        className="softcom-hero-blob"
        cx={AXIS.x2}
        cy={AXIS.y2}
        r={R}
        fill={paint ? "#00FFFF" : "#FFFFFF"}
        style={
          {
            "--blob-from-x": "-374.75px",
            "--blob-from-y": "222.5px",
          } as React.CSSProperties
        }
      />
      <circle
        className="softcom-hero-blob"
        cx={AXIS.x1}
        cy={AXIS.y1}
        r={R}
        fill={paint ? "#004BFF" : "#FFFFFF"}
        style={
          {
            "--blob-from-x": "374.75px",
            "--blob-from-y": "-222.5px",
          } as React.CSSProperties
        }
      />
    </>
  )

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className={cn("block aspect-[1094.102/789.602]", className)}
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={id("ink")}
          x1={RAMP.x1}
          y1={RAMP.y}
          x2={RAMP.x2}
          y2={RAMP.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#004BFF" />
          <stop offset="1" stopColor="#00FFFF" />
        </linearGradient>

        {/*
         * `crispEdges` is load-bearing: anti-aliasing a one-pixel cell averages
         * it away with its neighbours, which is precisely the wash the matrix
         * exists to avoid. The drift steps a whole cell at a time for the same
         * reason — a sub-pixel slide would shimmer.
         */}
        <pattern
          className="softcom-hero-screen"
          id={id("screen")}
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
          style={{ "--screen-tile": `${tile}px` } as React.CSSProperties}
        >
          {SCREEN.flatMap((row, y) =>
            row.map((v, x) => (
              <rect
                key={`${x}-${y}`}
                x={x * unit}
                y={y * unit}
                width={unit}
                height={unit}
                fill={step(v)}
                shapeRendering="crispEdges"
              />
            ))
          )}
        </pattern>

        <mask
          id={id("silhouette")}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={BOX.w}
          height={BOX.h}
        >
          {conduit(false)}
        </mask>
      </defs>

      {/*
       * Isolated so the blend reaches the mark and stops there — without it the
       * screen would composite against the page and haze the whole hero.
       */}
      <g style={{ isolation: "isolate" }}>
        {conduit(true)}
        <rect
          width={BOX.w}
          height={BOX.h}
          fill={`url(#${id("screen")})`}
          mask={`url(#${id("silhouette")})`}
          style={{ mixBlendMode: "overlay" }}
        />
      </g>
    </svg>
  )
}

export { HeroMark }
