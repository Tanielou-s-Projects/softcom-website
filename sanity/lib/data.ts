import type { PortableTextBlock } from "next-sanity"

import type { Sector, CaseStudy } from "@/components/case-studies/content"
import type { Insight, Topic } from "@/components/insights/content"
import type { Portrait } from "@/components/landing/content"
import type { Product } from "@/components/products/content"
import type {
  ProductFigure,
  ProductPage,
  ProductSection,
} from "@/components/products/pages"
import { client } from "@/sanity/lib/client"
import { sanityFetch } from "@/sanity/lib/live"
import {
  CASE_STUDIES_QUERY,
  INSIGHT_QUERY,
  INSIGHT_SLUGS_QUERY,
  INSIGHTS_QUERY,
  LEADERS_QUERY,
  PRODUCT_QUERY,
  PRODUCT_SLUGS_QUERY,
  PRODUCTS_QUERY,
  ROLES_QUERY,
  SETTINGS_QUERY,
} from "@/sanity/lib/queries"
import type { PRODUCT_QUERY_RESULT } from "@/sanity/types"

/*
 * The site's content, from Sanity, in the shapes the components already take.
 * Pages call these; components never see a Sanity document. Each fetch is
 * tagged with the document types it reads, which is what `/api/revalidate`
 * invalidates when the Studio publishes.
 */

/* ── Labels: the schemas store values, the site prints titles ── */

const TOPICS: Record<string, Topic> = {
  "digital-strategy": "Digital Strategy",
  data: "Data",
  "government-tech": "Government Tech",
  leadership: "Leadership",
  strategy: "Strategy",
}

const SECTORS: Record<string, string> = {
  government: "Government",
  "financial-inclusion": "Financial Inclusion",
  fmcg: "FMCG",
  agriculture: "Agriculture",
  telecoms: "Telecoms",
  health: "Health",
  education: "Education",
  other: "Other",
}

type SanityImage = {
  url: string | null
  width: number | null
  height: number | null
} | null

const imageOf = (image: SanityImage | undefined) =>
  image?.url && image.width && image.height
    ? { src: image.url, width: image.width, height: image.height }
    : undefined

/** "2026-04-26" from a datetime, as the site's date helpers expect. */
const dayOf = (datetime: string | null) => (datetime ?? "").slice(0, 10)

/* ── Site settings ── */

export type SiteSettings = {
  organisation: string
  email: string
  address: string[]
  social: { label: string; href: string }[]
}

export async function getSettings(): Promise<SiteSettings> {
  const data = await sanityFetch({
    query: SETTINGS_QUERY,
    tags: ["siteSettings"],
  })
  return {
    organisation: data?.organisation ?? "Softcom Limited",
    email: data?.email ?? "contact@softcom.xyz",
    address: data?.address ?? [],
    social: (data?.social ?? []).flatMap((link) =>
      link.label && link.url ? [{ label: link.label, href: link.url }] : []
    ),
  }
}

/* ── Insights ── */

export type InsightArticle = Omit<Insight, "id"> & {
  body: PortableTextBlock[]
  author?: string
}

export async function getInsights(): Promise<Insight[]> {
  const data = await sanityFetch({ query: INSIGHTS_QUERY, tags: ["insight"] })
  return data.flatMap((doc) =>
    doc.slug && doc.title
      ? [
          {
            id: doc._id,
            slug: doc.slug,
            topic: TOPICS[doc.category ?? ""] ?? "Strategy",
            date: dayOf(doc.publishedAt),
            title: doc.title,
            dek: doc.excerpt ?? "",
            cover: doc.coverImage?.url ?? "/images/market-payment.jpg",
          },
        ]
      : []
  )
}

export async function getInsight(slug: string): Promise<InsightArticle | null> {
  const doc = await sanityFetch({
    query: INSIGHT_QUERY,
    params: { slug },
    tags: ["insight"],
  })
  if (!doc?.slug || !doc.title) return null
  return {
    slug: doc.slug,
    topic: TOPICS[doc.category ?? ""] ?? "Strategy",
    date: dayOf(doc.publishedAt),
    title: doc.title,
    dek: doc.excerpt ?? "",
    cover: doc.coverImage?.url ?? "/images/market-payment.jpg",
    author: doc.author ?? undefined,
    // Paragraphs, headings, lists and inline images, as the Studio stores them.
    body: (doc.body ?? []) as PortableTextBlock[],
  }
}

/** For `generateStaticParams`: straight from the API, never the CDN. */
export async function getInsightSlugs() {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(INSIGHT_SLUGS_QUERY)
  return data.flatMap((doc) => (doc.slug ? [{ slug: doc.slug }] : []))
}

