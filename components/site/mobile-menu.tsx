"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"

import { Arrow } from "@/components/ui/arrow"
import { ButtonLink } from "@/components/ui/button"
import { lockScroll } from "@/lib/smooth-scroll"
import type { HeaderCopy } from "@/content/site/chrome-copy"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const
const noop = () => () => {}

/** A link is current on its own page and, for a section, on the pages under it. */
const isCurrent = (pathname: string, href: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)

/**
 * The phone's navigation: the capsule can't widen past a phone's edge, so on
 * small screens its dot opens this sheet instead. Every section as a ruled row
 * with its pages listed beneath at a thumb-sized height, the current page
 * marked, and the way to get in touch at the foot.
 * Rendered into <body>, under the capsule (which stays on top as the close
 * button), with the page's scroll held while it is open.
 */
function MobileMenu({
  open,
  items,
  onClose,
}: {
  open: boolean
  items: HeaderCopy["items"]
  onClose: () => void
}) {
  const pathname = usePathname()
  // The portal needs <body>, which the server render doesn't have.
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

  React.useEffect(() => {
    if (!open) return
    lockScroll(true)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      lockScroll(false)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          // Its own scroll, outside the smooth scroller.
          data-lenis-prevent=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="dark fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black px-4 pt-28 pb-8 text-ink md:hidden"
        >
          <nav aria-label="Main" className="flex-1">
            <ul className="flex flex-col border-b border-line">
              {items.map((item, i) => {
                const links = (item.links ?? []).filter(
                  (link) => link?.label && link?.href && link.href !== item.href
                )
                const current = isCurrent(pathname, item.href)
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: 0.05 + i * 0.06,
                    }}
                    className="border-t border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-4 py-4 font-heading text-[2rem] leading-[1.1] font-light",
                        current ? "text-accent-ink" : "text-ink"
                      )}
                    >
                      {item.label}
                      <Arrow className="size-5" />
                    </Link>
                    {links.length > 0 && (
                      <ul className="-mt-1 flex flex-col pb-3">
                        {links.map((link) => {
                          const here = isCurrent(pathname, link.href)
                          return (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                aria-current={here ? "page" : undefined}
                                className={cn(
                                  "flex min-h-10 items-center gap-3 text-body",
                                  here ? "text-ink" : "text-ink-soft"
                                )}
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    "size-1.5 shrink-0 rounded-full",
                                    here ? "bg-accent-ink" : "bg-line-strong"
                                  )}
                                />
                                {link.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </motion.li>
                )
              })}
            </ul>
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4"
          >
            <a
              href="mailto:contact@softcom.xyz"
              className="label text-ink-soft"
            >
              contact@softcom.xyz
            </a>
            <ButtonLink
              href="/contact"
              tone="light"
              onClick={onClose}
              className="h-12 w-full"
            >
              Start a conversation
            </ButtonLink>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export { MobileMenu }
