"use client"

import * as React from "react"

const STORAGE_KEY = "softcom-playground-overrides"

export type OverrideState = {
  /** Token overrides: CSS var name → value. Applied live to <html>. */
  tokens: Record<string, string>
  /** Per-component knob overrides. The knob key IS its CSS var name. */
  components: Record<string, Record<string, string>>
  /** Freeform intent, carried along so the handoff explains the why. */
  note: string
}

const EMPTY: OverrideState = { tokens: {}, components: {}, note: "" }

/*
 * localStorage is an external store, so it is read through
 * `useSyncExternalStore` rather than hydrated with a setState-in-effect. That
 * keeps the initial client render correct in one pass, gives a stable server
 * snapshot, and picks up edits made in another tab for free.
 */
const listeners = new Set<() => void>()
let snapshot: OverrideState | null = null

function read(): OverrideState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

function getSnapshot(): OverrideState {
  // Cached, because getSnapshot must return a referentially stable value.
  snapshot ??= read()
  return snapshot
}

function getServerSnapshot(): OverrideState {
  return EMPTY
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    snapshot = null
    for (const l of listeners) l()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function write(next: OverrideState) {
  snapshot = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore quota errors
  }
  for (const l of listeners) l()
}

type OverrideContextValue = OverrideState & {
  setToken: (name: string, value: string) => void
  resetToken: (name: string) => void
  setComponent: (component: string, key: string, value: string) => void
  resetComponent: (component: string, key: string) => void
  setNote: (note: string) => void
  resetAll: () => void
  /** Count of active overrides (tokens + component knobs). */
  count: number
}

const OverrideContext = React.createContext<OverrideContextValue | null>(null)

export function useOverrides() {
  const ctx = React.useContext(OverrideContext)
  if (!ctx) throw new Error("useOverrides must be used within OverrideProvider")
  return ctx
}

export function OverrideProvider({ children }: { children: React.ReactNode }) {
  const state = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const applied = React.useRef<Set<string>>(new Set())

  /*
   * Mirror every override onto <html> as an inline custom property. Because
   * Tier 2 roles are bound with `@theme inline`, overriding the role variable is
   * enough for every utility to update live — and the foundation specimens pick
   * it up through their style MutationObserver.
   */
  React.useEffect(() => {
    const root = document.documentElement
    const next = new Map<string, string>()
    for (const [key, value] of Object.entries(state.tokens))
      next.set(key, value)
    for (const knobs of Object.values(state.components)) {
      for (const [key, value] of Object.entries(knobs)) next.set(key, value)
    }
    // Clear anything set on a previous pass that is no longer overridden.
    for (const key of applied.current) {
      if (!next.has(key)) root.style.removeProperty(key)
    }
    for (const [key, value] of next) root.style.setProperty(key, value)
    applied.current = new Set(next.keys())
  }, [state])

  const value = React.useMemo<OverrideContextValue>(() => {
    const count =
      Object.keys(state.tokens).length +
      Object.values(state.components).reduce(
        (sum, knobs) => sum + Object.keys(knobs).length,
        0
      )

    return {
      ...state,
      count,
      setToken: (name, v) =>
        write({ ...state, tokens: { ...state.tokens, [name]: v } }),
      resetToken: (name) => {
        const tokens = { ...state.tokens }
        delete tokens[name]
        write({ ...state, tokens })
      },
      setComponent: (component, key, v) =>
        write({
          ...state,
          components: {
            ...state.components,
            [component]: { ...state.components[component], [key]: v },
          },
        }),
      resetComponent: (component, key) => {
        const knobs = { ...state.components[component] }
        delete knobs[key]
        const components = { ...state.components, [component]: knobs }
        if (Object.keys(knobs).length === 0) delete components[component]
        write({ ...state, components })
      },
      setNote: (note) => write({ ...state, note }),
      // Keep the note — it usually still applies after resetting the values.
      resetAll: () => write({ ...EMPTY, note: state.note }),
    }
  }, [state])

  return (
    <OverrideContext.Provider value={value}>
      {children}
    </OverrideContext.Provider>
  )
}

/** Renders the current overrides as the markdown block pasted back into chat. */
export function renderHandoff(state: OverrideState) {
  const lines: string[] = ["## Playground tweaks", ""]

  if (state.note.trim()) {
    lines.push("**Note:** " + state.note.trim(), "")
  }

  const tokens = Object.entries(state.tokens)
  if (tokens.length) {
    lines.push(
      "### Token overrides",
      "",
      "| CSS var | New value |",
      "| --- | --- |"
    )
    for (const [name, value] of tokens) {
      lines.push(`| \`${name}\` | \`${value}\` |`)
    }
    lines.push("")
  }

  const components = Object.entries(state.components)
  if (components.length) {
    lines.push(
      "### Component knobs",
      "",
      "| Component | Knob | Value |",
      "| --- | --- | --- |"
    )
    for (const [component, knobs] of components) {
      for (const [key, value] of Object.entries(knobs)) {
        lines.push(`| \`${component}\` | \`${key}\` | \`${value}\` |`)
      }
    }
    lines.push("")
  }

  if (!tokens.length && !components.length) {
    lines.push("_No value overrides — note only._", "")
  }

  lines.push(
    "Apply to `app/globals.css`: `--radius` and the Tier 3 knobs in the `:root` base;",
    "colour roles in whichever of `:root` / `.dark` applies. Keep pointing at Tier 1",
    "primitives (`var(--color-*)`) rather than inlining raw values."
  )

  return lines.join("\n")
}
