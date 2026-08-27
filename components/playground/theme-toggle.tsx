"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

/**
 * The site itself is dark-only, but the design system defines both mappings —
 * so the playground is where the light theme actually gets exercised.
 *
 * Which glyph shows is decided by CSS rather than a mounted flag, so there is no
 * hydration mismatch to paper over and no state to synchronise.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  )
}
