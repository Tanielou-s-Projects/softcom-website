import { cn } from "@/lib/utils"
import { bodyText, Container } from "@/components/landing/section"

/**
 * A row of figures, framed by hairlines rather than filled cards.
 *
 * The same treatment the landing page's team grid gives its stat cells — the
 * 4.27rem numeral on its tight 0.804 leading, bottom-weighted in a plate with
 * only vertical rules — at a height that suits a band rather than a full grid
 * row.
 */
function StatBand({
  stats,
  className,
}: {
  stats: { value: string; label: string }[]
  className?: string
}) {
  return (
    <Container className={cn("py-6", className)}>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="flex h-[220px] flex-col justify-end gap-3 overflow-clip border-x border-border p-6 whitespace-nowrap"
          >
            <p className="font-heading text-5xl leading-[0.804] text-foreground lg:text-[4.27rem]">
              {stat.value}
            </p>
            <p className={cn(bodyText, "text-foreground")}>{stat.label}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

export { StatBand }
