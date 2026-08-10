import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"

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

/** The angle of the conduit, so the screen lies along it rather than across it. */
const ANGLE = -30.694

/*
 * One cell of the dot screen, in composition units — close to 1:1 with CSS px
 * at the size the hero renders. The radius is set for ~50% coverage, which is
 * where the dot and gap means average out to the design's.
 */
const CELL = 5
const DOT = 2

/*
 * How far the screen pushes green, out of 128.
 *
 * Sampling node 210:41 shows the dither only ever moves the green channel: red
 * sits at 0 and blue at 255 across the whole mark, and no background shows
 * through anywhere. It swings green about +/-64 at the blue end and closes to
 * nothing by the cyan end.
 *
 * An `overlay` blend is exactly that shape. It leaves 0 and 255 untouched, so
 * red and blue survive it and the texture dissolves on its own as the ramp
 * warms — no second gradient to keep in sync. 128 is its neutral point, hence
 * the grey.
 */
const AMP = 100
const GAP_INK = `rgb(128, ${128 - AMP}, 128)`
const DOT_INK = `rgb(128, ${128 + AMP}, 128)`

/**
 * The brand mark: a 346-unit gradient-stroked conduit with a solid circle at
 * each end, the pair reading as one capsule, screened by a drifting dot dither.
 *
 * The dither is a fill treatment, not a knockout — it never punches to the page
 * behind. That also rules out a shader: `foreignObject` contributes nothing to
 * an SVG mask's luminance, so a canvas cannot participate here. It is the more
 * faithful of the two anyway, the design's texture being a regular screen
 * rather than noise.
 */
function HeroMark({ className }: { className?: string }) {
  const uid = React.useId()
  const id = (name: string) => `${uid}-${name}`

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
         * The base rotation is the `patternTransform` attribute and the drift is
         * a CSS animation that restates it. Anywhere CSS transforms don't reach
         * `<pattern>`, the screen simply sits still at the right angle.
         */}
        <pattern
          className="softcom-hero-screen"
          id={id("screen")}
          width={CELL}
          height={CELL}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${ANGLE})`}
        >
          <rect width={CELL} height={CELL} fill={GAP_INK} />
          <circle cx={CELL / 2} cy={CELL / 2} r={DOT} fill={DOT_INK} />
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

function Hero() {
  return (
    <section
      className={cn(
        "relative flex w-full flex-col gap-10 overflow-clip px-6 pt-36 pb-16",
        "lg:block lg:h-[1024px] lg:p-0"
      )}
    >
      <h1
        className={cn(
          displayText,
          "order-1 text-foreground",
          "lg:absolute lg:top-[19.629%] lg:left-[10.069%] lg:w-[37.153%]"
        )}
      >
        Technology for Organisations.
      </h1>

      <p
        className={cn(
          displayText,
          "order-3 self-end text-right text-foreground",
          "lg:absolute lg:top-[77.637%] lg:left-[61.944%] lg:w-[28.958%] lg:text-left"
        )}
      >
        Progress for Society.
      </p>

      <HeroMark
        className={cn(
          "order-2 w-full",
          "lg:absolute lg:top-[15.527%] lg:left-[11.667%] lg:w-[75%]"
        )}
      />
    </section>
  )
}

export { Hero, HeroMark }
