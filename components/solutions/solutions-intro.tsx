import { Reveal } from "@/components/motion/reveal"
import type { SolutionsPage } from "@/content/solutions/page-copy"

/*
 * What the three areas add up to: the first paragraph set large as the
 * page's thesis, the second beneath it at reading size.
 */
export function SolutionsIntro({ copy }: { copy: SolutionsPage["intro"] }) {
  const [thesis, ...rest] = copy.paragraphs

  return (
    <section className="shell mt-16 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-x-6">
      <Reveal className="md:col-span-3">
        <p className="label text-ink-soft">{copy.badge}</p>
      </Reveal>
      <Reveal className="md:col-span-9">
        <p className="text-lede text-balance">{thesis}</p>
        {rest.map((p) => (
          <p key={p} className="mt-8 max-w-2xl text-lg text-ink-soft">
            {p}
          </p>
        ))}
      </Reveal>
    </section>
  )
}
