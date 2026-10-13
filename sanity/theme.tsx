import { buildLegacyTheme } from "sanity"

/*
 * The Studio in the site's design system: the same near-black neutrals, the
 * brand blue as the one accent (buttons, focus, selection), the site's
 * Montserrat and Geist Mono, which the root layout already loads.
 *
 * Neutral values are the Tailwind ramp the site's tokens are built on
 * (globals.css); hex here because the theme is computed in JS.
 */
const props = {
  "--black": "#0a0a0a", // neutral-950, the site's dark ground
  "--white": "#fafafa", // neutral-50, the site's card
  "--gray": "#737373", // neutral-500, muted text
  "--gray-base": "#171717", // neutral-900

  "--component-bg": "#0a0a0a",
  "--component-text-color": "#fafafa",

  "--brand-primary": "#004bff", // brand blue
  "--default-button-color": "#737373",
  "--default-button-primary-color": "#004bff",
  "--default-button-success-color": "#16a34a",
  "--default-button-warning-color": "#d97706",
  "--default-button-danger-color": "#dc2626",

  "--state-info-color": "#004bff",
  "--state-success-color": "#16a34a",
  "--state-warning-color": "#d97706",
  "--state-danger-color": "#dc2626",

  "--main-navigation-color": "#0a0a0a",
  "--main-navigation-color--inverted": "#fafafa",

  "--focus-color": "#004bff",

  "--font-family-base":
    "var(--font-sans), Montserrat, ui-sans-serif, system-ui, sans-serif",
  "--font-family-monospace": "var(--font-mono), ui-monospace, monospace",
}

const legacy = buildLegacyTheme(props)

/*
 * Headings in the site's display face, Space Grotesk; body, labels and UI in
 * Montserrat; code in Geist Mono. Sizes stay Sanity's own, so dense lists
 * and forms keep their rhythm.
 */
export const theme = {
  ...legacy,
  fonts: {
    ...legacy.fonts,
    heading: {
      ...legacy.fonts.heading,
      family: "var(--font-heading), 'Space Grotesk', ui-sans-serif, sans-serif",
    },
    label: { ...legacy.fonts.label, family: props["--font-family-base"] },
    text: { ...legacy.fonts.text, family: props["--font-family-base"] },
    code: { ...legacy.fonts.code, family: props["--font-family-monospace"] },
  },
}

/** The workspace icon: the wordmark's two dots, cyan then blue. */
export function SoftcomIcon() {
  return (
    <svg viewBox="0 0 44 24" width="100%" height="100%" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#00ffff" />
      <circle cx="32" cy="12" r="11" fill="#004bff" />
    </svg>
  )
}
