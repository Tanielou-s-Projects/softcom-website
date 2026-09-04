/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { VariantSwitch } from "@/components/variants/variant-switch"

/*
 * Placeholder photography until the client supplies archive/stock imagery.
 * Two eras for the portals (2007 → today), one wide frame for the reveal.
 */
const PLACEHOLDER = {
  then: "/landing/team-01.png",
  now: "/landing/story.png",
  wide: "/landing/capability-01.png",
} as const

/* Geometry shared by every mark — see the HeroMark comment for provenance. */
const CAPSULE_PATH = "M88.3209 593.756L837.821 148.756"
const CAPSULE_STROKE = 346
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
        viewBox="0 0 926.142 742.512"
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

/**
 * Variant `portals`: the two circles become apertures onto photographs — one
 * from the early years, one from today — joined by the conduit. "Two decades"
 * stated by the mark itself rather than by a background.
 */
function HeroMarkPortals({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative aspect-[1094.1/789.61]", className)}
    >
      <svg
        className={capsuleSvg}
        viewBox="0 0 926.142 742.512"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <CapsuleGradient id="softcom-hero-gradient-portals" />
        </defs>
        <path
          className="softcom-hero-capsule"
          d={CAPSULE_PATH}
          pathLength="1"
          stroke="url(#softcom-hero-gradient-portals)"
          strokeWidth={CAPSULE_STROKE}
        />
      </svg>

      <div
        className={cn(blobA, "overflow-clip rounded-full bg-brand-cyan")}
        style={BLOB_A_FROM}
      >
        <Image
          src={PLACEHOLDER.now}
          alt=""
          fill
          sizes="30vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 rounded-full ring-[6px] ring-brand-cyan ring-inset" />
      </div>
      <div
        className={cn(blobB, "overflow-clip rounded-full bg-brand-cyan")}
        style={BLOB_B_FROM}
      >
        <Image
          src={PLACEHOLDER.then}
          alt=""
          fill
          sizes="30vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 rounded-full ring-[6px] ring-brand-cyan ring-inset" />
      </div>
    </div>
  )
}

/**
 * Variant `reveal`: the conduit is a window. A photograph is masked to the
 * stroke, so the draw-on *uncovers* the image instead of drawing a bar; the
 * gradient sits over it at low opacity to keep the brand colour. The circles
 * stay solid — two portals, with history running between them.
 */
function HeroMarkReveal({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative aspect-[1094.1/789.61]", className)}
    >
      <svg
        className={capsuleSvg}
        viewBox="0 0 926.142 742.512"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <CapsuleGradient id="softcom-hero-gradient-reveal" />
          {/* The animated stroke is the mask, so the photo appears as the line draws. */}
          <mask id="softcom-hero-reveal-mask" maskUnits="userSpaceOnUse">
            <path
              className="softcom-hero-capsule"
              d={CAPSULE_PATH}
              pathLength="1"
              stroke="#fff"
              strokeWidth={CAPSULE_STROKE}
            />
          </mask>
        </defs>
        <image
          href={PLACEHOLDER.wide}
          width="926.142"
          height="742.512"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#softcom-hero-reveal-mask)"
        />
        <path
          className="softcom-hero-capsule"
          d={CAPSULE_PATH}
          pathLength="1"
          stroke="url(#softcom-hero-gradient-reveal)"
          strokeWidth={CAPSULE_STROKE}
          opacity="0.42"
          style={{ mixBlendMode: "multiply" }}
        />
      </svg>

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

/**
 * The composition shell. On desktop it is a fixed-aspect box (1440 × 1024, the
 * Figma frame) that *scales to fit the fold*: its width is the smaller of the
 * page and what the viewport height allows once the sub-hero is reserved, so
 * hero + sub-hero always share the first screen and the internal percentages
 * hold at every size. Nothing inside is a pixel.
 */
function HeroShell({ mark }: { mark: React.ReactNode }) {
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

const markClass = cn(
  "order-2 w-full",
  "lg:absolute lg:top-[15.527%] lg:left-[11.667%] lg:w-[75%]"
)

function Hero() {
  return (
    <VariantSwitch
      variant="hero"
      cases={{
        conduit: <HeroShell mark={<HeroMark className={markClass} />} />,
        portals: <HeroShell mark={<HeroMarkPortals className={markClass} />} />,
        reveal: <HeroShell mark={<HeroMarkReveal className={markClass} />} />,
      }}
    />
  )
}

export { Hero, HeroMark }
