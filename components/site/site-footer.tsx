import Link from "next/link"

import { DitherWordmark } from "@/components/motion/dither-wordmark"
import type { Navigation } from "@/content/site/chrome-copy"
import type { SiteSettings } from "@/sanity/lib/data"

/*
 * The footer is the one ink plate on a paper site: link columns on a
 * hairline grid, then the wordmark at full shell width as the sign-off, drawn
 * in the site's dither and resolving in the first time it is seen.
 */
export function SiteFooter({
  footer,
  settings,
}: {
  footer: Navigation["footer"]
  settings: SiteSettings
}) {
  const legal = [...footer.legal, ...settings.social].filter(
    (link) => link.href
  )

  return (
    <footer className="dark mt-32 bg-paper text-ink md:mt-48">
      <div className="shell pt-16 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <p className="label text-ink-faint">{footer.contactLabel}</p>
            <a
              href={`mailto:${settings.email}`}
              className="mt-4 inline-block text-title transition-colors hover:text-signal"
            >
              {settings.email}
            </a>
            {settings.address.length > 0 && (
              <address className="mt-6 text-ink-soft not-italic">
                {settings.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            )}
          </div>
          {footer.columns.map((column) => (
            <div key={column.heading} className="md:col-span-2">
              <p className="label text-ink-faint">{column.heading}</p>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DitherWordmark
          src="/brand/softcom-wordmark.svg"
          alt="Softcom"
          className="mt-24 text-ink/25 md:mt-32"
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-ink-faint">
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          {legal.length > 0 && (
            <ul className="flex gap-6">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
