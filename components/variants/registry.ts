/**
 * Every in-page design exploration is registered here so the floating switcher
 * can list it and the store can validate it. Add a key while exploring; when a
 * direction is chosen, delete the losing branches *and* the key.
 *
 * The first option is the production default — what ungated visitors see.
 */
export const VARIANTS = {
  hero: {
    label: "Hero",
    options: [
      { id: "conduit", label: "Conduit (current)" },
      { id: "portals", label: "Portals" },
      { id: "reveal", label: "Reveal" },
    ],
  },
  tags: {
    label: "Sector tags",
    options: [
      { id: "pill", label: "Pill" },
      { id: "index", label: "Index list" },
      { id: "inline", label: "Inline run" },
    ],
  },
  margins: {
    label: "Margins",
    options: [
      { id: "none", label: "None" },
      { id: "labelled", label: "Labelled rails" },
      { id: "dither", label: "Dither" },
    ],
  },
} as const satisfies Record<
  string,
  { label: string; options: readonly { id: string; label: string }[] }
>

export type VariantKey = keyof typeof VARIANTS
export type VariantId<K extends VariantKey> =
  (typeof VARIANTS)[K]["options"][number]["id"]

export type VariantState = { [K in VariantKey]?: VariantId<K> }

export function defaultVariant<K extends VariantKey>(key: K): VariantId<K> {
  return VARIANTS[key].options[0].id as VariantId<K>
}

export function isVariantId<K extends VariantKey>(
  key: K,
  id: unknown
): id is VariantId<K> {
  return VARIANTS[key].options.some((o) => o.id === id)
}
