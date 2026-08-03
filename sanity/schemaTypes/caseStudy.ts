import { CaseIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * Case Studies — client work, organised by sector.
 *
 * Modelled on the real content shape: a headline metric plus a
 * Challenge → Solution → Outcomes narrative.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client / organisation",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sector",
      title: "Sector / industry",
      type: "string",
      options: {
        list: [
          { title: "Government", value: "government" },
          { title: "Financial Inclusion", value: "financial-inclusion" },
          { title: "FMCG", value: "fmcg" },
          { title: "Agriculture", value: "agriculture" },
          { title: "Telecoms", value: "telecoms" },
          { title: "Health", value: "health" },
          { title: "Education", value: "education" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Surface this on the homepage case-study pull.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "metric",
      title: "Headline metric",
      description: 'The big number on the card, e.g. "500K" or "1.2M".',
      type: "string",
    }),
    defineField({
      name: "metricLabel",
      title: "Metric label",
      description: 'What the metric counts, e.g. "Youth Engaged".',
      type: "string",
    }),
    defineField({
      name: "challenge",
      title: "The Challenge",
      type: "blockContent",
    }),
    defineField({
      name: "solution",
      title: "Our Approach / Solution",
      type: "blockContent",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      description: "Bullet-point results.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      sector: "sector",
      featured: "featured",
      metric: "metric",
      media: "coverImage",
    },
    prepare({ title, client, sector, featured, metric, media }) {
      const tag = sector ? sector.replace(/-/g, " ") : ""
      const parts = [client, tag].filter(Boolean).join(" · ")
      return {
        title: metric ? `${title} (${metric})` : title,
        subtitle: `${featured ? "★ Featured · " : ""}${parts}`,
        media,
      }
    },
  },
})
