# Daylight (godaylight.com): how it's built and animated

Researched 2026-10-14. Sources: production HTML, the downloaded and prettified JS chunks (`tmp/research/daylight/js`, `.../pretty`), CSS (`.../css`), and headless-Chrome captures (`tmp/research/daylight/shots`, contact sheets `sheet-*.png`). Anything marked **(inferred)** was not confirmed in code or in a capture.

---

## 1. Tech stack

| Layer | What | Evidence |
|---|---|---|
| Framework | **Next.js App Router** (React 19.2), deployed on **Vercel** with PPR route groups | `/_next/static/chunks/app/[locale]/(global)/(ppr)/(home)/page-*.js`, `?dpl=dpl_…` (Vercel deployment id), `version="19.2.0"` |
| CMS | **Sanity** (images served through `/cdn/<sanity-asset-id>-WxH.png?fp-x=…&w=…&auto=format` rewrites, error string `NEXT_PUBLIC_SANITY_PROJECT_ID`) plus Vercel Edge Config for redirects/rewrites | chunk 2339 / 7103 |
| Styling | **Tailwind v4** (`--tw-ease`, `@layer` tokens, `max-lg:` and `*:` variants) plus a custom **fluid column-grid plugin** (`span-w-*`, `margin-px-1`, `span-pl-1-wide`…). Variants come from `tailwind-variants` (`tv()`) and `cx()`. | CSS `2a25a22622efe1bc.css`, Button module 5800 |
| Animation | **GSAP 3.13.0** (all formerly-paid plugins, now free) with `@gsap/react` `useGSAP` (`contextSafe`, `revertOnUpdate`). Plugins registered: **ScrollTrigger**, **SplitText** (new 3.13 API: `mask:"lines"`, `autoSplit`, `onSplit`), **ScrambleTextPlugin** (footer links), **CustomEase**. `Observer` and `Flip` are bundled with ScrollTrigger but not used. | `version="3.13.0"` in chunks 3783, 7719, 7824, 8388 and 25c8a87d; `registerPlugin(...)` calls |
| Smooth scroll | **Lenis 1.3.4** (`window.lenisVersion`, `<html class="lenis">`) in a zustand store: `lerp: 0.12, wheelMultiplier: 1, smoothTouch: false`. It's driven by a **single shared rAF loop** (custom hook), and `lenis.on('scroll', ScrollTrigger.update)` keeps the two in sync. | layout chunk, module 8748 / 1102 |
| Vector animation | **Rive** (`@rive-app/canvas` with WebGL2 runtime): the hero logo draw-on, the How-it-works step 2 illustration, and the network map. Every one is **scrubbed** (`rive.scrub(value)`) by a GSAP tween rather than played. | chunk 1e75d386 (Rive runtime), `riveSrc`, `logoRive` |
| Video | Mux streams (`stream.mux.com/...high.mp4`, `image.mux.com` posters), muted autoplay loops. One About video is hosted on framerusercontent.com. | about/footer markup |
| Canvas | Product page: **121-frame JPG image sequence** drawn on a `<canvas>` while you scroll. About page: CEO letter typeset into a canvas with an Intl.Segmenter line-breaking library (looks like `@chenglou/pretext` **(inferred)**). Brand page: an interactive physics/paint canvas masked to the wordmark. | product chunk `ProcessScrollSection`, about `CeoLetterSection`, brand `BrandIdentitySection` |
| State | zustand (`introPlayed`, `isLocked`, `hideFooter`, `isPanelOpened`) | layout chunk |
| Not used | No Webflow, Framer site, Barba/Swup, Locomotive, Three.js, Lottie or Framer Motion. Nothing is exposed on `window.gsap`; everything is bundled. | grep and runtime check (`gsap:false`) |

Two build "eras" (inferred): the Home page and the shared components (`IntroAnimtedMask`, `UspMotion`, `WhyDaylight`, `DiptychAnimatedMask`, `HowItWorksMotion`) are carefully engineered agency code. They rebuild on resize via `matchMedia`, use `contextSafe`, and preserve progress across re-inits. The Product, About and Brand page sections are newer and plainer: inline styles, vanilla `scroll` listeners, IntersectionObserver reveals, and repeated generic GSAP "fade-up / scale 0.94→1, scrub 0.8" patterns.

