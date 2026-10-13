import Image from "next/image"

import { ArrowLink } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/section-heading"
import { capabilities } from "@/content/home/content"
import type { HomePage } from "@/content/home/page-copy"

/* Three focus areas as numbered columns on a hairline grid. */
export function FocusAreas({ copy }: { copy: HomePage["focusAreas"] }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <SectionHeading heading={copy.heading} intro={copy.intro} />
      <ol className="mt-12 grid border-t border-line md:-mx-6 md:mt-20 md:grid-cols-3 md:border-t-0">
        {copy.areas.map((area, i) => (
          <li
            key={area.title}
            className="flex flex-col border-b border-line py-8 md:border-b-0 md:border-l md:px-6 md:pt-0 md:first:border-l-0"
          >
            <p className="label text-ink-faint md:border-t md:border-line md:pt-8">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-title">{area.title}</h3>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={area.image}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 space-y-4 text-ink-soft">
              {area.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ArrowLink
              href={`/solutions#${capabilities[i]?.id ?? ""}`}
              className="mt-8 md:mt-auto md:pt-8"
            >
              {copy.linkPrefix} {area.title}
            </ArrowLink>
          </li>
        ))}
      </ol>
    </section>
  )
}
