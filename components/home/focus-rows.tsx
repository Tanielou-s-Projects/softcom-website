"use client"

import * as React from "react"

import { ArrowLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { DESKTOP, gsap, MOBILE, REDUCE, SplitText, useGSAP } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type FocusRow = {
  title: string
  paragraphs: string[]
  image?: string
  href: string
  linkLabel: string
}

/*
 * Daylight's slots for three rows, as fractions of the section's scroll:
 * when each row's text starts drifting, fades in, and fades out. Other counts
 * spread the same pattern evenly.
 */
function slotsFor(n: number) {
  if (n === 3)
    return {
      drift: [0, 0.3, 0.6],
      fadeIn: [0.06, 0.42, 0.72],
      fadeOut: [0.28, 0.57],
    }
  const step = n > 1 ? 0.6 / (n - 1) : 0
  const drift = Array.from({ length: n }, (_, i) => i * step)
  const fadeIn = drift.map((d) => d + 0.06)
  return { drift, fadeIn, fadeOut: fadeIn.slice(0, -1).map((f) => f + 0.22) }
}

/*
 * The focus areas as ruled rows, after Daylight's USP rows. On desktop each
 * row's centre cell clips a text layer that is `position: fixed` to the
 * viewport (clip-path clips fixed descendants without becoming their
 * containing block), so the text holds still mid-screen and shows only through
 * whichever row is passing behind it, while a scrubbed timeline drifts and
 * cross-fades one row's text into the next. Side cells alternate the image
 * and the area's second paragraph.
 *
 * On phones every row is in flow and reveals itself, its image opening from a
 * 20% inset as it de-scales. Under reduced motion nothing is fixed or moved.
 */
export function FocusRows({ rows }: { rows: FocusRow[] }) {
  const root = React.useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const layers = q("[data-focus-text]") as HTMLElement[]
      const mm = gsap.matchMedia()

      mm.add(
        { desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE },
        (context) => {
          const { desktop, reduce } = context.conditions as Record<
            string,
            boolean
          >
          if (reduce) return

          if (desktop) {
            const titles = layers.map((layer) =>
              SplitText.create(layer.querySelector("h3")!, { type: "lines" })
            )
            const { drift, fadeIn, fadeOut } = slotsFor(layers.length)
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root.current,
                start: "top 52%",
                end: "bottom 50%",
                scrub: true,
              },
            })
            // A one-unit spacer: every position below is a share of progress.
            tl.to({}, { duration: 1 }, 0)
            layers.forEach((layer, i) => {
              const last = i === layers.length - 1
              tl.fromTo(
                layer,
                { y: 150 - 100 * i },
                { y: -50 - 100 * i, duration: 0.4, ease: "none" },
                drift[i]
              )
                .fromTo(
                  layer,
                  { autoAlpha: 0 },
                  {
                    autoAlpha: 1,
                    duration: 0.15,
                    ease: last ? "power4.out" : "power2.out",
                  },
                  fadeIn[i]
                )
                .fromTo(
                  titles[i].lines,
                  { yPercent: 60, autoAlpha: 0 },
                  {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: i ? 0.2 : 0.15,
                    stagger: 0.012,
                    ease: "power3.out",
                  },
                  fadeIn[i]
                )
              if (!last)
                tl.to(
                  layer,
                  { autoAlpha: 0, duration: 0.15, ease: "power2.in" },
                  fadeOut[i]
                )
            })
            return () => titles.forEach((t) => t.revert())
          }

          // Phones: each row's image opens as the row arrives.
          ;(q("[data-focus-row]") as HTMLElement[]).forEach((row) => {
            const st = { trigger: row, start: "top 70%" }
            gsap.fromTo(
              row.querySelector("[data-focus-media]"),
              { clipPath: "inset(20% 0% 20% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: st,
              }
            )
            gsap.fromTo(
              row.querySelector("[data-focus-media] > *"),
              { scale: 1.8 },
              { scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger: st }
            )
            gsap.from(row.querySelector("[data-focus-text]"), {
              autoAlpha: 0,
              y: 24,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: st,
            })
          })
        }
      )
    },
    { scope: root }
  )

  return (
    <ol ref={root} className="mt-12 border-b border-line md:mt-20 lg:border-t">
      {rows.map((row, i) => {
        // The image alternates sides; the other side takes the second paragraph.
        const imageLeft = i % 2 === 1
        const [lead, ...rest] = row.paragraphs
        return (
          <li
            key={row.title}
            data-focus-row
            className="grid border-t border-line max-lg:px-4 max-lg:py-10 max-lg:first:border-t-0 md:max-lg:px-10 lg:min-h-[34rem] lg:grid-cols-[1fr_minmax(0,1.6fr)_1fr] lg:border-t-0 lg:not-last:border-b"
          >
            {/* The centre cell: clips its fixed text layer on desktop. */}
            <div className="relative lg:col-start-2 lg:row-start-1 lg:border-x lg:border-line lg:[clip-path:border-box]">
              <div
                data-focus-text
                className="flex flex-col items-start lg:fixed lg:inset-0 lg:items-center lg:justify-center lg:text-center motion-reduce:lg:static motion-reduce:lg:py-16"
              >
                <p className="label text-ink-faint">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(rows.length).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-headline font-normal lg:max-w-[16ch]">
                  {row.title}
                </h3>
                <p className="mt-6 max-w-[46ch] text-ink-soft">{lead}</p>
                <ArrowLink href={row.href} className="mt-8">
                  {row.linkLabel}
                </ArrowLink>
              </div>
            </div>

            <div
              className={cn(
                "relative max-lg:mt-8 max-lg:aspect-[4/3] lg:row-start-1",
                imageLeft ? "lg:col-start-1" : "lg:col-start-3"
              )}
            >
              <div
                data-focus-media
                className="absolute inset-0 overflow-hidden max-lg:rounded-lg"
              >
                <ImagePlaceholder
                  src={row.image}
                  reveal={false}
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="ring-0"
                />
              </div>
            </div>

            {rest.length > 0 && (
              <div
                className={cn(
                  "flex flex-col justify-end text-sm text-ink-soft max-lg:mt-6 lg:row-start-1 lg:p-8",
                  imageLeft ? "lg:col-start-3" : "lg:col-start-1"
                )}
              >
                {rest.map((p) => (
                  <p key={p} className="max-w-[38ch]">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
