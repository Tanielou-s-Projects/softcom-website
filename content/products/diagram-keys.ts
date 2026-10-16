/**
 * The deck diagrams rebuilt in code, by product. Sanity's product schema
 * offers these as the choices for a figure, so an editor can place, reorder or
 * drop a diagram without a developer — but a new diagram still needs code.
 *
 * Kept free of React so the Studio can import it without pulling in the
 * diagrams themselves.
 */
export const DIAGRAMS = {
  sentinel: [
    { key: "connections", title: "See the connections. Follow the money." },
    {
      key: "records-to-intelligence",
      title: "From financial records to intelligence.",
    },
    { key: "records", title: "Bring the records together." },
    { key: "visible", title: "Make the investigation visible." },
  ],
  reckon: [
    { key: "declared-owed", title: "Declared against owed." },
    { key: "three-records", title: "Three records, one rule, one exception." },
    { key: "chart-of-accounts", title: "One chart of accounts." },
    { key: "exception", title: "An exception, as the officer sees it." },
    { key: "years", title: "Three years, papered as 364 days." },
    { key: "judgement", title: "Rules, then judgement." },
    { key: "traced", title: "One finding, traced." },
    { key: "engine", title: "Three uses of one engine." },
  ],
  lift: [
    { key: "tiers", title: "Four tiers." },
    { key: "modules", title: "One member, six modules." },
    { key: "trusted", title: "From sign-up to Trusted." },
    { key: "gate", title: "A soft gate on a funding program." },
    { key: "payout", title: "Order to payout." },
    { key: "initiatives", title: "One product, many initiatives." },
  ],
  liquio: [
    {
      key: "foundation",
      title: "One foundation. Services across departments.",
    },
    { key: "service", title: "Connect every stage of a public service." },
  ],
  "rtgs-global": [
    {
      key: "network",
      title: "Connect payment operations to shared settlement infrastructure.",
    },
    { key: "fx", title: "Two payment instructions. One linked FX settlement." },
  ],
} as const

/** Every diagram as `slug/key`, the value a Sanity figure stores. */
export const DIAGRAM_OPTIONS = Object.entries(DIAGRAMS).flatMap(
  ([slug, list]) =>
    list.map(({ key, title }) => ({
      value: `${slug}/${key}`,
      title: `${slug} · ${title}`,
    }))
)
