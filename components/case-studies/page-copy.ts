import { sectors } from "@/components/case-studies/content"

/*
 * Every line of copy on Case Studies, as Sanity's `caseStudiesPage`
 * singleton mirrors it. The studies are Sanity `caseStudy` documents; the
 * impact numbers in the hero come from the home page's stats.
 */
export const caseStudiesPage = {
  meta: {
    description:
      "A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes.",
  },
  hero: {
    badge: "Case Studies",
    title: "Real engagements. Measurable outcomes.",
    lead: "A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes.",
    image: "/images/pos-agent.jpg",
  },
  filter: {
    allLabel: "All",
    /** The sector filter, in order; names must match the studies' sectors. */
    sectors: [...sectors] as string[],
  },
  labels: {
    client: "Client",
  },
}

export type CaseStudiesPage = typeof caseStudiesPage
