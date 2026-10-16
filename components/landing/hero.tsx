import type { HomePage } from "@/components/landing/home-copy"
import { PortalHero } from "./portal-hero"

export function Hero({ copy }: { copy: HomePage["hero"] }) {
  return <PortalHero copy={copy} />
}