/* ── Case studies ── */

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await sanityFetch({
    query: CASE_STUDIES_QUERY,
    tags: ["caseStudy"],
  })
  return data.flatMap((doc) =>
    doc.title && doc.sector
      ? [
          {
            id: doc.slug ?? doc._id,
            sector: (SECTORS[doc.sector] ?? "Other") as Sector,
            title: doc.title,
            challenge: doc.challenge ?? "",
            stat: { value: doc.metric ?? "", label: doc.metricLabel ?? "" },
            client: doc.client ?? "",
          },
        ]
      : []
  )
}

/* ── Careers ── */

export type Role = {
  id: string
  title: string
  department?: string
  location?: string
  type?: string
  /** Where to apply: the link, or a mailto for the email. */
  apply?: string
}

const ROLE_TYPES: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
}

export async function getRoles(): Promise<Role[]> {
  const data = await sanityFetch({ query: ROLES_QUERY, tags: ["role"] })
  return data.flatMap((doc) =>
    doc.title
      ? [
          {
            id: doc._id,
            title: doc.title,
            department: doc.department ?? undefined,
            location: doc.location ?? undefined,
            type: doc.type ? ROLE_TYPES[doc.type] : undefined,
            apply:
              doc.applyLink ??
              (doc.applyEmail ? `mailto:${doc.applyEmail}` : undefined),
          },
        ]
      : []
  )
}

/* ── Leadership ── */

export async function getLeaders(): Promise<Portrait[]> {
  const data = await sanityFetch({ query: LEADERS_QUERY, tags: ["leader"] })
  return data.flatMap((doc) =>
    doc.photo?.url
      ? [
          {
            image: doc.photo.url,
            name: doc.name ?? undefined,
            role: doc.role ?? undefined,
          },
        ]
      : []
  )
}

/* ── Products ── */

export type ProductWithKind = Product & { kind: "softcom" | "partner" }

export async function getProducts(): Promise<ProductWithKind[]> {
  const data = await sanityFetch({ query: PRODUCTS_QUERY, tags: ["product"] })
  return data.flatMap((doc) =>
    doc.slug && doc.name
      ? [
          {
            id: doc.slug,
            name: doc.name,
            tagline: doc.tagline ?? "",
            description: doc.description ?? "",
            dither:
              doc.kind === "partner"
                ? undefined
                : (doc.ditherSeed ?? undefined),
            wordmark: imageOf(doc.wordmark),
            kind: doc.kind === "partner" ? "partner" : "softcom",
          },
        ]
      : []
  )
}

type SanityFigure = NonNullable<NonNullable<PRODUCT_QUERY_RESULT>["heroFigure"]>

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

function figureOf(
  figure: SanityFigure | null | undefined
): ProductFigure | undefined {
  if (!figure?.title) return undefined
  const [source, key] = (figure.diagram ?? "").split("/")
  return {
    key: key || slugify(figure.title),
    source: key ? source : undefined,
    title: figure.title,
    caption: figure.caption ?? undefined,
    image: figure.diagram ? undefined : imageOf(figure.image),
  }
}

export async function getProductPage(slug: string) {
  const doc = await sanityFetch({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product"],
  })
  if (!doc?.slug || !doc.name) return null

  const sections: ProductSection[] = (doc.sections ?? []).map((section) => {
    const [figure, ...also] = (section.figures ?? []).flatMap((f) => {
      const mapped = figureOf(f)
      return mapped ? [mapped] : []
    })
    return {
      id: slugify(section.heading ?? section._key),
      heading: section.heading ?? "",
      body: section.body ?? [],
      cards: section.cards?.length
        ? section.cards.map((card) => ({
            label: card.label ?? "",
            description: card.description ?? "",
          }))
        : undefined,
      figure,
      also: also.length ? also : undefined,
      note: section.note ?? undefined,
    }
  })

  const page: ProductPage = {
    slug: doc.slug,
    eyebrow: doc.eyebrow ?? "",
    title: doc.title ?? doc.name,
    lead: doc.lead ?? [doc.description ?? ""],
    primary: {
      label: doc.primary?.label ?? "Request a demonstration",
      href: doc.primary?.href ?? "/contact",
    },
    figure: figureOf(doc.heroFigure),
    sections,
    audience: doc.audience?.heading
      ? {
          heading: doc.audience.heading,
          body: doc.audience.body ?? [],
          note: doc.audience.note ?? undefined,
        }
      : undefined,
    close: {
      heading: doc.close?.heading ?? "Find the technology that fits your work.",
      text: doc.close?.text ?? "",
      cta: {
        label: doc.close?.cta?.label ?? "Start a conversation",
        href: doc.close?.cta?.href ?? "/contact",
      },
    },
  }

  return { name: doc.name, seed: doc.ditherSeed ?? 1, page }
}

export async function getProductSlugs() {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(PRODUCT_SLUGS_QUERY)
  return data.flatMap((doc) => (doc.slug ? [{ slug: doc.slug }] : []))
}
