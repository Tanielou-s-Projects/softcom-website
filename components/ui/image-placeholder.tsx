"use client"

import * as React from "react"
import Image from "next/image"

import { gsap, REDUCE, useGSAP } from "@/lib/motion"
import { cn } from "@/lib/utils"

/*
 * Every image slot on the site. Given a `src` it shows that photograph,
 * cropped to cover; without one it stands in with a hairline frame and a
 * picture icon. Either way it fills its parent, taking whatever size and
 * shape the layout gives the slot.
 *
 * It enters the way Daylight's images do (§2.7): the frame opens from a 20%
 * inset as its contents settle from 1.8× scale, 1.5s expo-out, the first time
 * it is well into view. `reveal={false}` for slots whose section choreographs
 * them itself.
 */
export function ImagePlaceholder({
  src,
  label,
  className,
  reveal = true,
  priority = false,
  sizes = "100vw",
}: {
  /** The photograph; omit to show the placeholder. */
  src?: string
  /** What the image shows, for screen readers. */
  label?: string
  className?: string
  reveal?: boolean
  priority?: boolean
  sizes?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!reveal || !ref.current) return
      const mm = gsap.matchMedia()
      mm.add(`not all and ${REDUCE}`, () => {
        const scrollTrigger = {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        }
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(20% 0% 20% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger,
          }
        )
        gsap.fromTo(
          ref.current!.firstElementChild,
          { scale: 1.8 },
          { scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger }
        )
      })
    },
    { scope: ref, dependencies: [reveal] }
  )

  if (src)
    return (
      <div
        ref={ref}
        className={cn("relative size-full overflow-hidden", className)}
      >
        <Image
          src={src}
          alt={label ?? ""}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    )

  return (
    <div
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "flex size-full items-center justify-center bg-ink/[0.04] text-ink-faint ring-1 ring-line ring-inset",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        className="size-8"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
        <circle cx="8.5" cy="9.5" r="1.75" />
        <path d="m3.5 17.5 5.25-5.25 3.75 3.75 2.75-2.75 5.25 5.25" />
      </svg>
    </div>
  )
}
