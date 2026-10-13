import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LineDitherDefs } from "@/components/iso/line-dither"
import { CityFigure } from "@/components/solutions/figures/city/figure"
import { VignetteFigure } from "@/components/solutions/figures/vignettes/figure"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Figures — Workshop",
  robots: { index: false, follow: false },
}

const FOCUS = ["identity", "records", "services"] as const
const VIGNETTES = [
  ["audit", "Audit Intelligence"],
  ["financial", "Financial Intelligence"],
  ["market", "Market Intelligence"],
  ["regulatory", "Regulatory Intelligence"],
  ["societal", "Societal Intelligence"],
] as const

/** Dev-only bench for the Solutions line figures. 404s in prod. */
export default function Page() {
  if (!PLAYGROUND_ENABLED) notFound()

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-2.5 px-6 py-24">
      <LineDitherDefs />
      {FOCUS.map((focus) => (
        <div
          key={focus}
          data-focus={focus}
          className="line-panel rounded-3xl p-6 lg:p-10"
        >
          <CityFigure />
        </div>
      ))}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {VIGNETTES.map(([id, label]) => (
          <div key={id} className="line-panel rounded-3xl p-6">
            <VignetteFigure id={id} label={label} />
          </div>
        ))}
      </div>
    </main>
  )
}