### Fonts (next/font/local, all `font-display: swap`, with metric-matched Arial fallbacks)
| Role | Family | Weights | Usage |
|---|---|---|---|
| Display serif `--font-serif` | **Feature Deck** (Commercial Type) (`featureDeck`) | 400 only | Hero and section headlines. 85px desktop, `letter-spacing -0.02em`, line-height ~1.16 (0.95 for big statements). Note: `.font-serif` sets `text-transform: uppercase` by default and headings opt out with `normal-case`. Giant decorative uses go up to 600px ("Bright"), and ghost words at 3% opacity ("More / Power"). |
| Sans `--font-sans` | **Aeonik Pro** (`aeonikPro`) | 400, 500 | Body, buttons (500, 12–15px), USP headings (500, 50px, -0.02em) |
| Mono `--font-mono` | **ABC Social Mono** (`socialMono`) | 400 | Eyebrows and labels: 11–12px, UPPERCASE, `tracking -0.02em` ("SAVE", "STEP 1", "HOW DAYLIGHT WORKS"), footer `[ LINKS ]`, data chips, table headers |

---

## 2. Global systems

### Colour tokens (from CSS utilities and the Brand page "Quick reference")
| Token | Hex | Use |
|---|---|---|
| orange | `#F66F00` | primary brand, Sign-in CTA, chart line |
| beige | `#FFF7E9` | default page surface |
| beige-1 / beige-20 | `#F7EED9` | panels |
| beige-2 / beige-30 | `#F0E5CF` | How-it-works step cards, hover bg |
| dark-beige | `#DACAB6` | **hairline colour** (`border-beige-dark`), cookie buttons |
| near-black | `#111111` | primary button, text |
| brown | `#4C2806` | text on beige, "Bright" |
| grey / grey-txt | `#A09B93` / `#514E4A` | captions, mono eyebrows |
| yellow | `#FCCC3C` | Product page, secondary CTA |
| purple / purple-dark | `#C8B2FF` / `#321F61` | "Step into Daylight" diptych, CEO letter |
| blue / blue-dark | `#BED5FF` / `#1D3E86` | About "Financing" diptych, testimonials, partner form |

On dark/photo sections, hairlines are `white/20`–`white/30`. A film-grain layer (`/grain-2.jpg` tiled at 300px, `mix-blend-mode: overlay`, opacity 0.4, `z-index: 9999`, pointer-events none) sits over the whole page. A `steps(10)` keyframe for animating the grain exists but is turned off.

### Grid system (the visible hairline grid)
Fluid CSS variables on `html` are recomputed per breakpoint and subtract the scrollbar width (`--sbw`):

| Breakpoint | Columns | `--margin` | `--gutter` | `--column` | root font-size |
|---|---|---|---|---|---|
| mobile (<768) | 12 | 4.267vw (16px @375) | 2.667vw (10px) | 5.178vw | min(4.267vw, 20.27px) |
| tablet | 12 | 2.604vw (20px @768) | 1.302vw | 6.706vw | 2.083vw |
| desktop (≥1024) | **24** | 1.389vw (20px @1440) | 1.389vw (20px) | 2.72vw (≈39px) | min(1.111vw, 18.67px), so 1rem = 16px at 1440 and type scales with the viewport |

Utilities: `.span-w-N { width: calc(N*var(--column) + (N-1)*var(--gutter)) }`, plus `-wide` / `-wider` variants that add a gutter or margin, `span-pl-*`, `margin-px-1` (padding = margin), and `margin-left-1`. Spacing scale: `--spacing: .0625rem`, so `p-24` means 24px.

The hairlines are drawn three ways:
1. **Pseudo-element column rules.** The USP list has `before:span-w-6 before:margin-left-1 before:border-r` and `after:span-w-6 after:margin-right-1 after:border-l`. These are full-height absolutely positioned 6-column boxes whose single border draws the vertical rules. Each row `<li>` is a 3-track grid, `grid-cols-[calc(6col+5gut)_1fr_calc(6col+5gut)]`, with `border-b` and `first:border-t` for the horizontal rules.
2. **"Frame lines" that follow a clip-path window.** Four 1px divs (`h-1 w-full` / `w-1 h-full`, `bg-white/30`) are translated every frame (custom rAF) to the current top/right/bottom/left inset of the clipped media. They run edge to edge across the viewport, so the shrinking window always looks like it sits on a grid (Hero, Diptych).
3. Plain `border-beige-dark` table rows (comparison tables, FAQ, licenses).

### Radii and buttons
Radius tokens are xs 2px (small UI), **sm 4px (buttons)**, md 6–8px (cards, nav pill 8px), and **lg/xl 12–16px (images, phone mock)**.

