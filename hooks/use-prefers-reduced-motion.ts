"use client"

import * as React from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

/**
 * Tracks the reduced-motion preference.
 *
 * CSS handles this on its own wherever a `motion-reduce:` variant will do. This
 * exists for the cases CSS cannot reach — a canvas whose motion is a prop
 * rather than a style, where the honest answer is to freeze the thing rather
 * than hide it.
 *
 * Read through `useSyncExternalStore` because that is what a media query is: an
 * external store. It also keeps the first client render correct in one pass,
 * with no setState-in-effect and no flash of the wrong state.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// The server cannot know, and motion is the safer default to assume away.
function getServerSnapshot() {
  return true
}

export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
