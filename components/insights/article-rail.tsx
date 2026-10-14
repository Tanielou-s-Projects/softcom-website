"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The column beside the body, pinned while it scrolls: a hairline that fills
 * with the accent as the reader works through the article, and — when the
 * body has sections — its contents, with the section in view marked.
 *
 * Reads the native scroll position, which the site's smooth scroll keeps
 * current, and measures against the body element so the header and footer
 * don't count towards progress.
 */
export function ArticleRail({
  bodyId,
  sections,
  contentsLabel,
  progressLabel,
  children,
}: {
  bodyId: string
  sections: { id: string; text: string }[]
  contentsLabel: string
  progressLabel: string
  /** Anything else the rail carries, under the progress line. */
  children?: React.ReactNode
}) {
  const [progress, setProgress] = React.useState(0)
  const [active, setActive] = React.useState<string | null>(null)

  React.useEffect(() => {
    const body = document.getElementById(bodyId)
    if (!body) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = body.getBoundingClientRect()
      const line = window.innerHeight * 0.35
      const span = rect.height - window.innerHeight * 0.5
      setProgress(Math.min(1, Math.max(0, (line - rect.top) / span)))

      // The last section whose heading has passed the reading line.
      let current: string | null = null
      for (const section of sections) {
        const heading = document.getElementById(section.id)
        if (heading && heading.getBoundingClientRect().top <= line)
          current = section.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [bodyId, sections])

  return (
    <div className="sticky top-32">
      <div className="flex items-center justify-between gap-4">
        <p className="label text-ink-faint">{progressLabel}</p>
        <p className="label text-ink-soft tabular-nums">
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-3 h-px bg-line"
      >
        <div
          className="h-px origin-left bg-accent"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {children}

      {sections.length > 0 && (
        <nav aria-label={contentsLabel} className="mt-10">
          <p className="label text-ink-faint">{contentsLabel}</p>
          <ol className="mt-4 space-y-3 text-sm">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? "location" : undefined}
                  className={cn(
                    "group flex gap-3 transition-colors",
                    active === section.id
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink"
                  )}
                >
                  <span className="font-mono text-xs leading-5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-5">{section.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  )
}
