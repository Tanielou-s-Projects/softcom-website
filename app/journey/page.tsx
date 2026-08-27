import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JourneyLab } from "@/components/about/journey-lab"
import type { JourneyReveal } from "@/components/about/journey-timeline"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Journey — Lab",
  robots: { index: false, follow: false },
}

const REVEALS: JourneyReveal[] = ["side", "below", "card"]

/**
 * Dev-only lab for the "Our Journey" timeline reveal variations. 404s in prod.
 * The starting variation is shareable via `?reveal=side|below|card`.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!PLAYGROUND_ENABLED) notFound()

  const sp = await searchParams
  const r = typeof sp.reveal === "string" ? sp.reveal : undefined
  const initial = REVEALS.includes(r as JourneyReveal)
    ? (r as JourneyReveal)
    : "side"

  return <JourneyLab initialReveal={initial} />
}
