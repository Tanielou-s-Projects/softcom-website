/**
 * One-off seed: writes the site's current content (the TypeScript content
 * files the pages used before Sanity) as NDJSON for `sanity dataset import`.
 *
 *   npx tsx scripts/seed-sanity.ts > seed.ndjson
 *   npx sanity dataset import seed.ndjson -d production
 *
 * Images are uploaded from /public by the importer (`_sanityAsset`). Run it
 * once, on an empty dataset: ordinary documents get Sanity-generated IDs, so a
 * second run duplicates them. Only the settings singleton has a fixed ID.
 */
import { randomBytes } from "node:crypto"
import path from "node:path"

import { caseStudies } from "@/content/case-studies/content"
import { contactDetails } from "@/content/contact/content"
import { articles } from "@/content/insights/content"
import { portraits } from "@/content/home/content"
import { DIAGRAMS } from "@/content/products/diagram-keys"
import {
  partnerPlatforms,
  products,
  type Product,
} from "@/content/products/content"
import { productPages, type ProductFigure } from "@/content/products/pages"

const PUBLIC = path.resolve(process.cwd(), "public")
const key = () => randomBytes(6).toString("hex")
const asset = (publicPath: string) => ({
  _type: "image",
  _sanityAsset: `image@file://${path.join(PUBLIC, publicPath)}`,
})
const slug = (current: string) => ({ _type: "slug", current })
const out = (doc: Record<string, unknown>) =>
  process.stdout.write(`${JSON.stringify(doc)}\n`)

/* Settings — the one fixed ID. */
out({
  _id: "siteSettings",
  _type: "siteSettings",
  organisation: contactDetails.organisation,
  email: contactDetails.email,
  address: contactDetails.address,
  social: [],
})

/* Insights — the design's one written article. */
const TOPIC_VALUES: Record<string, string> = {
  "Digital Strategy": "digital-strategy",
  Data: "data",
  "Government Tech": "government-tech",
  Leadership: "leadership",
  Strategy: "strategy",
}
for (const article of articles) {
  out({
    _type: "insight",
    title: article.title,
    slug: slug(article.slug),
    category: TOPIC_VALUES[article.topic],
    featured: true,
    excerpt: article.dek,
    coverImage: { ...asset(article.cover), alt: "" },
    publishedAt: `${article.date}T09:00:00.000Z`,
    body: article.paragraphs.map((text) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text, marks: [] }],
    })),
  })
}

/* Case studies. */
const SECTOR_VALUES: Record<string, string> = {
  Government: "government",
  "Financial Inclusion": "financial-inclusion",
  FMCG: "fmcg",
  Agriculture: "agriculture",
}
caseStudies.forEach((study, index) => {
  out({
    _type: "caseStudy",
    title: study.title,
    slug: slug(study.id),
    client: study.client,
    sector: SECTOR_VALUES[study.sector],
    featured: index === 0,
    metric: study.stat.value,
    metricLabel: study.stat.label,
    challenge: study.challenge,
  })
})

/* Leadership, in the order the page shows them. */
portraits.forEach((portrait, index) => {
  if (!portrait.name) return
  out({
    _type: "leader",
    name: portrait.name,
    role: portrait.role,
    photo: { ...asset(portrait.image), alt: portrait.name },
    order: index,
  })
})

/* Products: card fields from content.ts, page fields from pages.ts. */
function figure(productSlug: string, fig: ProductFigure | undefined) {
  if (!fig) return undefined
  const known = (DIAGRAMS as Record<string, readonly { key: string }[]>)[
    productSlug
  ]?.some((d) => d.key === fig.key)
  return {
    _type: "productFigure",
    _key: key(),
    diagram: !fig.image && known ? `${productSlug}/${fig.key}` : undefined,
    image: fig.image ? asset(fig.image.src) : undefined,
    title: fig.title,
    caption: fig.caption,
  }
}

const all: { product: Product; kind: "softcom" | "partner" }[] = [
  ...products.map((product) => ({ product, kind: "softcom" as const })),
  ...partnerPlatforms.map((product) => ({ product, kind: "partner" as const })),
]

all.forEach(({ product, kind }, index) => {
  const page = productPages.find((p) => p.slug === product.id)
  out({
    _type: "product",
    name: product.name,
    slug: slug(product.id),
    kind,
    order: index,
    tagline: product.tagline,
    description: product.description,
    ditherSeed: product.dither ?? index + 1,
    wordmark: product.wordmark ? asset(product.wordmark.src) : undefined,
    ...(page
      ? {
          eyebrow: page.eyebrow,
          title: page.title,
          lead: page.lead,
          primary: { label: page.primary.label, href: page.primary.href },
          heroFigure: figure(product.id, page.figure),
          sections: page.sections.map((section) => ({
            _type: "productSection",
            _key: key(),
            heading: section.heading,
            body: section.body,
            cards: section.cards?.map((card) => ({ _key: key(), ...card })),
            figures: [section.figure, ...(section.also ?? [])]
              .map((f) => figure(product.id, f))
              .filter(Boolean),
            note: section.note,
          })),
          audience: page.audience,
          close: {
            heading: page.close.heading,
            text: page.close.text,
            cta: { label: page.close.cta.label, href: page.close.cta.href },
          },
        }
      : {}),
  })
})
