import type Lenis from "lenis"

/*
 * The page's Lenis instance (set by SmoothScroll; null on touch devices and
 * under reduced motion), so the intro and the phone menu can hold the page
 * still while they are up.
 */
export const smoothScroll: { lenis: Lenis | null } = { lenis: null }

export function lockScroll(on: boolean) {
  if (on) smoothScroll.lenis?.stop()
  else smoothScroll.lenis?.start()
  // Also covers touch devices, where Lenis is off.
  document.documentElement.style.overflow = on ? "hidden" : ""
}
