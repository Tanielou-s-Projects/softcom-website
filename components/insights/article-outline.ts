import type { PortableTextBlock } from "next-sanity"

/*
 * What the article page reads off the Portable Text body beyond rendering
 * it: plain text per block, the H2 outline (for the contents rail and the
 * headings' anchors) and a reading time.
 */

type Span = { _type?: string; text?: string }

/** A block's text with its marks stripped. */
export function blockText(block: PortableTextBlock) {
  if (block._type !== "block" || !Array.isArray(block.children)) return ""
  return (block.children as Span[]).map((child) => child.text ?? "").join("")
}

/** "Scope without sequence" → "scope-without-sequence". */
export function anchorFor(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .slice(0, 64)
}

/** Every H2 in the body, in order: the article's sections. */
export function outlineOf(body: PortableTextBlock[]) {
  return body
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => {
      const text = blockText(block)
      return { id: anchorFor(text), text }
    })
    .filter((section) => section.text)
}

/** Minutes at an unhurried 220 words a minute, never under one. */
export function readingMinutes(body: PortableTextBlock[]) {
  const words = body
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
