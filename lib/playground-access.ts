/**
 * The playground is internal tooling, so it is reachable in development and
 * off in production unless explicitly switched on.
 *
 * Set `ENABLE_PLAYGROUND=true` on a preview deployment to share it with the
 * team; leave it unset on production and the route 404s.
 *
 * Read at build time, which is what you want on Vercel — the value is fixed per
 * deployment rather than per request. Note this gates *access*, not bundle
 * weight: Tailwind scans the playground's source either way, which costs about
 * 2KB gzipped. Excluding that too would need `@source not` on the directory.
 */
export const PLAYGROUND_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_PLAYGROUND === "true"
