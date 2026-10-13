import { defineQuery } from "next-sanity"

/*
 * Every GROQ query the site runs, written with `defineQuery` so TypeGen can
 * type its result (`pnpm typegen` after editing one). Image fields project
 * the asset's dimensions so the site can size `next/image` without a guess.
 */

const image = /* groq */ `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  alt,
  hotspot
}`

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  organisation,
  email,
  address,
  social[]{ label, url }
}`)

export const INSIGHTS_QUERY = defineQuery(`*[
  _type == "insight" && defined(slug.current)
] | order(featured desc, publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  coverImage${image}
}`)

export const INSIGHT_QUERY = defineQuery(`*[
  _type == "insight" && slug.current == $slug
][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  author,
  publishedAt,
  coverImage${image},
  body
}`)

export const INSIGHT_SLUGS_QUERY = defineQuery(`*[
  _type == "insight" && defined(slug.current)
]{ "slug": slug.current }`)

export const CASE_STUDIES_QUERY = defineQuery(`*[
  _type == "caseStudy" && defined(slug.current)
] | order(featured desc, publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  client,
  sector,
  metric,
  metricLabel,
  challenge
}`)

export const ROLES_QUERY = defineQuery(`*[
  _type == "role" && active == true
] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  department,
  location,
  type,
  applyLink,
  applyEmail
}`)

export const LEADERS_QUERY =
  defineQuery(`*[_type == "leader"] | order(order asc){
  _id,
  name,
  role,
  photo${image}
}`)

const figure = /* groq */ `{
  diagram,
  title,
  caption,
  image${image}
}`

export const PRODUCTS_QUERY = defineQuery(`*[
  _type == "product" && defined(slug.current)
] | order(order asc){
  _id,
  name,
  "slug": slug.current,
  kind,
  tagline,
  description,
  ditherSeed,
  wordmark${image}
}`)

export const PRODUCT_QUERY = defineQuery(`*[
  _type == "product" && slug.current == $slug
][0]{
  _id,
  name,
  "slug": slug.current,
  kind,
  tagline,
  description,
  ditherSeed,
  eyebrow,
  title,
  lead,
  primary,
  heroFigure${figure},
  sections[]{
    _key,
    heading,
    body,
    cards[]{ label, description },
    figures[]${figure},
    note
  },
  audience,
  close
}`)

export const PRODUCT_SLUGS_QUERY = defineQuery(`*[
  _type == "product" && defined(slug.current)
]{ "slug": slug.current }`)
