import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { AlumniPage } from "@/content/about/page-copy"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/* The invitation, at lede size, then a wide slot for the team photograph. */
export function AlumniIntro({
  copy,
  label,
  imageAlt,
}: {
  copy: AlumniPage["intro"]
  label: string
  imageAlt: string
}) {
  const [first, ...rest] = copy.paragraphs

  return (
    <section className="mt-16 md:mt-24">
      <div className="shell grid gap-6 md:grid-cols-12 md:gap-x-6">
        <p className="label text-ink-soft md:col-span-3">{label}</p>
        <div className="md:col-span-9">
          {first && (
            <LineReveal as="p" className="text-lede text-pretty">
              {first}
            </LineReveal>
          )}
          <Reveal className="mt-8 max-w-xl space-y-4 text-xl tracking-[-0.01em] text-ink-soft">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
      </div>
      <Reveal className="shell mt-16 md:mt-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[21/9]">
          <ImagePlaceholder label={imageAlt} />
        </div>
      </Reveal>
    </section>
  )
}
