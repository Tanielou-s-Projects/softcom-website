import type * as React from "react"

import type { Partner } from "@/components/landing/content"
import type { HomePage } from "@/components/landing/home-copy"
import { cn } from "@/lib/utils"

/** Area every logo is given, so wide and square marks weigh the same. */
const AREA = 5200
const MAX_HEIGHT = 68

/** Width and height for a logo, by area rather than by height alone. */
function sizeOf({ width, height }: Partner) {
  const ratio = width / height
  const h = Math.min(MAX_HEIGHT, Math.sqrt(AREA / ratio))
  return { width: Math.round(h * ratio), height: Math.round(h) }
}

/**
 * One logo as a silhouette in the current text colour: the file is used as a
 * mask, so the row follows the theme and every partner sits in one ink.
 */
function Logo({ partner }: { partner: Partner }) {
  const { width, height } = sizeOf(partner)
  return (
    <span
      role="img"
      aria-label={partner.name}
      title={partner.name}
      className="block shrink-0 bg-current transition-colors duration-300"
      style={{
        width,
        height,
        maskImage: `url(${partner.logo})`,
        WebkitMaskImage: `url(${partner.logo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  )
}

/**
 * One moving row. The list is laid down twice so the loop is seamless (the
 * keyframes move it by half its width), and each copy holds the row's
 * logos twice so a copy is always wider than the screen. Repeats are hidden
 * from assistive tech.
 */
function Row({
  items,
  reverse = false,
  seconds,
}: {
  items: Partner[]
  reverse?: boolean
  seconds: number
}) {
  const run = [...items, ...items]
  return (
    <div
      className={cn(
        "group relative overflow-hidden py-3",
        // Fade the ends so logos arrive and leave rather than clip.
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        "motion-reduce:[mask-image:none]"
      )}
    >
      <div
        className="flex w-max animate-[partner-marquee_var(--marquee-s)_linear_infinite] items-center group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center"
        style={
          {
            "--marquee-s": `${seconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className={cn(
              "flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24",
              copy === 1 && "motion-reduce:hidden",
              "motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8 motion-reduce:pr-0 motion-reduce:lg:gap-x-14"
            )}
          >
            {run.map((partner, index) => (
              <li
                key={`${partner.name}-${index}`}
                aria-hidden={index >= items.length || undefined}
                className={cn(
                  "hover:text-foreground",
                  index >= items.length && "motion-reduce:hidden"
                )}
              >
                <Logo partner={partner} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/**
 * The partner strip under "Who we work with": two rows of logos drifting in
 * opposite directions at slightly different speeds, each pausing under the
 * pointer. With reduced motion both rows stand still, wrapped and centred.
 */
function PartnerLogos({
  copy,
  className,
}: {
  copy: HomePage["partners"]
  className?: string
}) {
  const partners: Partner[] = copy.logos
  const half = Math.ceil(partners.length / 2)
  return (
    <section
      aria-label={copy.label}
      className={cn(
        "flex flex-col gap-4 text-foreground/55 lg:gap-6",
        className
      )}
    >
      <Row items={partners.slice(0, half)} seconds={55} />
      <Row items={partners.slice(half)} seconds={65} reverse />
    </section>
  )
}

export { PartnerLogos }
