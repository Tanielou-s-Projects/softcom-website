import Image from "next/image"
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity"

import { cn } from "@/lib/utils"
import { Container } from "@/components/landing/section"
import { formatInsightDate } from "@/content/insights/content"
import { urlFor } from "@/sanity/lib/image"
import type { InsightArticle as Article } from "@/sanity/lib/data"
import { PageHero } from "@/components/site/page-hero"
import { ReadingProgress } from "@/components/insights/reading-progress"
import { ColorReveal } from "@/components/motion/color-reveal"

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
      <h2 className="pt-6 font-heading text-3xl leading-[1.15] font-light tracking-tight text-ink lg:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-4 font-heading text-2xl leading-[1.2] font-light text-ink">
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

/** Reading time at about 220 words a minute, never under a minute. */
const minutesFor = (blocks: PortableTextBlock[]) => {
  const words = blocks
    .flatMap((block) =>
      block._type === "block" && Array.isArray(block.children)
        ? block.children.map((child) =>
            typeof child.text === "string" ? child.text : ""
          )
        : []
    )
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/** A single insight, in full: the shared page hero, its cover, then the body. */
function InsightArticle({
  article,
  indexLabel,
}: {
  article: Article
  /** What the index is called, for the way back. */
  indexLabel: string
}) {
  return (
    <>
      <PageHero
        label={`${article.topic} · ${formatInsightDate(article.date)}`}
        heading={article.title}
        intro={article.dek}
      />
      <Container className="mt-16 flex flex-col gap-16 md:mt-24">
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

        <ReadingProgress
          backHref="/insights"
          backLabel={indexLabel}
          minutes={minutesFor(article.body)}
        >
          <PortableText value={article.body} components={components} />
        </ReadingProgress>

        <div aria-hidden className="h-px w-full bg-line" />
      </Container>
    </>
  )
}

export { InsightArticle }
