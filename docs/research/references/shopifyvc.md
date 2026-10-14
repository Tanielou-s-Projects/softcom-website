# shopify.vc (Shopify Ventures): how it's built and animated

Researched 2026-10-14. Sources: the live HTML; the downloaded JS/CSS bundles (saved in `research/js/`); headless Chrome runs (`research/svc-probe.mjs`); screenshots in `research/shopifyvc/`. Everything below was **observed in source or in screenshots** unless it is marked *(inferred)*.

---

## 1. Tech stack

| Layer | What | Evidence |
|---|---|---|
| Framework | **Shopify Hydrogen 2024.10.1** on **Remix** (React SSR), hosted on **Oxygen** | `window.__remixContext`, `__remixRouteModules`, assets at `cdn.shopify.com/oxygen-v2/...`, `St="2024.10.1"` in root bundle, `data-discover="true"` on links. The CMS is the Shopify store (`ventures-microsite.myshopify.com`): loaders return `news`, `testimonials`, `clients`, `teamMembers`, `advisors`. |
| CSS | **Tailwind CSS v4.0.0-alpha.17** | Banner comment in `app-CRnXrf3T.css`, `--font-size-*--line-height` token naming, `not-hover:` variant |
| Animation libraries | **None.** No GSAP, ScrollTrigger, SplitText, Lenis/Locomotive, Framer Motion, Barba/Swup, Three.js/WebGL, Lottie or Rive. | Grepped every bundle. At runtime `window.gsap`, `ScrollTrigger`, `lenis` and `Webflow` are all false. `document.getAnimations()` returns only CSS keyframe animations. |
| How things move | 1. A few hand-written CSS `@keyframes`. 2. Tailwind `transition-*` utilities. 3. A custom **Canvas 2D ASCII renderer** driven by `requestAnimationFrame`. 4. `IntersectionObserver` and `scroll` listeners in React state. | `meta-CI4A5jlx.js` (the ASCII engine), `_index`, `difference`, `our-team` and `portfolio` route chunks |
| Fonts | **Approach** (a grotesk) in Light 300 and Medium 400. The 400 weight points at the *Medium* file. **Space Mono** Regular 400 is used only inside the ASCII canvas, drawn as synthetic `bold`. | `@font-face` rules; they are preloaded as woff2 |
| Analytics/consent | Hydrogen `useAnalytics` plus Shopify customer-privacy banner and GTM | root bundle |

## 2. Global systems

- **Smooth scroll:** none from a library. Native scrolling with `html { scroll-behavior: smooth; scroll-padding-top: 102px }` (177px on mobile), so the in-page category anchors scroll smoothly.
- **Page transitions:** none. Remix client-side navigation swaps the route. Every hero remounts, so the hero's CSS intro animation replays on each page.
- **Preloader/intro:** no preloader. The intro is a sequence of CSS animations plus the canvas build-up:
  - `header.slide-in-down`: `slideInDown`, 1s, `both`, from `translateY(-100%)`, default `ease`.
  - Hero `h1` and caption card `.fade-in-up.delay-1000`: `fadeInUp`, 1s, 1s delay, `forwards`, from `opacity .01; translateY(100%)`.
  - The ASCII canvas then runs its own build-up (see section 4).
  - In captures, the page is flat brand colour for about 1.3s, then the grain and header appear, the ASCII art pixelates in, and the text rises at about 2s (`home-intro-*.png`).
- **Nav on scroll:** it does not hide or shrink. A `scroll` listener sets `isScrolled = scrollY > 0`, which toggles the header between `bg-transparent` and `bg-white` with `transition-all duration-200 ease-in-out`.
  - On the dark `/difference` page the header starts with white text and white pill outlines (`secondary` variant), then switches to the white bar with black text.
  - The current route's pill gets a full `ring-black`; the other pills get `ring-black/30`.
