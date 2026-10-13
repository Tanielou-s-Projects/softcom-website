import { homePage } from "@/content/home/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

/*
 * Placeholder while the new design system is built: the home page's Sanity
 * content, unstyled, to show the data layer still flows end to end.
 */
export default async function Page() {
  const copy = await getPageContent("homePage", homePage)

  return (
    <main className="mx-auto max-w-3xl p-8">
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(copy, null, 2)}
      </pre>
    </main>
  )
}
