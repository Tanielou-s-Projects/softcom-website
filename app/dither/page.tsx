import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DitherLab } from "@/components/site/dither-lab"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Dither — Workshop",
  robots: { index: false, follow: false },
}

/** Dev-only workshop for the Paper Shaders dithering plates. 404s in prod. */
export default function Page() {
  if (!PLAYGROUND_ENABLED) notFound()

  return <DitherLab />
}