- **Mobile menu:** below `md`, a two-line hamburger opens a full-screen black drawer. It slides in by moving `left` from `-left-full` to `left-0` (`transition-all duration-150`). The drawer holds the "Entrepreneurs thrive *here.*" line, a 1px divider and white outline pills.
- **Custom cursor:** none.
- **Footer:** static and not animated. It is a black rounded-lg card in a three-column grid (`1fr_1px_496px`) with a vertical 1px white rule:
  - left: "Entrepreneurs thrive *here.*" (italic second line), plus the © line and Privacy link
  - right: wordmark, white outline pills, the "powered by shopify" logo and a circular LinkedIn button that inverts on hover.
- **Colour tokens:**
  - `--color-sv-pink #fa9bbe`, `--color-sv-lime #dcff6e`, `--color-sv-blue #50c8f5`, `--color-sv-orange #ff873a`
  - black `#000` and white
  - borders are drawn as `ring-1 ring-inset` in black.
  - Colour per page: home is pink, portfolio blue, team orange, difference black. Lime is the accent used everywhere.
- **Grain texture:** a single class, `.bg-texture { background-image: url(texture.webp); background-size: 256px }`.
  - The webp is a 512×512 image of **pure white pixels with random alpha between 3 and 136 (mean about 64)**. It is white speckle noise laid over whatever `bg-sv-*` colour sits underneath.
  - It is not animated: no canvas, no SVG `feTurbulence`.
  - It sits on every coloured surface (hero backgrounds, lime cards, arrow circles, hover overlays).
- **Type scale** (Tailwind v4 tokens; all headings `font-light` 300, body copy also light):

  | Token | Size / line-height | Used for |
  |---|---|---|
  | `text-7xl` | 5rem / 1 | hero h1 at lg (`text-5xl` 3rem on mobile) |
  | `text-6xl` | 4rem / 1 | section h2 at lg (`text-4xl` 2.5rem on mobile) |
  | `text-5xl` | 3rem | card titles |
  | `text-3xl` | 1.875rem | sub-headings |
  | `text-xl` | 1.25rem | pills and captions (pills use `font-extralight` 200) |
  | `text-lg` | 1.25rem | body copy |

  Prose uses `text-wrap: pretty`.
- **Grid and margins:**
  - `main` uses `px-5 lg:px-10` with `max-w-[1440px] mx-auto`, and sections are spaced with `space-y-20`.
  - Content sections are often right-offset: `lg:ml-auto lg:max-w-[800px] xl:max-w-[1015px]`, which leaves an empty left column. On the portfolio and difference pages a sticky pill nav fills that column.
- **Radii:** cards use `rounded-lg` (8px). Pills use `rounded-[48px]`. Arrow buttons are `rounded-full`, 48px.
- **Buttons:**
  - Outline pill: `px-4 py-1 text-xl font-extralight ring-1 ring-inset`.
    - Hover on the primary variant: `bg-sv-lime` with a lime ring, `transition-all 150ms cubic-bezier(.4,0,.2,1)` (`hover-navpill.png`).
    - Hover on the secondary variant (on dark): white fill with black text.
  - Arrow circle: 48px lime circle with `bg-texture` and a pixel-stepped diagonal-arrow SVG.

## 3. Sitemap

| Route | Page colour / ASCII hero | In-page anchors |
|---|---|---|
| `/` | pink, rotating ASCII **globe** | none |
| `/portfolio` | blue, ASCII **hot-air balloons** bobbing | `#next-gen-commerce`, `#infrastructure-and-developer-tooling`, `#entrepreneurship-enablement` |
| `/difference` | black, ASCII **shopping bag that morphs into a diamond** on scroll | `#investment-approach`, `#portfolio-acceleration`, `#founder-testimonials` |
| `/our-team` | orange, ASCII **ring of people** circling in perspective | `#advisors` |

## 4. Per page, section by section

### The ASCII engine (shared by all four heroes)

Component `A` in `meta-CI4A5jlx.js`; it renders `<canvas id="ascii">`.

