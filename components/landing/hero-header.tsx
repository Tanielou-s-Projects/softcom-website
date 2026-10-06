import { SiteHeader } from "@/components/site/site-header"

/**
 * The landing page's header. The hero is a full-bleed pinned scene, so the
 * pill floats over it rather than taking space in the flow like other pages —
 * the hero reserves the top band for it instead (`pt-20` on its headline).
 * SiteHeader's own headroom does the rest: shown at the top of the hero, out
 * of the way while the scene scrolls, back on scroll up.
 */
export function HeroHeader() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <SiteHeader />
    </div>
  )
}