Button base: `inline-flex h-50 px-24 rounded-sm font-medium text-12` with `transition duration-1000 hover:duration-100 ease-expo-out`. That is a slow settle back and a near-instant response on hover-in. Variants: primary (black/white), secondary (beige/black), alt (outlined brown, hover bg beige-30), plus orange, yellow, blue and purple variants on the brand page.

- **Signature CTA hover ("rotated fill sweep"):** the label sits on `z-2` with `group-hover:-translate-y-1` and changes colour over 300ms. Behind it is a fill div: `absolute inset-0 translate-y-[200%] rotate-[15deg] scale-[1.8] rounded-lg bg-white`, which on hover goes to `translate-y-0 rotate-8`, `duration-1000 ease-expo-out`. A tilted slab swings up and floods the button.
- **Sign in (nav):** a looping `/daylight-button.mp4` gradient video fills the button, with a `backdrop-blur-sm` overlay and white text.
- **Underline links:** `after:scale-x-0 → hover:scale-x-100 origin-left` over 500ms expo-out. The "solidUnderlined" variant uses two pseudo lines: the existing line collapses to the right while a new one grows from the left, with a 75ms delay.
- **Footer links:** `[ LABEL ]` in mono. On hover, GSAP **ScrambleText** re-scrambles the label (0.5s) while the brackets move 5px inward (`x:±5`, 0.4s expo.out) and return with power4.out on leave.
- Nav links: `hover:opacity-60`.

Easing tokens: `expo-out cubic-bezier(.16,1.08,.38,.98)` (slight overshoot), `expo-inout (.9,0,.1,1)`, `quart-out (.26,1.04,.54,1)`, `quart-inout (.77,0,.175,1)`, `cubic-inout (.66,0,.34,1)`, and default `(.4,0,.2,1)`. In GSAP the common eases are `power3.out` and `power4.out` for reveals, `expo.inOut` for masks, and `sine.inOut` for scrubbed masks.

### Nav / header
- A floating **white pill**, centred, `fixed top-22` (12px on mobile), 8px radius, padding `6px 6px 6px 16px`, 28px gap. It holds the logo (117×17), the links Product / Partners / About / Brand (Aeonik 14px), and the Sign-in video button.
- **Entry:** it starts at `-translate-y-[150%]`. On `/` it waits for the intro (`introPlayed` store flag) and then animates `y:0` over 1.2s expo.out. On other routes it drops in after a 0.5s delay.
- **On scroll:** it does **not** hide, shrink or change colour. It is always visible (confirmed across all scroll captures).
- **Mobile:** a full-width white pill. A plus icon rotates 45° into a cross (0.6s, cubic-bezier(.16,1,.3,1)). Rows rise in with `transition-delay: calc(90ms + var(--i)*45ms)`, which is a CSS stagger driven by a custom property. A dark scrim fades in at `rgba(10,8,4,.5)`. Body scroll is locked while the menu is open. Durations collapse to 1ms under `prefers-reduced-motion`.

### Preloader / intro
There is no separate preloader. **The hero is the intro**, and every page whose hero uses `IntroAnimtedMask` (Home, Product, Partners, About) plays the same sequence (timeline starts 300ms after mount):

| t (s) | What happens |
|---|---|
| 0 | Full-bleed brand gradient video/image fills the viewport (`clip-path: inset(0 0 0 0)`). The photo underneath is pre-scaled to 1.1. **Scroll is locked** (Lenis destroyed, body `position: fixed`). |
| 0–2.5 | The Rive **logo draw-on** is scrubbed from 0 to 1 (linear). |
| 1.0–3.0 | The clip-path shrinks the gradient from full screen to a small window (`expo.inOut`, 2s). Home desktop inset is `[35%, 20%, 35%, 72%]`. The four frame lines travel with the edges. The logo scales to 0.4, drifts toward the window and fades. The photo scales from 1.1 to 1 (expo.inOut, 2s). |
| 2.0–3.0 | The headline block slides in from `x:-100%`. SplitText lines go from translateX -50 to 0 (power4.out, 1s, stagger 0.1). On mobile they go `y:120%→0`. |
| 2.3–2.9 | Data chips ("kWh generated 8.2kWh–9.5kWh", "Backup stored" progress bar, "Thermostat 68°F") rise `y:100%→0` (expo.out, 0.5s, stagger 0.04). The bar grows `scaleX 0→1`, then its inner fill goes `0→0.4`. |
| ~3.0 | Unlock scroll, set `introPlayed`, and the nav drops in. |

Measured frames (`shots/sheet-intro2.png`): 0.7s shows the logo drawing on a solid gradient, around 1.8s the mask starts closing, and by 2.4s the hero layout is in place.

