import { ScrubLines } from "@/components/motion/scrub-lines"
import { Crosshairs } from "@/components/ui/crosshairs"
import { withYears, type HomePage } from "@/content/home/page-copy"

/*
 * Who Softcom is, in one long sentence set at lede size, its lines rising
 * with the scroll.
 */
export function Statement({ copy }: { copy: HomePage["hero"] }) {
  return (
    <section className="pt-24 md:pt-36">
      <Crosshairs />
      <ScrubLines
        className="shell mt-10 grid gap-6 md:mt-16 md:grid-cols-12"
        label="Softcom"
        labelClassName="label text-ink-soft md:col-span-3"
        textClassName="text-lede text-pretty md:col-span-9"
      >
        {copy.statementBefore}
        <span className="text-accent-ink">
          {withYears(copy.statementHighlight)}
        </span>
        {copy.statementAfter}
      </ScrubLines>
    </section>
  )
}
