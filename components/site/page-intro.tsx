import { cn } from "@/lib/utils"
import { Container, leadText } from "@/components/landing/section"

/**
 * A standfirst above a full-width rule — the shape the Insights index uses to
 * open its list, reused wherever a page needs one line of framing between the
 * hero and the body.
 */
function PageIntro({ children }: { children: React.ReactNode }) {
  return (
    <Container className="flex flex-col gap-6 pt-16">
      <p className={cn(leadText, "max-w-[629px] leading-[1.6]")}>{children}</p>
      <div aria-hidden className="h-px w-full bg-border" />
    </Container>
  )
}

export { PageIntro }
