import type { ComponentType } from "react"

import { BadgesSection } from "@/components/playground/sections/badges"
import { ButtonsSection } from "@/components/playground/sections/buttons"
import { ColorsSection } from "@/components/playground/sections/colors"
import { DataSection } from "@/components/playground/sections/data"
import { FeedbackSection } from "@/components/playground/sections/feedback"
import { IconsSection } from "@/components/playground/sections/icons"
import { InputsSection } from "@/components/playground/sections/inputs"
import { LandingSection } from "@/components/playground/sections/landing"
import { MarksSection } from "@/components/playground/sections/marks"
import { NavigationSection } from "@/components/playground/sections/navigation"
import { OverlaysSection } from "@/components/playground/sections/overlays"
import { RadiusSection } from "@/components/playground/sections/radius"
import { ShadowsSection } from "@/components/playground/sections/shadows"
import { SpacingSection } from "@/components/playground/sections/spacing"
import { TypographySection } from "@/components/playground/sections/typography"

/**
 * Maps a registry section id to its gallery content. An id absent from this map
 * falls through to the "coming soon" state in <Section>, so the IA can list
 * something before it exists.
 */
export const SECTION_CONTENT: Record<string, ComponentType> = {
  colors: ColorsSection,
  typography: TypographySection,
  radius: RadiusSection,
  spacing: SpacingSection,
  shadows: ShadowsSection,
  icons: IconsSection,
  marks: MarksSection,
  landing: LandingSection,
  buttons: ButtonsSection,
  badges: BadgesSection,
  navigation: NavigationSection,
  inputs: InputsSection,
  overlays: OverlaysSection,
  feedback: FeedbackSection,
  data: DataSection,
}
