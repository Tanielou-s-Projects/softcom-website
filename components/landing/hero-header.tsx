"use client"

import { useEffect, useState, type RefObject } from "react"
import { SiteHeader } from "@/components/site/site-header"

/** Landing hero reveal policy. Keep the existing menu and its keyboard behaviour. */
export function RevealHeader({
  heroRef,
}: {
  heroRef: RefObject<HTMLDivElement | null>
}) {
  const [pastHero, setPastHero] = useState(false)
  const [nearTop, setNearTop] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current
      if (hero) setPastHero(hero.getBoundingClientRect().bottom <= 0)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        setNearTop((previous) => event.clientY <= (previous ? 112 : 32))
      }
    }
    const onPointerLeave = () => {
      setNearTop(false)
      setHovered(false)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    const observer = new ResizeObserver(onScroll)
    if (heroRef.current) observer.observe(heroRef.current)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onPointerLeave)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      observer.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      )
    }
  }, [heroRef])
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 -translate-y-full opacity-0 transition-[translate,opacity] duration-200 ease-out focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:transition-none"
      data-visible={pastHero || nearTop || hovered || focused}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
    >
      <SiteHeader />
    </div>
  )
}
