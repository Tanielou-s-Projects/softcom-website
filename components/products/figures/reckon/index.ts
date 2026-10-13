import type { FigureMap } from "@/components/products/figures/types"
import {
  ReckonChartOfAccounts,
  ReckonDeclaredOwed,
  ReckonEngine,
  ReckonException,
  ReckonJudgement,
  ReckonThreeRecords,
  ReckonTraced,
  ReckonYears,
} from "@/components/products/diagrams/reckon"

/** reckon's figures, by the `figure.key` in pages.ts: the deck's diagrams. */
export const RECKON_FIGURES: FigureMap = {
  "declared-owed": ReckonDeclaredOwed,
  "three-records": ReckonThreeRecords,
  "chart-of-accounts": ReckonChartOfAccounts,
  exception: ReckonException,
  years: ReckonYears,
  judgement: ReckonJudgement,
  traced: ReckonTraced,
  engine: ReckonEngine,
}
