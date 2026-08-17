import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { bodyText, Container, headingText } from "@/components/landing/section"
import { leaders, leadership, type Leader } from "@/components/about/content"

/** A portrait under a name plate on brand blue, as the landing team grid does. */
function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="relative flex h-[471px] w-full flex-col justify-end overflow-clip rounded-2xl bg-neutral-900 sm:w-[calc(50%-0.375rem)] lg:w-[339px]">
      <Image
        src={leader.image}
        alt={`${leader.name}, ${leader.role}`}
        fill
        sizes="(min-width: 1024px) 339px, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-bottom"
      />
      <div className="dark relative flex w-full flex-col gap-1 rounded-md bg-brand-blue p-3">
        <p className="font-heading text-xl leading-none font-bold text-foreground">
          {leader.name}
        </p>
        <p className="font-heading text-lg leading-[1.6] text-brand-cyan">
          {leader.role}
        </p>
      </div>
    </div>
  )
}

/**
 * Leadership — a section of About rather than a route of its own, which is what
 * the `id` is for: the header and footer both link here as `/about#leadership`.
 *
 * `flex-wrap` over fixed-width cards rather than a four-column grid, because
 * the list is currently one name: a grid would stretch a lone card across a
 * quarter of the page and read like a layout bug, where a wrapped row reads as
 * the first of however many follow.
 */
function LeadershipSection() {
  return (
    <Container
      id="leadership"
      className="flex scroll-mt-24 flex-col gap-10 py-6 lg:gap-16"
    >
      <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="brand">{leadership.eyebrow}</Badge>
          <h2 className={cn(headingText, "max-w-[664px] text-foreground")}>
            {leadership.heading}
          </h2>
        </div>
        <p className={cn(bodyText, "max-w-[420px] text-muted-foreground")}>
          {leadership.lead}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {leaders.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>
    </Container>
  )
}

export { LeadershipSection }
