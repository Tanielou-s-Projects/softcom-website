import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { ScrollWords } from "@/components/motion/scroll-words"
import { CityFigure } from "@/components/solutions/figures/city/figure"
import { FieldFigure } from "@/components/solutions/figures/field/figure"
import {
  VignetteFigure,
  type VignetteId,
} from "@/components/solutions/figures/vignettes/figure"
import { PinnedStory } from "@/components/solutions/sections/pinned-story"
import { ScrollRail } from "@/components/solutions/sections/scroll-rail"
import { Timeline } from "@/components/solutions/sections/timeline"
import { solutions } from "@/content/solutions/content"
import type { SolutionsPage } from "@/content/solutions/page-copy"

/*
 * The Solutions body as a landing page: each area opens on its own number
 * and then tells itself in the form that suits it — a pinned story for the
 * parts of an operation, a sliding rail for the kinds of intelligence, a list
 * and a drawn timeline for delivery.
 */

/** The areas' anchors, which the hero rail links to; fixed, not copy. */
const [infrastructureId, intelligenceId, initiativesId] = solutions.map(
  (solution) => solution.id
)

/** An area's opening: a large index, the title and its one-line claim. */
function Opener({
  number,
  title,
  lead,
  id,
}: {
  number: string
  title: string
  lead: string
  id: string
}) {
  return (
    <Container id={id} className="scroll-mt-24">
      <Reveal className="grid-12 gap-y-6 border-t border-line pt-8 lg:pt-10">
        <span className="font-mono text-sm tracking-[0.12em] text-ink-soft tabular-nums md:col-span-4">
          {number} / 03
        </span>
        <div className="flex flex-col gap-6 md:col-span-8">
          <h2 className={cn("text-headline", "text-ink")}>{title}</h2>
          <p className={cn("text-lede", "max-w-[52ch] text-accent-ink")}>
            {lead}
          </p>
        </div>
      </Reveal>
    </Container>
  )
}

/* ── 01 · Digital Infrastructure ── */

const STEP_IDS = ["identity", "records", "services"]

