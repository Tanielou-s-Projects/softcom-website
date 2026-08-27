"use client"

import * as React from "react"
import Link from "next/link"

import { SoftcomWordmark } from "@/components/site/softcom-wordmark"
import { DitherShape } from "@/components/site/dither-shape"

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

/**
 * A sticky capsule: the wordmark and the menu live in one floating pill,
 * centred at the top of every page. It stays put on scroll, its dark
 * translucent fill + ring keeping it legible over any content.
 *
 * The menu still morphs: the `#site-menu` region animates its width from the
 * two collapsed dots to the expanded nav + close, and the flex capsule grows
 * with it. Collapsed, the dots open the menu; expanded, the blue dot has become
 * the ✕. The logo's two `o`s pick up brand cyan/blue on hover (see
 * `SoftcomWordmark`), driven by the Link's `group`.
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

  const close = React.useCallback(() => {
    setMenuValue("")
    setOpen(false)
  }, [])

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

  return (
    <header className="sticky top-0 z-40 flex justify-center px-6 pt-4 lg:px-7">
      <NavigationMenu
        aria-label="Main"
        value={menuValue}
        onValueChange={setMenuValue}
        className="max-w-max"
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

          <div
            id="site-menu"
            className={cn(
              "overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none",
              open ? "w-[368px]" : "w-14"
            )}
          >
            {open ? (
              <div className="flex h-10 w-[368px] items-center justify-between">
                <span
                  aria-hidden
                  className="size-6 shrink-0 rounded-full bg-brand-cyan"
                />

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
                          <div className="flex h-52 w-full items-stretch">
                            <DitherShape
                              accent={
                                item.href === "/solutions" ? "cyan" : "blue"
                              }
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
                </NavigationMenuList>

                <button
                  type="button"
                  aria-label="Close menu"
                  aria-expanded
                  aria-controls="site-menu"
                  onClick={close}
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-blue outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <svg
                    viewBox="0 0 9.5 9.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    aria-hidden
                    className="size-[9.5px] text-brand-cyan"
                  >
                    <path d="M0.5 0.5L9 9" />
                    <path d="M9 0.5L0.5 9" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={false}
                aria-controls="site-menu"
                onClick={() => setOpen(true)}
                className="flex h-10 w-14 items-center justify-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                <span
                  aria-hidden
                  className="size-6 shrink-0 rounded-full bg-brand-cyan"
                />
                <span
                  aria-hidden
                  className="size-6 shrink-0 rounded-full bg-brand-blue"
                />
              </button>
            )}
          </div>
        </div>
      </NavigationMenu>
    </header>
  )
}

export { SiteHeader }