1. **The source is a tiny 64×64 `OffscreenCanvas`.** Each page provides a `drawFunction(offscreenCanvas, time)` that paints greyscale pixels with plain Canvas 2D calls (`drawImage`, `fillRect`).
2. **Pixels become text.** `te()` samples the source at N columns. For each cell it takes `255 − red`, picks a character from the ramp `" ,:;+*>%S#X"` (dark pixels give dense characters), and leaves a space where alpha ≤ 127. The result is a string with newlines.
3. **Text is drawn to the visible canvas** with `fillText`, in `bold {cell×1.2}px SpaceMono`. The fill is black (white on `/difference`) and the canvas itself has `opacity-70`. The canvas is DPR-scaled (DPR capped at 3) and sized `aspect-square w-[80vw] md:h-[80vh]`.
4. **Intro (on mount):**
   - Resolution ramps from `startResolution: 4` columns to `endResolution: 64` over **2000 ms**, linearly, rounded to multiples of 4. The image starts as about 4 giant characters and sharpens in steps (`home-intro-1800.png`, then `-2600`, then `-4000`).
   - At the same time a **character reveal** runs over **1000 ms**. Only the first `progress × count` characters of a seeded shuffled order are drawn, so glyphs pop in at random positions.
5. **Animation loop:**
   - `time += baseSpeed(0.5) × (0.5 + scrollVelocity × 1.5)` per frame. Scroll velocity is px/ms from a `scroll` hook and resets to 0 after 100 ms idle.
   - Scrolling therefore **speeds the art up**; at rest it runs at 0.25 per frame.
   - The loop runs only while the canvas is ≥10% in view (`IntersectionObserver`) and after `document.fonts.ready`.
6. **No mouse interaction.** Frames captured with the mouse at different positions were identical apart from normal time drift.
7. **It is not WebGL and has no shaders.** It is a CPU loop that calls `getImageData` and `fillText` 4,096 times per frame.

### `/` Home

| # | Section | Layout and content | Animation |
|---|---|---|---|
| 0 | Background wash | `fixed inset-0 bg-sv-pink bg-texture` behind everything | **Scroll-linked opacity** = `clamp(20 / scrollY, 0, 1)` with `transition-opacity 200ms`. It is fully pink at the top, 0.1 at 200px and about 0.02 by 1000px, so the page fades to off-white with a faint pink tint (`home-globe-scroll-*.png`). React state, no library. |
| 1 | Hero and globe | A `170vh` wrapper. Text is an absolute layer: h1 "Let's shape the future of entrepreneurship together." top-left (max 650px), and a lime textured caption card bottom-right (max 408px). The globe sits in a `sticky top-[5vh] h-screen` child. | **Load:** header slide-in, then text `fadeInUp` 1s after a 1s delay, and the ASCII build-up. **Scroll:** the globe is **sticky (pinned by CSS) for about 70vh** while the hero text scrolls past (it overlaps the text), then it scrolls off. The rotation speeds up with scroll velocity. |
| 1a | Globe mechanics | `earth-uv.webp` (64×64) is a pre-baked sphere **UV lookup map**: R = longitude, G = latitude, A = sphere mask. `earth.webp` (512×256) is an equirectangular greyscale land map. For each UV pixel: `x = (u·512 + time) % 512`, `y = (1−v)·256`, then the earth texel is written as grey. Advancing `time` spins the globe. | A fake 3D sphere with no 3D maths at runtime. Oceans come out dense (`X#`) and land sparse, because the map is inverted. At about 60fps one revolution takes roughly 34s at rest *(inferred from 0.25 px/frame over 512px)*. |
| 2 | Our mission | h2, then a lime textured card (`px-16 py-20`) with a 3-column grid of title and paragraph | None |
| 3 | In the news | h2, then 4 cards in a row at xl (`ring-1` outline, publisher label, headline, lime arrow circle) | **Hover:** an absolute overlay goes `opacity-0` to `100` (`duration-500 ease-in-out`), pink and textured, with a **marquee** of the headline plus arrow. The marquee is two copies animated with `marquee` and `marquee2` (`translateX(0→−100%)` and `(100%→0)`), linear and infinite. Duration = `max(3, headline.length / 12)` seconds, so longer headlines scroll at about the same pace (`hover-news-after.png`). |
| 4 | On the minds of founders | Right-offset column. h2 and a "Our portfolio" pill, then 3 tall cards (`min-h-[489px]`). Each card has a title, a large ASCII-style webp illustration (link, puzzle pieces or coins) bleeding off the edge, and a lime quote card. | **Scroll-in-view highlight:** `IntersectionObserver` at threshold 0.5 sets the visible card active. The active card gets `bg-sv-pink bg-texture ring-transparent` with `transition-all 300ms`, so cards light up pink one by one as you scroll (`home-scroll-04/05`). The illustrations are static images, not canvas. |
| 5 | Footer | See section 2 | None |

