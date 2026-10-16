import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { MotionConfig } from "motion/react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

/* Geist carries headings, body and UI; Geist Mono the labels. As in the rebuild. */
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

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
        "font-sans antialiased",
        geist.variable,
        geistMono.variable
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
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
