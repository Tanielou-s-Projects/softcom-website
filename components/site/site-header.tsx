/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
"use client"

import * as React from "react"
import Link from "next/link"

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
  "h-auto w-auto rounded-none p-0 font-body text-xs leading-none font-medium text-foreground transition-colors hover:bg-transparent focus:bg-transparent hover:text-brand-cyan data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:text-brand-cyan"

/**
 * Overlays the hero. Figma places it at y=27, and its 1384px row inside a
 * 1440px frame is a 28px gutter rather than a cap.
 *
 * The pill is a component set with five variants (278:51) that reduce to two
 * independent axes:
 *
 *   pill   collapsed (80px, two dots) <-> expanded (392px, nav + close)
 *   logo   white <-> its two `o`s in brand cyan and blue
 *
 * Collapsed, the whole pill opens the menu; expanded, the blue dot has become a
 * close button — so the cyan dot holds its position while the blue one travels
 * right and picks up the ✕. The logo's two states are byte-identical bar those
 * two fills, and are orthogonal to the pill, which is why hover drives them.
 *
 * `NavigationMenu` deliberately wraps the pill rather than sitting inside it:
 * the dropdown viewport is rendered as the root's last child, so keeping it a
 * *sibling* of the pill stops the pill's `overflow-hidden` — which the width
 * morph needs — from clipping the dropdown.
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
    <header className="absolute top-[27px] right-0 left-0 z-10 flex items-center justify-between px-6 lg:px-7">
      <Link
        href="/"
        aria-label="Softcom home"
        className="group relative block h-[51px] w-[169px] shrink-0"
      >
        <img
          src="/brand/softcom-logo.svg"
          alt="Softcom"
          className="absolute inset-0 size-full transition-opacity duration-200 group-hover:opacity-0 motion-reduce:transition-none"
        />
        <img
          src="/brand/softcom-logo-active.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 size-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
        />
      </Link>

      <NavigationMenu
        aria-label="Main"
        value={menuValue}
        onValueChange={setMenuValue}
        className="max-w-max shrink-0 justify-end"
      >
        <div
          id="site-menu"
          className={cn(
            "overflow-hidden rounded-full bg-background transition-[width] duration-300 ease-out motion-reduce:transition-none",
            open ? "w-[392px]" : "w-20"
          )}
        >
          {open ? (
            <div className="flex h-12 w-[392px] items-center justify-between px-4">
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
                      <NavigationMenuContent>
                        <ul className="w-[224px]">
                          {item.submenu.map((sub) => (
                            <li key={sub.href}>
                              <NavigationMenuLink
                                asChild
                                className="rounded-xl p-2.5 font-body text-xs leading-none font-medium hover:text-brand-cyan"
                              >
                                <Link href={sub.href} onClick={close}>
                                  {sub.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
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
                <img
                  src="/brand/close-x.svg"
                  alt=""
                  width={9.5}
                  height={9.5}
                  className="size-[9.5px]"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={false}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
              className="flex h-12 w-20 items-center justify-center px-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
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
      </NavigationMenu>
    </header>
  )
}

export { SiteHeader }
