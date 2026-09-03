"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/**
 * A two-option switch, styled as a pill to echo the header.
 *
 * Which side reads as selected is decided by CSS rather than React state, so
 * there is nothing to hydrate and no first-paint flash of the wrong option. That
 * also lets these stay plain actions ("use the light theme") rather than toggles
 * carrying an `aria-pressed` value that would have to disagree with the server
 * on the first render.
 *
 * It keys off `light:` — not `dark:` — because it lives on the footer plate,
 * which is scoped `dark` in both themes. Inside that scope `dark:` is always
 * true, while `light:` still tracks the real document theme. Colours are
 * explicit white-alpha for the same reason: the surface under it never changes.
 */
function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme } = useTheme()

  const base =
    "grid size-7 place-items-center rounded-full transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/15 p-0.5",
        className
      )}
    >
      <button
        type="button"
        aria-label="Use the light theme"
        onClick={() => setTheme("light")}
        className={cn(
          base,
          "text-white/55 hover:text-white",
          "light:bg-white/15 light:text-white"
        )}
      >
        <Sun />
      </button>
      <button
        type="button"
        aria-label="Use the dark theme"
        onClick={() => setTheme("dark")}
        className={cn(
          base,
          "bg-white/15 text-white",
          "light:bg-transparent light:text-white/55 light:hover:text-white"
        )}
      >
        <Moon />
      </button>
    </div>
  )
}

/**
 * The header's version: one 24px dot in the capsule's own language, sitting at
 * the end of the open menu. Shows the theme you would switch *to* — a sun in
 * dark mode, a moon in light — decided by CSS (`light:`), so nothing hydrates.
 * The capsule is scoped `dark`, hence `light:` rather than `dark:` here too.
 */
function ThemeToggleDot({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Switch theme"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 transition-colors outline-none hover:bg-white/20 hover:text-white focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3.5",
        className
      )}
    >
      <Sun className="light:hidden" />
      <Moon className="hidden light:block" />
    </button>
  )
}

export { ThemeSwitcher, ThemeToggleDot }
