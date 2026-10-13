"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import {
  bodyText,
  cardHeadingText,
  Container,
} from "@/components/landing/section"
import {
  caseStudies,
  sectors,
  type CaseStudy,
  type Sector,
} from "@/components/case-studies/content"
import { Reveal } from "@/components/motion/reveal"

type Filter = Sector | "All"

/**
 * One engagement, bottom-weighted on a full-height plate.
 *
 * The empty upper two thirds is the design's, not a mistake: each study takes a
 * viewport, so scrolling reveals them one at a time.
 */
function CaseStudyPanel({
  study,
  position,
  total,
}: {
  study: CaseStudy
  position: number
  total: number
}) {
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <article
      className={cn(
        "flex flex-col items-start justify-end gap-2.5 overflow-clip rounded-3xl bg-popover p-6",
        "lg:min-h-[min(1024px,88svh)]"
      )}
    >
      {/*
       * Counted against what is on screen rather than against the whole
       * portfolio, so filtering to two studies reads "01 / 02" instead of
       * leaving gaps in the sequence.
       */}
      <div className="shrink-0 overflow-clip rounded-3xl bg-brand-blue p-6">
        <p className={cn(cardHeadingText, "whitespace-nowrap text-brand-cyan")}>
          {pad(position)} / {pad(total)}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-8 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]">
          <h2 className={cn(cardHeadingText, "text-foreground")}>
            {study.title}
          </h2>
          <p className={cn(bodyText, "text-foreground")}>{study.challenge}</p>
        </div>

        <div className="flex flex-col items-start justify-center gap-2.5 lg:w-[34%] lg:shrink-0">
          {/* Larger than the badge's default 12px — the design sets 20px here. */}
          <Badge variant="brand" className="text-xl">
            {study.sector}
          </Badge>

          <div className="flex w-full flex-col gap-3 overflow-clip rounded-3xl bg-background p-6">
            <p className={cn(cardHeadingText, "text-foreground")}>
              {study.stat.value}
            </p>
            <p className={cn(bodyText, "text-muted-foreground")}>
              {study.stat.label}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 overflow-clip rounded-3xl bg-background p-6">
            <p className={cn(bodyText, "text-muted-foreground")}>Client</p>
            <p className="font-heading text-lg leading-[1.1] text-foreground">
              {study.client}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * The portfolio: a sector filter in the left gutter, the studies beside it.
 *
 * The filter is real rather than decorative — the design draws it in an active
 * state, and a row of pills that does nothing when clicked is worse than none.
 * On desktop it is sticky, so it follows the reader down the list.
 */
function CaseStudyList() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const listRef = React.useRef<HTMLDivElement>(null)

  /*
   * Filtering from deep in the list shortens the page under the reader, who
   * would land somewhere arbitrary. Bring the top of the results back into
   * view instead — only when it has scrolled away, so a filter used at the
   * top of the list doesn't jolt the page.
   */
  const choose = (option: Filter) => {
    setFilter(option)
    const list = listRef.current
    if (!list || list.getBoundingClientRect().top >= 0) return
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
    window.scrollTo({
      top: list.getBoundingClientRect().top + window.scrollY - 96,
      behavior: smooth ? "smooth" : "auto",
    })
  }

  const filtered =
    filter === "All"
      ? caseStudies
      : caseStudies.filter((study) => study.sector === filter)

  const filters: Filter[] = ["All", ...sectors]

  return (
    <Container className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
      {/*
       * Margin rather than padding for the drop, so the sticky box itself
       * starts low and then pins 96px down — clear of the floating nav pill.
       */}
      <aside className="lg:sticky lg:top-24 lg:mt-32 lg:w-[28%] lg:shrink-0 lg:pr-8">
        <div
          role="group"
          aria-label="Filter case studies by sector"
          className="flex flex-wrap items-center gap-3"
        >
          {/*
           * `badgeVariants` on a real button rather than `<Badge asChild>` —
           * Badge renders a plain span and takes no `asChild`, and these have to
           * be buttons to be operable by keyboard.
           */}
          {filters.map((option) => {
            const active = option === filter
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => choose(option)}
                className={cn(
                  badgeVariants({ variant: active ? "inverse" : "default" }),
                  "cursor-pointer transition-colors"
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </aside>

      <div ref={listRef} className="flex min-w-0 flex-1 flex-col gap-6">
        {filtered.map((study, index) => (
          <Reveal key={study.id} amount={0.1}>
            <CaseStudyPanel
              study={study}
              position={index + 1}
              total={filtered.length}
            />
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

export { CaseStudyList }
