import {
  BulbOutlineIcon,
  CaseIcon,
  DocumentTextIcon,
  PackageIcon,
} from "@sanity/icons"

import { caseStudiesPage } from "@/components/case-studies/page-copy"
import { insightsPage } from "@/components/insights/page-copy"
import { productsPage } from "@/components/products/page-copy"
import { solutionsPage } from "@/components/solutions/page-copy"
import type { PageDefinition } from "@/sanity/lib/page-schema"

/** Solutions and the index pages (see sanity/schemaTypes/pages.ts). */
export const SOLUTIONS_PAGES: PageDefinition[] = [
  {
    name: "solutionsPage",
    title: "Solutions",
    icon: BulbOutlineIcon,
    defaults: solutionsPage,
    notes: {
      "infrastructure.steps":
        "The pinned story's three steps, in the city drawing's order: identity, records, services.",
      "intelligence.kinds":
        "The rail's cards. Each sits over a drawing in this order: audit, financial, market, regulatory, societal.",
      "initiatives.phases": "The delivery timeline, left to right.",
    },
  },
  {
    name: "productsPage",
    title: "Enterprise Products",
    icon: PackageIcon,
    defaults: productsPage,
    notes: {
      "labels.explore":
        'The word before a product\'s name on its card and its page: "Explore Sentinel".',
      "labels.audience":
        'The small label over the "Built for …" block on every product page.',
    },
  },
  {
    name: "insightsPage",
    title: "Insights",
    icon: DocumentTextIcon,
    defaults: insightsPage,
    notes: {
      "filter.topics":
        "The topic filter, in order. Names must match the insights' categories exactly.",
      "headings.latest": "A new line here is a line break on the page.",
    },
  },
  {
    name: "caseStudiesPage",
    title: "Case Studies",
    icon: CaseIcon,
    defaults: caseStudiesPage,
    notes: {
      "filter.sectors":
        "The sector filter, in order. Names must match the case studies' sectors exactly.",
    },
  },
]
