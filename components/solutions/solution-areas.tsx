import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  cardHeadingText,
  Container,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { RailsFigure } from "@/components/solutions/figures/rails/figure"
import {
  deliveryClose,
  deliveryPhases,
  solutions,
  solutionsIntro,
  type Solution,
  type SolutionList,
} from "@/components/solutions/content"
import { ColorReveal } from "@/components/motion/color-reveal"

/**
 * A point in a solution's copy, as a tile: the dense lists read as a set of
 * equal things to scan rather than one long column. `mark` is an index
 * ("01") or, left empty, the alternating brand dot.
 */
function Tile({
  label,
  description,
  index,
  numbered,
}: {
  label: string
  description: string
  index: number
  numbered?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-6">
      {numbered ? (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            "size-2.5 rounded-full",
            index % 2 === 0 ? "bg-brand-cyan" : "bg-brand-blue"
          )}
        />
      )}
      <h3 className="font-heading text-xl leading-[1.15] text-card-foreground">
        {label}
      </h3>
      <p className="text-base leading-[1.6] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/** A subheaded list inside a solution, e.g. the parts of an operation. */
function ListBlock({ list }: { list: SolutionList }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-2xl leading-[1.1] text-foreground">
          {list.heading}
        </h3>
        <p className={cn(bodyText, "text-muted-foreground")}>{list.intro}</p>
      </div>
      <RevealStagger className="grid gap-2.5">
        {list.items.map((item, index) => (
          <RevealItem key={item.label}>
            <Tile {...item} index={index} numbered />
          </RevealItem>
        ))}
      </RevealStagger>
      <p className={cn(bodyText, "text-muted-foreground")}>{list.outro}</p>
    </div>
  )
}

/**
 * Each area's illustration. An anatomy figure where one is drawn; until
 * then, the area's photograph in the same slot.
 */
const FIGURES: Partial<Record<string, React.ReactNode>> = {
  "digital-infrastructure": <RailsFigure />,
}

function Illustration({ solution }: { solution: Solution }) {
  const figure = FIGURES[solution.id]
  if (figure) return figure
  return (
    <div className="relative aspect-[4/5] overflow-clip rounded-3xl bg-card">
      <ColorReveal>
        <Image
          src={solution.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
          style={{ objectPosition: solution.image.position }}
        />
      </ColorReveal>
    </div>
  )
}

/**
 * One solution area. A numbered header runs the full width; below it the
 * illustration holds still in a sticky column while the copy beside it
 * arrives in pieces as it scrolls by — the area is read in steps rather
 * than as one wall of text. The illustration alternates sides down the page.
 * `children` runs the full width under both columns (Powering Initiatives'
 * delivery phases), where its four phases have room to sit side by side.
 */
function SolutionBlock({
  solution,
  number,
  reversed,
  children,
}: {
  solution: Solution
  number: number
  reversed?: boolean
  children?: React.ReactNode
}) {
  return (
    <Container
      id={solution.id}
      className="flex scroll-mt-24 flex-col gap-10 lg:gap-16"
    >
      <Reveal asChild>
        <header className="grid gap-6 border-t border-border pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex items-baseline gap-5">
            <span className="font-mono text-sm text-muted-foreground tabular-nums">
              {String(number).padStart(2, "0")}
            </span>
            <h2 className={cn(cardHeadingText, "text-foreground")}>
              {solution.title}
            </h2>
          </div>
          {/*
           * The role, not the cyan the design names: cyan manages 1.25:1 on
           * a light card where the blue anchor gets 6.09:1, and
           * `--brand-accent` is what already resolves per theme.
           */}
          <p className={cn(leadText, "text-brand-accent")}>{solution.lead}</p>
        </header>
      </Reveal>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn("lg:sticky lg:top-24", reversed && "lg:order-2")}>
          <Reveal amount={0.2}>
            <Illustration solution={solution} />
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-col gap-12">
          {solution.description.map((paragraph) => (
            <Reveal key={paragraph}>
              <p className={cn(bodyText, "text-foreground")}>{paragraph}</p>
            </Reveal>
          ))}

          {solution.list ? (
            <Reveal amount={0.1}>
              <ListBlock list={solution.list} />
            </Reveal>
          ) : null}

          <RevealStagger
            amount={0.1}
            className={cn(
              "grid gap-2.5",
              solution.features.length > 1 && "sm:grid-cols-2"
            )}
          >
            {solution.features.map((feature, index) => (
              <RevealItem key={feature.label}>
                <Tile {...feature} index={index} />
              </RevealItem>
            ))}
          </RevealStagger>

          {solution.cta ? (
            <Reveal>
              <Button asChild size="lg" className={primaryPill}>
                <Link href={solution.cta.href}>{solution.cta.label}</Link>
              </Button>
            </Reveal>
          ) : null}
        </div>
      </div>

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
    <section className="dark flex flex-col gap-8 overflow-clip rounded-3xl bg-brand-blue p-8 lg:gap-12 lg:p-12">
      <header className="flex flex-col items-start justify-center gap-3">
        <Badge variant="inverse">Phases</Badge>
        <h2 className={cn(cardHeadingText, "text-foreground lg:max-w-[208px]")}>
          How we deliver
        </h2>
      </header>

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-11 lg:grid-cols-4">
        {deliveryPhases.map((phase) => (
          <li key={phase.step} className="flex flex-col items-start gap-4">
            <span className="font-heading text-5xl leading-none font-medium text-foreground">
              {phase.step}
            </span>
            <div className="flex min-w-0 flex-col gap-2.5 text-lg leading-[1.4] text-foreground">
              <h3 className="font-bold">{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-start gap-6 border-t border-foreground/20 pt-8">
        <p className={cn(bodyText, "text-foreground")}>{deliveryClose.text}</p>
        <Button asChild size="lg" className={primaryPill}>
          <Link href={deliveryClose.cta.href}>{deliveryClose.cta.label}</Link>
        </Button>
      </div>
    </section>
  )
}

/**
 * The body of the page: the framing sentence, then the three areas.
 *
 * The delivery panel belongs to Powering Initiatives rather than to the page, which is why
 * it is passed in as that block's child — in the design it sits inside the same
 * column as the Powering Initiatives copy, not below the whole section.
 */
function SolutionAreas() {
  return (
    <section className="flex flex-col gap-16">
      <Container className="flex flex-col items-start justify-center gap-6 pt-6">
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">Our Solutions</Badge>
          {solutionsIntro.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(leadText, "max-w-[671px] text-foreground")}
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Container>

      <div className="flex flex-col gap-24 lg:gap-40">
        {solutions.map((solution, index) => (
          <SolutionBlock
            key={solution.id}
            solution={solution}
            number={index + 1}
            reversed={index % 2 === 1}
          >
            {solution.id === "powering-initiatives" && (
              <Reveal amount={0.1}>
                <DeliveryPhases />
              </Reveal>
            )}
          </SolutionBlock>
        ))}
      </div>
    </section>
  )
}

export { SolutionAreas, DeliveryPhases }