**After the intro, the hero is scroll-scrubbed** (`start "top 1%"`, `end +=heroHeight`, `scrub: 1`). The window clip morphs to a second inset (`[26,32,57,41]` mobile / `[35,20,35,72]`→… desktop) and fades. The headline drifts `xPercent 0→40`, the chips drift and fade, and the progress bar stretches.

### Page transitions
**None.** Nav links are plain `<a href>`, so every route change is a full document load and the intro replays on the next page. The only enter/exit motion between states is the side **panel** (cookie preferences): it slides `translate-x-full → 0` over 1000ms expo-out and exits with quart-inout, with a 1000ms overlay fade, using `react-transition-state`.

### Custom cursor
No global cursor. The Brand page's interactive identity canvas hides the cursor (`cursor:none`) in fullscreen mode after 3s without mouse movement, and shows `grab` cursors on draggable elements.

### Footer
`#footer` is a full-viewport (`min-h-lvh`) block with an orange **gradient Mux video** background (poster image first; the video fades in over 100ms). It has a big white wordmark on the left, centred mono `[ BLOG ] [ BRAND KIT ] …` links with the scramble hover, "More Power" on the right, and socials bottom-left. It isn't sticky or a reveal-under; it's a normal z-10 block. Some routes (error) hide it through the store.

### Other global motion helpers
- `ScrollAnimation`: a custom parallax primitive, not GSAP. It reads Lenis `animatedScroll` inside the shared rAF, computes a ratio from element offset and viewport, and writes `translate3d(...) scale(...)`. It can auto-scale to fit so the parallax never exposes edges (`scaleToFit`), and it is **disabled on touch devices** (`(hover: hover)` check).
- SplitText `mask:"lines"` line-rise reveal (`yPercent 100→0`) is the default text entrance across the site.
- Product, Brand and About use a vanilla `ScrollReveal` (IntersectionObserver, threshold 0.1: opacity 0 + `translateY(20px)` → 0 over 0.55/0.65s, cubic-bezier(.16,1,.3,1)).

---

## 3. Sitemap

| Route | Type |
|---|---|
| `/` | Home (long-form narrative, ~16,000px) |
| `/product` | Product (~12,400px) |
| `/partners` | B2B landing with a partner form (~6,000px) |
| `/about` | Company / manifesto (~9,400px) |
| `/brand` | Public brand kit / design system (~20,700px) |
| `/legal/terms-of-service`, `/legal/privacy-policy` | Legal article (`legal/[slug]`) |
| `/licenses` | Data table |
| any unknown path | 404 (`[slug]` fallback) |

External: blog.godaylight.com, help.godaylight.com, account. (sign-in), start. / estimate. (qualify funnel), Greenhouse careers.

---

## 4. Page-by-page, section-by-section

### 4.1 Home `/` (`shots/sheet-home-a/b/c.png`, `sheet-intro*.png`)

