import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
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
import {
  deliveryClose,
  deliveryPhases,
  entrust,
  solutions,
  solutionsIntro,
} from "@/components/solutions/content"

/*
 * The Solutions body as a landing page: each area opens on its own number
 * and then tells itself in the form that suits it — a pinned story for the
 * parts of an operation, a sliding rail for the kinds of intelligence, a list
 * and a drawn timeline for delivery.
 */

const [infrastructure, intelligence, initiatives] = solutions

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
      <Reveal className="grid gap-6 border-t border-border pt-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 lg:pt-10">
        <span className="font-mono text-sm tracking-[0.12em] text-muted-foreground tabular-nums">
          {number} / 03
        </span>
        <div className="flex flex-col gap-6">
          <h2 className={cn(headingText, "text-foreground")}>{title}</h2>
          <p className={cn(leadText, "max-w-[52ch] text-brand-accent")}>
            {lead}
          </p>
        </div>
      </Reveal>
    </Container>
  )
}

/* ── 01 · Digital Infrastructure ── */

const STEP_IDS = ["identity", "records", "services"]

function Infrastructure() {
  const list = infrastructure.list!
  const [built, global] = infrastructure.features
  return (
    <section className="flex flex-col gap-24 lg:gap-40">
      <Opener
        id={infrastructure.id}
        number="01"
        title={infrastructure.title}
        lead={infrastructure.lead}
      />

      <Container className="flex flex-col gap-6">
        <Reveal className="flex max-w-[60ch] flex-col gap-4">
          <h3 className="font-heading text-2xl leading-[1.15] text-foreground lg:text-[2rem]">
            {list.heading}
          </h3>
          <p className={cn(bodyText, "text-muted-foreground")}>{list.intro}</p>
        </Reveal>
        <PinnedStory
          steps={list.items.map((item, index) => ({
            id: STEP_IDS[index],
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
          <p className="mx-auto max-w-[30ch] text-center font-heading text-2xl leading-[1.2] text-foreground lg:text-[2.25rem]">
            {list.outro}
          </p>
        </Reveal>
      </Container>

      {/* Two ways in, set against each other. */}
      <Container className="flex flex-col gap-2.5">
        <RevealStagger amount={0.2} className="grid gap-2.5 lg:grid-cols-2">
          <RevealItem className="h-full">
            <div className="dark flex h-full min-h-[360px] flex-col justify-between gap-10 rounded-3xl bg-brand-blue p-8 lg:p-12">
              <span className="font-mono text-xs tracking-[0.12em] text-foreground/70 uppercase">
                Build
              </span>
              <div className="flex flex-col gap-4">
                <h3 className={cn(headingText, "text-foreground")}>
                  {built.label}
                </h3>
                <p className={cn(bodyText, "max-w-[48ch] text-foreground/85")}>
                  {built.description}
                </p>
              </div>
            </div>
          </RevealItem>
          <RevealItem className="h-full">
            <div className="flex h-full min-h-[360px] flex-col justify-between gap-10 rounded-3xl bg-card p-8 lg:p-12">
              <span className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
                Implement
              </span>
              <div className="flex flex-col gap-4">
                <h3 className={cn(headingText, "text-foreground")}>
                  {global.label}
                </h3>
                <p
                  className={cn(bodyText, "max-w-[48ch] text-muted-foreground")}
                >
                  {global.description}
                </p>
              </div>
            </div>
          </RevealItem>
        </RevealStagger>
        {infrastructure.cta ? (
          <Reveal className="flex justify-center pt-6">
            <Button asChild size="lg" className={primaryPill}>
              <Link href={infrastructure.cta.href}>
                {infrastructure.cta.label}
              </Link>
            </Button>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}

/* ── 02 · Applied Intelligence ── */

const VIGNETTE_OF: Record<string, VignetteId> = {
  "Audit Intelligence": "audit",
  "Financial Intelligence": "financial",
  "Market Intelligence": "market",
  "Regulatory Intelligence": "regulatory",
  "Societal Intelligence": "societal",
}

/** "Each system reflects the mandate of its users, the evidence they need and the decisions they must make." */
const SHAPED_BY = [
  "The mandate of its users",
  "The evidence they need",
  "The decisions they must make",
]

function Intelligence() {
  const kinds = intelligence.features.filter((f) => VIGNETTE_OF[f.label])
  const shaped = intelligence.features.find((f) => !VIGNETTE_OF[f.label])
  return (
    <section className="flex flex-col gap-10 lg:gap-0">
      <Opener
        id={intelligence.id}
        number="02"
        title={intelligence.title}
        lead={intelligence.lead}
      />

      <ScrollRail
        intro={
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end gap-6 rounded-3xl p-2 sm:w-[420px] lg:w-[460px] lg:p-8">
            <span className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
              Five kinds of intelligence →
            </span>
            {intelligence.description.map((paragraph) => (
              <p
                key={paragraph}
                className="text-xl leading-[1.4] text-foreground lg:text-2xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        }
      >
        {kinds.map((kind, index) => (
          <article
            key={kind.label}
            className="flex w-[82vw] shrink-0 snap-start flex-col overflow-clip rounded-3xl bg-card sm:w-[420px] lg:w-[440px]"
          >
            <div className="line-panel px-6 pt-6">
              <VignetteFigure id={VIGNETTE_OF[kind.label]} label={kind.label} />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-2xl leading-[1.15] text-foreground">
                {kind.label}
              </h3>
              <p className="text-base leading-[1.6] text-muted-foreground">
                {kind.description}
              </p>
            </div>
          </article>
        ))}
      </ScrollRail>

      {shaped ? (
        <Container className="pt-24 lg:pt-40">
          <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <Reveal>
              <h3 className={cn(headingText, "text-foreground")}>
                {shaped.label}
              </h3>
            </Reveal>
            <div className="flex flex-col gap-10">
              {/* The three things each system reflects, from the copy. */}
              <RevealStagger
                amount={0.2}
                className="grid border-y border-border sm:grid-cols-3"
              >
                {SHAPED_BY.map((item, index) => (
                  <RevealItem key={item}>
                    <div className="flex h-full flex-col gap-6 border-border py-6 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-2xl leading-[1.15] text-foreground">
                        {item}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>
              <Reveal className="flex flex-col items-start gap-6">
                <p
                  className={cn(bodyText, "max-w-[56ch] text-muted-foreground")}
                >
                  {shaped.description.split(". ").slice(1).join(". ")}
                </p>
                {intelligence.cta ? (
                  <Button asChild size="lg" className={primaryPill}>
                    <Link href={intelligence.cta.href}>
                      {intelligence.cta.label}
                    </Link>
                  </Button>
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

function Initiatives() {
  return (
    <section className="flex flex-col gap-24 lg:gap-40">
      <Opener
        id={initiatives.id}
        number="03"
        title={initiatives.title}
        lead={initiatives.lead}
      />

      <Container>
        <Reveal amount={0.15}>
          <FieldFigure />
        </Reveal>
      </Container>

      <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <Reveal className="flex flex-col gap-6 lg:sticky lg:top-32">
            <h3 className="font-heading text-2xl leading-[1.15] text-foreground lg:text-[2rem]">
              {entrust.heading}
            </h3>
            <p className={cn(bodyText, "text-muted-foreground")}>
              {entrust.outro}
            </p>
          </Reveal>
        </div>
        <RevealStagger amount={0.15} className="flex flex-col">
          {entrust.items.map((item, index) => (
            <RevealItem key={item}>
              <div className="group flex items-baseline gap-6 border-b border-border py-5 lg:py-6">
                <span className="w-8 font-mono text-sm text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-3xl leading-[1.1] tracking-tight text-foreground transition-colors group-hover:text-brand-accent lg:text-5xl">
                  {item}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>

      <Container>
        <Reveal amount={0.1}>
          <div className="dark flex flex-col gap-12 overflow-clip rounded-3xl bg-brand-blue p-8 lg:gap-16 lg:p-14">
            <header className="flex flex-col items-start gap-3">
              <Badge variant="inverse">Phases</Badge>
              <h2 className={cn(headingText, "text-foreground")}>
                How we deliver
              </h2>
            </header>
            <Timeline phases={deliveryPhases} />
            <div className="flex flex-col items-start gap-6 border-t border-foreground/20 pt-8 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-[40ch] font-heading text-2xl leading-[1.25] text-foreground">
                {deliveryClose.text}
              </p>
              <Button asChild size="lg" className={primaryPill}>
                <Link href={deliveryClose.cta.href}>
                  {deliveryClose.cta.label}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/** The body of the Solutions page, after the hero. */
function SolutionsStory() {
  return (
    <div className="flex flex-col gap-48 lg:gap-80">
      <Container className="flex flex-col items-start gap-8 pt-16 lg:pt-24">
        <Badge variant="brand">Our Solutions</Badge>
        <ScrollWords
          paragraphs={solutionsIntro}
          className="max-w-[1040px]"
          paragraphClassName="font-heading text-3xl leading-[1.15] tracking-tight text-foreground lg:text-5xl"
        />
      </Container>
      <Infrastructure />
      <Intelligence />
      <Initiatives />
    </div>
  )
}

export { SolutionsStory }
