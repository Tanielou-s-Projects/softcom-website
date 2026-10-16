import type { HomePage } from "@/content/home/page-copy"
import { PortalHero } from "./portal-hero"

export function Hero({ copy }: { copy: HomePage["hero"] }) {
  return <PortalHero copy={copy} />
}
