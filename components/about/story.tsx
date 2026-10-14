import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { AboutPage } from "@/content/about/page-copy"
import { story as storyContent } from "@/content/about/content"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/*
 * How Softcom began: the headline beside the first paragraph at lede size,
 * the rest set narrow below it, then the hero's "life at Softcom" slots as a
 * strip of image placeholders: one height, varied widths.
 */
export function Story({
  copy,
  images,
}: {
  copy: AboutPage["story"]
  images: AboutPage["hero"]["images"]
}) {
  const [first, ...rest] = copy.paragraphs
  /* Five slots at most; the spans add up to twelve columns. */
  const spans = [
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-2",
  ]
  const slots = images.slice(0, spans.length)

  return (
    <section id="story" className="mt-16 scroll-mt-24 md:mt-24">
      <div className="shell grid gap-10 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <p className="label mb-5 text-ink-soft">{storyContent.eyebrow}</p>
          <LineReveal
            as="h2"
            className="text-headline font-normal text-balance"
          >
            {copy.heading}
          </LineReveal>
        </div>
        <Reveal className="md:col-span-6 md:col-start-7 md:pt-10">
          {first && <p className="text-xl tracking-[-0.01em]">{first}</p>}
          <div className="mt-6 space-y-4 text-ink-soft">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
      {slots.length > 0 && (
        <Reveal
          stagger="cards"
          className="shell mt-16 grid grid-cols-2 gap-3 md:mt-24 md:grid-cols-12 md:gap-6"
        >
          {slots.map((_, i) => (
            <div
              key={i}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-lg md:aspect-auto md:h-[26rem]",
                spans[i],
                i === 0 && "col-span-2 aspect-[16/10]",
                i > 2 && "hidden md:block"
              )}
            >
              <ImagePlaceholder />
            </div>
          ))}
        </Reveal>
      )}
    </section>
  )
}
