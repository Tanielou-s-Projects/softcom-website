import { Crosshairs } from "@/components/ui/crosshairs"
import { withYears, type HomePage } from "@/content/home/page-copy"

/* Who Softcom is, in one long sentence set at lede size. */
export function Statement({ copy }: { copy: HomePage["hero"] }) {
  return (
    <section className="pt-24 md:pt-36">
      <Crosshairs />
      <div className="shell mt-10 grid gap-6 md:mt-16 md:grid-cols-12">
        <p className="label text-ink-soft md:col-span-3">Softcom</p>
        <p className="text-lede text-pretty md:col-span-9">
          {copy.statementBefore}
          <span className="text-accent">
            {withYears(copy.statementHighlight)}
          </span>
          {copy.statementAfter}
        </p>
      </div>
    </section>
  )
}