function Infrastructure({ copy }: { copy: SolutionsPage["infrastructure"] }) {
  return (
    <section className="flex flex-col gap-section-tight">
      <Opener
        id={infrastructureId}
        number="01"
        title={copy.title}
        lead={copy.lead}
      />

      <Container className="flex flex-col gap-6">
        <Reveal className="flex max-w-[60ch] flex-col gap-4">
          <h3 className="font-heading text-2xl leading-[1.15] font-light text-ink lg:text-[2rem]">
            {copy.listHeading}
          </h3>
          <p className={cn("text-body", "text-ink-soft")}>{copy.listIntro}</p>
        </Reveal>
        <PinnedStory
          steps={copy.steps.map((item, index) => ({
            id: STEP_IDS[index] ?? `step-${index}`,
            label: item.label,
            title: item.label,
            body: item.description,
          }))}
          figure={
            <div className="line-panel rounded-3xl p-4 lg:p-8">
              <CityFigure />
            </div>
          }
        />
      </Container>

      <Container>
        <Reveal>
          <p className="mx-auto max-w-[30ch] text-center font-heading text-2xl leading-[1.2] font-light text-ink lg:text-[2.25rem]">
            {copy.outro}
          </p>
        </Reveal>
      </Container>

      {/* Two ways in, set against each other. */}
      <Container className="flex flex-col gap-2.5">
        <RevealStagger amount={0.2} className="grid gap-2.5 lg:grid-cols-2">
          <RevealItem className="h-full">
            <div className="dark flex h-full min-h-[360px] flex-col justify-between gap-10 rounded-3xl bg-accent p-8 lg:p-12">
              <span className="font-mono text-xs tracking-[0.12em] text-ink/70 uppercase">
                {copy.buildLabel}
              </span>
              <div className="flex flex-col gap-4">
                <h3 className={cn("text-headline", "text-ink")}>
                  {copy.buildTitle}
                </h3>
                <p className={cn("text-body", "max-w-[48ch] text-ink/85")}>
                  {copy.buildText}
                </p>
              </div>
            </div>
          </RevealItem>
          <RevealItem className="h-full">
            <div className="flex h-full min-h-[360px] flex-col justify-between gap-10 rounded-3xl bg-surface p-8 lg:p-12">
              <span className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">
                {copy.implementLabel}
              </span>
              <div className="flex flex-col gap-4">
                <h3 className={cn("text-headline", "text-ink")}>
                  {copy.implementTitle}
                </h3>
                <p className={cn("text-body", "max-w-[48ch] text-ink-soft")}>
                  {copy.implementText}
                </p>
              </div>
            </div>
          </RevealItem>
        </RevealStagger>
        {copy.ctaLabel ? (
          <Reveal className="flex justify-center pt-6">
            <ButtonLink href={copy.ctaHref} tone="ink">
              {copy.ctaLabel}
            </ButtonLink>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}

/* ── 02 · Applied Intelligence ── */

/** The rail's drawings, in card order: the first card sits over audit. */
const VIGNETTES: VignetteId[] = [
  "audit",
  "financial",
  "market",
  "regulatory",
  "societal",
]

function Intelligence({ copy }: { copy: SolutionsPage["intelligence"] }) {
  return (
    <section className="flex flex-col gap-10 lg:gap-0">
      <Opener
        id={intelligenceId}
        number="02"
        title={copy.title}
        lead={copy.lead}
      />

      <ScrollRail
        intro={
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end gap-6 rounded-3xl p-2 sm:w-[420px] lg:w-[460px] lg:p-8">
            <span className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">
              {copy.railLabel}
            </span>
            {copy.railIntro.map((paragraph) => (
              <p
                key={paragraph}
                className="text-xl leading-[1.4] text-ink lg:text-2xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        }
      >
        {copy.kinds.map((kind, index) => (
          <article
            key={kind.label}
            className="flex w-[82vw] shrink-0 snap-start flex-col overflow-clip rounded-3xl bg-surface sm:w-[420px] lg:w-[440px]"
          >
            <div className="line-panel px-6 pt-6">
              <VignetteFigure
                id={VIGNETTES[index % VIGNETTES.length]}
                label={kind.label}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
              <span className="font-mono text-xs text-ink-soft tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-2xl leading-[1.15] font-light text-ink">
                {kind.label}
              </h3>
              <p className="text-base leading-[1.6] text-ink-soft">
                {kind.description}
              </p>
            </div>
          </article>
        ))}
      </ScrollRail>

      {copy.shapedHeading ? (
        <Container className="pt-section-tight">
          <div className="grid-12 gap-y-10 border-t border-line pt-10">
            <Reveal className="md:col-span-4">
              <h3 className={cn("text-headline", "text-ink")}>
                {copy.shapedHeading}
              </h3>
            </Reveal>
            <div className="flex flex-col gap-10 md:col-span-8">
              {/* The three things each system reflects, from the copy. */}
              <RevealStagger
                amount={0.2}
                className="grid border-y border-line sm:grid-cols-3"
              >
                {copy.shapedPoints.map((item, index) => (
                  <RevealItem key={item}>
                    <div className="flex h-full flex-col gap-6 border-line py-6 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                      <span className="font-mono text-xs text-ink-soft tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-2xl leading-[1.15] font-light text-ink">
                        {item}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>
              <Reveal className="flex flex-col items-start gap-6">
                <p className={cn("text-body", "max-w-[56ch] text-ink-soft")}>
                  {copy.shapedText}
                </p>
                {copy.ctaLabel ? (
                  <ButtonLink href={copy.ctaHref} tone="ink">
                    {copy.ctaLabel}
                  </ButtonLink>
                ) : null}
              </Reveal>
            </div>
          </div>
        </Container>
      ) : null}
    </section>
  )
}

/* ── 03 · Powering Initiatives ── */

function Initiatives({ copy }: { copy: SolutionsPage["initiatives"] }) {
  return (
    <section className="flex flex-col gap-section-tight">
      <Opener
        id={initiativesId}
        number="03"
        title={copy.title}
        lead={copy.lead}
      />

      <Container>
        <Reveal amount={0.15}>
          <FieldFigure />
        </Reveal>
      </Container>

      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-gutter">
        <div className="lg:col-span-4">
          <Reveal className="flex flex-col gap-6 lg:sticky lg:top-32">
            <h3 className="font-heading text-2xl leading-[1.15] font-light text-ink lg:text-[2rem]">
              {copy.entrustHeading}
            </h3>
            <p className={cn("text-body", "text-ink-soft")}>
              {copy.entrustText}
            </p>
          </Reveal>
        </div>
        <RevealStagger amount={0.15} className="flex flex-col lg:col-span-8">
          {copy.entrustItems.map((item, index) => (
            <RevealItem key={item}>
              <div className="group flex items-baseline gap-6 border-b border-line py-5 lg:py-6">
                <span className="w-8 font-mono text-sm text-ink-soft tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-3xl leading-[1.1] font-light tracking-tight text-ink transition-colors group-hover:text-accent-ink lg:text-5xl">
                  {item}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>

      <Container>
        <Reveal amount={0.1}>
          <div className="dark flex flex-col gap-12 overflow-clip rounded-3xl bg-accent p-8 lg:gap-16 lg:p-14">
            <header className="flex flex-col items-start gap-3">
              <Badge variant="inverse">{copy.phasesBadge}</Badge>
              <h2 className={cn("text-headline", "text-ink")}>
                {copy.phasesHeading}
              </h2>
            </header>
            <Timeline phases={copy.phases} />
            <div className="flex flex-col items-start gap-6 border-t border-ink/20 pt-8 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-[40ch] font-heading text-2xl leading-[1.25] font-light text-ink">
                {copy.closeText}
              </p>
              <ButtonLink href={copy.closeCtaHref} tone="light">
                {copy.closeCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/** The body of the Solutions page, after the hero. */
function SolutionsStory({ copy }: { copy: SolutionsPage }) {
  return (
    <div className="flex flex-col gap-section">
      <Container className="flex flex-col items-start gap-8 pt-16 lg:pt-24">
        <Badge variant="brand">{copy.intro.badge}</Badge>
        <ScrollWords
          paragraphs={copy.intro.paragraphs}
          className="max-w-[1040px]"
          paragraphClassName="font-heading font-light text-3xl leading-[1.15] tracking-tight text-ink lg:text-5xl"
        />
      </Container>
      <Infrastructure copy={copy.infrastructure} />
      <Intelligence copy={copy.intelligence} />
      <Initiatives copy={copy.initiatives} />
    </div>
  )
}

export { SolutionsStory }
