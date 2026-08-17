/**
 * Insights copy, transcribed from Figma `Insights` (node 215:23 → 215:24) and
 * `Insights - Article` (node 318:316).
 *
 * Held here for the same reason as the other pages' copy: editorial content is
 * the first thing that moves to Sanity, so the components stay presentational.
 */

/**
 * The filter's order is the design's. `All` is added by the filter itself
 * rather than living here, so this list stays a set of real topics.
 */
export const topics = [
  "Digital Strategy",
  "Data",
  "Government Tech",
  "Leadership",
  "Strategy",
] as const

export type Topic = (typeof topics)[number]

export type Insight = {
  id: string
  /** Resolves to `/insights/<slug>`. */
  slug: string
  topic: Topic
  /** ISO date; rendered through `formatInsightDate` and `<time dateTime>`. */
  date: string
  title: string
  /** The standfirst under the title on a card. */
  dek: string
  cover: string
}

export type Article = Omit<Insight, "id"> & {
  /** Body copy, one string per paragraph. */
  paragraphs: string[]
}

/**
 * The design draws five cards — one featured, four in the grid — all holding
 * the same placeholder article, and gives body copy for exactly one. So the
 * cards below share that copy and all resolve to the single article route; each
 * becomes its own document once Sanity supplies them.
 */
const placeholder = {
  slug: "why-digital-transformation-fails-in-african-enterprises",
  date: "2026-04-26",
  title:
    "Why Digital Transformation Fails in African Enterprises — And What to Do About It",
  dek: "Most digital transformation efforts fail not because of bad technology, but because of a fundamental misreading of what needs to change.",
  cover: "/insights/cover-digital-transformation.png",
}

/**
 * Topics vary across the cards even though the design prints "Digital Strategy"
 * on all five: the design can only draw one filter state, and a filter whose
 * every option but one returns nothing reads as broken.
 */
export const insights: Insight[] = [
  { id: "featured", topic: "Digital Strategy", ...placeholder },
  { id: "latest-1", topic: "Data", ...placeholder },
  { id: "latest-2", topic: "Government Tech", ...placeholder },
  { id: "latest-3", topic: "Leadership", ...placeholder },
  { id: "latest-4", topic: "Strategy", ...placeholder },
]

export const articles: Article[] = [
  {
    ...placeholder,
    topic: "Digital Strategy",
    paragraphs: [
      "Across Nigeria and the broader African continent, the story repeats itself with uncomfortable regularity. A large enterprise — bank, telco, retailer, or government agency — announces a major digital transformation initiative. External consultants are brought in. A global platform is selected. Millions are committed. And then, two or three years later, the system sits half-implemented, the champions have moved on, and the organisation reverts to what it was doing before.",
      "The failure is rarely technological. The platforms being deployed — whether ERP systems, core banking software, CRM tools, or data platforms — are mature, tested, and capable. The failure is almost always organisational. It is a failure to change the workflows, incentive structures, and mental models that the technology is supposed to serve. A digital system layered onto an analogue process does not produce a digital process. It produces an expensive, underused system and a frustrated workforce.",
      "There are three patterns we see most consistently in failed transformations. The first is scope without sequence — organisations try to change everything at once and end up changing nothing. The second is technology without redesign — new tools are deployed without rethinking the underlying processes they are supposed to improve. The third is implementation without ownership — transformation programmes are run by external teams with no accountability for outcomes after go-live.",
      "What works is different. Successful transformations in African enterprises share a common thread: they start small, move deliberately, and are owned internally at a senior level. They treat the first phase as a learning exercise, not a solution deployment. They build internal capability alongside external delivery. And they define success not by go-live, but by measurable improvement in operational outcomes — faster service, lower cost, better decisions.",
      "For Softcom, this insight has shaped how we engage. We do not sell transformation as a destination. We design it as a journey — one with clear phases, internal champions, and outcomes we stay accountable for long after the initial deployment.",
    ],
  },
]

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}

/**
 * "April 26, 2026" — the design's format. Pinned to `en-US` and UTC so the
 * server and the client can't disagree about it.
 */
export function formatInsightDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** The page's own standfirst, sitting beside the topic filter. */
export const insightsIntro =
  "Thinking from Softcom's practice leads, on digital transformation, data strategy, government technology, and the forces shaping Africa's technology landscape."
