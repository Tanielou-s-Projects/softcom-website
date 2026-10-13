import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

/*
 * Page copy from Sanity. Every page has one singleton document whose fields
 * mirror the page's copy object in code (the defaults). The document is laid
 * over the defaults field by field, so:
 *
 * - a field an editor fills in replaces the default;
 * - a field left empty keeps the default, so nothing on the site goes blank;
 * - an uploaded image replaces the default image path (as its CDN URL).
 *
 * Fetches are tagged with the document's type, which the publish webhook
 * (/api/revalidate) marks stale.
 */

const REVALIDATE = 60

/*
 * Straight from the API, not the CDN: Next caches the page, and the CDN can
 * still hold the old copy for a moment after a publish, which would undo the
 * webhook's refresh.
 */
const fresh = client.withConfig({ useCdn: false })

type SanityImage = { _type?: string; asset?: { _ref?: string } }

const isImage = (value: unknown): value is SanityImage =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as SanityImage).asset?._ref === "string"

/** A document value as plain data: `_key`/`_type` dropped, images as URLs. */
function plainOf(value: unknown): unknown {
  if (isImage(value)) return urlFor(value).auto("format").url()
  if (Array.isArray(value)) return value.map(plainOf)
  if (typeof value === "object" && value !== null)
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "_key" && key !== "_type")
        .map(([key, v]) => [key, plainOf(v)])
    )
  return value
}

/** A default's shape with its text emptied. */
function blankOf(value: unknown): unknown {
  if (typeof value === "string") return ""
  if (Array.isArray(value)) return []
  if (typeof value === "object" && value !== null)
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, blankOf(v)])
    )
  return value
}

/** Lays `doc` over `defaults`, keeping each default the doc leaves empty. */
export function merge<T>(defaults: T, doc: unknown): T {
  if (doc === null || doc === undefined) return defaults

  // An image field over a path default: the uploaded image's URL.
  if (typeof defaults === "string") {
    if (isImage(doc)) return urlFor(doc).auto("format").url() as T
    return (typeof doc === "string" && doc.trim() !== "" ? doc : defaults) as T
  }

  if (typeof defaults === "number" || typeof defaults === "boolean")
    return (typeof doc === typeof defaults ? doc : defaults) as T

  if (Array.isArray(defaults)) {
    if (!Array.isArray(doc) || doc.length === 0) return defaults
    // No default to take a shape from (an empty list in code): use the
    // editor's items as written, minus Sanity's keys, images as URLs.
    if (defaults.length === 0) return doc.map(plainOf) as T
    // Items match their default by position; an item an editor adds beyond
    // the defaults takes the first default's shape with every field blank,
    // so it never borrows another item's copy.
    const blank = blankOf(defaults[0])
    return doc.map((item, index) =>
      merge(index < defaults.length ? defaults[index] : blank, item)
    ) as T
  }

  if (typeof defaults === "object" && defaults !== null) {
    if (typeof doc !== "object") return defaults
    const out: Record<string, unknown> = {
      ...(defaults as Record<string, unknown>),
    }
    for (const key of Object.keys(defaults)) {
      out[key] = merge(
        (defaults as Record<string, unknown>)[key],
        (doc as Record<string, unknown>)[key]
      )
    }
    return out as T
  }

  return defaults
}

/**
 * A page's copy: its singleton (`_id` and `_type` are the same name) over
 * the code defaults.
 */
export async function getPageContent<T>(type: string, defaults: T): Promise<T> {
  try {
    const doc = await fresh.fetch(
      `*[_id == $id][0]`,
      { id: type },
      { next: { revalidate: REVALIDATE, tags: [type] } }
    )
    return merge(defaults, doc)
  } catch {
    // Sanity unreachable: the site still renders with its own copy.
    return defaults
  }
}
