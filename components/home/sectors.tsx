import Image from "next/image"

import { SectionHeading } from "@/components/ui/section-heading"
import type { HomePage } from "@/content/home/page-copy"

/*
 * Who Softcom works with: three sectors side by side on surface cards, then
 * the organisations as a slow, greyscale marquee.
 */
export function Sectors({
  copy,
  partners,
}: {
  copy: HomePage["whoWeWorkWith"]
  partners: HomePage["partners"]
}) {
  return (
    <section className="mt-32 md:mt-48">
      <div className="shell">
        <SectionHeading heading={copy.heading} intro={copy.intro} />
        <ul className="mt-12 grid gap-2 md:mt-20 md:grid-cols-3">
          {copy.sectors.map((sector) => (
            <li
              key={sector.title}
              className="flex flex-col rounded-xl bg-surface p-6 md:min-h-[26rem] md:p-8"
            >
              <h3 className="text-title whitespace-pre-line">{sector.title}</h3>
              <p className="mt-auto pt-10 text-ink-soft md:pt-16">
                {sector.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {sector.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 md:mt-28">
        <p className="shell label text-ink-soft">{partners.label}</p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
            {[0, 1].map((copyIndex) =>
              partners.logos.map((logo) => (
                <li
                  key={`${copyIndex}-${logo.name}`}
                  aria-hidden={copyIndex === 1}
                  className="flex h-16 shrink-0 items-center px-8 md:px-12"
                >
                  <Image
                    src={logo.logo}
                    alt={copyIndex === 0 ? logo.name : ""}
                    width={logo.width}
                    height={logo.height}
                    className="h-8 w-auto max-w-36 object-contain opacity-50 brightness-0 md:h-10 dark:invert"
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
