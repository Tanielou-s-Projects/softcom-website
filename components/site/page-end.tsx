import { Bleed } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { cn } from "@/lib/utils"

/**
 * Every page's ending: its closing call to action, then the footer. They share
 * this wrapper so the CTA's `sticky` pin resolves against it — the footer then
 * scrolls up over the pinned panel.
 */
function PageEnd({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Bleed
      className={cn("mt-40 flex flex-col gap-2.5 py-6 lg:mt-64", className)}
    >
      {children}
      <SiteFooter />
    </Bleed>
  )
}

export { PageEnd }
