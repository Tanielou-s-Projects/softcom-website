import { VariantSwitch } from "@/components/variants/variant-switch"
import type { HomePage } from "@/components/landing/home-copy"
import { PortalHero } from "./portal-hero"

export function Hero({ copy }: { copy: HomePage["hero"] }) {
  return (
    <VariantSwitch
      variant="hero"
      cases={{
        circles: <PortalHero variant="circles" copy={copy} />,
        grid: <PortalHero variant="grid" copy={copy} />,
        dissolve: <PortalHero variant="dissolve" copy={copy} />,
      }}
    />
  )
}
