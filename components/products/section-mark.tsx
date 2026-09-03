import { cn } from "@/lib/utils"
import { cardHeadingText } from "@/components/landing/section"

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
          accent === "cyan" ? "bg-brand-cyan" : "bg-brand-blue"
        )}
      />
      <h2
        className={cn(
          cardHeadingText,
          "text-center text-foreground lg:max-w-[359px]"
        )}
      >
        {children}
      </h2>
    </header>
  )
}

export { SectionMark }
