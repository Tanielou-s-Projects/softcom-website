import { DocumentTextIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * Insights — articles, news, and thought leadership.
 */
export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Digital Strategy", value: "digital-strategy" },
          { title: "Data", value: "data" },
          { title: "Government Tech", value: "government-tech" },
          { title: "Leadership", value: "leadership" },
          { title: "Strategy", value: "strategy" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Surface this on the homepage / Insights featured pull.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary used in cards and previews.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
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
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
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
      category: "category",
      featured: "featured",
      media: "coverImage",
    },
    prepare({ title, category, featured, media }) {
      const tag = category ? category.replace(/-/g, " ") : "uncategorised"
      return {
        title,
        subtitle: `${featured ? "★ Featured · " : ""}${tag}`,
        media,
      }
    },
  },
})
