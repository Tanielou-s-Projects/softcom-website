"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { PixelArrowDown } from "@/components/ui/pixel-arrow-down"
import { TENURE } from "@/components/landing/content"
import { cn } from "@/lib/utils"
import { RevealHeader } from "./hero-header"

/* Mirrors Tailwind's `md` breakpoint, which the markup below switches on. */
const MOBILE_QUERY = "(max-width: 767.98px)"

// Illustrative story using existing photography, not a customer case study.
export function PortalHero({ variant }: { variant: "grid" | "circles" }) {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = track.current
    if (!element) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    const update = () => {
      frame = 0
      const distance = element.offsetHeight - window.innerHeight
      const raw = Math.max(
        0,
        Math.min(
          1,
          -element.getBoundingClientRect().top / Math.max(1, distance)
        )
      )
      const t = Math.min(1, raw / 0.88)
      const p = media.matches ? 0 : t * t * (3 - 2 * t)
      if (variant === "circles") {
        const width = element.clientWidth
        const height = window.innerHeight
        const mobile = window.matchMedia(MOBILE_QUERY).matches
        const upperRadius =
          Math.min(
            width * (mobile ? 0.43 : 0.34),
            height * (mobile ? 0.3 : 0.42)
          ) / 2
        const lowerRadius =
          (mobile ? Math.min(width * 1.05, height * 0.58) : width * 0.8) / 2
        const scale = 1 - p * 0.72
        const growingRadius =
          upperRadius + (Math.max(width, height) * 0.75 - upperRadius) * p
        // Push along the line joining the initial centres. Centre distance
        // always equals both rendered radii plus a gap, even on reverse scroll.
        const dx = (mobile ? -width * 0.08 : 0) + lowerRadius - width * 0.77
        const dy = height * (mobile ? 0.38 : 0.32) + lowerRadius - height * 0.27
        const length = Math.hypot(dx, dy)
        const separation =
          growingRadius + lowerRadius * scale + (mobile ? 12 : 24)
        const x = width * (0.77 - p * 0.27) + (dx / length) * separation
        const y = height * (0.27 + p * 0.23) + (dy / length) * separation
        element.style.setProperty("--lower-x", `${x}px`)
        element.style.setProperty("--lower-y", `${y}px`)
        element.style.setProperty("--lower-visible", "visible")
      }
      element.style.setProperty("--p", String(p))
      element.style.setProperty("--exit", String(Math.max(0, 1 - p * 3)))
      element.style.setProperty(
        "--arrival",
        String(Math.max(0, (p - 0.55) / 0.45))
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    media.addEventListener("change", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      media.removeEventListener("change", schedule)
    }
  }, [variant])
  const circles = variant === "circles"
  return (
    <div className="bg-background text-foreground">
      <RevealHeader heroRef={track} />
      <div
        ref={track}
        className="h-[200vh] [--arrival:0] [--exit:1] [--p:0] [--row:48%] [--split:60%] motion-reduce:h-auto md:[--row:52%] md:[--split:70%]"
      >
        <section
          aria-labelledby="story-title"
          className={cn(
            "sticky top-0 isolate h-screen overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-screen",
            circles
              ? "[--diameter:min(43vw,30vh)] [--hero-type-size:clamp(20px,5.3vw,38px)] [--lower-diameter:min(105vw,58vh)] md:[--diameter:min(34vw,42vh)] md:[--hero-type-size:clamp(28px,min(5.7vw,11vh),100px)] md:[--lower-diameter:80vw]"
              : "border border-border"
          )}
        >
          <div
            className={cn(
              "softcom-portal-exit-up absolute top-0 left-0 flex",
              "motion-reduce:relative motion-reduce:m-0 motion-reduce:h-auto motion-reduce:min-h-[40vh] motion-reduce:w-full motion-reduce:transform-none motion-reduce:px-[5vw] motion-reduce:pt-20 motion-reduce:pb-10 motion-reduce:opacity-100 motion-reduce:md:mt-0 motion-reduce:md:px-[5vw] motion-reduce:md:pt-20 motion-reduce:md:pb-10",
              circles
                ? "h-[45%] w-[62%] items-start px-3.5 pt-[7vh] pb-5 md:-mt-[min(94px,9.02vh)] md:items-center md:px-[3.2vw] md:py-8"
                : "h-(--row) w-(--split) items-end border-r border-b border-border px-3.5 py-5 md:px-[3.2vw] md:py-8"
            )}
          >
            <h1
              id="story-title"
              className={cn(
                "font-heading font-normal tracking-[-0.055em]",
                // Size before leading: tailwind-merge drops a leading-* that a later text-* follows.
                circles
                  ? "text-(length:--hero-type-size)"
                  : "text-[clamp(20px,5.3vw,38px)] md:text-[clamp(30px,min(6.6vw,12vh),116px)]",
                "leading-[1.04]"
              )}
            >
              Technology for
              <br />
              Organisations.
            </h1>
          </div>
          {/* Always dark: white type over a shaded photograph in either theme. */}
          <section
            aria-labelledby="progress-title"
            className={cn(
              "dark @container absolute top-0 z-4 flex items-center justify-center overflow-hidden text-foreground",
              "motion-reduce:relative motion-reduce:inset-auto motion-reduce:h-[60vh] motion-reduce:w-full motion-reduce:[clip-path:none]",
              circles
                ? "softcom-portal-circle inset-0 size-full bg-brand-blue"
                : "softcom-portal-panel border-b border-l border-border bg-neutral-900"
            )}
          >
            <Image
              src="/landing/capability-02.png"
              alt="A team sharing digital tools and working together with a tablet"
              fill
              priority
              sizes="100vw"
              className={cn(
                "object-cover object-[center_48%]",
                circles && "softcom-portal-photo-in motion-reduce:opacity-100"
              )}
            />
            <div className="softcom-portal-shade absolute inset-0 bg-[color-mix(in_oklab,var(--color-brand-blue-950),black_60%)] motion-reduce:opacity-65" />
            <h2
              id="progress-title"
              className={cn(
                "softcom-portal-arrival relative z-1 p-3.5 font-heading font-normal motion-reduce:transform-none motion-reduce:opacity-100 md:p-6",
                circles
                  ? "text-(length:--hero-type-size) leading-[1.04] tracking-[-0.055em]"
                  : "text-[clamp(22px,12cqw,84px)] leading-[1.02] tracking-[-0.05em] md:text-[clamp(24px,10cqw,144px)]"
              )}
            >
              Progress
              <br />
              for Society.
            </h2>
          </section>
          <figure
            className={cn(
              "absolute z-3 overflow-hidden motion-reduce:hidden",
              circles
                ? "softcom-portal-orbit rounded-full"
                : "softcom-portal-exit-left top-(--row) left-0 h-[calc(100%-var(--row))] w-(--split) border-t border-r border-border bg-neutral-900"
            )}
          >
            <Image
              src="/landing/capability-01.png"
              alt="Paper reports, handwritten notes, and laptops spread across a table"
              fill
              priority
              sizes="(max-width: 767px) 60vw, 70vw"
              className="object-cover object-[center_48%]"
            />
            {/* A layer over the photo rather than a background behind it, so
                no cyan fringe shows at the circle's antialiased edge. */}
            {circles && (
              <div className="softcom-portal-tint-in absolute inset-0 bg-brand-cyan" />
            )}
          </figure>
          {circles && (
            <button
              className="absolute right-[5vw] bottom-22 z-5 grid h-18 w-14 cursor-pointer place-items-center rounded-full text-brand-accent transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent active:scale-[0.97] motion-reduce:hidden md:bottom-[max(24px,4vh)]"
              aria-label="Scroll to Progress for Society"
              onClick={() => {
                const element = track.current
                if (!element) return
                const reduce = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches
                const top = window.scrollY + element.getBoundingClientRect().top
                window.scrollTo({
                  top:
                    top +
                    (reduce
                      ? element.offsetHeight
                      : (element.offsetHeight - window.innerHeight) * 0.88),
                  behavior: reduce ? "instant" : "smooth",
                })
              }}
            >
              <PixelArrowDown
                cascade
                className="softcom-pixel-cascade size-12"
              />
            </button>
          )}
        </section>
      </div>
      {/* Brand blue in both themes; `dark` resolves the accent to cyan. */}
      <section
        aria-label="Our experience and impact"
        className="dark flex min-h-[90vh] items-center justify-center bg-brand-blue px-6 py-16 text-foreground md:px-[7vw] md:py-25"
      >
        <p className="max-w-[1140px] font-heading text-[clamp(26px,3.6vw,58px)] leading-[1.25] tracking-[-0.035em]">
          For <span className="text-brand-accent">{TENURE}</span>, we have
          pioneered the technology that organisations rely on to expand access
          to digital services, reach underserved communities, bridge
          infrastructure gaps, and unlock opportunities across Nigeria and
          Africa.
        </p>
      </section>
    </div>
  )
}
