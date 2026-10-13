import { partnersIntro, productsIntro } from "@/components/products/content"

/*
 * The copy around the products on Enterprise Products, and the fixed labels
 * on every product page, as Sanity's `productsPage` singleton mirrors it.
 * The products themselves are Sanity `product` documents.
 */
export const productsPage = {
  hero: {
    badge: "Products",
    title: productsIntro.title,
    lead: productsIntro.lead,
  },
  softcom: {
    title: "Softcom Products",
  },
  partners: {
    title: partnersIntro.title,
    lead: partnersIntro.lead,
  },
  labels: {
    /** Before the product's name, on its card and its page's hero. */
    explore: "Explore",
    /** Over the "Built for …" block on each product page. */
    audience: "Who it is for",
  },
}

export type ProductsPage = typeof productsPage