The mobile layout is the same with the globe at 80vw (`mobile-home-scroll-00-0.png`).

### `/portfolio`

| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | Hero | `min-h-screen bg-sv-blue bg-texture`. h1 "Backing future-defining founders" with a lime caption card. An ASCII canvas sits absolutely in the centre, behind the text. | The same intro. The draw function paints a balloon sprite 3 times at different sizes, each **bobbing on its own sine wave** (`sin(t·0.05·k)·2px`, phase-offset), and the ASCII engine turns it to text. It speeds up on scroll. |
| 2 | Category nav and grid | xl: sticky pill column at left (`sticky top-[104px] w-[450px]`), with category blocks on the right. Each block has an eyebrow, an h3, a caption, then a 2-column grid of logo cards (greyscale logo, city, optional black "Exit"/"IPO" chip, lime arrow). | **Scrollspy:** each block's `IntersectionObserver` (threshold 0.5, or 0.2 with a −100px margin on mobile) sets the active pill (full black ring vs `/30`). On mobile the pill bar is horizontal and auto-`scrollTo`s the active pill to centre (smooth). Clicking a pill uses an anchor link plus CSS smooth scroll. **Card hover:** a blue textured overlay fades in (500ms) with a **marquee of the logo repeated 8×**, speed = logo width / 8 s. |

### `/difference`

| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | Hero (dark) | `bg-black`. A sticky `h-screen` canvas layer, then the content pulled up with `mt-[-100vh]`. h1 "Let's ask big questions and build answers together" in white. Two large `text-5xl` manifesto paragraphs, offset right. | **Scroll-scrubbed, without a library:** `progress = min(scrollY/400, 1)`. The draw function **crossfades a shopping-bag sprite into a diamond sprite** via `globalAlpha` (bag at 1−p, diamond at p). The bag also squash-and-stretch bounces (`pow(1−sinPhase, 10)` spikes). Past p 0.5 it spawns **sparkle particles** (small plus-shaped crosses, 30-frame life, fading). A black overlay layer (`z-5`) goes to `opacity = min(scrollY/400·0.7, 0.7)`, dimming the art behind the text. The engine runs in white with scroll-velocity disabled. The canvas stays pinned while the paragraphs scroll over it (`difference-scroll-00/01/02`). |
| 2 | Marquee band | "From hello world to IPO." plus a lime diamond badge, ×3, `text-6xl` white on black | CSS `marquee`/`marquee2`, **20s** linear infinite, always running |
| 3 | Investment approach | Sticky pill nav at left (as on portfolio). 4 wide outline cards: title left, text right, padding up to 88px. | Scrollspy pills. **In-view highlight:** a card at ≥70% visible turns `bg-sv-lime bg-texture` (300ms transition). |
| 4 | Portfolio acceleration | Caption, 2 rows of title + copy, then a Founder Summit video (ASCII globe artwork, `preload="none"`) | The video **autoplays muted when ≥10% in view and pauses when out**. A lime round mute/unmute button fades in on hover. |
| 5 | Founder testimonials | Lime textured quote cards in 2 columns; the third spans both columns | None |

