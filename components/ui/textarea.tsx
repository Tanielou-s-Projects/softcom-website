import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-line-strong bg-line-strong/30 px-3 py-3 text-base transition-colors outline-none placeholder:text-ink-soft focus-visible:border-accent-ink focus-visible:ring-[3px] focus-visible:ring-accent-ink/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20 md:text-sm dark:aria-invalid:border-danger/50 dark:aria-invalid:ring-danger/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
