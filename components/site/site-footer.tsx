/* eslint-disable @next/next/no-img-element -- local SVG, intentionally not run through next/image */
import Link from "next/link"

import { footerNav } from "@/components/landing/content"
import { ThemeSwitcher } from "@/components/site/theme-switcher"

/**
 * The footer plate. On desktop the oversized wordmark and the copyright line
 * are absolutely placed inside a fixed 700px panel, per Figma; below `lg` they
 * fall back into normal flow so the panel can grow with its content.
 *
 * The plate stays `bg-neutral-900` in both themes rather than following `--card`
 * — a dark footer under a light page is the intent, and it keeps the oversized
 * wordmark legible. It therefore carries a local `dark` class, so every role
 * used inside resolves to its dark value even while the page is light, instead
 * of each one having to be pinned by hand.
 */
function SiteFooter() {
  return (
    <footer className="dark relative overflow-clip rounded-4xl bg-neutral-900 px-6 pt-14 pb-6 lg:h-[700px] lg:px-[46px] lg:pt-[60px] lg:pb-0">
      <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <p className="font-heading text-3xl leading-[1.026] text-foreground lg:w-[610px] lg:text-[3.375rem]">
          Technology for Organisations. Progress for Society.
        </p>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-start gap-x-12 gap-y-8 text-sm leading-6 font-medium lg:gap-[127px]"
        >
          {footerNav.map((group) => (
            <div
              key={group.heading}
              className="flex flex-col items-start gap-4"
            >
              <p className="text-muted-foreground">{group.heading}</p>
              <ul className="flex flex-col items-start gap-2 text-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Oversized wordmark, held at its natural 1268x284 proportions. */}
      <img
        src="/brand/softcom-wordmark.svg"
        alt="Softcom"
        className="mt-14 block h-auto w-full lg:absolute lg:top-[44.16%] lg:right-[4.45%] lg:left-[4.45%] lg:mt-0"
      />

      {/* neutral-400 on neutral-900 clears AA; the design's neutral-700 was ~2:1 and read as unreadable. */}
      <p className="mt-10 text-sm leading-6 font-medium text-neutral-400 lg:absolute lg:bottom-[33px] lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:whitespace-nowrap">
        © 2026 Softcom Limited. All rights reserved.
      </p>

      {/* Optically centred against the copyright's 24px line, not its box. */}
      <ThemeSwitcher className="mt-6 lg:absolute lg:right-[46px] lg:bottom-[29px] lg:mt-0" />
    </footer>
  )
}

export { SiteFooter }
