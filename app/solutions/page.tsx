import type { Metadata } from "next"

import { Bleed } from "@/components/landing/section"
import { SolutionAreas } from "@/components/solutions/solution-areas"
import { SolutionsCta } from "@/components/solutions/solutions-cta"
import { SolutionsHero } from "@/components/solutions/solutions-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Three integrated solution areas that together cover the full arc of delivery — digital infrastructure, intelligence, and programmes.",
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <SolutionsHero />
      <SolutionAreas />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="flex flex-col gap-2.5 py-6">
        <SolutionsCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
