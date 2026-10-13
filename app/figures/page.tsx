import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { RailsFigure } from "@/components/solutions/figures/rails/figure"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Figures — Workshop",
  robots: { index: false, follow: false },
}

/** Dev-only bench for the Solutions anatomy figures. 404s in prod. */
export default function Page() {
  if (!PLAYGROUND_ENABLED) notFound()

  return (
    <main className="mx-auto flex max-w-[880px] flex-col gap-10 px-6 py-24">
      <RailsFigure />
    </main>
  )
}
