import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { formatInsightDate, type Insight } from "@/components/insights/content"

/**
 * One insight: cover, then a meta line, then the title and its standfirst.
 *
 * `featured` is the wide treatment at the top of the page — the same parts, but
 * the title and standfirst sit side by side rather than stacked. Everything
 * else, including the 324px cover, is shared.
 */
function InsightCard({
  insight,
  layout = "grid",
  sizes,
}: {
  insight: Insight
  layout?: "featured" | "grid"
  sizes: string
}) {
  const featured = layout === "featured"

  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex flex-col gap-4 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {/*
       * `bg-neutral-900` is the design's own #1b1b1b backing plate, which shows
       * through while the cover loads and behind its transparent edges.
       */}
      <div className="relative h-[min(324px,40svh)] w-full shrink-0 overflow-clip rounded-2xl bg-neutral-900">
        <Image
          src={insight.cover}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-left"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 font-heading text-xs leading-[1.2]">
          <span className="text-foreground">{insight.topic}</span>
          <time dateTime={insight.date} className="text-muted-foreground">
            {formatInsightDate(insight.date)}
          </time>
        </div>

        <div
          className={cn(
            "flex flex-col gap-2.5",
            featured && "lg:flex-row lg:items-center"
          )}
        >
          <h3
            className={cn(
              "font-heading text-2xl leading-[1.2] text-foreground transition-colors group-hover:text-brand-accent",
              featured && "lg:min-w-0 lg:flex-1"
            )}
          >
            {insight.title}
          </h3>
          {/*
           * The design brightens the standfirst on the featured card to match
           * its title, and dims it on the grid cards.
           */}
          <p
            className={cn(
              "text-sm leading-[1.2]",
              featured
                ? "text-foreground lg:min-w-0 lg:flex-1"
                : "text-muted-foreground"
            )}
          >
            {insight.dek}
          </p>
        </div>
      </div>
    </Link>
  )
}

export { InsightCard }
