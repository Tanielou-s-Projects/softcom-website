"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  JourneyTimeline,
  type JourneyReveal,
} from "@/components/about/journey-timeline"
import { Container } from "@/components/landing/section"
import { SiteHeader } from "@/components/site/site-header"

const REVEALS: { key: JourneyReveal; label: string; note: string }[] = [
  {
    key: "side",
    label: "Side",
    note: "Giant year on the left, full detail slides in from the right.",
  },
  {
    key: "below",
    label: "Below",
    note: "Detail rises in directly beneath the ruler (closest to V7).",
  },
  {
    key: "card",
    label: "Card",
    note: "The detail springs in as a card.",
  },
]

/** Dev-only surface for comparing the reveal variations of the journey timeline. */
export function JourneyLab({
  initialReveal = "side",
}: {
  initialReveal?: JourneyReveal
}) {
  const [reveal, setReveal] = React.useState<JourneyReveal>(initialReveal)
  const current = REVEALS.find((r) => r.key === reveal)!

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <Container className="flex flex-col gap-10 py-12">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Journey timeline — reveal variations
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {REVEALS.map((r) => {
              const isActive = r.key === reveal
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setReveal(r.key)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-brand-cyan/50 bg-card text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r.label}
                </button>
              )
            })}
            <span className="ml-2 text-sm text-muted-foreground">
              {current.note}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-6 lg:p-10">
          {/* No `key` here on purpose — remounting would re-trigger the
              scroll-reveal on an already-visible element and flash empty.
              Switching a variation just swaps the reveal branch in place. */}
          <JourneyTimeline reveal={reveal} />
        </div>
      </Container>
    </div>
  )
}
