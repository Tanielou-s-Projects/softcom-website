import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Softcom — Hero motion study",
  robots: { index: false, follow: false },
}

export default async function HeroPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>
}) {
  if (!PLAYGROUND_ENABLED) notFound()
  const { variant } = await searchParams
  redirect(`/?v.hero=${variant === "grid" ? "grid" : "circles"}`)
}
