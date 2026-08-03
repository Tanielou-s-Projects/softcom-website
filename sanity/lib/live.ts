// Live Content API — real-time content + automatic Visual Editing.
// https://github.com/sanity-io/next-sanity#live-content-api
import { defineLive } from "next-sanity/live"

import { client } from "@/sanity/lib/client"

const token = process.env.SANITY_API_READ_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Tokens are only required to read drafts/preview. Published content works without them.
  serverToken: token,
  browserToken: token,
})
