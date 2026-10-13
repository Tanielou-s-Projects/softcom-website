import type { FigureMap } from "@/components/products/figures/types"
import {
  SentinelConnections,
  SentinelRecords,
  SentinelRecordsToIntelligence,
  SentinelVisible,
} from "@/components/products/diagrams/sentinel"

/** Sentinel's figures, by the `figure.key` in pages.ts: the deck's diagrams. */
export const SENTINEL_FIGURES: FigureMap = {
  connections: SentinelConnections,
  "records-to-intelligence": SentinelRecordsToIntelligence,
  records: SentinelRecords,
  visible: SentinelVisible,
}
