import Link from "next/link"

import { insights } from "@/components/landing/content"
import { Container, headingText } from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/**
 * "Want to know more?" — a V7-style news list: a label column on the left, the
 * heading, then hairline-separated rows (title · category · date). The avatar is
 * a placeholder until authors are wired to Sanity.
 */
function News() {
  return (
    <Container className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <div className="flex shrink-0 items-center gap-2 lg:w-40">
        <span aria-hidden className="size-2.5 rounded-full bg-brand-accent" />
        <span className="text-sm font-medium text-muted-foreground">News</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-10 lg:gap-12">
        <Reveal className="flex flex-col gap-3">
          <h2 className={cn(headingText, "text-foreground")}>
            Want to know more?
          </h2>
          <p className="text-lg text-muted-foreground">Read the latest news.</p>
        </Reveal>

        <RevealStagger as="ul" className="flex flex-col border-t border-border">
          {insights.map((insight) => (
            <RevealItem
              as="li"
              key={insight.slug}
              className="border-b border-border"
            >
              <Link
                href={`/insights/${insight.slug}`}
                className="group grid items-center gap-4 py-6 sm:grid-cols-[1fr_8rem_auto] sm:gap-10"
              >
                <p className="font-heading text-lg text-foreground transition-colors group-hover:text-brand-accent lg:text-xl">
                  {insight.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {insight.category}
                </p>
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-7 shrink-0 rounded-full bg-muted"
                  />
                  <span className="text-sm whitespace-nowrap text-muted-foreground">
                    {insight.date}
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Container>
  )
}

export { News }
