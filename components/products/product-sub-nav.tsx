"use client"

import * as React from "react"

import { ButtonLink } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type SubNavItem = { id: string; label: string }

const pad = (n: number) => String(n).padStart(2, "0")

/*
 * A product page's own index, Stereolabs-style, pinned under the top of the
 * window while the body scrolls: the product's name, its chapters as
 * numbered anchors, the title of the chapter being read, and the ask.
 * Chapter titles are whole sentences and a product can have ten of them, so
 * the row carries numbers and names only the current one; each number is
 * labelled with its title for screen readers and on hover.
 */
export function ProductSubNav({
  name,
  items,
  cta,
}: {
  name: string
  items: SubNavItem[]
  cta: { label: string; href: string }
}) {
  const [active, setActive] = React.useState(items[0]?.id)
  const current = items.findIndex((item) => item.id === active)
  const headerHidden = useHeaderHidden()
  const listRef = React.useRef<HTMLOListElement>(null)

  React.useEffect(() => {
    const targets = items.flatMap(({ id }) => {
      const el = document.getElementById(id)
      return el ? [el] : []
    })
    // A thin band across the upper middle of the window: whichever chapter
    // crosses it is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  React.useEffect(() => {
    // On a phone the numbers overflow: keep the current one in the row's
    // view, scrolling the row only, never the page.
    const list = listRef.current
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!list || !link || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({
      left: link.offsetLeft - list.offsetLeft - list.clientWidth / 2,
      behavior: "smooth",
    })
  }, [active])

  return (
    <nav
      aria-label={`${name} chapters`}
      className={cn(
        "sticky z-40 border-y border-line bg-paper/90 backdrop-blur-md transition-[top] duration-300 ease-[cubic-bezier(0.16,1.08,0.38,0.98)]",
        // The site header is h-14 under a 0.5rem (md: 1.25rem) inset.
        headerHidden ? "top-0" : "top-16 md:top-19"
      )}
    >
      <div className="shell flex h-14 items-center gap-4 md:gap-6">
        <p className="hidden shrink-0 font-medium md:block">{name}</p>
        <span
          aria-hidden="true"
          className="hidden h-5 w-px shrink-0 bg-line md:block"
        />
        <ol
          ref={listRef}
          className="flex min-w-0 [scrollbar-width:none] items-center gap-0.5 overflow-x-auto max-sm:flex-1 sm:shrink-0"
        >
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                title={item.label}
                aria-label={`${pad(i + 1)} ${item.label}`}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "label flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-1.5 transition-colors",
                  active === item.id
                    ? "bg-ink text-paper"
                    : "text-ink-faint hover:text-ink"
                )}
              >
                {pad(i + 1)}
              </a>
            </li>
          ))}
        </ol>
        <p
          aria-hidden="true"
          className="hidden min-w-0 flex-1 truncate text-sm text-ink-soft sm:block"
        >
          {items[current]?.label}
        </p>
        <ButtonLink
          href={cta.href}
          className="ml-auto hidden h-10 shrink-0 text-sm lg:inline-flex"
        >
          {cta.label}
        </ButtonLink>
      </div>
    </nav>
  )
}

/*
 * Whether the site header is tucked away, so the sub-nav can take its place
 * at the top. Mirrors HeaderShell's rule (hidden after 120px while scrolling
 * down, back on any scroll up), which keeps its state to itself.
 */
function useHeaderHidden() {
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    const header = document.querySelector("header")
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < 6) return
      const focused = header?.contains(document.activeElement)
      setHidden(y > 120 && delta > 0 && !focused)
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

  return hidden
}
