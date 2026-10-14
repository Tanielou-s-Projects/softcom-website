"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const THEMES = [
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" />,
  },
] as const

/*
 * Light / dark as a two-segment switch. The active segment is unknown until
 * mount (the theme lives in the browser), so both render unpressed on the
 * server and the state appears after hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  // Reading the browser's theme is the point of the mount flag.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn(
        "inline-flex rounded-full p-0.5 ring-1 ring-line-strong",
        className
      )}
    >
      {THEMES.map((theme) => {
        const active = mounted && resolvedTheme === theme.value
        return (
          <button
            key={theme.value}
            type="button"
            aria-pressed={active}
            aria-label={theme.label}
            onClick={() => setTheme(theme.value)}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors",
              active ? "bg-ink text-paper" : "text-ink-faint hover:text-ink"
            )}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4"
            >
              {theme.icon}
            </svg>
          </button>
        )
      })}
    </div>
  )
}
