/**
 * This route mounts the Sanity Studio at `/studio`.
 *
 * The Studio is configured in `sanity.config.ts` at the project root and
 * rendered by the `Studio` Client Component (the config pulls in `@sanity/ui`,
 * which must run client-side).
 *
 * Learn more: https://github.com/sanity-io/next-sanity#studio
 */
import Studio from "./Studio"

export const dynamic = "force-static"

export { metadata, viewport } from "next-sanity/studio"

export default function StudioPage() {
  return <Studio />
}
