import { cn } from "@/lib/utils"

/**
 * The centred dot-and-heading that opens each half of the page.
 *
 * The dot alternates between the two brand anchors down the page — cyan over
 * the products, blue over the services — so it is a prop rather than a fixed
 * colour.
 */
function SectionMark({
  accent,
  children,
}: {
  accent: "cyan" | "blue"
  children: React.ReactNode
}) {
  return (
    <header className="flex flex-col items-center gap-8 px-6 lg:gap-16">
      <span
        aria-hidden
        className={cn(
          "size-[26px] shrink-0 rounded-full",
          accent === "cyan" ? "bg-signal" : "bg-accent"
        )}
      />
      <h2
        className={cn(
          "text-headline leading-[1.1]",
          "text-center text-ink lg:max-w-[359px]"
        )}
      >
        {children}
      </h2>
    </header>
  )
}

export { SectionMark }
