import Link from "next/link"

import { Arrow } from "@/components/ui/arrow"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { formatInsightDate, type Insight } from "@/content/insights/content"
import { cn } from "@/lib/utils"

/*
 * One insight in the index: the cover slot, a mono topic/date line, then the
 * title and its standfirst. `featured` is the lead story — cover and copy side
 * by side on wide screens, the title a size up.
 */
export function InsightCard({
  insight,
  featured = false,
  className,
}: {
  insight: Insight
  featured?: boolean
  className?: string
}) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className={cn(
        "group grid gap-6",
        featured && "md:grid-cols-12 md:items-end md:gap-x-6",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-lg",
          featured && "md:col-span-7 md:aspect-[16/10]"
        )}
      >
        <ImagePlaceholder className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>

      <div className={cn("grid gap-4", featured && "md:col-span-5 md:gap-6")}>
        <p className="label flex flex-wrap gap-x-3 gap-y-1 text-ink-faint">
          <span className="text-accent-ink">{insight.topic}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={insight.date}>{formatInsightDate(insight.date)}</time>
        </p>
        <h3
          className={cn(
            "text-title text-pretty transition-colors group-hover:text-accent-ink",
            featured && "md:text-lede"
          )}
        >
          {insight.title}
        </h3>
        {insight.dek && (
          <p
            className={cn(
              "text-pretty text-ink-soft",
              featured ? "max-w-md md:text-lg" : "line-clamp-3"
            )}
          >
            {insight.dek}
          </p>
        )}
        {featured && (
          <span className="mt-2 inline-flex items-center gap-2 font-medium">
            Read the insight
            <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  )
}
