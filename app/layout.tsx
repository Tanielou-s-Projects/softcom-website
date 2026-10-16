import type { Metadata } from "next"
import { Geist_Mono, Montserrat, Space_Grotesk } from "next/font/google"
import { MotionConfig } from "motion/react"

import "./globals.css"
import { PixelPageTransition } from "@/components/motion/pixel-page-transition"
import { AnimatedFavicon } from "@/components/site/animated-favicon"
import { ChromeProvider } from "@/components/site/chrome-context"
import { getNavigation } from "@/components/site/get-navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})

/*
 * Montserrat carries body copy *and* UI — there is no separate UI face.
 * The Figma file specifies Inter on button labels, but that is the shadcn
 * library's own default showing through rather than a deliberate third family,
 * so it is not reproduced here.
 */
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Softcom — Technology for Organisations. Progress for Society.",
  description:
    "Softcom builds the systems that help organisations operate, grow, and better serve the people who depend on them.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The header menu, from Sanity, for every page's SiteHeader.
  const { header } = await getNavigation()
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        spaceGroteskHeading.variable,
        montserrat.variable
      )}
    >
      <body>
        {/* The Softcom design is dark-only; `d` still toggles for comparison. */}
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {/*
           * `reducedMotion="user"` handles prefers-reduced-motion for every
           * motion component in one place — transforms are stripped, opacity
           * still animates — without SSR/client branches that break hydration.
           */}
          <MotionConfig reducedMotion="user">
            <ChromeProvider header={header}>{children}</ChromeProvider>
            <PixelPageTransition />
          </MotionConfig>
        </ThemeProvider>
        <AnimatedFavicon />
      </body>
    </html>
  )
}
