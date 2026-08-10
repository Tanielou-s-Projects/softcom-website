/* eslint-disable @next/next/no-img-element -- local SVG, intentionally not run through next/image */
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Container,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * Two stacked full-bleed panels (Figma group 210:82): the blue mission
 * statement, then the same photograph again as a darkened band. They share a
 * 12px gutter rather than the page's usual 128px rhythm.
 */
function Mission() {
  return (
    <Container className="flex flex-col gap-3 pt-6">
      {/* Panel one — mission statement on brand blue. */}
      <div className="dark relative flex flex-col items-center gap-12 overflow-clip rounded-4xl bg-brand-blue px-6 pt-20 pb-6 lg:h-[1024px] lg:gap-32 lg:pt-32">
        <h2
          className={cn(
            headingText,
            "max-w-[600px] text-center leading-[1.1] text-foreground"
          )}
        >
          We exist to create lasting impact.
        </h2>
        {/* Pinned, not semantic: this sits on brand blue in both themes. */}
        <p
          className={cn(leadText, "max-w-[684px] text-center text-neutral-200")}
        >
          Founded in Lagos in 2007, Softcom builds the systems that help
          organisations operate, grow, and better serve the people who depend on
          them. We believe stronger organisations are the foundation of a more
          prosperous society.
        </p>

        <div className="relative aspect-[701/506.668] w-full overflow-clip rounded-2xl lg:absolute lg:top-[58.01%] lg:left-[25.43%] lg:h-[49.48%] lg:w-[50.36%]">
          <Image
            src="/landing/story.png"
            alt="A Softcom team member reviewing printed reports"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-bottom"
          />
        </div>
      </div>

      {/* Panel two — the same photograph, darkened, carrying the story CTA. */}
      <div className="dark relative flex flex-col items-center justify-center gap-10 overflow-clip rounded-4xl px-6 py-20 lg:h-[1024px] lg:gap-16 lg:p-6">
        <Image
          src="/landing/story.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div aria-hidden className="absolute inset-0 bg-black/64" />

        <img
          src="/brand/accent-dot.svg"
          alt=""
          width={26}
          height={26}
          className="relative size-[26px] shrink-0"
        />
        <p
          className={cn(
            leadText,
            "relative max-w-[576px] text-center text-neutral-200"
          )}
        >
          For over two decades, we have partnered with governments, financial
          institutions, global development agencies, and growth-stage
          enterprises to build the platforms, data systems, and digital
          capabilities that drive their most important outcomes.
        </p>
        <Button asChild size="lg" className={cn(primaryPill, "relative")}>
          <Link href="/about">Our Story</Link>
        </Button>
      </div>
    </Container>
  )
}

export { Mission }
