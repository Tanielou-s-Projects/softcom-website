import { PackageIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

import { DIAGRAM_OPTIONS } from "@/content/products/diagram-keys"

/*
 * Products — Softcom's own and the partner platforms it implements. One
 * document holds both the card on Enterprise Products and the product's own
 * page at /enterprise-products/<slug>, in the copy deck's order: hero, then
 * sections, then who it is for and the closing ask.
 */

const link = defineField({
  name: "cta",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      description: 'A path on the site ("/contact") or a full URL.',
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
})

/** A figure: one of the deck's rebuilt diagrams, or a screenshot. */
export const productFigure = defineType({
  name: "productFigure",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "diagram",
      title: "Diagram",
      description:
        "One of the deck's diagrams, rebuilt in code. Leave empty to show the screenshot below instead.",
      type: "string",
      options: { list: DIAGRAM_OPTIONS },
    }),
    defineField({
      name: "image",
      title: "Screenshot",
      description: "A product screen, shown as-is when no diagram is chosen.",
      type: "image",
    }),
    defineField({
      name: "title",
      title: "Caption title",
      description: 'The deck\'s caption, e.g. "Declared against owed."',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  validation: (r) =>
    r.custom((value: { diagram?: string; image?: unknown } | undefined) =>
      value && !value.diagram && !value.image
        ? "Choose a diagram or add a screenshot."
        : true
    ),
  preview: {
    select: { title: "title", diagram: "diagram", media: "image" },
    prepare: ({ title, diagram, media }) => ({
      title,
      subtitle: diagram ? `Diagram · ${diagram}` : "Screenshot",
      media,
    }),
  },
})

const paragraphs = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "text", rows: 3 })],
  })

export const productSection = defineType({
  name: "productSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (r) => r.required(),
    }),
    paragraphs("body", "Body", "One entry per paragraph."),
    defineField({
      name: "cards",
      title: "Cards",
      description: "Short titled points, shown as a row of cards.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "description", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "figures",
      type: "array",
      of: [defineArrayMember({ type: "productFigure" })],
    }),
    defineField({
      name: "note",
      description: 'Small print under the section, e.g. "Illustrative."',
      type: "string",
    }),
  ],
  preview: { select: { title: "heading" } },
})

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "page", title: "Product page" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "card",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      description: "The page's address: /enterprise-products/<slug>.",
      type: "slug",
      group: "card",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      group: "card",
      options: {
        list: [
          { title: "Softcom product", value: "softcom" },
          { title: "Partner platform", value: "partner" },
        ],
        layout: "radio",
      },
      initialValue: "softcom",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      description: "Position on Enterprise Products (lower first).",
      type: "number",
      group: "card",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "card",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      description: "The card's paragraph on Enterprise Products.",
      type: "text",
      rows: 4,
      group: "card",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ditherSeed",
      title: "Dither seed",
      description:
        "Gives the product its own dither front, on its card and page hero. Any whole number.",
      type: "number",
      group: "card",
    }),
    defineField({
      name: "wordmark",
      description: "The product's logo, laid over its card (SVG preferred).",
      type: "image",
      group: "card",
    }),

    defineField({
      name: "eyebrow",
      description:
        'Over the page title, e.g. "Softcom product · Applied Intelligence".',
      type: "string",
      group: "page",
    }),
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "page",
    }),
    paragraphs(
      "lead",
      "Lead",
      "The first paragraph sits in the hero; the rest open the page."
    ),
    { ...link, name: "primary", title: "Hero button", group: "page" },
    defineField({
      name: "heroFigure",
      title: "Opening figure",
      type: "productFigure",
      group: "page",
    }),
    defineField({
      name: "sections",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "productSection" })],
    }),
    defineField({
      name: "audience",
      title: "Who it is for",
      type: "object",
      group: "page",
      fields: [
        defineField({ name: "heading", type: "string" }),
        paragraphs("body", "Body"),
        defineField({ name: "note", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "close",
      title: "Closing call to action",
      type: "object",
      group: "page",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "text", type: "text", rows: 2 }),
        link,
      ],
    }),
  ],
  orderings: [
    {
      title: "Page order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      kind: "kind",
      media: "wordmark",
    },
    prepare: ({ title, subtitle, kind, media }) => ({
      title,
      subtitle: `${kind === "partner" ? "Partner · " : ""}${subtitle ?? ""}`,
      media,
    }),
  },
})