| # | Section | Layout / content | Animation (trigger → what moves → timing → library) |
|---|---|---|---|
| 1 | **Hero, "Power your home for less"** (`IntroAnimtedMask`) | Full-bleed house photo (sticky, `h-svh`, scale-110). Bottom-left: mono eyebrow "POWER YOU CONTROL", 85px Feature Deck H1, sub-copy, inline address input with a black "See if you qualify" pill. Right of centre: a **gradient window** with frame lines extending across the viewport and three **data chips** around it. | **On load:** the intro sequence above (Rive logo, clip-path shrink, SplitText lines, chip rise, bar scale; about 3s; GSAP + Rive). **Scroll-scrubbed** (scrub 1): the window clip morphs and fades, text drifts 40% right, chips drift and fade. The photo has a custom parallax of 200px. |
| 2 | **USP rows** ("Save: Cut your electric bill by 20% or more", "Protect: Keep the lights on with battery backup", "Control: Track it all in the Daylight app") (`UspMotion`) | Three rows of a **3-track hairline grid** (6 col │ flexible │ 6 col) on beige. Photos alternate between the outer cells. The centre cell holds the text. | **Desktop (scroll-scrubbed, one timeline, start "top 52%" → end "bottom 50%", scrub true):** each centre text block is `position: fixed; inset: 0` inside a `clip-path: border-box` cell. The text appears fixed to the viewport but is only visible through its own grid cell (fixed-in-clipped-cell trick). Content blocks move on y (150→-50, 50→-150, -50→-250) for parallax and cross-fade in sequence (autoAlpha 0.15 slices). The mono eyebrow rises `yPercent 100→0` and title lines go `yPercent 60→0` with stagger 0.012. **Mobile (on enter, "top 70%"):** lines rise (0.4/0.66s expo.out), the image wrapper clip goes `inset(20% 0 20% 0)→0` while the image scales 1.8→1 (1.5s expo.out), and the top/bottom border lines slide ±20% into place. |
| 3 | **How Daylight works intro, "A new way to power your home"** (`HowItWorksIntro`) | A sticky `h-lvh` full-bleed photo (hands holding the sun, warm haze), with a centred mono eyebrow, a big serif H2, a paragraph and a beige button. | **On scroll into view** ("top center"): SplitText lines rise for the eyebrow (0.4s, stagger 0.1), title (0.66s, stagger 0.15) and text (at "top 35%"), all power3.out. **Parallax:** the background moves 0→-300px and the text 0→-200px (custom ScrollAnimation). |
| 4 | **Steps 1–3** ("Subscribe to Daylight", "We install", "Power on") (`HowItWorksMotion` + `Step1/2/3Motion`) | A pinned-feel stack on a beige-2 card (rounded, inset by the margin). Left: mono "STEP N", 28px sans title, mono subtitle, body, black CTA. Right half: the visual. A fixed beige backdrop (`.hiw-bg`) fades in. | **Stack:** each step is sticky (`lg:h-lvh` absolute visuals). One scrubbed timeline ("top 35%" → "bottom top") fades the bg in, then shrinks each finished step to **scale 0.9 + autoAlpha 0** (sine.in) as the next one slides over it, so the cards stack. **Step 1:** a phone mockup grows from a small orange app-icon tile. Clip-path goes `inset(34.5% 12.29% 28% 12.29% round 1rem) → inset(0 round 1rem)` (expo.inOut) while the logo scales 3.1→1. Title lines rise. Top/bottom UI rise. The "Subscribe / Power on" toggle pill slides `xPercent 0→109` and the two labels swap colours (scrubbed over 1.4×vh). **Step 2:** a Rive isometric house/neighbourhood (line art, orange panels and circuits) is **scrubbed** 0→1.5 over 1.4×vh, so the illustration builds and the grid expands to a neighbourhood. **Step 3:** an "Energy / Earnings" card with an SVG curve. A clip-rect width 0→700 draws the orange line left to right (ease none). A **counter** runs 0.0→9.5 kWh via `onUpdate` → `textContent`. A faded second curve (opacity 0.3) and a "today" marker line appear at progress 0.45–0.55. All scrubbed, `top 25%` → `+=1.4vh`. |
| 5 | **Why Daylight** ("Today's grid was built for yesterday's world", then "The risks" list over wildfire footage) (`WhyDaylight`) | Full-viewport `<article>`s, each a background video (50% overlay) with beige text. Layout `center` gives a centred serif title. Layout `left` gives three 45px sans lines aligned left / right / centre in a staircase. | **Video:** the first one scales 0.8→1 scrubbed (to "center center"). Each background has custom parallax (`distance 0.75` × viewport). **Titles** (desktop, on enter "top center"): SplitText lines from `xPercent ±15` alternating per line (centre layout: `yPercent 150`) plus autoAlpha → 0, 1.6s **expo.out**, stagger 0.1. The CTA uses the rotated-fill hover. |
| 6 | **Full-screen banner** ("Daylight is creating the power we all need…") (`FullscreenBannerMotion`) | Aerial sunset video with a centred serif statement. | **Scroll-scrubbed** (`top 70%` → `bottom 100%`, scrub 1): eyebrow, title and text lines rise from `yPercent 100` in sequence (stagger 0.1–0.15). |
| 7 | **Network, "Every home makes the network stronger"** (`NetworkMotion`) | Beige section. Centred eyebrow, serif H2, paragraph, black CTA, then a wide **Rive US map** with arcs and nodes. | Text: `.nw-text` lines rise on enter (0.8s power4.out, stagger 0.1). **The Rive map is scrubbed** 0→1.3 (scrub true from "top center"), so the arcs draw as you scroll. |
| 8 | **Step into Daylight (diptych CTA)** (`DiptychAnimatedMask`) | 50/50 split on purple: left has a 120px serif title, logo mark, mono subtitle, copy and CTA. Right is a sticky interior photo with a **purple gradient window** and four frame lines. | **Scroll-scrubbed** (`top 75%` → `bottom 25%`, scrub 0.5): the window clip tweens through 3–4 preset insets (sine.inOut) and the frame lines follow. **Mouse-move parallax** (desktop): the window and lines offset up to ±25px with a lerp of 0.1 per frame (custom rAF). Text: title lines rise on "top 75%", subtitle/CTA on "top 20%" (desktop), SplitText body lines once. |
| 9 | **Footer** | See Global. | Hover scramble on links. |

