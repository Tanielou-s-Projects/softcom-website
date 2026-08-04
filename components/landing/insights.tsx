import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { insights } from "@/components/landing/content"
import { cn } from "@/lib/utils"

function Insights() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip pt-6 lg:gap-16">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <h2 className={cn(headingText, "text-foreground")}>Latest Insights</h2>
        <Button asChild size="lg" className={primaryPill}>
          <Link href="/insights">View All Insights</Link>
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map((insight) => (
          <Link
            key={insight.slug}
            href={`/insights/${insight.slug}`}
            className="group flex flex-col items-start gap-4 rounded-[16px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {/*
             * Figma leaves the cover art as an empty plate; it becomes the
             * insight's `coverImage` once this is wired to Sanity.
             */}
            <div className="aspect-[690/324] w-full rounded-[16px] bg-neutral-900 transition-opacity group-hover:opacity-80" />

            <div className="flex w-full items-start justify-between gap-6 font-heading leading-[1.2]">
              <div className="flex shrink-0 flex-col gap-2 text-xs whitespace-nowrap">
                <p className="text-neutral-200">{insight.category}</p>
                <p className="text-neutral-500">{insight.date}</p>
              </div>
              <p className="text-lg text-neutral-200 lg:w-[501px] lg:text-2xl">
                {insight.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export { Insights }
