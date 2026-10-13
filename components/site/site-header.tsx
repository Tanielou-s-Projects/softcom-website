import Link from "next/link"

import { Wordmark } from "@/components/site/wordmark"
import type { HeaderCopy } from "@/content/site/chrome-copy"
import { cn } from "@/lib/utils"

const CONTACT_HREF = "/contact"

/*
 * A floating white bar, inset from the viewport edges, that reads the same
 * over paper and over photography. Contact is pulled out of the menu as the
 * accent pill. Dropdowns open on hover and keyboard focus with no script; on
 * phones the menu is a <details> sheet.
 */
export function SiteHeader({ header }: { header: HeaderCopy }) {
  const menu = header.items.filter((item) => item.href !== CONTACT_HREF)
  const contact = header.items.find((item) => item.href === CONTACT_HREF)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-5 md:pt-5">
      <div className="mx-auto flex h-14 max-w-[88.75rem] items-center justify-between rounded-[0.625rem] bg-surface/95 pr-2 pl-5 text-ink shadow-[0_1px_0_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.18)] backdrop-blur-md">
        <Link href="/" aria-label="Softcom home">
          <Wordmark className="h-5" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {menu.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="flex h-10 items-center rounded-full px-4 text-[0.9375rem] transition-colors hover:bg-ink/5"
              >
                {item.label}
              </Link>
              {item.links.length > 0 && (
                <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-56 rounded-[0.625rem] bg-surface p-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)] ring-1 ring-line">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-2 text-[0.9375rem] hover:bg-ink/5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {contact && (
            <Link
              href={contact.href}
              className="ml-3 flex h-10 items-center rounded-full bg-accent px-5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-deep"
            >
              {contact.label}
            </Link>
          )}
        </nav>

        <details className="group md:hidden">
          <summary className="label flex h-10 cursor-pointer list-none items-center rounded-full px-4 hover:bg-ink/5 [&::-webkit-details-marker]:hidden">
            {header.menuLabel}
          </summary>
          <nav
            aria-label="Main"
            className="absolute inset-x-2 top-[4.25rem] rounded-[0.625rem] bg-surface p-3 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)] ring-1 ring-line"
          >
            <ul>
              {header.items.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-line last:border-0"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-3 text-xl tracking-[-0.02em]",
                      item.href === CONTACT_HREF && "text-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.links.length > 0 && (
                    <ul className="pb-3">
                      {item.links
                        .filter((link) => link.href !== item.href)
                        .map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="block px-3 py-1.5 text-ink-soft"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
