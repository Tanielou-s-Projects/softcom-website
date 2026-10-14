import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity"

import { anchorFor, blockText } from "@/components/insights/article-outline"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"

/*
 * The article body as the Studio writes it, set for long-form reading: a
 * ~65ch measure, generous leading, headings that open sections with air above
 * them, quiet lists, a pull-quote rule in the accent and underlined links.
 * Inline images keep their slot and caption but render the placeholder, as
 * every image on the site does for now.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={anchorFor(blockText(value))}
        className="mt-16 scroll-mt-32 text-title text-balance text-ink first:mt-0"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 text-xl font-medium tracking-[-0.01em] text-ink">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="label mt-10 text-ink-soft">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-12 border-l-2 border-accent pl-6 text-2xl leading-snug font-light tracking-[-0.015em] text-pretty text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-3 pl-6 marker:text-ink-faint">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-6 marker:font-mono marker:text-sm marker:text-ink-faint">
        {children}
      </ol>
    ),
  },
  listItem: ({ children }) => <li className="pl-1">{children}</li>,
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noreferrer" : undefined}
        className="text-accent-ink underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-12">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
          <ImagePlaceholder label={value?.alt || undefined} />
        </div>
        {value?.caption && (
          <figcaption className="label mt-3 text-ink-faint">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
}

export function ArticleBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="max-w-[65ch] space-y-6 text-lg leading-[1.7] text-ink-soft">
      <PortableText value={body} components={components} />
    </div>
  )
}
