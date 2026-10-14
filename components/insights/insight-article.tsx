import Link from "next/link"

import { ArticleBody } from "@/components/insights/article-body"
import {
  outlineOf,
  readingMinutes,
} from "@/components/insights/article-outline"
import { ArticleRail } from "@/components/insights/article-rail"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { Arrow } from "@/components/ui/arrow"
import { Crosshairs } from "@/components/ui/crosshairs"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { formatInsightDate, type Insight } from "@/content/insights/content"
import type { InsightArticle as Article } from "@/sanity/lib/data"

const BODY_ID = "article-body"

/*
 * A single insight, in full. The header is the subpage hero's anatomy at
 * reading scale — a way back, a mono meta line, the title rising, the
 * standfirst — then the cover slot, and the body on the shell's grid with a
 * pinned rail beside it: reading progress and the article's contents.
 */
export function InsightArticle({
  article,
  indexLabel,
}: {
  article: Article
  /** The index's own name, for the way back. */
  indexLabel: string
}) {
  const sections = outlineOf(article.body)
  const minutes = readingMinutes(article.body)

  // The same facts again, kept in view beside the body.
  const facts = [
    { term: "Topic", value: article.topic },
    { term: "Published", value: formatInsightDate(article.date) },
    { term: "Reading time", value: `${minutes} min` },
    ...(article.author ? [{ term: "Author", value: article.author }] : []),
  ]

  const meta = [
    {
      key: "topic",
      node: <span className="text-accent">{article.topic}</span>,
    },
    {
      key: "date",
      node: (
        <time dateTime={article.date}>{formatInsightDate(article.date)}</time>
      ),
    },
    { key: "time", node: <span>{minutes} min read</span> },
    ...(article.author
      ? [{ key: "author", node: <span>By {article.author}</span> }]
      : []),
  ]

  return (
    <article>
      <header className="pt-32 md:pt-44">
        <div className="shell grid gap-8 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-10">
            <Reveal>
              <Link
                href="/insights"
                className="label group inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                <Arrow className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                {indexLabel}
              </Link>
              <p className="label mt-10 flex flex-wrap gap-x-3 gap-y-2 text-ink-faint md:mt-14">
                {meta.map((item, i) => (
                  <span key={item.key} className="inline-flex gap-3">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {item.node}
                  </span>
                ))}
              </p>
            </Reveal>
            <LineReveal
              as="h1"
              immediate
              delay={0.15}
              className="mt-6 text-headline font-light text-balance"
            >
              {article.title}
            </LineReveal>
          </div>
          {article.dek && (
            <Reveal delay={0.4} className="md:col-span-7">
              <p className="text-xl leading-snug text-pretty text-ink-soft md:text-2xl">
                {article.dek}
              </p>
            </Reveal>
          )}
        </div>
        <Crosshairs className="mt-16 md:mt-24" />
      </header>

      <Reveal className="shell mt-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-[21/9]">
          <ImagePlaceholder />
        </div>
      </Reveal>

      <div className="shell mt-16 grid gap-x-6 md:mt-24 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <ArticleRail
            bodyId={BODY_ID}
            sections={sections}
            contentsLabel="Contents"
            progressLabel="Reading"
          >
            <dl className="mt-10 grid gap-5 border-t border-line pt-6 text-sm">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="label text-ink-faint">{fact.term}</dt>
                  <dd className="mt-1.5 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ArticleRail>
        </aside>
        <div id={BODY_ID} className="lg:col-span-8 lg:col-start-5">
          <ArticleBody body={article.body} />
          <p className="label mt-16 flex items-center gap-3 text-ink-faint">
            <span aria-hidden="true" className="size-2 bg-accent" />
            {article.topic} / {formatInsightDate(article.date)}
          </p>
        </div>
      </div>
    </article>
  )
}

/*
 * After the article: what to read next, as ruled index rows — same topic
 * first, then the most recent.
 */
export function KeepReading({
  current,
  insights,
  heading,
  indexLabel,
}: {
  current: Article
  insights: Insight[]
  heading: string
  indexLabel: string
}) {
  const others = insights.filter((insight) => insight.slug !== current.slug)
  const next = [
    ...others.filter((insight) => insight.topic === current.topic),
    ...others.filter((insight) => insight.topic !== current.topic),
  ].slice(0, 3)

  if (next.length === 0) return null

  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-12 md:mt-16">
        <div className="flex items-end justify-between gap-6">
          <LineReveal as="h2" className="text-headline text-balance">
            {heading}
          </LineReveal>
          <Link
            href="/insights"
            className="label group hidden shrink-0 items-center gap-2 text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            {indexLabel}
            <Arrow className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <Reveal
          as="ul"
          stagger="rows"
          className="mt-12 border-b border-line md:mt-16"
        >
          {next.map((insight) => (
            <li key={insight.id} className="border-t border-line">
              <Link
                href={`/insights/${insight.slug}`}
                className="group grid gap-4 py-8 md:grid-cols-12 md:gap-x-6 md:py-10"
              >
                <p className="label flex flex-col gap-2 pt-2 text-ink-faint md:col-span-3">
                  <time dateTime={insight.date}>
                    {formatInsightDate(insight.date)}
                  </time>
                  <span className="text-accent">{insight.topic}</span>
                </p>
                <h3 className="text-title text-pretty transition-colors group-hover:text-accent md:col-span-5">
                  {insight.title}
                </h3>
                <p className="line-clamp-3 text-ink-soft md:col-span-3">
                  {insight.dek}
                </p>
                <span className="hidden items-start justify-end pt-2 md:col-span-1 md:flex">
                  <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
        <Link
          href="/insights"
          className="label group mt-8 inline-flex items-center gap-2 text-ink-soft sm:hidden"
        >
          {indexLabel}
          <Arrow className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
