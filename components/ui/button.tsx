import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { Arrow } from "@/components/ui/arrow"
import { cn } from "@/lib/utils"

const button = cva(
  "group inline-flex h-12 items-center gap-3 rounded-full pr-5 pl-6 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-200",
  {
    variants: {
      tone: {
        accent: "bg-accent text-on-accent hover:bg-accent-deep",
        ink: "bg-ink text-paper hover:bg-ink/85",
        outline: "border border-line-strong text-ink hover:border-ink",
        /* For use over photography and the accent block. */
        light: "bg-white text-ink hover:bg-white/85",
        glass: "bg-white/15 text-white backdrop-blur-md hover:bg-white/25",
      },
    },
    defaultVariants: { tone: "accent" },
  }
)

type ButtonLinkProps = VariantProps<typeof button> & {
  href: string
  children: React.ReactNode
  className?: string
}

export function ButtonLink({
  href,
  tone,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(button({ tone }), className)}>
      {children}
      <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  )
}

/** An inline text link with the arrow, for "Read more"-weight actions. */
export function ArrowLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline",
        className
      )}
    >
      {children}
      <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  )
}
