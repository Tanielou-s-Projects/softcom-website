import type { FigureMap } from "@/components/products/figures/types"
import {
  LiftGate,
  LiftInitiatives,
  LiftModules,
  LiftPayout,
  LiftTiers,
  LiftTrusted,
} from "@/components/products/diagrams/lift"

/** lift's figures, by the `figure.key` in pages.ts: the deck's diagrams. */
export const LIFT_FIGURES: FigureMap = {
  tiers: LiftTiers,
  modules: LiftModules,
  trusted: LiftTrusted,
  gate: LiftGate,
  payout: LiftPayout,
  initiatives: LiftInitiatives,
}
