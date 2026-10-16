import type Lenis from "lenis"

/*
 * The page's Lenis instance (set by SmoothScroll; null on touch devices and
 * under reduced motion), so the intro and the phone menu can hold the page
 * still while they are up. `locked` remembers a hold placed before Lenis
 * exists — the hero's intro starts first — so it starts already stopped.
 */
export const smoothScroll: { lenis: Lenis | null; locked: boolean } = {
  lenis: null,
  locked: false,
}

export function lockScroll(on: boolean) {
  smoothScroll.locked = on
  if (on) smoothScroll.lenis?.stop()
  else smoothScroll.lenis?.start()
  // Also covers touch devices, where Lenis is off.
  document.documentElement.style.overflow = on ? "hidden" : ""
}
