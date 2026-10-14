import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { SectionHeading } from "@/components/ui/section-heading"
import type { AboutPage } from "@/content/about/page-copy"
import { Reveal } from "@/components/motion/reveal"

type Person = { name?: string; role?: string }

/*
 * The leadership as a people grid: a portrait slot each, with the name and
 * role in mono labels on a hairline beneath. `id="team"` is the anchor the
 * header's "Leadership" link points at.
 */
export function Leadership({
  copy,
  people,
}: {
  copy: AboutPage["leadership"]
  people: Person[]
}) {
  return (
    <section id="team" className="shell mt-32 scroll-mt-24 md:mt-48">
      <SectionHeading label="Leadership" heading={copy.heading} />
      <Reveal
        as="ul"
        stagger
        className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-20 md:gap-x-6 md:gap-y-12 lg:grid-cols-3"
      >
        {people.map((person, i) => (
          <li key={person.name ?? i}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <ImagePlaceholder
                label={person.name ? `Portrait of ${person.name}` : undefined}
              />
            </div>
            <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
              <p className="label">{person.name}</p>
              <p className="label text-ink-soft lg:text-right">{person.role}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  )
}
