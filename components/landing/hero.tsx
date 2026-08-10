/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import * as React from "react"

import { cn } from "@/lib/utils"
import { HeroDither } from "@/components/landing/hero-dither"
import { displayText } from "@/components/landing/section"

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
        className="absolute top-[2.982%] left-[7.674%] h-[94.035%] w-[84.649%]"
        viewBox="0 0 926.142 742.512"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="softcom-hero-gradient"
            x1="74.8753"
            y1="396.543"
            x2="817.194"
            y2="396.543"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#004BFF" />
            <stop offset="1" stopColor="#00FFFF" />
          </linearGradient>
        </defs>
        <path
          className="softcom-hero-capsule"
          d="M88.3209 593.756L837.821 148.756"
          pathLength="1"
          stroke="url(#softcom-hero-gradient)"
          strokeWidth="346"
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
        className="softcom-hero-blob absolute top-0 left-[68.504%] h-[43.642%] w-[31.497%]"
        style={
          {
            "--blob-from-x": "-108.75%",
            "--blob-from-y": "64.57%",
          } as React.CSSProperties
        }
      />
      <img
        src="/brand/hero-blob-b.svg"
        alt=""
        className="softcom-hero-blob absolute top-[56.357%] left-0 h-[43.642%] w-[31.497%]"
        style={
          {
            "--blob-from-x": "108.75%",
            "--blob-from-y": "-64.57%",
          } as React.CSSProperties
        }
      />
    </div>
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
      {/*
       * First child, so everything after paints over it without needing a
       * stacking context — the headlines and the mark are positioned, and
       * later-in-DOM wins.
       */}
      <HeroDither />

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
