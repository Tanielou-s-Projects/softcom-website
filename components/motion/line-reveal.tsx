"use client"

import * as React from "react"
import { motion } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"

type Tag = "h1" | "h2" | "h3" | "p" | "div"

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Text that rises into place line by line, each line inside its own mask, the
 * first time it scrolls into view — the rebuild's LineReveal, in motion.
 *
 * The text renders as words (so it reads without JS); before first paint the
 * words are grouped into the lines they actually wrapped to, and those lines
 * animate. A resize or a late font load regroups them. `immediate` plays on
 * mount instead of on scroll, for heroes already in view. Reduced motion: the
 * plain text, no animation.
 */
function LineReveal({
  as: Tag = "div",
  id,
  className,
  children,
  delay = 0,
  immediate = false,
}: {
  as?: Tag
  id?: string
  className?: string
  children: string
  delay?: number
  immediate?: boolean
}) {
  const ref = React.useRef<HTMLElement>(null)
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [lines, setLines] = React.useState<string[] | null>(null)
  // Once it has played, a regroup shows the lines in place, no replay.
  const [played, setPlayed] = React.useState(false)
  const words = React.useMemo(() => children.split(/\s+/), [children])

  // Group the words by the line they sit on, measured before paint.
  React.useLayoutEffect(() => {
    if (reduce || lines) return
    const el = ref.current
    if (!el) return
    const spans = [...el.querySelectorAll<HTMLElement>("[data-word]")]
    const grouped: string[][] = []
    let top: number | null = null
    for (const span of spans) {
      if (span.offsetTop !== top) {
        grouped.push([])
        top = span.offsetTop
      }
      grouped[grouped.length - 1].push(span.textContent ?? "")
    }
    setLines(grouped.map((line) => line.join(" ")))
  }, [reduce, lines, words])

  // A new width or a late font can change the wrap: regroup.
  React.useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let width = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== width) {
        width = el.clientWidth
        setLines(null)
      }
    })
    observer.observe(el)
    document.fonts?.ready.then(() => setLines(null))
    return () => observer.disconnect()
  }, [reduce])

  const Comp = Tag as React.ElementType
  return (
    <Comp ref={ref} id={id} className={className}>
      {reduce || !lines ? (
        words.map((word, i) => (
          <React.Fragment key={i}>
            <span data-word="">{word}</span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))
      ) : (
        <>
          <span className="sr-only">{children}</span>
          {lines.map((line, i) => (
            // The mask reaches a little below its line so descenders stay whole.
            <span
              key={`${i}-${line}`}
              aria-hidden
              className="-mb-[0.22em] block overflow-hidden pb-[0.22em]"
            >
              <motion.span
                className="block"
                initial={played ? false : { y: "110%" }}
                onAnimationComplete={() => setPlayed(true)}
                {...(immediate
                  ? { animate: { y: "0%" } }
                  : {
                      whileInView: { y: "0%" },
                      viewport: { once: true, amount: 0.6 },
                    })}
                transition={{
                  duration: 0.9,
                  ease: EASE,
                  delay: delay + i * 0.08,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </>
      )}
    </Comp>
  )
}

export { LineReveal }
