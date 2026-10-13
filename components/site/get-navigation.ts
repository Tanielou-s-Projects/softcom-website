import { navigation } from "@/components/site/chrome-copy"
import { getPageContent } from "@/sanity/lib/page-content"

/**
 * The chrome's copy: Sanity's `navigation` over the code defaults. Server
 * only (it reads Sanity); client parts get it as props or through
 * `ChromeProvider`.
 */
export function getNavigation() {
  return getPageContent("navigation", navigation)
}
