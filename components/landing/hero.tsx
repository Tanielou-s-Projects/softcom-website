/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { FOUNDED } from "@/components/landing/content"
import { AtlasDots } from "@/components/landing/atlas-dots"
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

/* ── Compositions ───────────────────────────────────────────────────────── */

/**
 * The original split composition. On desktop it is a fixed-aspect box
 * (1440 × 1024, the Figma frame) that *scales to fit the fold*: its width is
 * the smaller of the page and what the viewport height allows once the
 * sub-hero is reserved, so hero + sub-hero always share the first screen and
 * the internal percentages hold at every size. Nothing inside is a pixel.
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

const MASTHEAD = `Softcom — Est. ${FOUNDED} — Lagos, Nigeria`

/**
 * Variant `atlas`: the statement holds the left column and Africa, drawn as a
 * field of square dots, runs off the right edge. Lagos is lit and the routes
 * to the other markets draw out of it — the claim ("the institutions that move
 * Africa forward") shown as territory rather than asserted over a photograph.
 */
function HeroAtlas() {
  return (
    <section
      className={cn(
        "relative -mt-6 flex w-full flex-col gap-12 overflow-clip px-6 pt-10 pb-10",
        "lg:mx-auto lg:-mt-[200px] lg:min-h-[calc(100svh-13rem)] lg:flex-row lg:items-center lg:gap-0 lg:pt-[14svh] lg:pb-0"
      )}
    >
      <div className="relative z-10 flex flex-col gap-8 lg:w-[46%] lg:shrink-0 lg:gap-10">
        <p className="font-mono text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase">
          {MASTHEAD}
        </p>

        <h1
          className={cn(
            displayText,
            "text-balance text-foreground lg:text-[min(4.5rem,5vw)] lg:leading-[1.02]"
          )}
        >
          Technology for Organisations. Progress for Society.
        </h1>
      </div>

      {/*
       * Bled off the right edge so the continent reads as bigger than the
       * viewport — the section's own `overflow-clip` does the cropping.
       */}
      {/*
       * Sized by height, not width: the map is very nearly square, so a
       * width-based size overflows the fold and crops North Africa off.
       */}
      <AtlasDots className="w-full lg:absolute lg:top-1/2 lg:right-[1%] lg:h-[72svh] lg:w-auto lg:-translate-y-1/2" />
    </section>
  )
}

/**
 * Variant `atlas-full`: the same map, centred and full-bleed behind a centred
 * statement. Quieter dots, no place labels — the map is ground, not subject.
 */
function HeroAtlasFull() {
  return (
    <section
      className={cn(
        "relative -mt-6 flex w-full flex-col items-center justify-center gap-10 overflow-clip px-6 pt-16 pb-10 text-center",
        "lg:mx-auto lg:-mt-[200px] lg:min-h-[calc(100svh-13rem)] lg:pt-[18svh]"
      )}
    >
      {/*
       * Masked out through the middle so the statement sits in clear air —
       * without it the dots run straight through the type.
       */}
      <AtlasDots
        labels={false}
        className={cn(
          "absolute top-1/2 left-1/2 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40",
          "lg:h-[86svh] lg:w-auto",
          "[mask-image:radial-gradient(58%_42%_at_50%_58%,transparent,black_78%)]"
        )}
      />

      <p className="relative font-mono text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase">
        {MASTHEAD}
      </p>

      <h1
        className={cn(
          displayText,
          "relative max-w-[22ch] text-balance text-foreground lg:text-[min(5rem,5.6vw)] lg:leading-[1.02]"
        )}
      >
        Technology for Organisations. Progress for Society.
      </h1>
    </section>
  )
}

const markClass = cn(
  "order-2 w-full",
  "lg:absolute lg:top-[15.527%] lg:left-[11.667%] lg:w-[75%]"
)

function Hero() {
  return (
    <VariantSwitch
      variant="hero"
      cases={{
        conduit: <HeroSplit mark={<HeroMark className={markClass} />} />,
        atlas: <HeroAtlas />,
        "atlas-full": <HeroAtlasFull />,
      }}
    />
  )
}

export { Hero, HeroMark }
