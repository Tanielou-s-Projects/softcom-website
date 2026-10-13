/**
 * Creates each page singleton from its defaults in code, only if it does not
 * exist yet — so running it again never overwrites an editor's work.
 *
 *   npx tsx scripts/seed-pages.ts > pages.json
 *   npx sanity documents create pages.json --missing
 *
 * Image fields are left empty: the site keeps its current image until an
 * editor uploads one.
 */
import { toDocument } from "@/sanity/lib/page-schema"
import { PAGE_DEFINITIONS } from "@/sanity/schemaTypes/pages"

const docs = PAGE_DEFINITIONS.map((page) => ({
  _id: page.name,
  _type: page.name,
  ...(toDocument(page.defaults) as object),
}))
process.stdout.write(JSON.stringify(docs, null, 2))
