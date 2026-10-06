import { VariantSwitch } from "@/components/variants/variant-switch"
import { PortalHero } from "./portal-hero"

export function Hero() {
  return (
    <VariantSwitch
      variant="hero"
      cases={{
        circles: <PortalHero variant="circles" />,
        grid: <PortalHero variant="grid" />,
        dissolve: <PortalHero variant="dissolve" />,
      }}
    />
  )
}
