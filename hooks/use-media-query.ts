"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Live `matchMedia` result. The server snapshot is `false`, so SSR and the
 * first client render always take the non-matching branch — pair with CSS
 * (e.g. `lg:` variants) for anything that must look right before hydration.
 */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

export { useMediaQuery }
