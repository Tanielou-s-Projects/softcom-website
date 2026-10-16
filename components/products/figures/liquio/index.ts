import type { FigureMap } from "@/components/products/figures/types"
import {
  LiquioFoundation,
  LiquioService,
} from "@/components/products/diagrams/liquio"

/** liquio's figures, by the `figure.key` in content/products/pages.ts: the deck's diagrams. */
export const LIQUIO_FIGURES: FigureMap = {
  foundation: LiquioFoundation,
  service: LiquioService,
}
