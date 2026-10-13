import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LineDitherDefs } from "@/components/iso/line-dither"
import { ProductFigureSlot } from "@/components/products/figures"
import { figuresOf } from "@/components/products/pages"
import { getProductPage } from "@/sanity/lib/data"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

export const metadata: Metadata = {
  title: "Product figures — Workshop",
  robots: { index: false, follow: false },
}

/**
 * Dev-only bench: every figure on one product page, numbered as the page
 * numbers them, without the page's reveals. 404s in prod.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!PLAYGROUND_ENABLED) notFound()
  const { slug } = await params
  const page = (await getProductPage(slug))?.page
  if (!page) notFound()

  const figures = [
    ...(page.figure ? [page.figure] : []),
    ...page.sections.flatMap(figuresOf),
  ]

  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-24">
      <LineDitherDefs />
      {figures.map((figure, index) => (
        <section
          key={figure.key}
          id={figure.key}
          className="flex flex-col gap-3"
        >
          <p className="font-mono text-xs text-muted-foreground">
            {figure.key} · {figure.title}
          </p>
          <ProductFigureSlot slug={slug} figure={figure} number={index + 1} />
        </section>
      ))}
    </main>
  )
}
