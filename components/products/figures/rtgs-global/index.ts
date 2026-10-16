import type { FigureMap } from "@/components/products/figures/types"
import { RtgsFx, RtgsNetwork } from "@/components/products/diagrams/rtgs"

/** rtgs-global's figures, by the `figure.key` in content/products/pages.ts: the deck's diagrams. */
export const RTGS_FIGURES: FigureMap = {
  network: RtgsNetwork,
  fx: RtgsFx,
}