The home hero's "qualify" input opens a `HomepageQualifyModal` (not tested; no forms submitted).

### 4.2 Product `/product` (`shots/sheet-product-*.png`)

| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | **Hero, "Your home's new energy system"** (`ProductHeroIntro` → `IntroAnimtedMask`) | The same hero system with a **yellow** gradient window. The house photo uses `mix-blend-mode: luminosity`, opacity 0.72. Two CTAs: beige "See if you qualify" and yellow "Get estimate". | Same intro and scroll scrub as Home. The CTAs use the rotated-fill hover with a black fill. |
| 2 | **How Daylight works for you** (`HowItWorksSection`) | Yellow `#FCCC3C` section with a serif H2 and four numbered cards ("01. Solar makes energy"…), each with an image and copy. | **Pinned horizontal scroll (vanilla JS, no GSAP).** The section height is `100vh + 1.5×overflow`. The inner wrapper is `position: sticky; top: 0; height: 100vh`, and a `scroll` listener sets `translateX(-progress × (scrollWidth − innerWidth))`. The track slides left about 1:1.5 with scroll. Header via IntersectionObserver ScrollReveal. Mobile: stacked. |
| 3 | **The hardware behind your lower electric bill** | Dark brown band with three cream cards (photo top, title, bullets). | `.product-hw-card` fade up + `scale 0.94→1`, **scrub 0.8** ("top 88%" → "top 38%"). |
| 4 | **Your home supports a more reliable grid** | Full-screen aerial video with a centred serif H2. | `NetworkSectionText`: SplitText line rises at "top 85%" / "top 65%". |
| 5 | **Daylight or cash purchase** | Beige comparison table (mono row labels, two columns) and two "pros" cards, ending with "Save on energy. Stay powered." and the logo mark. | Rows: `opacity 0, x:-10 → 0` stagger 0.06 (0.45s) at "top 85%". Pros cards: scrubbed fade/scale. |
| 6 | **A simple path to Daylight** (`ProcessScrollSection`) | Black sticky full-screen with a **canvas** behind a dark gradient. Top-left headline. Three yellow process cards along the bottom. | **Scroll-driven image sequence:** 121 JPGs (`/frames/frame-0001.jpg…`) are preloaded. The section is `100vh + 2000px` tall with a sticky 100vh stage. On scroll (rAF-throttled) it picks `floor(121 × progress)` and draws it cover-fit on the canvas, so a sun sets over hills as you scroll. If the first wheel event is coarse (≥80 delta), the section shortens to `+800px`. Mobile shows a static first frame. Cards: scrubbed fade/scale (stagger 0.14). |
| 7 | **FAQ, "Questions? We have answers."** (orange second clause) | Numbered rows (mono index), plus/minus icon. | Accordion animates `grid-template-rows 0→1fr` (0.35s). Answer goes opacity plus `translateY(-6px)→0` with 0.05s delay. The icon's vertical bar goes `scaleY(1→0)` to turn plus into minus. |
| 8 | **Real homes. Real savings.** | Dark blue band with three tall photo cards and glassy quote overlays (serif quotes). | Testimonial cards: scrubbed `opacity, y, scale 0.93→1`, stagger 0.14. |
| 9 | **Step into Daylight** | Yellow band, serif title left, white multi-step qualify form right (step "1/2" progress bar). | ScrollReveal fade-up. |
| 10 | Footer | | |

### 4.3 Partners `/partners` (`shots/sheet-partners.png`)
| # | Section | Animation |
|---|---|---|
| 1 | Hero "The only PPA with a battery included": the same `IntroAnimtedMask` with a **blue** window over a pool/house photo, eyebrow "FOR SOLAR INSTALLERS" | Intro and scroll scrub as on Home |
| 2 | "Why partners choose Daylight": orange gradient feature card left, three numbered (01/02/03 in big orange serif) reason cards right | ScrollReveal fade-ups **(inferred: same helper)** |
| 3 | "Not all PPAs are built the same": Typical vs Built-different split card (grey vs orange gradient), then a strike-through comparison table ending "Daylight wins." | Fade-ups |
| 4 | "The offer: 20% instant savings. $0 down…": `DiptychAnimatedMask` on yellow with a solar-roof photo and a yellow window | Scrubbed clip window, mouse parallax, line rises (as Home §8) |
| 5 | "Step into Daylight / Partner with us": dark blue, partner signup form in a cream card | none notable |

