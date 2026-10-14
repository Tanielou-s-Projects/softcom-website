"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/*
 * Light first: the `.dark` class on <html> swaps every colour token
 * (app/globals.css). The choice persists, and next-themes sets the class
 * before first paint so a returning dark-mode visitor never sees a flash.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
