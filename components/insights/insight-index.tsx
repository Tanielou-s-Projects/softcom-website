"use client"

import * as React from "react"

import { InsightCard } from "@/components/insights/insight-card"
import { Reveal } from "@/components/motion/reveal"
import type { Insight } from "@/content/insights/content"
import type { InsightsPage } from "@/content/insights/page-copy"
import { cn } from "@/lib/utils"

/** A topic name, or `null` for every topic. */
type Filter = string | null

/*
 * Grid positions left empty on wide screens, out of every nine cells: the
 * holes stagger the three columns into an editorial checkerboard rather than
 * a catalogue.
 */
const HOLES = new Set([1, 5, 7])

/** The cards with spacer cells (`null`) dropped in at the hole positions. */
function withHoles(items: Insight[]) {
  const cells: (Insight | null)[] = []
  for (const item of items) {
    while (HOLES.has(cells.length % 9)) cells.push(null)
    cells.push(item)
  }
  return cells
}

/*
 * The index under the hero: a ruled topic filter, the lead story, then the
 * rest on a three-column grid with deliberate empty cells. The filter drives
 * both — the first match leads, so a narrowed index still reads as a page.
 */
export function InsightIndex({
  insights,
  copy,
}: {
  insights: Insight[]
  copy: InsightsPage
}) {
  const [filter, setFilter] = React.useState<Filter>(null)

  // Only offer topics that have something behind them.
  const options: { value: Filter; label: string }[] = [
    { value: null, label: copy.filter.allLabel },
    ...copy.filter.topics
      .filter((topic) => insights.some((insight) => insight.topic === topic))
      .map((topic) => ({ value: topic, label: topic })),
  ]

  const filtered =
    filter === null
      ? insights
      : insights.filter((insight) => insight.topic === filter)
  const [featured, ...latest] = filtered

  return (
    <section className="shell">
      <div className="flex flex-col gap-6 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filter insights by topic"
          className="flex flex-wrap gap-2"
        >
          {options.map((option) => {
            const active = option.value === filter
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "h-9 cursor-pointer rounded-full border px-4 text-sm transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line-strong text-ink-soft hover:border-ink hover:text-ink"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="label text-ink-faint">
          {String(filtered.length).padStart(2, "0")} /{" "}
          {String(insights.length).padStart(2, "0")}
        </p>
      </div>

      {/* Keyed on the filter, so each new selection arrives with the reveal. */}
      <div key={filter ?? "all"}>
        {featured ? (
          <Reveal className="mt-12 md:mt-20">
            <h2 className="label mb-6 text-ink-soft">
              {copy.headings.featured}
            </h2>
            <InsightCard insight={featured} featured />
          </Reveal>
        ) : (
          <p className="mt-12 text-ink-soft md:mt-20">
            Nothing published under this topic yet.
          </p>
        )}

        {latest.length > 0 && (
          <div className="mt-24 md:mt-36">
            <h2 className="label border-b border-line pb-5 text-ink-soft">
              {copy.headings.latest.replace(/\n/g, " ")}
            </h2>
            <Reveal
              as="ul"
              stagger
              className="mt-10 grid gap-x-6 gap-y-16 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-20"
            >
              {withHoles(latest).map((insight, i) =>
                insight ? (
                  <li key={insight.id}>
                    <InsightCard insight={insight} />
                  </li>
                ) : (
                  <li
                    key={`hole-${i}`}
                    aria-hidden="true"
                    className="hidden lg:block"
                  />
                )
              )}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
