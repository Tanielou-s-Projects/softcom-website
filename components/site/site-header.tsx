"use client"

import * as React from "react"
import Link from "next/link"

import { SoftcomWordmark } from "@/components/site/softcom-wordmark"
import { NavPlate } from "@/components/site/nav-plate"
import { ThemeToggleDot } from "@/components/site/theme-switcher"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { headerNav } from "@/components/landing/content"
import { cn } from "@/lib/utils"

/**
 * Shared by the triggers and the plain links so both sit flush in the pill.
 * The registry's defaults style these as standalone chips (`h-9`, `px-4.5`,
 * `hover:bg-muted`), which is wrong inside a 48px pill — `cn` merges them away.
 */
const pillItem =
  "h-auto w-auto rounded-none p-0 text-xs leading-none font-medium text-foreground transition-colors hover:bg-transparent focus:bg-transparent hover:text-brand-accent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:text-brand-accent"

const CUE_KEY = "softcom-menu-cue"

/**
 * Once per session, a beat after load, the two dots part to show the word
 * "Menu" and close again — so a first-time visitor learns the capsule opens
 * without a permanent label. Skipped under reduced motion.
 */
function useMenuCue(enabled: boolean) {
  const [cue, setCue] = React.useState(false)

  React.useEffect(() => {
    if (!enabled) return
    try {
      if (sessionStorage.getItem(CUE_KEY)) return
      sessionStorage.setItem(CUE_KEY, "1")
    } catch {
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const open = window.setTimeout(() => setCue(true), 1000)
    const close = window.setTimeout(() => setCue(false), 1900)
    return () => {
      window.clearTimeout(open)
      window.clearTimeout(close)
    }
  }, [enabled])

  return cue
}

/** How far past the top the page must be before scrolling down hides the pill. */
const HIDE_AFTER = 96
/** Scroll jitter below this many px doesn't count as a direction change. */
const SCROLL_SLOP = 6
/** Mouse within this many px of the window's top edge brings the pill back. */
const EDGE_REVEAL = 32
/** Grace before a hover-opened pill closes, so a slip off its edge doesn't snap it shut. */
const HOVER_CLOSE_DELAY = 280

/**
 * Headroom: the pill gets out of the way while the reader scrolls down — so it
 * never sits on a heading they are reading — and returns on any scroll up, near
 * the top of the page, or when the mouse comes up to the window's top edge.
 *
 * Returns whether the page has scrolled the pill away; the caller decides what
 * keeps it shown regardless (pointer inside, focus inside, menu open).
 * `onScrollDown` lets the caller fold an open menu as the reader moves on.
 */
function useScrolledAway(onScrollDown: () => void) {
  const [away, setAway] = React.useState(false)

  React.useEffect(() => {
    let last = window.scrollY
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        const delta = y - last
        if (y < HIDE_AFTER) {
          setAway(false)
          last = y
        } else if (delta > SCROLL_SLOP) {
          setAway(true)
          onScrollDown()
          last = y
        } else if (delta < -SCROLL_SLOP) {
          setAway(false)
          last = y
        }
      })
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      if (event.clientY <= EDGE_REVEAL) setAway(false)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [onScrollDown])

  return away
}

/**
 * A sticky capsule: the wordmark and the menu live in one floating pill,
 * centred at the top of every page. It opens on hover (mouse and pen) or on
 * the blue dot, and steps aside while the reader scrolls down so it never
 * covers the heading they are reading (see `useScrolledAway`).
 *
 * The menu morphs: `#site-menu` animates its width from the two collapsed dots
 * to the expanded nav + close, and the flex capsule grows with it. The two dots
 * are the *same elements* in every state — the cyan one at the left edge, the
 * blue one (the toggle) at the right — sitting at a constant inset, so they
 * stay flush with the pill's ends whether it is closed, cueing, or open. What
 * changes is only what mounts between them.
 *
 * `NavigationMenu` deliberately wraps the capsule rather than sitting inside it:
 * the dropdown viewport is rendered as the root's last child, so keeping it a
 * *sibling* of the capsule stops the menu region's `overflow-hidden` — which the
 * width morph needs — from clipping the dropdown.
 */
