import type { QueryParams } from "next-sanity"

import { client } from "@/sanity/lib/client"

/*
 * How the site reads Sanity. Every fetch is cached under the document types
 * it depends on, refreshes on its own within a minute, and refreshes at once
 * when the Studio publishes: a Sanity webhook calls `/api/revalidate`, which
 * marks the published type's tag stale (see that route).
 *
 * Not `defineLive`: next-sanity 13's Live Content API is built for Cache
 * Components (`'use cache'`), which this app doesn't enable.
 */

/*
 * Straight from the API, not the CDN: Next already caches the result, and the
 * CDN can lag a publish by a moment, which would undo the webhook's refresh.
 */
const fresh = client.withConfig({ useCdn: false })

/** Seconds before a cached query is refetched, webhook or not. */
const REVALIDATE = 60

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags,
}: {
  query: QueryString
  params?: QueryParams
  /** The document types the result depends on, e.g. `["insight"]`. */
  tags: string[]
}) {
  return fresh.fetch(query, params, {
    next: { revalidate: REVALIDATE, tags },
  })
}
