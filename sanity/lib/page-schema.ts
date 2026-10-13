import type { ComponentType } from "react"
import {
  defineArrayMember,
  defineField,
  defineType,
  type FieldDefinition,
} from "sanity"

/*
 * Page singletons, generated from the page's copy object in code (the same
 * object `getPageContent` uses as defaults), so the Studio form and the site
 * can never drift apart:
 *
 * - each top-level key is a tab in the Studio;
 * - short strings are lines, long strings paragraphs;
 * - a string that is an image path ("/images/…") is an image upload;
 * - a list of strings is a list of paragraphs, a list of objects a list of
 *   items with the first item's fields;
 * - nested objects are grouped fields.
 *
 * Every field is optional: left empty, the site keeps its current copy.
 */

const IMAGE = /^\/.*\.(png|jpe?g|webp|svg|avif)$/i

/** "heroImages" → "Hero images". */
export const titleOf = (key: string) => {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const isLong = (text: string) => text.length > 70 || text.includes("\n")

const isFilled = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined && v !== null

/**
 * One item's shape for a list of objects: every key any item has, each with
 * the first filled-in value, so an empty list or blank field in the first
 * item doesn't decide the form.
 */
function shapeOf(items: object[]): Record<string, unknown> {
  const shape: Record<string, unknown> = {}
  for (const item of items)
    for (const [key, value] of Object.entries(item))
      if (!(key in shape) || (!isFilled(shape[key]) && isFilled(value)))
        shape[key] = value
  return shape
}

function fieldOf(
  name: string,
  value: unknown,
  group?: string,
  notes: Record<string, string> = {},
  path = name
): FieldDefinition {
  const base = {
    name,
    title: titleOf(name),
    description: notes[path],
    ...(group ? { group } : {}),
  }

  if (typeof value === "string") {
    if (IMAGE.test(value))
      return defineField({
        ...base,
        type: "image",
        options: { hotspot: true },
        description:
          notes[path] ?? "Leave empty to keep the image the site uses now.",
      })
    return defineField({
      ...base,
      type: isLong(value) ? "text" : "string",
      ...(isLong(value) ? { rows: 3 } : {}),
    } as FieldDefinition)
  }

  if (typeof value === "number") return defineField({ ...base, type: "number" })
  if (typeof value === "boolean")
    return defineField({ ...base, type: "boolean" })

  if (Array.isArray(value)) {
    const first = value[0]
    if (typeof first === "string" && IMAGE.test(first))
      return defineField({
        ...base,
        type: "array",
        of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
        description:
          notes[path] ?? "Leave empty to keep the images the site uses now.",
      })
    if (typeof first === "object" && first !== null) {
      const shape = shapeOf(value as object[])
      return defineField({
        ...base,
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: `${name}Item`,
            title: titleOf(name),
            fields: Object.entries(shape).map(([key, v]) =>
              fieldOf(key, v, undefined, notes, `${path}.${key}`)
            ),
            preview: {
              select: Object.fromEntries(
                Object.entries(shape)
                  .filter(([, v]) => typeof v === "string" && !IMAGE.test(v))
                  .slice(0, 2)
                  .map(([key], i) => [i === 0 ? "title" : "subtitle", key])
              ),
            },
          }),
        ],
      })
    }
    return defineField({
      ...base,
      type: "array",
      of: [
        defineArrayMember({
          type: first && isLong(String(first)) ? "text" : "string",
        }),
      ],
    })
  }

  if (typeof value === "object" && value !== null)
    return defineField({
      ...base,
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: Object.entries(value).map(([key, v]) =>
        fieldOf(key, v, undefined, notes, `${path}.${key}`)
      ),
    })

  return defineField({ ...base, type: "string" })
}

/** A page singleton, before it is generated into a schema type. */
export type PageDefinition = {
  /** Also the document's fixed `_id` and its cache tag. */
  name: string
  title: string
  icon?: ComponentType
  /** The page's copy object in code: the form's shape and its fallbacks. */
  defaults: Record<string, unknown>
  /** Help text by field path, e.g. `{ "hero.title": "Keep it short" }`. */
  notes?: Record<string, string>
}

export function pageSingleton({
  name,
  title,
  icon,
  defaults,
  notes,
}: PageDefinition) {
  const sections = Object.keys(defaults)
  return defineType({
    name,
    title,
    type: "document",
    icon,
    groups: sections.map((key, index) => ({
      name: key,
      title: titleOf(key),
      default: index === 0,
    })),
    fields: Object.entries(defaults).map(([key, value]) =>
      fieldOf(key, value, key, notes)
    ),
    preview: { prepare: () => ({ title }) },
  })
}

/* ── Seeding: the defaults as a Sanity document ── */

const keyOf = () => Math.random().toString(36).slice(2, 14)

/** The defaults as document fields: arrays of objects get `_key`s, and
 *  image paths are dropped (an empty image field keeps the site's image). */
export function toDocument(value: unknown): unknown {
  if (typeof value === "string") return IMAGE.test(value) ? undefined : value
  if (Array.isArray(value)) {
    if (typeof value[0] === "string" && IMAGE.test(value[0])) return undefined
    return value.map((item) =>
      typeof item === "object" && item !== null
        ? { _key: keyOf(), ...(toDocument(item) as object) }
        : item
    )
  }
  if (typeof value === "object" && value !== null)
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, toDocument(v)])
        .filter(([, v]) => v !== undefined)
    )
  return value
}