function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  /*
   * The dropdown is controlled so collapsing the pill can close it too —
   * otherwise a panel can be left hanging under a pill that is shrinking.
   */
  const [menuValue, setMenuValue] = React.useState("")
  const cue = useMenuCue(!open)
  const [focused, setFocused] = React.useState(false)
  const closeTimer = React.useRef(0)

  const close = React.useCallback(() => {
    window.clearTimeout(closeTimer.current)
    setMenuValue("")
    setOpen(false)
  }, [])

  /*
   * Scrolling down is a deliberate gesture and beats a resting cursor: it
   * folds the menu, so a pointer parked at the top (say, after clicking a
   * link) can't pin the pill over the page. Only keyboard focus keeps it
   * shown — a keyboard user must never lose what they're on.
   */
  const scrolledAway = useScrolledAway(close)
  const hidden = scrolledAway && !focused

  React.useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  /*
   * Hover opens the menu on mouse and pen — the pill is the navigation, so it
   * shouldn't need a click on one dot first. Touch keeps tap-to-toggle: a tap
   * also fires pointerenter, and opening on it would fight the toggle.
   */
  const onPointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(close, HOVER_CLOSE_DELAY)
  }

  React.useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return

      // Escape unwinds one layer at a time: dropdown first, then the pill.
      if (menuValue) {
        setMenuValue("")
        return
      }

      setOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, menuValue])

  const peek = !open && cue

  return (
    <header
      data-hidden={hidden || undefined}
      className={cn(
        "pointer-events-none sticky top-0 z-40 flex justify-center px-6 pt-4 lg:px-7",
        "transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none",
        "data-hidden:-translate-y-[calc(100%+1rem)] data-hidden:opacity-0"
      )}
    >
      <NavigationMenu
        aria-label="Main"
        value={menuValue}
        onValueChange={setMenuValue}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocusCapture={(event) =>
          // Keyboard focus only: a mouse click on a link also focuses it.
          setFocused(event.target.matches(":focus-visible"))
        }
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false)
        }}
        // Only the pill takes the pointer, so the header's full-width strip
        // never blocks clicks on the page beside it.
        className={cn("max-w-max", !hidden && "pointer-events-auto")}
      >
        <div className="dark flex items-center gap-4 rounded-full bg-black py-1.5 pr-2 pl-5 text-foreground ring-1 ring-white/10">
          <Link
            href="/"
            aria-label="Softcom home"
            onClick={close}
            className="group flex shrink-0 items-center"
          >
            <SoftcomWordmark className="h-6 w-auto" />
          </Link>

          <span aria-hidden className="h-6 w-px shrink-0 bg-white/10" />

          {/*
           * Constant 4px inset on both sides in every state, so the dots never
           * move relative to the capsule's ends — only the width between them.
           */}
          <div
            id="site-menu"
            className={cn(
              "relative flex h-10 items-center justify-between overflow-hidden px-1 transition-[width] duration-300 ease-out motion-reduce:transition-none",
              open ? "w-[432px]" : peek ? "w-28" : "w-14"
            )}
          >
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              tabIndex={open ? -1 : 0}
              onClick={() => setOpen(true)}
              className="size-6 shrink-0 rounded-full bg-brand-cyan outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />

            {open ? (
              <NavigationMenuList className="gap-[22px]">
                {headerNav.map((item) =>
                  item.submenu ? (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger className={pillItem}>
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-full md:w-full">
                        {/* Fixed height so every dropdown is the same size —
                            otherwise the shared viewport jumps between panels
                            and the morph reads as broken. */}
                        <div
                          data-nav-plate-root
                          className="flex h-52 w-full items-stretch"
                        >
                          <NavPlate
                            seed={item.href === "/solutions" ? 7 : 3}
                            className="w-44 shrink-0"
                          />
                          <ul className="ml-auto flex flex-col justify-center gap-1 pr-8 text-right">
                            {item.submenu.map((sub) => (
                              <li key={sub.href}>
                                <NavigationMenuLink
                                  asChild
                                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-transparent hover:text-brand-accent focus:bg-transparent"
                                >
                                  <Link href={sub.href} onClick={close}>
                                    {sub.label}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild className={pillItem}>
                        <Link href={item.href} onClick={close}>
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
                <NavigationMenuItem>
                  <ThemeToggleDot />
                </NavigationMenuItem>
              </NavigationMenuList>
            ) : (
              /* Out of flow, so the closed 56px box holds exactly the two dots. */
              <span
                aria-hidden
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 text-xs leading-none font-medium whitespace-nowrap text-foreground/80 transition-opacity duration-300",
                  peek ? "opacity-100 delay-150" : "opacity-0"
                )}
              >
                Menu
              </span>
            )}

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => (open ? close() : setOpen(true))}
              className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-blue outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <svg
                viewBox="0 0 9.5 9.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                aria-hidden
                className={cn(
                  "size-[9.5px] text-brand-cyan transition-opacity duration-200",
                  open ? "opacity-100" : "opacity-0"
                )}
              >
                <path d="M0.5 0.5L9 9" />
                <path d="M9 0.5L0.5 9" />
              </svg>
            </button>
          </div>
        </div>
      </NavigationMenu>
    </header>
  )
}

export { SiteHeader }