### 4.4 About `/about` (`shots/sheet-about.png`)
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | Hero "More Power" | `IntroAnimtedMask` with a **purple** gradient, homeowners/partners toggle buttons, mission sub-copy | Intro (Rive logo) and scroll scrub |
| 2 | **USP rows on black** ("A lower electric bill in every home", "A powered home through every storm"…) | The same 3-track hairline grid as Home §2, but on `bg-black` with `white/20` hairlines and **ghost "More / Power"** in 520px serif at 3% opacity behind | Same `UspMotion`: fixed-in-clipped-cell text, sequenced cross-fades, image clip `inset(20% 0)` plus scale 1.8→1 on mobile |
| 3 | **Investors strip** ("Backed by the industry's leading investors") | Logo row on beige | **Marquee in vanilla rAF:** `translateX -= 0.04px × dt`, wraps at track width, **pauses on hover** |
| 4 | **"The grid has … no master"** | Full-screen pylons photo, two 120px serif fragments at opposite corners, mono "DAYLIGHT / OUR THESIS" corner labels, small paragraph | Static layout; split-across-viewport typography is the effect |
| 5 | **Video** (sun in space) | 100svh muted video with a mono "SOUND OFF/ON" glass pill bottom-right | IntersectionObserver: play at ≥25% visible; pause and **reset to 0** when out |
| 6 | **Diptychs** "A new kind of energy company" (yellow) and "Financing the electrified world" (light blue, mirrored) | 50/50 `lg:h-lvh` text + photo with a coloured gradient window (`AboutDiptychSection`) | Scrubbed clip window (scrub 0.5), frame lines, `xPercent` title-line offsets (staircase "A new kind / of energy / company") |
| 7 | **"The future is Bright"** | Beige, "The future is" in sans and the 600px serif **"Bright"** cropped by the section bottom, logo mark | Static |
| 8 | **CEO letter** | Purple gradient with a luminosity-blended video, centre lilac card with deep side shadows, serif heading, **letter text drawn on `<canvas>`** (sr-only copy for accessibility), "Power on, Jason" sign-off | Canvas text layout at DPR, re-laid on resize/fonts ready (no motion) |
| 9 | Footer | | |

### 4.5 Brand `/brand` (`shots/sheet-brand-*.png`)
A public, interactive brand kit. Its own hero nav lists chapters 00–07 (Welcome, Logo, Color, Typography, Voice, Photography, Motion, Components) with "Download kit" and "Open in Figma". "+/−" chapter steppers and "↑ Top" sit in each section header.

| # | Section | Animation |
|---|---|---|
| 1 | **Hero "This is Daylight"** on black with a warm glow video, chapter list, "A new kind of energy company" | Two `<video>`s **ping-pong**: rAF modulates `playbackRate` (0.2→0.62 via cos/sin over 2.5s) and they cross-swap at `ended`, giving a slow breathing loop. GSAP intro timeline (delay 0.8, expo.out): title/sub `y:28→0`, logo/label `y:-14→0`, nav `y:20→0`, chained with `"<0.08"` offsets. CSS keyframes `brand-kb` (scale 1.06→1 Ken Burns) and `brand-glow`. |
| 2 | **"Spreading Daylight"** identity playground | Huge wordmark used as a **CSS mask** (SVG data-URI `mask-image`) over a canvas. Draggable suns and clouds (physics particles with vx/vy), a "PAINT · SNAP · SHARE" mode and "SCREENSAVER" fullscreen. Cursor hides after 3s idle. Keyboard shortcuts. Activates on IntersectionObserver, desktop >768px only. |
| 3–9 | Logo, Palette (incl. animated gradient tiles yellow/purple/blue), Typography specimens, Tone of voice, Photography grids, Motion system (gradient-window demos, an "Illuminations 002" card, a terminal-style live log), UI components (buttons, terminals) and Quick reference tokens | A repeated GSAP recipe per section: eyebrow line rise (0.4s), title SplitText lines (0.66s, stagger 0.12–0.15, power3.out, "top 86%"), body fade (0.7s), then cards with **scrubbed** `opacity/y/scale` (scrub 0.8, "top 88%" → "top 38–45%", stagger 0.1–0.14). Tone section has one `scrub: 0.6`. |

