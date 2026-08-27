import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PlaygroundShell } from "@/components/playground/playground-shell"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Softcom Design System — Playground",
  robots: { index: false, follow: false },
}

export default function PlaygroundPage() {
  // Internal tooling — see lib/playground-access.ts.
  if (!PLAYGROUND_ENABLED) notFound()

  return <PlaygroundShell />
}
