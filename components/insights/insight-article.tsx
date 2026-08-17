import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container, displayText, leadText } from "@/components/landing/section"
import { formatInsightDate, type Article } from "@/components/insights/content"

/**
 * The rail beside the body: one rule per paragraph, the first one longer and
 * brighter. Pinned, so it tracks alongside the copy.
 *
 * Reproduced from the design's geometry rather than shipped as its exported SVG,
 * for two reasons: the export hardcodes five rules where the article has however
 * many paragraphs it has, and it bakes in dark-mode strokes that would vanish on
 * a light background.
 *
 * The highlight is fixed on the first rule. Driving it from scroll position is
 * scroll-linked motion, which is deferred with the rest of the animation work.
 */
function ParagraphRail({ count }: { count: number }) {
  return (
    <div
      aria-hidden
      className="hidden shrink-0 flex-col gap-3 lg:sticky lg:top-24 lg:flex lg:w-[71px]"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-0.5 rounded-full",
            index === 0 ? "w-[68px] bg-muted-foreground" : "w-[51px] bg-border"
          )}
        />
      ))}
    </div>
  )
}

/** A single insight, in full. */
function InsightArticle({ article }: { article: Article }) {
  return (
    <Container className="flex flex-col gap-16 pt-32">
      <header className="flex flex-col gap-16 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-16">
          <span
            aria-hidden
            className="size-[26px] shrink-0 rounded-full bg-brand-blue"
          />
          <h1 className={cn(displayText, "text-foreground")}>
            {article.title}
          </h1>
        </div>

        <div className="flex flex-col gap-16 lg:w-[629px] lg:shrink-0">
          <div className="flex items-center gap-6">
            <Badge>{article.topic}</Badge>
            <time
              dateTime={article.date}
              className="font-heading text-xs leading-[1.2] text-muted-foreground"
            >
              {formatInsightDate(article.date)}
            </time>
          </div>

          {/*
           * The article's own standfirst. Figma prints the site-wide Insights
           * blurb in this slot — a copy-paste from the index — which would put
           * identical text at the top of every article.
           */}
          <p className={cn(leadText, "leading-[1.6]")}>{article.dek}</p>
        </div>
      </header>

      <div className="relative h-[280px] w-full overflow-clip rounded-2xl bg-neutral-900 sm:h-[400px] lg:h-[577px]">
        <Image
          src={article.cover}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-left"
        />
      </div>

      <div className="flex gap-8 lg:gap-32">
        <ParagraphRail count={article.paragraphs.length} />

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph} className={cn(leadText, "leading-[1.6]")}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div aria-hidden className="h-px w-full bg-border" />
    </Container>
  )
}

export { InsightArticle }
