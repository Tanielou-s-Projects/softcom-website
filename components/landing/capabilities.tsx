import Image from "next/image"

import {
  bodyText,
  cardHeadingText,
  Container,
  headingText,
  leadText,
} from "@/components/landing/section"
import { capabilities } from "@/components/landing/content"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/**
 * Three full-bleed capability slides on a horizontal rail. Figma sizes each at
 * 1176x1024 and lets the row overflow; scroll-snap is added so the rail is
 * actually navigable by pointer, keyboard, and touch.
 */
function Capabilities() {
  return (
    <div className="flex flex-col gap-10 lg:gap-16">
      <Reveal asChild>
        <Container className="flex flex-col items-center gap-8 pt-6 text-center lg:gap-16">
          <h2 className={cn(headingText, "max-w-[533px] text-foreground")}>
            From infrastructure → intelligence.
          </h2>
          <p className={cn(leadText, "max-w-[576px] text-muted-foreground")}>
            We design and deliver across the full stack of enterprise
            technology, from core operational platforms to data systems that
            turn complexity into clarity.
          </p>
        </Container>
      </Reveal>

      {/* One reveal for the rail as a unit — never transform the overflow-x-auto element itself. */}
      <Reveal amount={0.15}>
        <div
          /* Scrollable region, so it must be keyboard-reachable. */
          tabIndex={0}
          role="region"
          aria-label="What we do"
          className="flex snap-x snap-mandatory scroll-px-6 items-start gap-3 overflow-x-auto overflow-y-clip px-6 pt-6"
        >
          {capabilities.map((capability) => (
            <article
              key={capability.number}
              className="dark relative flex h-[560px] w-[min(1176px,85vw)] shrink-0 snap-start flex-col items-end justify-end gap-2.5 overflow-clip rounded-4xl p-4 sm:h-[720px] lg:h-[1024px] lg:p-6"
            >
              <Image
                src={capability.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 1176px, 85vw"
                className="object-cover"
              />

              <div
                className={cn(
                  "relative flex flex-col items-start overflow-clip rounded-4xl p-4 lg:p-6",
                  capability.chipClassName
                )}
              >
                <p className={cn(cardHeadingText, "whitespace-nowrap")}>
                  {capability.number}
                </p>
              </div>

              <div className="relative flex flex-col items-start gap-6 overflow-clip rounded-4xl bg-background p-6 text-foreground lg:gap-8 lg:p-[47px]">
                <h3 className={cn(cardHeadingText, "lg:w-[359px]")}>
                  {capability.title}
                </h3>
                <p className={cn(bodyText, "lg:w-[600px]")}>
                  {capability.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

export { Capabilities }
