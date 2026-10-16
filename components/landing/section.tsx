import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The page's content column: the 1440px shell (globals.css), with 16px edges
 * on phones and 40px from md. Full-bleed moments (the hero, the capability
 * rail, the closing CTA + footer) use `Bleed` instead, which keeps the same
 * edges without the cap.
 */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("shell", className)} {...props} />
}

function Bleed({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full px-4 md:px-10", className)} {...props} />
}

export { Bleed, Container }
