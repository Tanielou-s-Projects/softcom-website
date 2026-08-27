/**
 * Case Studies copy, transcribed from Figma `Case Studies` (node 215:23).
 *
 * Held here for the same reason as the other pages' copy: this is the most
 * obviously editorial content on the site and the first thing that will move to
 * Sanity, so the components stay presentational.
 */

/**
 * The filter's order is the design's, not the order the studies happen to
 * appear in — deriving it from the list would put Financial Inclusion last.
 */
export const sectors = [
  "Government",
  "Financial Inclusion",
  "FMCG",
  "Agriculture",
] as const

export type Sector = (typeof sectors)[number]

export type CaseStudy = {
  id: string
  sector: Sector
  title: string
  /** The situation, not the solution — the design only shows the problem. */
  challenge: string
  stat: { value: string; label: string }
  client: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: "npower",
    sector: "Government",
    title: "A National Digital Platform for 500,000 Young Nigerians",
    challenge:
      "Nigeria faced an acute youth unemployment crisis — nearly 50% of graduates were unemployed or unemployable. Past government interventions struggled with inefficiency, poor reach, and weak accountability. The challenge: recruit, train, deploy, and pay half a million young people fairly and on time, across all 36 states.",
    stat: { value: "500k", label: "Youth Engaged" },
    client: "Federal Government of Nigeria",
  },
  {
    id: "cash-transfers",
    sector: "Government",
    title: "Conditional Cash Transfers to Nigeria's Poorest Households",
    challenge:
      "Over 100 million Nigerians are classified as multidimensionally poor. The Federal Government needed to deliver targeted support to the poorest households — encouraging education, immunisation, and family planning — while reaching riverine and hard-to-access rural communities with full transparency.",
    stat: { value: "190k+", label: "Beneficiaries Reached" },
    client: "National Cash Transfer Office / FGN",
  },
  {
    id: "coca-cola",
    sector: "FMCG",
    title: "Connecting Directly with 12 Million Coca-Cola Consumers",
    challenge:
      "Millions of Nigerians drank Coca-Cola daily, yet the company had limited visibility into who those consumers were or how to reward loyalty beyond traditional retail channels. A direct consumer database was needed — built at scale, fast.",
    stat: { value: "12M", label: "Consumers Identified" },
    client: "Coca-Cola Nigeria",
  },
  {
    id: "gb-foods",
    sector: "Agriculture",
    title:
      "Digitising the Agricultural Value Chain for West Africa's Largest Tomato Processor",
    challenge:
      "GB Foods operates the largest tomato processing factory in West Africa in Kebbi State, sourcing from 1,500 hectares of farm and 5,000+ out-grower farmers. Before production could scale, they needed a reliable way to identify, verify, and profile thousands of smallholder farmers.",
    stat: { value: "13k+", label: "Farmers Profiled" },
    client: "GB Foods Nigeria",
  },
  {
    id: "bank-of-industry",
    sector: "Financial Inclusion",
    title: "Digital Micro-Lending to 1.2 Million Nigerian Traders",
    challenge:
      "Millions of Nigerian informal traders had no credit history, no bank account, and no access to formal lending — making them invisible to the financial system. The Bank of Industry needed to reach them directly, at scale, with verifiable identity and instant disbursement.",
    stat: { value: "1.2M", label: "Traders Reached" },
    client: "Bank of Industry / Federal Government of Nigeria",
  },
  {
    id: "trophy-beer",
    sector: "FMCG",
    title: "Building a Direct Consumer Relationship for Trophy Beer",
    challenge:
      "AB InBev needed to understand and directly engage their Trophy Beer consumer base in Nigeria's informal beer market — a largely anonymous audience transacting through informal distribution channels with no direct brand-to-consumer connection.",
    stat: { value: "4M", label: "Consumers Engaged" },
    client: "AB InBev Nigeria — Trophy Beer",
  },
]
