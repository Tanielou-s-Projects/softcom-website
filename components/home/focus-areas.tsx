import { FocusRows } from "@/components/home/focus-rows"
import { SectionHeading } from "@/components/ui/section-heading"
import { capabilities } from "@/content/home/content"
import type { HomePage } from "@/content/home/page-copy"

/* The three focus areas, as Daylight-style rows read through a fixed centre. */
export function FocusAreas({ copy }: { copy: HomePage["focusAreas"] }) {
  return (
    <section className="mt-32 md:mt-48">
      <div className="shell">
        <SectionHeading heading={copy.heading} intro={copy.intro} />
      </div>
      <FocusRows
        rows={copy.areas.map((area, i) => ({
          title: area.title,
          paragraphs: area.paragraphs,
          href: `/solutions#${capabilities[i]?.id ?? ""}`,
          linkLabel: `${copy.linkPrefix} ${area.title}`,
        }))}
      />
    </section>
  )
}
