import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { getNavigation } from "@/content/site/get-navigation"
import { getSettings } from "@/sanity/lib/data"

/* The public site's chrome. The Studio sits outside this group. */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [navigation, settings] = await Promise.all([
    getNavigation(),
    getSettings(),
  ])

  return (
    <>
      <SiteHeader header={navigation.header} />
      <main>{children}</main>
      <SiteFooter footer={navigation.footer} settings={settings} />
    </>
  )
}
