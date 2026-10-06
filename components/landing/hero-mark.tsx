/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import * as React from "react"

import { cn } from "@/lib/utils"

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

export { HeroMark }
