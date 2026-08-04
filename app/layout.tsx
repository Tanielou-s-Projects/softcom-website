import type { Metadata } from "next"
import { Geist_Mono, Inter, Montserrat, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SanityLive } from "@/sanity/lib/live"
import { cn } from "@/lib/utils"

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const montserratBody = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Softcom — Technology for Organisations. Progress for Society.",
  description:
    "Softcom builds the systems that help organisations operate, grow, and better serve the people who depend on them.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        spaceGroteskHeading.variable,
        montserratBody.variable
      )}
    >
      <body>
        {/* The Softcom design is dark-only; `d` still toggles for comparison. */}
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <SanityLive />
      </body>
    </html>
  )
}
