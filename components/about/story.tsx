import Image from "next/image"

import { cn } from "@/lib/utils"
import { bodyText, Container, headingText } from "@/components/landing/section"
import { story } from "@/components/about/content"

/**
 * The founding story, on brand blue.
 *
 * The landing page's mission panel centres its copy over an inset photograph;
 * this one sets the two side by side. Same plate, different composition — the
 * About page needs room for two paragraphs, and stacking them under a centred
 * heading would push the photo off the fold.
 *
 * Scoped `dark` because the plate is brand blue in either theme.
 */
function Story() {
  return (
    <Container className="pt-6">
      <div className="dark flex flex-col gap-12 overflow-clip rounded-4xl bg-brand-blue p-8 lg:flex-row lg:items-center lg:gap-24 lg:p-16">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <h2 className={cn(headingText, "max-w-[520px] text-foreground")}>
            {story.heading}
          </h2>

          {/*
           * Pinned rather than tokenised, like the mission panel's body copy:
           * this sits on brand blue in both themes.
           */}
          {story.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(bodyText, "max-w-[560px] text-neutral-200")}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="relative aspect-[4/3] w-full overflow-clip rounded-2xl lg:aspect-auto lg:h-[420px] lg:w-[480px] lg:shrink-0">
          <Image
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </Container>
  )
}

export { Story }
