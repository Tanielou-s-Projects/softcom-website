"use client"

import * as React from "react"

import {
  VARIANTS,
  defaultVariant,
  type VariantKey,
} from "@/components/variants/registry"
import { useVariantStore } from "@/components/variants/variant-context"
import { cn } from "@/lib/utils"

/**
 * Floating control for in-page explorations. Rendered only behind the
 * playground gate (see app/layout.tsx), so it never reaches production.
 * Collapsed it is a single mono chip showing how many keys are off-default.
 */
export function VariantSwitcher() {
  const { state, set, reset } = useVariantStore()
  const [open, setOpen] = React.useState(false)
  const keys = Object.keys(VARIANTS) as VariantKey[]
  const changed = keys.filter(
    (k) => state[k] !== undefined && state[k] !== defaultVariant(k)
  ).length

  return (
    <div className="dark fixed right-4 bottom-4 z-[90] flex flex-col items-end gap-2 font-mono text-xs text-foreground">
      {open && (
        <div className="flex w-64 flex-col gap-3 rounded-2xl bg-black/90 p-3 ring-1 ring-white/10 backdrop-blur">
          {keys.map((key) => {
            const active = state[key] ?? defaultVariant(key)
            return (
              <fieldset key={key} className="flex flex-col gap-1.5">
                <legend className="mb-1 text-[10px] tracking-wider text-neutral-400 uppercase">
                  {VARIANTS[key].label}
                </legend>
                <div className="flex flex-wrap gap-1">
                  {VARIANTS[key].options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={active === o.id}
                      onClick={() => set(key, o.id)}
                      className={cn(
                        "rounded-full px-2.5 py-1 ring-1 transition-colors",
                        active === o.id
                          ? "bg-brand-cyan text-neutral-950 ring-brand-cyan"
                          : "ring-white/15 hover:ring-white/40"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )
          })}
          <button
            type="button"
            onClick={reset}
            className="self-start text-neutral-400 underline-offset-2 hover:underline"
          >
            Reset to defaults
          </button>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-black/90 py-1.5 pr-3 pl-2 ring-1 ring-white/10 backdrop-blur hover:ring-white/30"
      >
        <span
          aria-hidden
          className={cn(
            "size-2.5 rounded-full",
            changed ? "bg-brand-cyan" : "bg-neutral-600"
          )}
        />
        Variants{changed ? ` · ${changed}` : ""}
      </button>
    </div>
  )
}
