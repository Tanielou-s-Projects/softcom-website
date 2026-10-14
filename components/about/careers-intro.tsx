import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { CareersPage } from "@/content/about/page-copy"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/*
 * The rest of the invitation: the first paragraph at lede size, the second
 * beside an image slot, so the promise reads before the work does.
 */
export function CareersIntro({
  copy,
  label,
}: {
  copy: CareersPage["intro"]
  label: string
}) {
  const [first, ...rest] = copy.paragraphs

  return (
    <section className="mt-16 md:mt-24">
      <div className="shell grid gap-6 md:grid-cols-12 md:gap-x-6">
        <p className="label text-ink-soft md:col-span-3">{label}</p>
        {first && (
          <LineReveal as="p" className="text-lede text-pretty md:col-span-9">
            {first}
          </LineReveal>
        )}
      </div>
      <div className="shell mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-x-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:col-span-7">
          <ImagePlaceholder />
        </div>
        <Reveal className="space-y-4 self-end text-xl tracking-[-0.01em] text-ink-soft md:col-span-4 md:col-start-9">
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
