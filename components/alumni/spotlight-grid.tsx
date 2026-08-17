import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container, headingText } from "@/components/landing/section"
import {
  spotlights,
  spotlightSection,
  type Spotlight,
} from "@/components/alumni/content"

/**
 * One alumnus: portrait, name, and the then/now pair that is the whole point of
 * the card.
 */
function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[400px] w-full overflow-clip rounded-2xl bg-neutral-900">
        <Image
          src={spotlight.image}
          alt={`${spotlight.name}, now ${spotlight.now}`}
          fill
          sizes="(min-width: 1024px) 339px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-heading text-xl leading-none font-bold text-foreground">
          {spotlight.name}
        </p>
        <dl className="flex flex-col gap-1 text-sm leading-[1.6]">
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted-foreground">Then</dt>
            <dd className="text-foreground">{spotlight.then}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted-foreground">Now</dt>
            <dd className="text-foreground">{spotlight.now}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

/**
 * The spotlight grid, which renders nothing at all when there is nobody to
 * show.
 *
 * No empty state: an "alumni coming soon" plate would be a placeholder shipped
 * to production, and the invite panel below already carries the ask. The section
 * simply appears once `spotlights` has entries.
 */
function SpotlightGrid() {
  if (spotlights.length === 0) return null

  return (
    <Container className="flex flex-col gap-10 py-6 lg:gap-16">
      <header className="flex flex-col items-start gap-6">
        <Badge variant="brand">{spotlightSection.eyebrow}</Badge>
        <h2 className={cn(headingText, "max-w-[664px] text-foreground")}>
          {spotlightSection.heading}
        </h2>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {spotlights.map((spotlight) => (
          <SpotlightCard key={spotlight.name} spotlight={spotlight} />
        ))}
      </div>
    </Container>
  )
}

export { SpotlightGrid }