### `/our-team`

| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | Hero | `bg-sv-orange bg-texture`, h1 "Your partners in entrepreneurship", lime caption. The ASCII canvas sits behind. | A sprite sheet `people.webp` (8×3 figures). 7 random figures are placed on an **ellipse carousel**: angle = `i/7·2π + t·0.01`, tilted by `−π/3` for perspective, depth-scaled 0.5–1.5×, z-sorted, with a small sine bob. They **orbit slowly**, rendered as ASCII. It speeds up on scroll. |
| 2 | Intro and team grids | Right column: a large `text-5xl` statement, "Investors" and "Platform" headings, 2-column person cards (name, title, LinkedIn icon, arrow circle coloured by team: pink investors, lime platform, blue advisors). | **Hover:** a textured overlay in the team colour fades in (500ms) with a **marquee of the person's name** ×6, 10s. |
| 3 | Advisors | Left: an "Expertise area" checkbox filter, sticky (`lg:sticky top-[104px]`); on mobile it collapses with a rotating caret (300ms). Right: the advisor grid. | Filtering is instant (no animation). Hover as above. |

## 5. Reusable patterns worth borrowing

1. **Image-to-ASCII canvas hero.** Draw any sprite or animation into a 64×64 offscreen canvas, map luminance to `" ,:;+*>%S#X"`, and `fillText` the result in a mono font at about 70% opacity. One engine works for every page; only the draw function changes.
2. **Pixelate-in intro.** Ramp the ASCII column count 4→64 over 2s (stepped in 4s) while revealing glyphs in a seeded random order over 1s. You get a cheap, distinctive "boot-up" effect.
3. **Fake 3D globe via a UV lookup texture.** Pre-bake a 64×64 sphere UV map (R=u, G=v, A=mask). Each frame, sample an equirectangular map at `(u·W + t) % W`. That gives a spinning sphere without Three.js.
4. **Scroll velocity as an animation multiplier.** `speed = base × (0.5 + |v| × 1.5)`, decaying to 0 after 100ms idle. Ambient art reacts to scrolling with no scroll timeline needed.
5. **Static grain overlay.** A 512px white-noise PNG/WebP (alpha 3–136) tiled at 256px on top of flat brand colours. It is one utility class (`bg-texture`) and costs no GPU.
6. **CSS-sticky pinned hero.** A tall wrapper (`170vh`) with the art in a `sticky top-0 h-screen` child and the text in an absolute layer, or with content pulled up via `mt-[-100vh]`. Pinning without ScrollTrigger.
7. **Scroll-scrubbed state from `scrollY / 400`.** Feed a 0→1 progress into the canvas (crossfade one object into another, add sparkles) and into a dimming overlay's opacity.
8. **Hover marquee overlay on cards.** An absolutely positioned overlay in a brand colour with grain fades in over 500ms, carrying a two-copy CSS marquee of the card's title or logo. Duration scales with text length.
9. **"Active card" on scroll.** An `IntersectionObserver` (threshold 0.5–0.7) fills the in-view card with a textured accent colour via a 300ms transition, so the list reads as a progress highlight.
10. **Scrollspy pill nav.** A sticky outline-pill column with full-ring active and `/30`-ring inactive states. On mobile it becomes a horizontal strip that auto-scrolls the active pill to centre.
11. **Outline-pill button system.** `ring-1 ring-inset`, 48px radius, extralight 20px text, lime fill on hover in 150ms. Used for nav, CTAs and filters alike.
12. **Fading page colour wash.** A fixed brand-colour layer with `opacity = 20/scrollY`. The hero is saturated, and the colour melts away to white as soon as you scroll.

## Caveats

- The intro timing in headless capture includes network latency: the texture and fonts arrive at about 1.3s.
- The "34s per revolution" figure is computed from the code constants, not timed.
- `pauseOnHover` is passed to the portfolio marquee, but the Marquee component ignores it.
