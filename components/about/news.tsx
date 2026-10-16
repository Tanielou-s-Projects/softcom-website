import Link from "next/link"

import type { AboutPage } from "@/content/about/page-copy"
import { Container } from "@/components/landing/section"
import { RevealItem, RevealStagger } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/site/section-heading"

/**
 * "Latest news" — a V7-style news list: a label column on the left, the
 * heading, then hairline-separated rows (title · category · date). The avatar is
 * a placeholder until authors are wired to Sanity.
 */
function News({ copy }: { copy: AboutPage["news"] }) {
  return (
    <Container className="flex flex-col gap-section-head">
      <SectionHeading
        label={copy.label}
        heading={copy.heading}
        intro={copy.lead}
      />

      <div className="flex flex-col gap-10">
        <RevealStagger as="ul" className="flex flex-col border-t border-line">
          {copy.items.map((insight) => (
            <RevealItem
              as="li"
              key={insight.slug}
              className="border-b border-line"
            >
              <Link
                href={`/insights/${insight.slug}`}
                className="group grid-12 items-center gap-y-4 py-6"
              >
                <p className="font-heading text-lg text-ink transition-colors group-hover:text-accent-ink md:col-span-7 lg:text-xl">
                  {insight.title}
                </p>
                <p className="text-sm text-ink-soft md:col-span-2 md:col-start-9">
                  {insight.category}
                </p>
                <div className="flex items-center gap-2.5 md:col-span-2 md:col-start-11 md:justify-end">
                  <span
                    aria-hidden
                    className="size-7 shrink-0 rounded-full bg-surface-raised"
                  />
                  <span className="text-sm whitespace-nowrap text-ink-soft">
                    {insight.date}
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>

        <Link
          href={copy.viewAllHref}
          className="self-start text-sm font-medium text-ink underline underline-offset-4"
        >
          {copy.viewAllLabel}
        </Link>
      </div>
    </Container>
  )
}

export { News }
