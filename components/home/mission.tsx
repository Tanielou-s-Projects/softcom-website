import { ArrowLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { HomePage } from "@/content/home/page-copy"

/* The mission beside a tall image, its body text dropped below. */
export function Mission({ copy }: { copy: HomePage["mission"] }) {
  return (
    <section className="shell mt-24 grid gap-10 md:mt-40 md:grid-cols-12 md:gap-x-6">
      <div className="flex flex-col md:col-span-5">
        <h2 className="text-headline font-normal text-balance">
          {copy.heading}
        </h2>
        <p className="mt-6 max-w-md text-xl tracking-[-0.01em] text-ink-soft">
          {copy.intro}
        </p>
        <div className="mt-10 max-w-md border-t border-line pt-6 md:mt-auto">
          <p>{copy.body}</p>
          <ArrowLink href={copy.cta.href} className="mt-6">
            {copy.cta.label}
          </ArrowLink>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:col-span-7 md:aspect-[7/6]">
        <ImagePlaceholder label={copy.imageAlt} />
      </div>
    </section>
  )
}
