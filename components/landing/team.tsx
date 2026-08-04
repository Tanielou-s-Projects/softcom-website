import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { teamCells, type TeamCell } from "@/components/landing/content"
import { cn } from "@/lib/utils"

/** A stat plate, framed by hairlines rather than a filled card. */
function StatCell({ value, label }: Extract<TeamCell, { kind: "stat" }>) {
  return (
    <div className="flex h-[471px] flex-col justify-end gap-3 overflow-clip border-x border-secondary p-6 whitespace-nowrap">
      <p className="font-heading text-5xl leading-[0.804] text-foreground lg:text-[4.27rem]">
        {value}
      </p>
      <p className={cn(bodyText, "text-foreground")}>{label}</p>
    </div>
  )
}

/** A portrait, optionally captioned with a name plate on brand blue. */
function PortraitCell({
  image,
  name,
  role,
}: Extract<TeamCell, { kind: "portrait" }>) {
  return (
    <div className="relative flex h-[471px] flex-col justify-end overflow-clip rounded-[16px] bg-neutral-900">
      <Image
        src={image}
        alt={name ? `${name}, ${role}` : ""}
        fill
        sizes="(min-width: 1024px) 339px, 50vw"
        className="object-cover object-bottom"
      />
      {name ? (
        <div className="relative flex w-full flex-col gap-1 rounded-[8px] bg-brand-blue p-3">
          <p className="font-heading text-xl leading-none font-bold text-foreground">
            {name}
          </p>
          <p className="font-heading text-lg leading-[1.6] text-brand-cyan">
            {role}
          </p>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Stats and portraits interleaved across a four-column grid, in the order
 * Figma lays them out.
 */
function Team() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip py-6 lg:gap-16">
      <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-[206px]">
        <h2 className={cn(headingText, "text-foreground lg:w-[664px]")}>
          Built by people who&apos;ve done this before.
        </h2>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
          <p className={cn(bodyText, "text-foreground")}>
            Eighteen years of enterprise delivery, led by a team that&apos;s
            shipped technology at national scale.
          </p>
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/leadership">The Team</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {teamCells.map((cell, index) =>
          cell.kind === "stat" ? (
            <StatCell key={`${cell.value}-${index}`} {...cell} />
          ) : (
            <PortraitCell key={cell.image} {...cell} />
          )
        )}
      </div>
    </Container>
  )
}

export { Team }
