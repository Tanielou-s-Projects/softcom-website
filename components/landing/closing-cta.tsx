/* eslint-disable @next/next/no-img-element -- local SVG, intentionally not run through next/image */
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * The closing call to action. Figma pins this panel with `position: sticky` so
 * the footer rides up over it as you reach the bottom of the page — which is
 * why it and the footer must stay siblings inside the same wrapper.
 */
function ClosingCta() {
  return (
    <div className="relative flex h-[560px] flex-col items-center gap-10 overflow-clip rounded-[24px] pt-16 lg:sticky lg:top-0 lg:h-[831px] lg:gap-16 lg:pt-[71px]">
      <Image
        src="/landing/story.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom"
      />
      <div aria-hidden className="absolute inset-0 bg-black/75" />

      <img
        src="/brand/accent-dot-2.svg"
        alt=""
        width={26}
        height={26}
        className="relative size-[26px] shrink-0"
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        <h2
          className={cn(
            headingText,
            "max-w-[598px] text-center text-foreground"
          )}
        >
          Let&apos;s build something
          <br />
          that lasts.
        </h2>
        <div className="flex items-start gap-2">
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/contact">Get In Touch</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className={ghostPill}>
            <Link href="/solutions">Our Solutions</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ClosingCta }
