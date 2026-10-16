import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { DitherPanel } from "@/components/motion/dither-panel"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { FullHero } from "@/components/site/full-hero"
import { Cards, Eyebrow } from "@/components/solutions/solution-areas"
import { hasFigure, ProductFigureSlot } from "@/components/products/figures"
import {
  figuresOf,
  type ProductPage,
  type ProductSection,
} from "@/content/products/pages"

/*
 * A product's inner page, on the same rhythm as Solutions (Palantir's
 * Ontology page, the client reference): every block is its own plate, 10px
 * apart, and each section is a heading plate, its cards, then its figure
 * full width.
 */

/** The opening: the product's own dither front, title, lead and the ask. */
function ProductHero({
  page,
  name,
  seed,
  explore = "Explore",
}: {
  page: ProductPage
  name: string
  seed: number
  /** The word before the name on the second button (productsPage copy). */
  explore?: string
}) {
  return (
    <FullHero
      background={
        <DitherPanel
          seed={seed}
          level={0.55}
          tone="mono"
          className="absolute inset-0"
        />
      }
      badge={page.eyebrow}
      title={page.title}
      lead={page.lead[0]}
      rail={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="lg" className={primaryPill}>
            <Link href={page.primary.href}>{page.primary.label}</Link>
          </Button>
          {page.sections.length > 0 || page.lead.length > 1 ? (
            <Button asChild size="lg" variant="ghost" className={ghostPill}>
              <Link href="#overview">
                {explore} {name}
              </Link>
            </Button>
          ) : null}
        </div>
      }
    />
  )
}

/** Heading on the left, its copy on the right; stacked on a phone. */
function HeadingPlate({
  label,
  heading,
  body,
  note,
}: {
  label: string
  heading: string
  body: string[]
  note?: string
}) {
  return (
    <Reveal asChild>
      <header className="grid gap-6 rounded-3xl bg-surface p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-10">
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{label}</Eyebrow>
          <h2 className="font-heading text-2xl leading-[1.15] text-ink lg:text-[32px]">
            {heading}
          </h2>
        </div>
        {body.length || note ? (
          <div className="flex flex-col gap-4 lg:pt-8">
            {body.map((paragraph) => (
              <p key={paragraph} className={cn(bodyText, "text-ink-soft")}>
                {paragraph}
              </p>
            ))}
            {note ? (
              <p className="font-mono text-xs tracking-[0.08em] text-ink-soft uppercase">
                {note}
              </p>
            ) : null}
          </div>
        ) : null}
      </header>
    </Reveal>
  )
}

function Section({
  slug,
  section,
  index,
  figureNumber,
}: {
  slug: string
  section: ProductSection
  index: number
  /** The number of the section's first figure. */
  figureNumber: number
}) {
  return (
    <Container id={section.id} className="flex scroll-mt-24 flex-col gap-2.5">
      <HeadingPlate
        label={String(index + 1).padStart(2, "0")}
        heading={section.heading}
        body={section.body}
        note={section.note}
      />
      {section.cards ? <Cards items={section.cards} /> : null}
      {figuresOf(section)
        .filter((figure) => hasFigure(slug, figure))
        .map((figure, offset) => (
          <Reveal key={figure.key} amount={0.15}>
            <ProductFigureSlot
              slug={slug}
              figure={figure}
              number={figureNumber + offset}
            />
          </Reveal>
        ))}
    </Container>
  )
}

/** The page body: opening copy and figure, the sections, who it is for. */
function ProductBody({
  page,
  audienceLabel = "Who it is for",
}: {
  page: ProductPage
  /** Over the "Built for …" block (productsPage copy). */
  audienceLabel?: string
}) {
  // Figures count up down the page, the hero's first.
  const counts = page.sections.map((section) => figuresOf(section).length)
  const numbers = counts.map(
    (_, index) =>
      (page.figure ? 1 : 0) +
      counts.slice(0, index).reduce((sum, count) => sum + count, 0) +
      1
  )
  const rest = page.lead.slice(1)

  return (
    <section className="flex flex-col gap-24 lg:gap-32">
      <Container
        id="overview"
        className="flex scroll-mt-24 flex-col gap-2.5 pt-6"
      >
        {rest.length ? (
          <Reveal asChild>
            <div className="flex flex-col items-center gap-6 rounded-3xl bg-surface px-6 py-16 text-center lg:py-20">
              {rest.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn(bodyText, "max-w-[62ch] text-ink")}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        ) : null}
        {page.figure && hasFigure(page.slug, page.figure) ? (
          <Reveal amount={0.15}>
            <ProductFigureSlot
              slug={page.slug}
              figure={page.figure}
              number={1}
            />
          </Reveal>
        ) : null}
      </Container>

      {page.sections.map((section, index) => (
        <Section
          key={section.id}
          slug={page.slug}
          section={section}
          index={index}
          figureNumber={numbers[index]}
        />
      ))}

      {page.audience ? (
        <Container>
          <Reveal asChild>
            <div className="flex flex-col items-center gap-6 rounded-3xl bg-surface px-6 py-16 text-center lg:py-24">
              <Eyebrow>{audienceLabel}</Eyebrow>
              <h2 className={cn(headingText, "max-w-[22ch] text-ink")}>
                {page.audience.heading}
              </h2>
              {page.audience.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn(bodyText, "max-w-[62ch] text-ink-soft")}
                >
                  {paragraph}
                </p>
              ))}
              {page.audience.note ? (
                <p className="max-w-[62ch] text-sm text-ink-soft">
                  {page.audience.note}
                </p>
              ) : null}
            </div>
          </Reveal>
        </Container>
      ) : null}
    </section>
  )
}

/** The close: the product's own ask on the shared photographic plate. */
function ProductCta({ page }: { page: ProductPage }) {
  return (
    <CtaPanel accent="cyan">
      {/* Reveal stays on the inner content — the panel itself is sticky and must never gain a transform. */}
      <Reveal asChild>
        <div className="relative flex flex-col items-center gap-6 px-6">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
            <h2
              className={cn(
                headingText,
                "text-center text-ink lg:max-w-[440px] lg:text-left"
              )}
            >
              {page.close.heading}
            </h2>
            <p className="max-w-[339px] text-center text-lg leading-[1.4] text-ink lg:text-left">
              {page.close.text}
            </p>
          </div>
          <Button asChild size="lg" className={primaryPill}>
            <Link href={page.close.cta.href}>{page.close.cta.label}</Link>
          </Button>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { ProductHero, ProductBody, ProductCta }
