"use client"

import * as React from "react"

import { Reveal } from "@/components/motion/reveal"
import type { CaseStudy } from "@/content/case-studies/content"
import type { CaseStudiesPage } from "@/content/case-studies/page-copy"
import { cn } from "@/lib/utils"

/** A sector name, or `null` for every sector. */
type Filter = string | null

const pad = (n: number) => String(n).padStart(2, "0")

/*
 * The portfolio as a ruled index: one row per engagement, its number, sector
 * and title on the left, the challenge in the middle and the figure it moved
 * on the right. A row of sector pills above filters it in place; each pill
 * carries its count, and a sector with nothing in it can't be chosen.
 */
export function CaseStudyIndex({
  caseStudies,
  copy,
}: {
  caseStudies: CaseStudy[]
  copy: CaseStudiesPage
}) {
  const [filter, setFilter] = React.useState<Filter>(null)

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: null, label: copy.filter.allLabel, count: caseStudies.length },
    ...copy.filter.sectors.map((sector) => ({
      value: sector,
      label: sector,
      count: caseStudies.filter((study) => study.sector === sector).length,
    })),
  ]

  const shown =
    filter === null
      ? caseStudies
      : caseStudies.filter((study) => study.sector === filter)

  return (
    <section className="mt-16 md:mt-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div
            role="group"
            aria-label="Filter case studies by sector"
            className="flex flex-wrap gap-1.5"
          >
            {filters.map((option) => {
              const active = option.value === filter
              return (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={active}
                  disabled={option.count === 0}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line-strong hover:border-ink"
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "font-mono text-xs",
                      active ? "text-paper/60" : "text-ink-faint"
                    )}
                  >
                    {pad(option.count)}
                  </span>
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="label text-ink-soft">
            {pad(shown.length)} / {pad(caseStudies.length)}
          </p>
        </Reveal>
        <Reveal
          as="ol"
          stagger="rows"
          className="mt-10 border-t border-line md:mt-12"
        >
          {shown.map((study, i) => (
            <li
              key={study.id}
              className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-x-6 md:py-14"
            >
              <span className="label text-ink-faint md:col-span-1 md:pt-2">
                {pad(i + 1)}
              </span>
              <div className="md:col-span-5">
                <p className="inline-flex rounded-full border border-line px-3 py-1 text-sm">
                  {study.sector}
                </p>
                <h2 className="mt-5 text-title text-balance">{study.title}</h2>
                {study.client && (
                  <p className="mt-6 text-sm text-ink-soft">
                    <span className="label mr-3 text-ink-faint">
                      {copy.labels.client}
                    </span>
                    {study.client}
                  </p>
                )}
              </div>
              <p className="text-ink-soft md:col-span-4">{study.challenge}</p>
              {study.stat.value && (
                <div className="md:col-span-2 md:text-right">
                  <p className="text-headline font-light text-accent">
                    {study.stat.value}
                  </p>
                  <p className="label mt-3 text-ink-soft">{study.stat.label}</p>
                </div>
              )}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
