"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import {
  cardHeadingText,
  Container,
  leadText,
} from "@/components/landing/section"
import { InsightCard } from "@/components/insights/insight-card"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import {
  insights,
  insightsIntro,
  topics,
  type Topic,
} from "@/components/insights/content"

type Filter = Topic | "All"

/**
 * The topic filter. Figma parks it in the right gutter inside a container that
 * spans the whole list and pins its contents — so it stays in view while the
 * cards scroll past. Absolute positioning is the design's own mechanism here,
 * not a shortcut: the rules and cards below are narrower than the page, so the
 * rail can't be a flex sibling without dragging their widths around with it.
 *
 * Below `lg` it collapses into the normal flow, under the standfirst.
 */
function TopicFilter({
  filter,
  onFilterChange,
}: {
  filter: Filter
  onFilterChange: (filter: Filter) => void
}) {
  const options: Filter[] = ["All", ...topics]

  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[29%]">
      <div
        role="group"
        aria-label="Filter insights by topic"
        className="flex flex-wrap items-center gap-3 lg:sticky lg:top-6 lg:justify-end lg:pt-6"
      >
        {/*
         * `badgeVariants` on real buttons rather than `<Badge>` — Badge renders
         * a plain span and takes no `asChild`, and these have to be buttons to
         * be operable by keyboard.
         */}
        {options.map((option) => {
          const active = option === filter
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(option)}
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
    </div>
  )
}

/**
 * The index: a standfirst and topic filter, one featured insight, then the rest
 * in two columns.
 *
 * The filter drives both sections. The design can only draw the unfiltered
 * state, so the rule here is that the first match is featured and the remainder
 * fill the grid — that way narrowing to a topic still reads as a page rather
 * than leaving a featured card that contradicts the active filter.
 */
function InsightList() {
  const [filter, setFilter] = React.useState<Filter>("All")

  const filtered =
    filter === "All"
      ? insights
      : insights.filter((insight) => insight.topic === filter)

  const [featured, ...latest] = filtered

  return (
    <Container className="relative flex flex-col gap-16 pt-16">
      <TopicFilter filter={filter} onFilterChange={setFilter} />

      <Reveal className="flex flex-col gap-6">
        <p className={cn(leadText, "max-w-[629px] leading-[1.6]")}>
          {insightsIntro}
        </p>
        <div aria-hidden className="h-px w-full bg-border" />
      </Reveal>

      {featured && (
        <Reveal as="section" className="flex max-w-[921px] flex-col gap-12">
          <h2 className={cn(cardHeadingText, "max-w-[359px] text-foreground")}>
            Featured Insight
          </h2>
          <InsightCard
            insight={featured}
            layout="featured"
            sizes="(min-width: 1024px) 921px, 100vw"
          />
        </Reveal>
      )}

      {latest.length > 0 && (
        <section className="flex max-w-[917px] flex-col gap-12">
          <Reveal asChild>
            <h2
              className={cn(cardHeadingText, "max-w-[359px] text-foreground")}
            >
              Latest
              <br />
              Insights
            </h2>
          </Reveal>

          <RevealStagger className="grid gap-12 lg:grid-cols-2 lg:gap-x-24">
            {latest.map((insight, index) => (
              <RevealItem key={insight.id} className="relative">
                {/*
                 * The rule Figma draws between the columns, centred in the 96px
                 * gutter — so it hangs off the second card of each row.
                 */}
                {index % 2 === 1 && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-12 hidden w-px bg-border lg:block"
                  />
                )}
                <InsightCard
                  insight={insight}
                  sizes="(min-width: 1024px) 411px, 100vw"
                />
              </RevealItem>
            ))}
          </RevealStagger>
        </section>
      )}
    </Container>
  )
}

export { InsightList }
