import { PageBackground } from "@/components/motion/page-background"
import { PixelPageTransition } from "@/components/motion/pixel-page-transition"
import { AnimatedFavicon } from "@/components/site/animated-favicon"
import { ChromeProvider } from "@/components/site/chrome-context"
import { getNavigation } from "@/content/site/get-navigation"

/* The public site's chrome. The Studio sits outside this group. */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The header menu, from Sanity, for every page's SiteHeader.
  const { header } = await getNavigation()

  return (
    <>
      <ChromeProvider header={header}>{children}</ChromeProvider>
      <PageBackground />
      <PixelPageTransition />
      <AnimatedFavicon />
    </>
  )
}
