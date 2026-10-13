import { DitherMark } from "@/components/motion/dither-mark"
import { FullHero } from "@/components/site/full-hero"

/**
 * Discs of different weight, loosely joined — ideas connecting — and the
 * claim. No lead or rail: the standfirst and topic filter open the list
 * directly below, and repeating them here would split the filter from what it
 * filters.
 */
function InsightsHero() {
  return (
    <FullHero
      background={<DitherMark layout="insights" />}
      badge="News & Insights"
      title="Research, analysis, & perspectives from the field."
    />
  )
}

export { InsightsHero }
