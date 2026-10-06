"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { bayer8, CELL, cellState, field } from "@/lib/dither"
import { cn } from "@/lib/utils"

const BLUE = "#004bff"
const CYAN = "#00ffff"
/** How far the base field has risen once the plate has resolved. */
const LEVEL = 0.3
const RESOLVE_MS = 520
/** Pointer follow per frame — a gathered glide rather than a snap. */
const FOLLOW = 0.16

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The dropdown's plate, in the site's dither language (lib/dither.ts) and
 * answering the menu rather than looping on its own clock.
 *
 * It resolves in when the dropdown opens. Then, as the pointer moves down the
 * links beside it, the field swells toward that item — solid blue at the
 * centre, the cyan front ringing it — so the plate reaches for whatever you
 * are about to choose. Over the plate itself the swell follows the pointer
 * directly. Same Bayer order and front as every other effect; only the field
 * gains a second, pointer-shaped term.
 *
 * Canvas 2D on the shared JS port: one small plate, mounted only while its
 * dropdown is open (Radix unmounts inactive content).
 */
function NavPlate({
  seed = 0,
  className,
}: {
  seed?: number
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const root = canvas.closest<HTMLElement>("[data-nav-plate-root]")

    let cols = 0
    let rows = 0
    let size = 0
    let cells: { col: number; row: number; t: number; f: number }[] = []
    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      size = CELL * ratio
      cols = Math.ceil(canvas.width / size)
      rows = Math.ceil(canvas.height / size)
      cells = []
      for (let row = 0; row < rows; row++) {
        const up = rows - 1 - row
        for (let col = 0; col < cols; col++) {
          cells.push({
            col,
            row,
            t: bayer8(col, up),
            f: field(col, up, up / Math.max(1, rows - 1), seed),
          })
        }
      }
    }
    layout()

    // Pointer target in cell units, and how present the swell is (0–1).
    const target = { x: cols * 0.62, y: rows / 2, on: 0 }
    const shown = { x: target.x, y: target.y, on: 0 }

    const onMove = (event: PointerEvent) => {
      const plate = canvas.getBoundingClientRect()
      const area = root?.getBoundingClientRect() ?? plate
      const overPlate = event.clientX <= plate.right
      // Beside the plate (over the links), swell just inside its inner edge,
      // so the whole round shape shows rather than half of it.
      target.x = overPlate
        ? ((event.clientX - plate.left) / plate.width) * cols
        : cols * 0.62
      target.y = ((event.clientY - area.top) / area.height) * rows
      target.on = 1
    }
    const onLeave = () => {
      target.on = 0
    }
    const host = root ?? canvas
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)

    const follow = reduceMotion ? 1 : FOLLOW
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const resolve = reduceMotion
        ? 1
        : easeOut(Math.min(1, (now - start) / RESOLVE_MS))
      shown.x += (target.x - shown.x) * follow
      shown.y += (target.y - shown.y) * follow
      shown.on += (target.on - shown.on) * follow

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const progress = LEVEL * resolve
      for (const cell of cells) {
        // The swell: distance from the pointer, in plate heights, as a field.
        const d = Math.hypot(cell.col - shown.x, cell.row - shown.y) / rows
        const swell = d * 2.4 - 0.3 + (1 - shown.on) * 2
        const state = cellState(progress, Math.min(cell.f, swell), cell.t)
        if (state === "rest") continue
        ctx.fillStyle = state === "front" ? CYAN : BLUE
        ctx.fillRect(cell.col * size, cell.row * size, size, size)
      }
      frame = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
    }
  }, [seed, reduceMotion])

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden bg-black", className)}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  )
}

export { NavPlate }
