import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container, primaryPill } from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { FieldLineFigure } from "@/components/solutions/figures/field-line/figure"
import { LightTableFigure } from "@/components/solutions/figures/light-table/figure"
import { PlatformFigure } from "@/components/solutions/figures/platform/figure"
import {
  deliveryClose,
  deliveryPhases,
  solutions,
  solutionsIntro,
  type Solution,
  type SolutionFeature,
} from "@/content/solutions/content"

/*
 * The Solutions body, on the rhythm of Palantir's Ontology page (a client
 * reference): each area is an intro plate with a centred title, a grid of
 * short cards, and its figure in a full-width panel. Every block is its own
 * plate on the page, 10px apart, so an area reads as a set of pieces rather
 * than one column of text.
 */

/** The small label over a plate's title: a dot and a mono caption. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-accent-ink" />
      {children}
    </p>
  )
}

/** A short card: an accent title and a few lines of muted copy. */
function Card({
  feature,
  index,
}: {
  feature: SolutionFeature
  /** Shown as "01" when the cards are a sequence. */
  index?: number
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl bg-surface p-6 lg:p-8">
      {index === undefined ? null : (
        <span className="font-mono text-xs text-ink-soft tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <h3 className="font-heading text-xl leading-[1.2] text-accent-ink">
        {feature.label}
      </h3>
      <p className="text-base leading-[1.6] text-ink-soft">
        {feature.description}
      </p>
    </div>
  )
}

/** Cards in a grid of two or three, revealing one after another. */
function Cards({
  items,
  numbered,
}: {
  items: SolutionFeature[]
  numbered?: boolean
}) {
  return (
    <RevealStagger
      amount={0.1}
      className={cn(
        "grid gap-2.5",
        items.length > 1 && "sm:grid-cols-2",
        items.length % 3 === 0 && "lg:grid-cols-3"
      )}
    >
      {items.map((item, index) => (
        <RevealItem key={item.label} className="h-full">
          <Card feature={item} index={numbered ? index : undefined} />
        </RevealItem>
      ))}
    </RevealStagger>
  )
}

/** Each area's figure, full width in its own panel. */
const FIGURES: Record<string, React.ReactNode> = {
  "digital-infrastructure": <PlatformFigure />,
  "applied-intelligence": <LightTableFigure />,
  "powering-initiatives": <FieldLineFigure />,
}

/**
 * One solution area: intro plate, the parts of the area as cards, its figure
 * full width, then the remaining points as cards. `children` closes the
 * area (Powering Initiatives' delivery phases).
 */
function SolutionBlock({
  solution,
  number,
  children,
}: {
  solution: Solution
  number: number
  children?: React.ReactNode
}) {
  return (
    <Container id={solution.id} className="flex scroll-mt-24 flex-col gap-2.5">
      <Reveal asChild>
        <header className="flex flex-col items-center gap-6 rounded-3xl bg-surface px-6 py-16 text-center lg:py-24">
          <Eyebrow>Solution {String(number).padStart(2, "0")}</Eyebrow>
          <h2 className={cn("text-headline", "max-w-[18ch] text-ink")}>
            {solution.title}
          </h2>
          {/*
           * The role, not the cyan the design names: cyan manages 1.25:1 on
           * a light card where the blue anchor gets 6.09:1, and
           * `--brand-accent` is what already resolves per theme.
           */}
          <p className={cn("text-lede", "max-w-[52ch] text-accent-ink")}>
            {solution.lead}
          </p>
          {solution.description.map((paragraph) => (
            <p
              key={paragraph}
              className={cn("text-body", "max-w-[62ch] text-ink-soft")}
            >
              {paragraph}
            </p>
          ))}
        </header>
      </Reveal>

      {solution.list ? (
        <>
          <Reveal asChild>
            <div className="grid gap-4 rounded-3xl bg-surface p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-8">
              <h3 className="font-heading text-2xl leading-[1.15] font-light text-ink">
                {solution.list.heading}
              </h3>
              <div className="flex flex-col gap-3">
                <p className={cn("text-body", "text-ink-soft")}>
                  {solution.list.intro}
                </p>
                <p className={cn("text-body", "text-ink-soft")}>
                  {solution.list.outro}
                </p>
              </div>
            </div>
          </Reveal>
          <Cards items={solution.list.items} numbered />
        </>
      ) : null}

      <Reveal amount={0.15}>{FIGURES[solution.id]}</Reveal>

      <Cards items={solution.features} />

      {solution.cta ? (
        <Reveal className="flex justify-center rounded-3xl bg-surface p-6">
          <Button asChild size="lg" className={primaryPill}>
            <Link href={solution.cta.href}>{solution.cta.label}</Link>
          </Button>
        </Reveal>
      ) : null}

      {children}
    </Container>
  )
}

/**
 * The delivery phases, on a brand-blue plate.
 *
 * Scoped `dark` because the plate is brand blue in either theme: the roles
 * inside it have to keep resolving to their dark values or the labels turn
 * near-black on blue in light mode.
 */
function DeliveryPhases() {
  return (
    <section className="dark flex flex-col gap-8 overflow-clip rounded-3xl bg-accent p-8 lg:gap-12 lg:p-12">
      <header className="flex flex-col items-start justify-center gap-3">
        <Badge variant="inverse">Phases</Badge>
        <h2
          className={cn(
            "text-headline leading-[1.1]",
            "text-ink lg:max-w-[208px]"
          )}
        >
          How we deliver
        </h2>
      </header>

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-11 lg:grid-cols-4">
        {deliveryPhases.map((phase) => (
          <li key={phase.step} className="flex flex-col items-start gap-4">
            <span className="font-heading text-5xl leading-none font-medium text-ink">
              {phase.step}
            </span>
            <div className="flex min-w-0 flex-col gap-2.5 text-lg leading-[1.4] text-ink">
              <h3 className="font-bold">{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-start gap-6 border-t border-ink/20 pt-8">
        <p className={cn("text-body", "text-ink")}>{deliveryClose.text}</p>
        <Button asChild size="lg" className={primaryPill}>
          <Link href={deliveryClose.cta.href}>{deliveryClose.cta.label}</Link>
        </Button>
      </div>
    </section>
  )
}

/** The body of the page: the framing sentence, then the three areas. */
function SolutionAreas() {
  return (
    <section className="flex flex-col gap-section-tight">
      <Container className="flex flex-col items-start justify-center gap-6 pt-6">
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">Our Solutions</Badge>
          {solutionsIntro.map((paragraph) => (
            <p
              key={paragraph}
              className={cn("text-lede", "max-w-[671px] text-ink")}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Container>

      {solutions.map((solution, index) => (
        <SolutionBlock key={solution.id} solution={solution} number={index + 1}>
          {solution.id === "powering-initiatives" && (
            <Reveal amount={0.1}>
              <DeliveryPhases />
            </Reveal>
          )}
        </SolutionBlock>
      ))}
    </section>
  )
}

export { SolutionAreas, DeliveryPhases, Eyebrow, Cards }
