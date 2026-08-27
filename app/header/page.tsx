import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { HeaderLab, type HeaderVariant } from "@/components/site/header-lab"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Header — Lab",
  robots: { index: false, follow: false },
}

const VARIANTS: HeaderVariant[] = ["pills", "capsule", "bar", "glass"]

/** Dev-only lab for the sticky header variations. 404s in prod. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!PLAYGROUND_ENABLED) notFound()

  const sp = await searchParams
  const v = typeof sp.variant === "string" ? sp.variant : undefined
  const initial = VARIANTS.includes(v as HeaderVariant)
    ? (v as HeaderVariant)
    : "pills"

  return <HeaderLab initialVariant={initial} />
}
