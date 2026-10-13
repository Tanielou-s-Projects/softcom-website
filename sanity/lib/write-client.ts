import { client } from "@/sanity/lib/client"

/**
 * Sanity with write access, for the site's own forms. The token
 * (`SANITY_API_WRITE_TOKEN`, editor role) is server-only: import this from
 * server actions and route handlers, never from client components.
 */
export function writeClient() {
  if (typeof window !== "undefined")
    throw new Error("The Sanity write client is server-only.")
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return null
  return client.withConfig({ token, useCdn: false })
}
