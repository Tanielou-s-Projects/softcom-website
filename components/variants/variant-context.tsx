"use client"

import * as React from "react"

import {
  defaultVariant,
  isVariantId,
  VARIANTS,
  type VariantId,
  type VariantKey,
  type VariantState,
} from "@/components/variants/registry"

const STORAGE_KEY = "softcom-variants"
const QUERY_PREFIX = "v."

/*
 * Same shape as the playground override store: localStorage read through
 * `useSyncExternalStore` so the first client render is right in one pass and
 * the server snapshot is stable. `?v.<key>=<id>` in the URL wins over storage
 * and is persisted, which is how the screenshot script pins a variant.
 */
const listeners = new Set<() => void>()
let snapshot: VariantState | null = null
const EMPTY: VariantState = {}

function sanitize(input: unknown): VariantState {
  const out: VariantState = {}
  if (!input || typeof input !== "object") return out
  for (const key of Object.keys(VARIANTS) as VariantKey[]) {
    const id = (input as Record<string, unknown>)[key]
    if (isVariantId(key, id)) Object.assign(out, { [key]: id })
  }
  return out
}

function read(): VariantState {
  let stored: VariantState = {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    stored = raw ? sanitize(JSON.parse(raw)) : {}
  } catch {
    stored = {}
  }

  const fromQuery: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(window.location.search)) {
    if (k.startsWith(QUERY_PREFIX)) fromQuery[k.slice(QUERY_PREFIX.length)] = v
  }
  const merged = { ...stored, ...sanitize(fromQuery) }
  if (Object.keys(fromQuery).length) persist(merged)
  return merged
}

function persist(next: VariantState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore quota errors
  }
}

function getSnapshot(): VariantState {
  snapshot ??= read()
  return snapshot
}

function getServerSnapshot(): VariantState {
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

function write(next: VariantState) {
  snapshot = next
  persist(next)
  for (const l of listeners) l()
}

type VariantContextValue = {
  state: VariantState
  set: <K extends VariantKey>(key: K, id: VariantId<K>) => void
  reset: () => void
}

const VariantContext = React.createContext<VariantContextValue | null>(null)

/**
 * Mount once, in the root layout, only when the playground gate is open.
 * Without the provider every `useVariant` returns its production default, so
 * ungated visitors never see an exploration.
 */
export function VariantProvider({ children }: { children: React.ReactNode }) {
  const state = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const value = React.useMemo<VariantContextValue>(
    () => ({
      state,
      set: (key, id) => write({ ...state, [key]: id }),
      reset: () => write({}),
    }),
    [state]
  )

  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  )
}

/** The active option for a registered exploration; the default when ungated. */
export function useVariant<K extends VariantKey>(key: K): VariantId<K> {
  const ctx = React.useContext(VariantContext)
  const chosen = ctx?.state[key]
  return (chosen ?? defaultVariant(key)) as VariantId<K>
}

/** Switcher-only access to the whole store. */
export function useVariantStore() {
  const ctx = React.useContext(VariantContext)
  if (!ctx) throw new Error("useVariantStore requires VariantProvider")
  return ctx
}
