import { ArrowLink } from "@/components/ui/button"
import { Crosshairs } from "@/components/ui/crosshairs"
import type { HomePage } from "@/content/home/page-copy"

/* How Softcom works: the claim on the left, the two halves of it on the right. */
export function Approach({ copy }: { copy: HomePage["approach"] }) {
  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <h2 className="text-headline font-normal text-balance md:col-span-6">
          {copy.heading}
        </h2>
        <div className="md:col-span-5 md:col-start-8">
          <p className="text-xl tracking-[-0.01em]">{copy.lead}</p>
          <p className="mt-6 text-ink-soft">{copy.body}</p>
          <ArrowLink href={copy.cta.href} className="mt-8">
            {copy.cta.label}
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}
