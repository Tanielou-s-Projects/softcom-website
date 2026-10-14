import { Crosshairs } from "@/components/ui/crosshairs"
import type { AboutPage } from "@/content/about/page-copy"
import { milestones } from "@/content/about/content"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/*
 * The milestones as a hairline-ruled timeline. The heading and the span of
 * years hold still on the left (CSS sticky, no scroll scripting) while the
 * years run down the right, each on its own rule with a node on the spine.
 */
export function Journey({ copy }: { copy: AboutPage["journey"] }) {
  const first = copy.items[0]?.year.split(/[–-]/)[0]
  const last = copy.items.at(-1)?.year.split(/[–-]/).at(-1)

  return (
    <section id="journey" className="mt-32 scroll-mt-24 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="label mb-5 text-ink-soft">{milestones.eyebrow}</p>
            <LineReveal
              as="h2"
              className="text-headline font-normal text-balance"
            >
              {copy.heading}
            </LineReveal>
            {first && last && (
              <p className="label mt-8 text-ink-faint">
                {first} — {last} · {String(copy.items.length).padStart(2, "0")}
              </p>
            )}
          </div>
        </div>

        <Reveal
          as="ol"
          stagger
          className="relative border-b border-line md:col-span-8"
        >
          {copy.items.map((item) => (
            <li
              key={`${item.year}-${item.headline}`}
              className="relative grid gap-3 border-t border-line py-8 pl-6 md:grid-cols-8 md:gap-x-6 md:py-10 md:pl-0"
            >
              {/* On phones, a spine down the left edge with a node per year. */}
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-px bg-line md:hidden"
              />
              <span
                aria-hidden="true"
                className="absolute top-10 -left-[3px] size-[7px] rounded-full bg-accent md:top-[3.25rem] md:hidden"
              />
              <p className="text-title font-light text-accent tabular-nums md:col-span-2">
                {item.year}
              </p>
              <div className="md:col-span-6">
                <h3 className="text-title">{item.headline}</h3>
                <p className="mt-4 max-w-xl text-ink-soft">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
