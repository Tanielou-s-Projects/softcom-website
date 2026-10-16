"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Container } from "@/components/landing/section"
import type { CaseStudy } from "@/content/case-studies/content"
import type { CaseStudiesPage } from "@/content/case-studies/page-copy"
import { Reveal } from "@/components/motion/reveal"

/** A sector name, or `null` for every sector. */
type Filter = string | null

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
  clientLabel,
}: {
  study: CaseStudy
  position: number
  total: number
  clientLabel: string
}) {
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <article
      className={cn(
        "flex flex-col items-start justify-end gap-2.5 overflow-clip rounded-3xl bg-surface p-6",
        "lg:min-h-[min(1024px,88svh)]"
      )}
    >
      {/*
       * Counted against what is on screen rather than against the whole
       * portfolio, so filtering to two studies reads "01 / 02" instead of
       * leaving gaps in the sequence.
       */}
      <div className="shrink-0 overflow-clip rounded-3xl bg-accent p-6">
        <p
          className={cn(
            "text-headline leading-[1.1]",
            "whitespace-nowrap text-signal"
          )}
        >
          {pad(position)} / {pad(total)}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-8 overflow-clip rounded-3xl bg-paper p-8 lg:p-[47px]">
          <h2 className={cn("text-headline leading-[1.1]", "text-ink")}>
            {study.title}
          </h2>
          <p className={cn("text-body", "text-ink")}>{study.challenge}</p>
        </div>

        <div className="flex flex-col items-start justify-center gap-2.5 lg:w-[34%] lg:shrink-0">
          {/* Larger than the badge's default 12px — the design sets 20px here. */}
          <Badge variant="brand" className="text-xl">
            {study.sector}
          </Badge>

          <div className="flex w-full flex-col gap-3 overflow-clip rounded-3xl bg-paper p-6">
            <p className={cn("text-headline leading-[1.1]", "text-ink")}>
              {study.stat.value}
            </p>
            <p className={cn("text-body", "text-ink-soft")}>
              {study.stat.label}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 overflow-clip rounded-3xl bg-paper p-6">
            <p className={cn("text-body", "text-ink-soft")}>{clientLabel}</p>
            <p className="font-heading text-lg leading-[1.1] text-ink">
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
function CaseStudyList({
  caseStudies,
  copy,
}: {
  caseStudies: CaseStudy[]
  copy: CaseStudiesPage
}) {
  const [filter, setFilter] = React.useState<Filter>(null)
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
    filter === null
      ? caseStudies
      : caseStudies.filter((study) => study.sector === filter)

  const filters: { value: Filter; label: string }[] = [
    { value: null, label: copy.filter.allLabel },
    ...copy.filter.sectors.map((sector) => ({ value: sector, label: sector })),
  ]

  return (
    <Container className="grid-12 gap-y-8 lg:items-start">
      {/*
       * Margin rather than padding for the drop, so the sticky box itself
       * starts low and then pins 96px down — clear of the floating nav pill.
       */}
      <aside className="md:col-span-12 lg:sticky lg:top-24 lg:col-span-3 lg:mt-32">
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
            const active = option.value === filter
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() => choose(option.value)}
                className={cn(
                  badgeVariants({ variant: active ? "inverse" : "default" }),
                  "cursor-pointer transition-colors"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </aside>

      <div
        ref={listRef}
        className="flex flex-col gap-6 md:col-span-12 lg:col-span-9"
      >
        {filtered.map((study, index) => (
          <Reveal key={study.id} amount={0.1}>
            <CaseStudyPanel
              study={study}
              position={index + 1}
              total={filtered.length}
              clientLabel={copy.labels.client}
            />
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

export { CaseStudyList }
