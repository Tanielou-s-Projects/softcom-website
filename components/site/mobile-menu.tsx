"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"

import { ButtonLink } from "@/components/ui/button"
import type { HeaderCopy } from "@/content/site/chrome-copy"

const EASE = [0.16, 1, 0.3, 1] as const
const noop = () => () => {}

/**
 * The phone's navigation: the capsule can't widen past a phone's edge, so on
 * small screens its dot opens this sheet instead. Every section in large
 * light type with its pages beneath, and the way to get in touch at the foot.
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
  // The portal needs <body>, which the server render doesn't have.
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

  React.useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      root.style.overflow = previous
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="dark fixed inset-0 z-30 flex flex-col overflow-y-auto bg-black px-4 pt-28 pb-8 text-ink md:hidden"
        >
          <nav aria-label="Main" className="flex-1">
            <ul className="flex flex-col">
              {items.map((item, i) => {
                const links = (item.links ?? []).filter(
                  (link) => link?.label && link?.href && link.href !== item.href
                )
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
                    className="border-t border-line py-5"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block text-headline text-ink"
                    >
                      {item.label}
                    </Link>
                    {links.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                        {links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="label text-ink-soft"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
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
            className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-6"
          >
            <a href="mailto:contact@softcom.xyz" className="text-lede text-ink">
              contact@softcom.xyz
            </a>
            <ButtonLink href="/contact" tone="light" onClick={onClose}>
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
