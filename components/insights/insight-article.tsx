import Image from "next/image"
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/landing/section"
import { formatInsightDate } from "@/content/insights/content"
import { urlFor } from "@/sanity/lib/image"
import type { InsightArticle as Article } from "@/sanity/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { ColorReveal } from "@/components/motion/color-reveal"

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
            index === 0 ? "w-[68px] bg-ink-soft" : "w-[51px] bg-line"
          )}
        />
      ))}
    </div>
  )
}

const body = cn("text-lede", "leading-[1.6]")

/**
 * The article body as the Studio writes it: paragraphs in the lead size the
 * design sets, headings in the display face, lists, quotes, links and inline
 * images.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={body}>{children}</p>,
    h2: ({ children }) => (
      <h2 className="pt-6 font-heading text-3xl leading-[1.15] tracking-tight text-ink lg:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-4 font-heading text-2xl leading-[1.2] text-ink">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-xl text-ink">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(body, "border-l-2 border-accent-ink pl-6 italic")}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className={cn(body, "list-disc space-y-2 pl-6")}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol className={cn(body, "list-decimal space-y-2 pl-6")}>{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noreferrer" : undefined}
        className="text-accent-ink underline underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="flex flex-col gap-3">
          <Image
            src={urlFor(value).width(1600).fit("max").auto("format").url()}
            alt={value.alt ?? ""}
            width={1600}
            height={900}
            className="h-auto w-full rounded-2xl"
          />
          {value.caption ? (
            <figcaption className="text-sm text-ink-soft">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null,
  },
}

/** Paragraph-level blocks: one rule each on the rail. */
const paragraphsIn = (blocks: PortableTextBlock[]) =>
  blocks.filter((block) => block._type === "block").length

/** A single insight, in full. */
function InsightArticle({ article }: { article: Article }) {
  return (
    <Container className="flex flex-col gap-16 pt-8">
      {/* Header/meta only — per-paragraph reveals on long-form reading are hostile. */}
      <Reveal asChild>
        <header className="flex flex-col gap-16 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-16">
            <span
              aria-hidden
              className="size-[26px] shrink-0 rounded-full bg-accent"
            />
            <h1 className={cn("text-display", "text-ink")}>{article.title}</h1>
          </div>

          <div className="flex flex-col gap-16 lg:w-[49%] lg:shrink-0">
            <div className="flex items-center gap-6">
              <Badge>{article.topic}</Badge>
              <time
                dateTime={article.date}
                className="font-heading text-xs leading-[1.2] text-ink-soft"
              >
                {formatInsightDate(article.date)}
              </time>
            </div>

            {/*
             * The article's own standfirst. Figma prints the site-wide Insights
             * blurb in this slot — a copy-paste from the index — which would put
             * identical text at the top of every article.
             */}
            <p className={cn("text-lede", "leading-[1.6]")}>{article.dek}</p>
          </div>
        </header>
      </Reveal>

      <div className="relative h-[min(280px,40svh)] w-full overflow-clip rounded-2xl bg-neutral-900 sm:h-[min(400px,50svh)] lg:h-[min(577px,65svh)]">
        <ColorReveal>
          <Image
            src={article.cover}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-left"
          />
        </ColorReveal>
      </div>

      <div className="flex gap-8 lg:gap-32">
        <ParagraphRail count={paragraphsIn(article.body)} />

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <PortableText value={article.body} components={components} />
        </div>
      </div>

      <div aria-hidden className="h-px w-full bg-line" />
    </Container>
  )
}

export { InsightArticle }