### 4.6 Legal / Licenses / 404 (`shots/sheet-misc.png`)
- **Terms:** a full-viewport photo hero with a serif title. The body is a 2-column article: a sticky "LAST UPDATED" label on the left and small-type copy on the right.
- **Licenses:** a centred serif title over a table with a dark-beige mono header row and hairline rows. Everything is static.
- **404:** the full-screen orange gradient (footer video), logo mark, "404 page not found" in serif, and a beige "Back to homepage" button.

---

## 5. Reusable patterns worth borrowing

1. **Hero as intro: a full-bleed gradient clip-paths down to a window.** Animate `clip-path: inset(0 0 0 0) → inset(35% 20% 35% 72%)` over 2s expo.inOut on a gradient layer above the hero photo, while the photo scales 1.1→1. Then scrub the inset further on scroll.
2. **Frame lines that track a clip window.** Use four absolutely positioned 1px lines (`bg-white/30`) and set their translate from the current inset values every rAF. The window then appears to sit on a full-viewport grid.
3. **Data chips around the window.** Small mono labels ("kWh generated 8.2–9.5", progress bar, "Thermostat 68°F") rise from a masked `y:100%` with a 40ms stagger once the mask settles, and drift away on scroll.
4. **Fixed text inside a clipped grid cell.** Give the cell `clip-path: border-box` and make the text inside `position: fixed; inset: 0`. Text stays put while the cell scrolls past, which looks like a pin without ScrollTrigger pinning. Pair it with a scrubbed cross-fade between rows.
5. **Visible fluid column grid.** Use CSS vars `--column/--gutter/--margin` in vw (24 cols desktop, 12 mobile) plus `span-w-N` utilities. Draw rules with full-height pseudo-elements sized to N columns with one border side, and `border-b first:border-t` rows.
6. **SplitText masked line rise as the house reveal.** `SplitText.create(el, {type:"lines", mask:"lines", autoSplit:true, onSplit})`, then `yPercent:100→0`, 0.66s power3.out, stagger 0.15, at "top 85%". Use a staircase variant (`xPercent ±15`, 1.6s expo.out) for statement lines.
7. **Scrub vector art instead of playing it.** Drive a Rive (or Lottie) timeline with `scrub(progress)` from a GSAP tween with `scrollTrigger:{scrub:true}`. Diagrams then build as you scroll (house → neighbourhood, US network arcs).
8. **Sticky stacked step cards.** Make each step sticky full-height. One scrubbed timeline shrinks the outgoing card to `scale .9, autoAlpha 0` (sine.in) while the next slides over it.
9. **Phone/app reveal from an icon.** Animate clip-path `inset(34% 12% 28% 12% round 1rem) → inset(0 round 1rem)` on a portrait mockup while the centred logo scales 3.1→1. A toggle pill then slides `xPercent 109` and swaps label colours.
10. **Scrubbed chart plus counter.** Grow an SVG `clipPath` rect width 0→W over the line path (ease none) and tween a plain object's value 0→9.5 with `onUpdate` writing `textContent.toFixed(1)`.
11. **Scroll image-sequence canvas** (Apple style). Preload N frames, use a sticky 100vh stage in a `100vh + Npx` section, and draw `frame = floor(N × progress)` with cover-fit `drawImage` in rAF.
12. **Pinned horizontal card track without libraries.** Make the section height `100vh + overflow×k` with a sticky inner track, and set `translateX(-progress × overflow)` on scroll.
13. **Diptych with a mouse-parallax window.** A 50/50 split where the coloured window moves through preset insets on scroll (scrub 0.5) and also lerps ±25px toward the cursor (lerp 0.1).
14. **Rotated-fill button hover.** A fill div `translate-y-[200%] rotate-[15deg] scale-[1.8]` goes to `translate-y-0 rotate-8` over 1s expo-out, with the label lifting 1px and changing colour (300ms). Add `hover:duration-100` with a 1000ms base so hover-in snaps and hover-out settles.
15. **Bracketed mono links with ScrambleText.** `[ LABEL ]` where hover scrambles the text (0.5s) and the brackets move in 5px.
16. **Grain overlay.** A tiled 300px grain JPG over the whole page with `mix-blend-overlay`, opacity 0.4 and pointer-events none, which warms the flat beige.
17. **Ghost and over-scaled serif type.** Use 3%-opacity 520px words behind dark sections, a 600px word cropped by the section edge ("Bright"), and statement fragments pinned to opposite corners ("The grid has / no master").
18. **Lenis wired to one shared rAF.** Use `lerp 0.12` with `lenis.on('scroll', ScrollTrigger.update)`. During intros and modals, lock scroll by destroying Lenis and fixing the body, then restore `scrollTo(saved, {immediate:true})`.
