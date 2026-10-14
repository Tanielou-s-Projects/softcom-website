"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type IndexEntry = { id: string; title: string }

/*
 * The side index beside the three areas: numbered anchor links, the one in
 * view marked with a short accent rule. Sticky on wide screens, so the reader
 * always knows which area they're in; a plain contents list on phones.
 */
export function SolutionIndex({
  entries,
  label,
}: {
  entries: IndexEntry[]
  label: string
}) {
  const [active, setActive] = React.useState(entries[0]?.id)

  React.useEffect(() => {
    const sections = entries
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    /*
     * An area counts as current while it crosses a band just above the
     * middle of the viewport, so the index flips as a heading reaches
     * reading height rather than the moment it enters at the bottom.
     */
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(record.target.id)
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [entries])

  return (
    <nav aria-label={label} className="md:sticky md:top-28">
      <p className="label text-ink-soft">{label}</p>
      <ol className="mt-6 border-t border-line">
        {entries.map((entry, i) => {
          const current = entry.id === active
          return (
            <li key={entry.id} className="border-b border-line">
              <a
                href={`#${entry.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "group flex items-baseline gap-4 py-4 transition-colors duration-200",
                  current ? "text-ink" : "text-ink-faint hover:text-ink"
                )}
              >
                <span className="label w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-lg tracking-[-0.01em]">
                  {entry.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-4 self-center bg-accent transition-opacity duration-200",
                    current ? "opacity-100" : "opacity-0"
                  )}
                />
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
