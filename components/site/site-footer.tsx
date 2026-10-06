import Link from "next/link"

import {
  footerLegal,
  footerNav,
  footerSocial,
} from "@/components/landing/content"
import { contactDetails, phoneHref } from "@/components/contact/content"
import { DitherWordmark } from "@/components/site/dither-wordmark"
import { ThemeSwitcher } from "@/components/site/theme-switcher"

/**
 * The footer plate — and, with no persistent top navigation, the site's full
 * menu. Contact details lead (the closing CTA above it has already made the
 * invitation; this gives the means), the menu lists every page and product,
 * and the oversized wordmark, cut by the plate's bottom edge, is a greyscale
 * dither gradient that dissolves into the crop. On desktop the wordmark and the bottom bar are placed inside a
 * fixed panel, per Figma; below `lg` they fall back into normal flow.
 *
 * The plate stays `bg-neutral-900` in both themes rather than following `--card`
 * — a dark footer under a light page is the intent. It therefore carries a
 * local `dark` class, so every role used inside resolves to its dark value
 * even while the page is light.
 */
function SiteFooter() {
  const year = new Date().getFullYear()
  const bottomLinks = [...footerLegal, ...footerSocial].filter(
    (link): link is { label: string; href: string } => Boolean(link.href)
  )

  return (
    <footer className="dark relative overflow-clip rounded-4xl bg-neutral-900 px-6 pt-14 pb-6 lg:h-[min(700px,85svh)] lg:px-[3.2%] lg:pt-[60px] lg:pb-0">
      <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
        <address className="flex flex-col gap-6 not-italic lg:w-[30%]">
          <p className="text-sm leading-6 font-medium text-muted-foreground">
            Get in touch
          </p>
          <div className="flex flex-col gap-1 font-heading text-2xl leading-[1.15] text-foreground lg:text-[1.75rem]">
            <a
              href={`mailto:${contactDetails.email}`}
              className="w-fit hover:text-brand-accent"
            >
              {contactDetails.email}
            </a>
            <a href={phoneHref} className="w-fit hover:text-brand-accent">
              {contactDetails.phone}
            </a>
          </div>
          <p className="text-sm leading-6 text-neutral-400">
            {contactDetails.organisation}
            {contactDetails.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </address>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-10 gap-y-10 text-sm leading-6 font-medium sm:grid-cols-4 lg:gap-x-16"
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

      {/*
       * Oversized wordmark, held at its natural 1268x284 proportions. On
       * desktop it sits on the plate's bottom edge, pushed down so the plate
       * crops its lower ~40% — where its dither gradient has thinned to dots.
       */}
      <DitherWordmark
        src="/brand/softcom-wordmark.svg"
        alt="Softcom"
        className="mt-14 lg:absolute lg:bottom-0 lg:left-[4.45%] lg:mt-0 lg:w-[91.1%] lg:translate-y-[40%]"
      />

      {/* One bottom bar: copyright, legal and social, theme. */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-border pt-6 text-sm leading-6 font-medium text-neutral-400 lg:absolute lg:inset-x-[3.2%] lg:bottom-[24px] lg:mt-0 lg:border-t-0 lg:pt-0">
        {/* neutral-400 on neutral-900 clears AA; the design's neutral-700 was ~2:1. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p>© {year} Softcom Limited. All rights reserved.</p>
          {bottomLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  )
}

export { SiteFooter }
