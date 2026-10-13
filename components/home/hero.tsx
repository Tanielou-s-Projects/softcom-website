import Image from "next/image"

import { ButtonLink } from "@/components/ui/button"
import type { HomePage } from "@/content/home/page-copy"

/*
 * Full-bleed photograph under a drawn four-column grid, the headline set
 * large across the lower left. The grid lines are the same hairlines the
 * rest of the site is built on, here in white.
 */
export function Hero({ copy }: { copy: HomePage["hero"] }) {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink text-white">
      <Image
        src={copy.portalImage}
        alt={copy.portalImageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.2)_55%,rgb(0_0_0/0.35))]" />

      <div
        aria-hidden="true"
        className="shell pointer-events-none absolute inset-0 grid grid-cols-2 md:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="border-l border-white/20 last:border-r max-md:[&:nth-child(2)]:border-r max-md:[&:nth-child(n+3)]:hidden"
          />
        ))}
      </div>

      <div className="shell relative pb-10 md:pb-14">
        <h1 className="text-display font-light">
          <span className="block">
            {copy.headlineFirstLine} {copy.headlineSecondLine}
          </span>
          <span className="block text-white/60">
            {copy.progressFirstLine} {copy.progressSecondLine}
          </span>
        </h1>
        <div className="mt-10 flex flex-wrap gap-2 md:mt-14">
          <ButtonLink href={copy.primaryCta.href} tone="light">
            {copy.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={copy.secondaryCta.href} tone="glass">
            {copy.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
