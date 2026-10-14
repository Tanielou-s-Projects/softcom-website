"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Scroll distance before the header starts hiding, and the jitter it ignores. */
const TOP = 120
const THRESHOLD = 6

/*
 * Hides the header while scrolling down and brings it back on any scroll up,
 * as the reference sites do. Always shown near the top of the page and while
 * focus is inside it.
 */
export function HeaderShell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const [hidden, setHidden] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < THRESHOLD) return
      const focused = ref.current?.contains(document.activeElement)
      setHidden(y > TOP && delta > 0 && !focused)
      last = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <header
      ref={ref}
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "transition-transform duration-300 ease-[cubic-bezier(0.16,1.08,0.38,0.98)]",
        hidden && "-translate-y-[calc(100%+1.25rem)]",
        className
      )}
    >
      {children}
    </header>
  )
}
