# Hero prototype — promoted to landing page

## Landing-page promotion — 10 September 2026

User requested promotion on `codex/hero-motion`, based on current main.
The active implementation now lives in `components/landing/portal-hero.tsx`
with its own stylesheet and shared-site-header reveal wrapper.
The main picker offers Circular portals (default) and Bordered grid; Conduit,
Atlas, and Atlas full-bleed are no longer hero options. Sector-tag and margin
choices are unchanged. The capsule mark remains available in the brand playground.

The blue statement replaces the old SubHero on the landing page. There is
one header and one picker, with no standalone replay/reduced-motion controls.
Old study URLs redirect to the matching `/?v.hero=circles` or `/?v.hero=grid`.
Picker changes update the URL and reset hero scroll when the hero changes.
System reduced motion renders both statements in normal document flow.

Validation: typecheck, targeted ESLint, formatting, and 164 numerical desktop/
mobile motion samples passed. Browser visual verification remains pending.
The notes below document earlier iterations and are historical, not current
instructions or an accurate description of the promoted page.

## Variant picker (latest)

Latest header/icon pass: circles headline moves up by min(94px, 9.02vh) on
desktop, while the <=700px layout keeps its existing top spacing. A local
RevealHeader wrapper reuses SiteHeader: hidden at scroll zero, shown after
16px of scroll or mouse/pen entry within the top 32px, and retained during
hover or keyboard focus. Touch users reveal it by scrolling. Reduced-motion
disables the reveal transition. Production SiteHeader itself is unchanged.

The scroll button now uses Pixelarticons' official arrow-down at 48px. The
reusable PixelArrowDown component is in components/ui, with the upstream MIT
license in public/licenses/pixelarticons.txt. Other site icons are unchanged.
TypeScript and targeted lint passed; local browser verification remains pending.

Latest colour pass: circular variant has no outer frame or circle outlines.
Upper-right starts brand blue and fades to the solution photograph over the
first half of scroll progress. Lower-left starts photographic and fades to
cyan over the first third while shrinking and exiting. Both reverse with
scroll. Reduced motion shows the solution photo immediately. Grid unchanged.

Circular composition refinement: the lower photo is now roughly twice the
upper circle's diameter, centred 8% inside the left viewport edge and cropped
at the left/bottom. On scroll it shrinks to 28% of its original size while
moving left and slightly upward, using the existing reversible scroll progress.
Mobile uses a separate size cap and vertical position. Reduced motion leaves
the cropped initial composition still. The rectangular variant is unaffected.

- `?variant=grid`: existing composition with subtle borders on panel edges.
- `?variant=circles`: two separate circular photographic windows, as selected
  by the user. The upper-right solution window expands as a circular clip
  beyond the viewport edges to reveal a full-screen image. There is no bridge.
- Progress for Society appears only during scroll (or immediately for reduced
  motion). The supplied two-decades paragraph remains in the blue section.
- Floating previous/next controls and left/right arrow keys switch variants,
  update the URL, and return to the start. Input fields retain arrow-key use.
- Server query parsing keeps variant selection on reload; unsupported values
  default to the bordered grid. Both stay behind the playground access guard.
- TypeScript, targeted ESLint and whitespace checks pass. Browser visual QA
  remains unverified because local browser access was previously blocked.

Earlier direction notes below are historical.

## Current direction: top-right expansion

The opening row now reads Technology for Organisations / Progress for Society.
The top-right dark Progress panel expands leftward and downward to fill the
sticky viewport; its heading scales with the panel width. The bottom-left
photograph translates up and left out of view, while the opening headline
and lower-right supporting copy leave. Progress becomes the next full-screen
statement within the pinned sequence. The following blue section now reads
Stronger organisations / Wider possibilities to avoid repeating Progress.
TypeScript and targeted ESLint pass. Earlier story notes below are historical.

## Current photo study

The route now renders StoryPrototype. Existing capability-01 and capability-02
photographs illustrate scattered reports becoming shared digital information;
this is not a documented customer case study. Both images were inspected.

A 100vh sticky scene inside a 200vh wrapper tracks native scroll. The headline
exits up, problem image exits right, supporting text exits down, and solution
photo expands from bottom left to full screen. Its message fades in late in
the transition. The scene then releases into Progress for Society below.
Reverse scroll reverses the transition. System reduced motion and the preview
toggle remove pinning and expansion and retain both sections in normal flow.

Typecheck and targeted lint pass. Automatic browser approval blocked visual
verification of this revision. The old capsule component is preserved but
no longer mounted; the notes below describe that earlier version.

Question: does Mistral’s large headline, narrow supporting column, and changing
colour grid work with Softcom’s capsule and social-impact positioning?

Reference: https://mobbin.com/sites/sections/687e8d48-cc6e-422b-bacf-b6fae6802471

The Mobbin recording and live Mistral homepage were visually inspected. Both
show the headline above a changing rectangular colour field and a supporting
right column. The live homepage is dark; the archived recording is light.
No video file was recorded or copied. Exact reference entrance timings were
not measured; the following are prototype choices, not claimed measurements.

- 0.1–1.83s: staggered grid reveal from the centre out.
- 0.4–2.3s: capsule appears; endpoints separate as its connecting stroke draws.
- 0.9–2.18s: two headline lines enter through clipping masks.
- 1.6–3.35s: eyebrow, explanation, and societal outcome settle.
- The colour grid continues a stepped 5.2s cycle with staggered phases.
- Pause freezes every animation; Replay remounts the visual scene but preserves
  control focus. Still frame and system reduced motion show the complete state.

Run `pnpm dev --port 3001`; open `/playground/hero-prototype`, or follow the
Hero motion study link in the playground’s Landing section. The route uses
the existing playground production-access guard and no-index metadata.
No site header, navigation, or production landing components are changed.

Verification: TypeScript and targeted ESLint checks passed. Browser visual,
responsive, replay, and reduced-motion verification remain pending because
automatic browser approval blocked access to the local preview. Do not treat
the prototype as visually approved or promote it to production yet.

Decision: pending user review. Absorb the chosen approach or remove this study
after the direction is agreed.
