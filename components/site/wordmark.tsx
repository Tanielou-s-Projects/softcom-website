import { cn } from "@/lib/utils"

/*
 * The Softcom wordmark in the current text colour: the brand SVG is used as a
 * mask, so the same file reads on paper, on the accent and on photography.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Softcom"
      className={cn("block aspect-[1268/284] bg-current", className)}
      style={{
        mask: "url(/brand/softcom-wordmark.svg) center / contain no-repeat",
        WebkitMask:
          "url(/brand/softcom-wordmark.svg) center / contain no-repeat",
      }}
    />
  )
}
