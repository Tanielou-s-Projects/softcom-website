import { insightsIntro, topics } from "@/components/insights/content"

/*
 * Every line of copy on the Insights index, as Sanity's `insightsPage`
 * singleton mirrors it. The articles are Sanity `insight` documents.
 */
export const insightsPage = {
  hero: {
    badge: "News & Insights",
    title: "Research, analysis, & perspectives from the field.",
  },
  intro: {
    text: insightsIntro,
  },
  filter: {
    allLabel: "All",
    /** The topic filter, in order; names must match the insights' categories. */
    topics: [...topics] as string[],
  },
  headings: {
    featured: "Featured Insight",
    latest: "Latest\nInsights",
  },
}

export type InsightsPage = typeof insightsPage
