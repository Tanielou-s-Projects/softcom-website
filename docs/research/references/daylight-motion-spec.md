# Daylight section animations: implementation spec

Researched 2026-10-14 for Softcom. This is a build spec, not a survey. For the
broader teardown (stack, colours, grid, sitemap) see [daylight.md](./daylight.md).

**Sources.** Production JS from godaylight.com (GSAP 3.13.0, Lenis 1.3.4, Rive),
de-minified and read module by module, plus live headless-Chrome captures that
probed computed `transform`, `opacity` and `clip-path` at known scroll offsets.
The numbers below are quoted from the source. Where a capture confirmed a value
it says **(measured)**. Anything not confirmed in source or capture is marked
**(inferred)**.

**Screenshot roots.** These are scratch folders and may be cleaned up later.

- `S/` = `~/.claude/jobs/cb80e452/tmp/research/daylight/shots/` (first pass: intro probes and per-page scroll frames)
- `F/` = `~/.claude/jobs/cb80e452/tmp/research/daylight-spec/` (this pass: USP, steps and late-page frame sequences at 1440×900)

**Source module map**, for anyone re-reading the bundles in `daylight/pretty/`:

| Component | Chunk / module |
|---|---|
| `IntroAnimtedMask`, `ScrollAnimation`, `Parallax`, resize and rAF hooks, Lenis store, clip constants | `2339` (modules 2339, 277, 6094, 3772, 6316, 8748, 6454) |
| `UspMotion`, `HowItWorksIntro`, `HowItWorksMotion`, `Step1Motion`, `Step2Motion`, `Step3Chart`, `WhyDaylight`, `FullscreenBannerMotion`, `NetworkMotion`, `DiptychAnimatedMask`, `Button` | `7103` |
| `AboutDiptychSection` (About and Partners diptychs) | `5927` |
| `ProductAnimations`, `HowItWorksSection` (horizontal), `ProcessScrollSection` (canvas), `FAQSection`, `ScrollReveal`, `NetworkSectionText` | product page chunk |
| `AboutInvestorSection` (marquee), the About video, the CEO letter | about page chunk |
| `Lenis` driver, `GsapScrollTrigger`, nav, footer scramble | layout chunk (modules 1102, 4106, 1332) |

---

## 0. How this maps onto what Softcom already has

`lib/motion.ts` already registers `ScrollTrigger, SplitText, CustomEase, useGSAP`
and defines `EASE.out` as Daylight's CSS expo-out curve. `components/motion/smooth-scroll.tsx`
already runs Lenis on `gsap.ticker` with `lagSmoothing(0)`. Every recipe below
imports from `@/lib/motion` and assumes that setup. Section 1.10 lists the small
additions the recipes need: media-query constants, a few named eases, and an
exported Lenis handle for the intro scroll lock.

**One structural rule:** two of the best effects (the USP fixed-in-cell text,
§2.7, and the How-it-works backdrop, §2.8) use `position: fixed` inside the
page. No ancestor of those sections may carry a `transform`, `filter`,
`perspective`, `will-change: transform` or `contain: paint`, because any of
those makes the fixed element relative to that ancestor and breaks the trick.
The pixel page transition is already a fixed overlay rather than a wrapper, so
it is safe. Keep it that way.

---

## 1. Global motion constants

### 1.1 Plugin registration

Every motion module registers what it uses at module top level, at import time:

```js
// chunk 7103, UspMotion (module 9178)
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
// Step2Motion (module 1421) is the only module that also registers CustomEase
gsap.registerPlugin(ScrollTrigger, useGSAP, CustomEase);
```

The layout also mounts a `<GsapScrollTrigger/>` (module 4106) that registers
ScrollTrigger once and calls `ScrollTrigger.update()` on every Lenis scroll.

**CustomEase is registered but never used.** No module calls
`CustomEase.create`, and every GSAP ease is a built-in. The "house curve" only
exists in CSS (§1.4). Softcom's `EASE.out` CustomEase is therefore a deliberate
improvement that lets CSS and GSAP share one curve. It is not a copy.

### 1.2 Lenis

Lenis lives in a zustand store (chunk 2339, module 8748):

```js
const LENIS_OPTIONS = {
  lerp: 0.12,
  orientation: "vertical",
  gestureOrientation: "vertical",
  wheelMultiplier: 1,
  normalizeWheel: false,   // legacy option name, ignored by Lenis 1.3
  smoothTouch: false,      // legacy option name, ignored (touch is native by default)
};
lenis: new Lenis(LENIS_OPTIONS),
```

They do not drive it from `gsap.ticker`. A single shared rAF loop (module 6316,
one `requestAnimationFrame` for every subscriber, with optional per-subscriber
fps throttling) calls `lenis.raf(time)`. Sync with ScrollTrigger happens through
the scroll event:

```js
// layout module 1102 (the <Lenis/> driver)
useRaf((t) => !lenis.__isStopped && lenis?.raf(t), true);   // true = run first in the loop
useEffect(() => { lenis.on("scroll", ScrollTrigger.update); lenis.emit();
                  return () => lenis.off("scroll", ScrollTrigger.update) }, [lenis]);
useEffect(() => { lenis.scrollTo(0, { immediate: true }) }, []);  // always start at top
```

They never call `lagSmoothing` and never use `ScrollTrigger.scrollerProxy`. That
works because Lenis 1.x scrolls the real window, so ScrollTrigger reads native
`scrollY`.

**Softcom:** keep the existing `gsap.ticker` driver. It is the officially
recommended pattern and is strictly better, because GSAP and Lenis then advance
in the same frame:

```ts
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

Daylight runs Lenis on touch devices too, where it passes through to native
scrolling. Softcom disables Lenis on `(pointer: coarse)`, which is fine.

### 1.3 Scroll lock and the intro-before-scroll gate

The store exposes `setIsLocked(bool)`. Locking **destroys** Lenis and freezes
the body. Unlocking recreates Lenis and restores the position:

```js
setIsLocked: (lock) => {
  if (lock && !isLocked) {
    const y = lenis.animatedScroll; lenis.destroy();
    Object.assign(document.body.style, { position: "fixed", top: `-${y}px`, left: "0", right: "0" });
    set({ isLocked: true, savedScrollY: y });
  } else if (!lock && isLocked) {
    Object.assign(document.body.style, { position: "", top: "" });
    set({ lenis: new Lenis(LENIS_OPTIONS) });
    get().lenis.scrollTo(get().savedScrollY, { immediate: true, force: true });
    set({ isLocked: false, savedScrollY: 0 });
  }
}
```

A second store holds `introPlayed`. The hero intro timeline (§2.1) wires both
stores:

```js
gsap.timeline({ paused: true,
  onStart:    () => { setIsLocked(true); setTimeout(() => { setIsLocked(false); setIntroPlayed(true) }, 2000) },
  onComplete: () => { setIsLocked(false); setIntroPlayed(true); setIntroDone(true) /* builds the scroll timeline */ },
})
```

On mobile the lock is released even earlier, from inside the timeline:
`tl.add(() => setIsLocked(false), 1)`. So the lock covers about 2 s of a
roughly 3.2 s intro on desktop and 1 s on mobile. The tail of the intro (text and
chips arriving) plays while the user can already scroll. The nav listens for
`introPlayed` and then drops in (§2.23).

**Play gating:** the intro does not start on mount. The hero media fires
`onLoad` (image) or `onMetadataLoaded` (video), which calls `intro.play()`.
There is also a fallback, `setTimeout(() => intro.play(), 300)`, when a
`mediaNode` (the gradient layer) is passed. **There is no `document.fonts.ready`
gate on GSAP anywhere.** `document.fonts.ready` appears once, for the canvas CEO
letter on About. Text splits rely on SplitText `autoSplit` (§1.6) re-splitting
once the fonts load.

### 1.4 Eases

**GSAP eases, by job.** Counted across every motion module:

| Ease | Used for |
|---|---|
| `power3.out` | the default line reveal (eyebrow, title and body lines), product card fade-ups |
| `power4.out` | stronger line reveals (diptych, network text, step titles), intro headline lines (desktop), bar/backdrop fades |
| `expo.out` | intro chips and mobile intro lines, USP mobile reveals, the WhyDaylight staircase (1.6 s), nav drop-in, footer brackets |
| `expo.inOut` | anything that **travels**: the intro clip window, photo de-scale, Rive logo exit, the Step 1 phone clip |
| `sine.inOut` | scrubbed diptych window keyframes |
| `sine.in` | stacked step cards shrinking away |
| `power2.in` / `power2.out` | the hero scroll-out (defaults), USP cross-fades, product scrubbed cards |
| `none` | scrubbed proxies: Rive progress, chart width, counters, USP y-drift, video scale |

**CSS tokens** (Tailwind utilities in `2a25a22622efe1bc.css`):

| Utility | cubic-bezier |
|---|---|
| `ease-expo-out` | `(.16, 1.08, .38, .98)` (slight overshoot) |
| `ease-expo-inout` | `(.9, 0, .1, 1)` |
| `ease-quart-out` | `(.26, 1.04, .54, 1)` |
| `ease-quart-inout` | `(.77, 0, .175, 1)` |
| `ease-cubic-inout` | `(.66, 0, .34, 1)` |
| `ease-in-out` / `ease-out` | `(.4, 0, .2, 1)` / `(0, 0, .2, 1)` |
| newer inline styles (Product, About, nav) | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out without the overshoot) |

To mirror these in GSAP, use CustomEase. It accepts the four-number form:

```ts
CustomEase.create("dl.expoOut",   "0.16,1.08,0.38,0.98")   // = softcom.out today
CustomEase.create("dl.expoInOut", "0.9,0,0.1,1")           // CSS expo-inout. Steeper than GSAP's expo.inOut
CustomEase.create("dl.quartOut",  "0.26,1.04,0.54,1")
```

### 1.5 Durations and staggers

| Thing | Duration | Stagger | Ease |
|---|---|---|---|
| Mono eyebrow line | **0.4** | 0.1 | power3.out |
| Title lines | **0.66** | **0.15** (0.12 on Product) | power3.out |
| Body lines | 0.66 | 0.15 (0.1 in diptychs) | power3.out |
| Strong line rise (diptych, network) | 0.8 | 0.1 | power4.out |
| Intro headline lines | 1.0 | 0.1 desktop / 0.07 mobile | power4.out / expo.out |
| Chips and labels | 0.5 | 0.04 | expo.out |
| Image clip and scale reveal | 1.5 | none | expo.out |
| Statement staircase | 1.6 | 0.1 | expo.out |
| Clip window travel | 2.0 | none | expo.inOut |
| Nav drop | 1.2 (0.5 delay off-home) | none | expo.out |
| Scrubbed card rise | scrub **0.8** | 0.14 | power2.out |
| Scrub smoothing values | `scrub: true` (steps, USP, Rive), `0.5` (diptych window), `0.8` (product cards), `1` (hero out, banner) | | |

Common **start** positions: `"top 88%"`/`"top 85%"` for reveals, `"top 70%"`
for mobile and banner scrubs, `"top 75%"` for diptychs, `"top center"` for
full-screen sections, `"top 35%"` for the step stack, and `"top 1%"` for the hero.

### 1.6 SplitText conventions (GSAP 3.13 API)

Every split uses `mask: "lines"`. Each line is wrapped in a
`<div class="{linesClass}-mask" style="overflow:clip">` that hides it while it
sits at `yPercent: 100`. Two forms appear:

```js
// A. Reveal tied to the split. autoSplit re-splits on font load and width change,
//    and the tween returned from onSplit is reverted and rebuilt with it.
new SplitText(".fb-title", {
  type: "words, lines", mask: "lines", linesClass: "fb-title-line", autoSplit: true,
  onSplit: (self) => gsap.fromTo(self.lines, { yPercent: 100 },
    { yPercent: 0, duration: 0.66, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top center" } }),
});

// B. Split once and feed the lines into a larger timeline (hero intro, banner, steps).
//    No autoSplit, because the timeline owns the lines.
const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "intro-line" });
```

Details worth copying:

- **Descender fix.** A mask clips descenders and accents, so they pad the line
  and pull it back. On Product:
  `.network-title-line { padding-bottom: .18em; margin-bottom: -.18em }`, or in
  JS `line.parentElement.style.paddingBottom = "0.18em"`. On the intro and USP:
  Tailwind `[&_.intro-line]:my-[-0.04em] [&_.intro-line]:py-[0.04em]`.
- **Turning the mask off when lines move sideways.** The intro headline slides
  on `x`, so the H1 has `*:!overflow-visible` to stop the masks clipping it. The
  USP desktop titles do the same: `lg:*:!overflow-visible`.
- **FOUC guard.** WhyDaylight titles render `lg:invisible`. JS calls
  `gsap.set(title, { visibility: "visible" })` immediately before the `fromTo`.
- `type: "words, lines"` is used wherever text wraps at fluid widths. Words make
  the line detection robust. Only lines are animated.
- **Bug, not a feature.** `UspMotion` passes `onUpdate` to SplitText, which is
  not a SplitText callback, so it is ignored. Don't copy it.

### 1.7 Resize and rebuild strategy (the "agency" components)

- Resize goes through one shared, debounced window listener (module 3772,
  default 40 ms, 200 ms for heavy timelines).
- **They rebuild only when the width changes, or always at ≥1024 px.** This
  ignores the mobile URL bar changing `innerHeight`:

  ```js
  if ((e.innerWidth < 1024 && e.innerWidth !== prev.innerWidth) || e.innerWidth >= 1024) rebuild()
  ```
- **Rebuilds keep progress.** `const p = tl.progress(); tl.kill(); mm.revert(); build(); tl.progress(p)`.
- They use `gsap.matchMedia()` with `(min-width: 1024px)` and
  `(max-width: 1023px)` everywhere a component has separate desktop and mobile
  choreography.
- Some components force `ScrollTrigger.refresh(true)` after the rebuild.
- `useGSAP(fn, { scope, revertOnUpdate: true })` and `contextSafe` wrap the
  resize callbacks so every tween they create is reverted on unmount.

**Softcom equivalent:** `ScrollTrigger.config({ ignoreMobileResize: true })`
plus `invalidateOnRefresh: true` on function-based values, plus `gsap.matchMedia`.
Hand-rolled rebuilds are only worth it for the hero (§2.1), where progress must
survive a resize.

### 1.8 Custom parallax primitive (not GSAP)

`ScrollAnimation` (module 277) and its wrapper `Parallax` (module 6094,
`distance` default 100, wraps the child in `overflow-clip`) compute a ratio from
the Lenis `animatedScroll` inside the shared rAF loop and write
`translate3d(0, ratio × distance px, 0) scale(s)`:

```js
// offset = [[a, b], [c, d]]. Default [[0.5, 0.5], [1, 0]]
start = a*elH - b*vh;  end = c*elH - d*vh;
ratio = (scrollY - (start + elTop)) / (end - start);   // unclamped, no smoothing
```

With the default offset, `ratio` is −1 when the element enters at the bottom of
the viewport, 0 when it is centred and +1 when it leaves at the top. With
`[[0, 0], [1, 0]]` (the hero), it is 0 at the page top and 1 after scrolling the
element's own height.

`scaleToFit` adds just enough scale that the translation never exposes an edge.
`useViewportRatio` makes `distance` a fraction of the viewport height (WhyDaylight
uses `0.75`). It is **disabled on touch devices**:
`!matchMedia("(hover: hover)").matches`.

GSAP equivalent:

```ts
gsap.fromTo(inner, { y: -d }, { y: d, ease: "none",
  scrollTrigger: { trigger: outer, start: "top bottom", end: "bottom top", scrub: true } })
```

### 1.9 Reduced motion

Daylight has **no reduced-motion handling in GSAP**. The only
`prefers-reduced-motion` rule is the mobile nav CSS. Softcom must add it. Every
recipe below uses one pattern:

```ts
mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (ctx) => {
  const { desktop, reduce } = ctx.conditions!
  if (reduce) { /* set final states, no ScrollTriggers */ return }
  ...
})
```

### 1.10 Additions to `lib/motion.ts` assumed by the recipes

```ts
export const DESKTOP = "(min-width: 1024px)"
export const MOBILE  = "(max-width: 1023px)"
export const REDUCE  = "(prefers-reduced-motion: reduce)"

CustomEase.create("dl.expoInOut", "0.9,0,0.1,1")
ScrollTrigger.config({ ignoreMobileResize: true })

/** inset() string from [top, right, bottom, left] percentages */
export const inset = (a: readonly number[], round = "") =>
  `inset(${a.map((v) => `${v}%`).join(" ")}${round ? ` round ${round}` : ""})`

// smooth-scroll.tsx: expose the instance so the hero can lock scroll
export const lenisRef: { current: Lenis | null } = { current: null }
export const lockScroll = (on: boolean) => {
  on ? lenisRef.current?.stop() : lenisRef.current?.start()
  document.documentElement.style.overflow = on ? "hidden" : ""   // also covers touch, where Lenis is off
}
```

`lenis.stop()` is simpler than Daylight's destroy-and-fix-body, and it keeps the
scroll position.

---

## 2. Effect catalogue

Each entry covers where the effect appears, the mechanics as quoted from source,
a timing table, a recipe, and the Softcom mapping.

---

### 2.1 Hero intro: full-bleed colour layer clips down to a window (`IntroAnimtedMask`)

**Where.** The hero on Home, Product, Partners and About (all four pages use it
with different colours). Frames: `S/sheet-intro2.png`, `S/probe-intro-00-0.png`
through `S/probe-intro-09-4117.png`, `S/home-intro-{0,300,800,1500,2500,3500,5000}.png`,
`S/product-intro-*.png`, `S/partners-intro-*.png`, `S/about-intro-*.png`.

**DOM** (desktop classes, abridged):

```html
<div class="containerRef relative isolate overflow-clip [clip-path:border-box]">
  <!-- 1. the photo: parallax wrapper, sticky, pre-scaled -->
  <Parallax distance={200} offset={[[0,0],[1,0]]} class="relative h-full w-full">
    <div ref=photo class="sticky top-0 h-svh w-full scale-110">{photo}</div>
  </Parallax>
  <!-- 2. everything else rides one ScrollAnimation y:200 layer -->
  <ScrollAnimation y={200} offset={[[0,0],[1,0]]} class="absolute inset-0 z-1 grid grid-cols-1 grid-rows-1">
    <!-- 2a. the colour layer that becomes the window -->
    <div ref=win class="clip-path-inset-0 sticky top-0 z-2 col-start-1 row-start-1 grid h-svh w-full">
      {gradient video/image (mediaNode)}
      <figure class="relative z-1 flex items-center justify-center">{Rive logo}</figure>
    </div>
    <!-- 2b. four 1px frame lines, aria-hidden -->
    <div class="sticky top-0 z-1 col-start-1 row-start-1 grid h-svh w-full">
      <div class="-top-2 absolute h-1 w-full bg-white/30"/>    <!-- or bg-beige-dark -->
      <div class="-right-2 absolute h-full w-1 bg-white/30"/>
      <div class="-bottom-2 absolute h-1 w-full bg-white/30"/>
      <div class="-left-2 absolute h-full w-1 bg-white/30"/>
    </div>
    <!-- 2c. the text slot -->
    <div class="!sticky !overflow-visible top-0 z-2 flex h-svh flex-col justify-end lg:justify-center">
      <div ref=text class="lg:-translate-x-full translate-y-[120%] lg:translate-y-0">{eyebrow, h1, sub, CTA}</div>
    </div>
    <!-- 2d. data chips pinned to the window corners -->
    <div class="!sticky top-0 z-1 block h-svh">
      <ul ref=infoTop style="inset: {win.top}% 0 0 {win.left}%" class="absolute lg:-translate-y-full ...">…</ul>
      <div ref=infoRight style="bottom:{win.bottom}%; right:{win.right}%" class="absolute translate-x-full overflow-y-clip">…</div>
      <div ref=infoBottom style="bottom:{win.bottom}%; left:{win.left}%" class="absolute translate-y-full overflow-clip">…</div>
    </div>
  </ScrollAnimation>
</div>
```

Pre-states live in the markup (`translate-y-[120%]`, `lg:-translate-x-full`,
`scale-110`), so nothing flashes before hydration. The sticky `h-svh` layers keep
the window, lines and text on screen while the hero scrolls away.

**Clip constants** (module 6454). These are `[top, right, bottom, left]` in % of
the hero box.

| Name | Value | Use |
|---|---|---|
| `Lv` | `[0, 0, 0, 0]` | intro start (full bleed) |
| `gP` | `[30, 15, 30, 67.15]` | **desktop** window after the intro (all four pages) |
| `Oy` | `[22.29, 28.27, 53.83, 36]` | **mobile** window after the intro |
| `or` | `[35, 20, 35, 72]` | desktop window at the end of the scroll-out |
| `y$` | `[26, 32, 57, 41]` | mobile window at the end of the scroll-out |

Home's RSC payload confirms `clipPaths: [[30,15,30,67.15],[22.29,28.27,53.83,36]]`
(measured). Product, Partners and About pass `[gP, Oy]` too. The first-pass doc
listed `[35, 20, 35, 72]` as the intro window, but that is the scroll-out target.

**Intro timeline** (desktop branch, de-minified; `O` = desktop clip):

```js
const tl = gsap.timeline({ paused: true, onStart, onComplete });       // see §1.3
tl.set(win,   { clipPath: "inset(0% 0% 0% 0%)" }, 0)
  .set(lines, { x: 0, y: 0 }, 0)
  .set(photo, { scale: 1.1 }, 0);
const split = SplitText.create(text.firstChild.childNodes, { type: "lines", mask: "lines", linesClass: "intro-line" });
tl.set(text, { x: "-100%", y: "0" }, 0)
  .set(split.lines, { translateX: -50 }, 0)
  .set(infoTop, { y: "-100%", x: "0%" }, 0)
  .set(".intro-info-top", { y: "100%" }, 0)
  .set(".intro-info-right", { yPercent: 100 }, 0)
  .set(".intro-info-right-bar", { scaleX: 0, autoAlpha: 0 }, 0)
  .set(".intro-info-right-bar-inner", { scaleX: 0 }, 0)
  .fromTo(riveProgress, { current: 0 }, { current: 1, duration: 2.5, ease: "none",
          onUpdate: () => rive.scrub(riveProgress.current) }, 0)
  .to(win, { clipPath: () => inset(O), duration: 2, ease: "expo.inOut" }, 1)
  .to(lineState, { ...fractions(O), duration: 2, ease: "expo.inOut" }, "<")      // frame lines follow
  .to(text, { x: "0%", y: "0%", duration: 1, ease: "power4.out" }, 2)
  .to(split.lines, { translateX: 0, duration: 1, ease: "power4.out", stagger: 0.1 }, 2)
  .fromTo(".intro-info-top",   { y: "100%" },  { y: "0%", duration: 0.5, ease: "expo.out", stagger: 0.04 }, 2.3)
  .fromTo(".intro-info-right", { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "expo.out", stagger: 0.04 }, 2.4)
  .fromTo(".intro-info-right-bar", { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 2.3)
  .fromTo(".intro-info-right-bar-inner", { scaleX: 0 }, { scaleX: 0.4, duration: 0.6, ease: "expo.out" }, 2.4)
  .fromTo(riveLogoEl, { scale: 1, x: 0, y: 0, autoAlpha: 1 },
          { scale: 0.4, x: (O[3] / 100 * heroW) / 3, autoAlpha: 0, duration: 1.9, ease: "expo.inOut" }, 1)
  .to(photo, { scale: 1, duration: 2, ease: "expo.inOut" }, 1);
```

The mobile branch differs as follows. The text starts at `y: "120%"` and lines
at `y: 60`. The text and lines rise with `expo.out` (stagger **0.07**) instead of
sliding with `power4.out`. The chips are positioned with `inset`/`bottom`/`right`
from the mobile clip `X`. The logo exits with `xPercent: 5,
y: -(O[2]/100 × heroH)/2 + 15`. Scroll unlocks at t = 1.

**Timing (desktop).**

| t (s) | Element | Property | From → to | Dur | Ease |
|---|---|---|---|---|---|
| 0 | Rive logo | draw progress | 0 → 1 | 2.5 | none |
| 0 | body | scroll locked | (unlock at +2.0 s via setTimeout) | | |
| 1.0 | colour layer `win` | `clip-path` | `inset(0 0 0 0)` → `inset(30% 15% 30% 67.15%)` | 2.0 | expo.inOut |
| 1.0 | frame lines | translate | screen edges → window edges | 2.0 | expo.inOut |
| 1.0 | photo | `scale` | 1.1 → 1 | 2.0 | expo.inOut |
| 1.0 | Rive logo | `scale`, `x`, `autoAlpha` | 1, 0, 1 → 0.4, ≈322 px @1440, 0 | 1.9 | expo.inOut |
| 2.0 | text block | `x` | −100% → 0 | 1.0 | power4.out |
| 2.0 | H1 lines | `translateX` | −50 px → 0 | 1.0 | power4.out, stagger 0.1 |
| 2.3 | chip labels (`.intro-info-top`) | `y` | 100% → 0 (masked) | 0.5 | expo.out, stagger 0.04 |
| 2.3 | progress bar | `scaleX`, `autoAlpha` | 0 → 1 | 0.5 | expo.out |
| 2.4 | right-chip text | `yPercent` | 100 → 0 | 0.5 | expo.out, stagger 0.04 |
| 2.4 | bar fill | `scaleX` | 0 → 0.4 | 0.6 | expo.out |
| ≈3.2 | | `onComplete`: build the scroll-out (§2.2) | | | |

Measured frames (`S/sheet-intro2.png`): at 0.7 s the logo is drawing on a solid
gradient, at about 1.8 s the window is closing, and by 2.4 s the layout has landed.

**Frame-line maths** (rAF, only while the hero is in view). `state` holds
fractions 0–1. W and H are the window layer's box.

```js
top:    translateY =  state.top    * H + 1
right:  translateX = -state.right  * W - 1
bottom: translateY = -state.bottom * H - 1
left:   translateX =  state.left   * W + 1
```

**Recreation recipe.** This one component covers §2.1 to §2.4.

```tsx
"use client"
import * as React from "react"
import { gsap, SplitText, useGSAP, DESKTOP, REDUCE, inset, lockScroll } from "@/lib/motion"

const WIN = { desktop: [30, 15, 30, 67.15], mobile: [22.29, 28.27, 53.83, 36] } as const
const OUT = { desktop: [35, 20, 35, 72],    mobile: [26, 32, 57, 41] } as const
const frac = (a: readonly number[]) => ({ top: a[0] / 100, right: a[1] / 100, bottom: a[2] / 100, left: a[3] / 100 })

export function HeroMask({ photo, layer, children }: { photo: React.ReactNode; layer: React.ReactNode; children: React.ReactNode }) {
  const root = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const win = q(".hm-win")[0] as HTMLElement
    const lines = q(".hm-line") as HTMLElement[]          // top, right, bottom, left
    const box = frac([0, 0, 0, 0])
    const draw = () => {
      const { width: W, height: H } = win.getBoundingClientRect()
      gsap.set(lines[0], { y:  box.top * H + 1 });  gsap.set(lines[1], { x: -box.right * W - 1 })
      gsap.set(lines[2], { y: -box.bottom * H - 1 }); gsap.set(lines[3], { x:  box.left * W + 1 })
    }
    const mm = gsap.matchMedia()
    mm.add({ desktop: DESKTOP, reduce: REDUCE }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean }
      const W0 = desktop ? WIN.desktop : WIN.mobile, W1 = desktop ? OUT.desktop : OUT.mobile
      const text = q(".hm-text")[0], chips = q(".hm-chip"), photoEl = q(".hm-photo")[0]
      if (reduce) {                                       // final state, no motion, no lock
        gsap.set(win, { clipPath: inset(W0) }); Object.assign(box, frac(W0)); draw()
        gsap.set([text, chips, photoEl], { clearProps: "transform" }); return
      }
      const split = SplitText.create(q(".hm-title"), { type: "lines", mask: "lines", linesClass: "intro-line" })
      const intro = gsap.timeline({
        paused: true,
        onStart: () => { lockScroll(true); gsap.delayedCall(desktop ? 2 : 1, () => lockScroll(false)) },
        onComplete: () => { lockScroll(false); buildOut() },
      })
      intro.set(win, { clipPath: inset([0, 0, 0, 0]) }, 0).set(photoEl, { scale: 1.1 }, 0)
        .set(text, desktop ? { xPercent: -100 } : { yPercent: 120 }, 0)
        .set(split.lines, desktop ? { x: -50 } : { y: 60 }, 0)
        .set(chips, { yPercent: 100 }, 0)
        .to(win, { clipPath: inset(W0), duration: 2, ease: "expo.inOut" }, 1)
        .to(box, { ...frac(W0), duration: 2, ease: "expo.inOut", onUpdate: draw }, 1)
        .to(photoEl, { scale: 1, duration: 2, ease: "expo.inOut" }, 1)
        .to(text, { xPercent: 0, yPercent: 0, duration: 1, ease: desktop ? "power4.out" : "expo.out" }, 2)
        .to(split.lines, { x: 0, y: 0, duration: 1, stagger: desktop ? 0.1 : 0.07, ease: desktop ? "power4.out" : "expo.out" }, 2)
        .to(chips, { yPercent: 0, duration: 0.5, stagger: 0.04, ease: "expo.out" }, 2.3)

      function buildOut() {                               // §2.2
        gsap.timeline({
          defaults: { duration: 1, ease: desktop ? "power2.in" : "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top 1%", end: () => `+=${win.offsetHeight}`, scrub: 1, invalidateOnRefresh: true },
        })
          .fromTo(win, { clipPath: inset(W0) }, { clipPath: inset(W1) }, 0)
          .fromTo(box, frac(W0), { ...frac(W1), onUpdate: draw }, 0)
          .fromTo(chips, { xPercent: 0, autoAlpha: 1 }, { xPercent: 40, yPercent: -20, autoAlpha: 0 }, 0)
      }
      // start once the hero image has decoded (Daylight: onLoad / onMetadataLoaded, plus a 300 ms fallback)
      const img = root.current!.querySelector("img")
      const go = () => intro.play()
      img && !img.complete ? img.addEventListener("load", go, { once: true }) : gsap.delayedCall(0.3, go)
      return () => { lockScroll(false); split.revert() }
    })
    const onResize = () => draw()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, { scope: root })

  return (
    <section ref={root} className="relative isolate overflow-clip [clip-path:border-box]">
      <div className="hm-photo sticky top-0 h-svh w-full scale-110">{photo}</div>
      <div className="absolute inset-0 z-1 grid">
        <div className="hm-win sticky top-0 z-2 col-start-1 row-start-1 h-svh [clip-path:inset(0)]">{layer}</div>
        <div aria-hidden className="sticky top-0 z-1 col-start-1 row-start-1 h-svh">
          <div className="hm-line absolute -top-px h-px w-full bg-white/30" />
          <div className="hm-line absolute -right-px h-full w-px bg-white/30" />
          <div className="hm-line absolute -bottom-px h-px w-full bg-white/30" />
          <div className="hm-line absolute -left-px h-full w-px bg-white/30" />
        </div>
        <div className="sticky top-0 z-3 col-start-1 row-start-1 flex h-svh flex-col justify-end lg:justify-center">
          <div className="hm-text translate-y-[120%] lg:-translate-x-full lg:translate-y-0">{children}</div>
        </div>
      </div>
    </section>
  )
}
```

Put `hm-title` on the H1, and wrap each chip in
`<p class="relative overflow-clip"><span class="hm-chip relative inline-block">…</span></p>`.
That is Daylight's `R` mask helper, covered in §2.4.

**Softcom mapping: the Home hero** (full height, headline and two buttons over
an image). The colour layer should be Softcom's brand blue or a dither field.
The pixel page transition already ends on that blue ("every page change passes
through the same blue the hero ends on"), so the intro reads as the transition
continuing into the window.

Adjustments:

- Drop the Rive logo. If you want a mark, stroke the Softcom logo with DrawSVG,
  which is free in GSAP 3.13+.
- Keep the two buttons inside `hm-text` so they arrive with the headline.
- Subpage heroes should use a **short variant**: start at t = 0, not 1, so the
  clip runs 0 → 1.4 s; use no scroll lock; and skip the logo.
- Play the full version once per session only, gated by a `sessionStorage`
  flag. Daylight replays it on every full page load, which gets old on a site
  people navigate around.

---

### 2.2 Hero scroll-out (scrubbed)

**Where.** The same heroes, after the intro. Frames: `S/home-s00-700.png`,
`S/product-s00-800.png`.

**Mechanics** (built in `onComplete` of the intro, then rebuilt on resize with
progress kept):

```js
gsap.timeline({ paused: true,
  scrollTrigger: { trigger: containerRef, start: "top 1%", end: `+=${winRect.height}`, scrub: 1,
                   onUpdate: ({ progress }) => (saved.current = progress) },
  defaults: { duration: 1, ease: "power2.in" } });
// desktop
.fromTo(win,       { clipPath: () => inset(O) },  { clipPath: () => inset([35,20,35,72]), ease: "power2.in" }, 0)
.fromTo(lineState, fractions(O), { ...fractions([35,20,35,72]), autoAlpha: 0, ease: "power2.in" }, 0)
.fromTo(infoTop,   { xPercent: 0 }, { xPercent: 40 }, 0)
.fromTo(infoBottom,{ xPercent: 0, yPercent: 0 }, { xPercent: 40, yPercent: -40 }, 0)
.fromTo(".intro-info-right, .intro-info-right-bar",
        { xPercent: 0, yPercent: 0, scaleX: 1, autoAlpha: 1, overflow: "visible" },
        { xPercent: -40, yPercent: -20, scaleX: 0.6, autoAlpha: 0 }, 0)
.fromTo(".intro-info-right-bar-inner", { scaleX: 0.4 }, { scaleX: 1 }, 0)
// mobile: same targets, ease "power3.out"; infoTop/infoBottom/infoRight fade out in
// the first 0.4 (duration 0.4, ease none) with xPercent 35 / 30,-40 / -25
```

Corrections to the first-pass doc:

- The headline does **not** drift. The `xPercent: 40` belongs to the top chip
  list.
- `autoAlpha: 0` on `lineState` targets a plain proxy object, so the frame lines
  do **not** fade. They only travel. This looks like a bug **(inferred)**.

On top of the scrub, both the photo (`Parallax distance=200`) and the overlay
(`ScrollAnimation y=200`) translate `ratio × 200px`. The `offset [[0,0],[1,0]]`
makes ratio run 0 → 1 over the hero's height, so the hero leaves about 200 px
slower than the page.

| Scroll progress | Element | Property | From → to | Ease |
|---|---|---|---|---|
| 0 → 1 (top 1% → +1 svh) | window | clip-path | `30 15 30 67.15` → `35 20 35 72` | power2.in |
| 0 → 1 | frame lines | translate | follow the window | power2.in |
| 0 → 1 | top chips | xPercent | 0 → 40 | power2.in |
| 0 → 1 | bottom chip | x/yPercent | 0,0 → 40,−40 | power2.in |
| 0 → 1 | right chip and bar | x/yPercent, scaleX, autoAlpha | 0,0,1,1 → −40,−20,0.6,0 | power2.in |
| 0 → 1 | photo and overlay | translateY | 0 → 200 px | linear (rAF) |

**Recipe.** This is `buildOut()` in §2.1. For the photo lag, add:

```ts
gsap.to(".hm-photo", { y: 200, ease: "none",
  scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
```

**Softcom:** the Home hero. Keep `scrub: 1` and `power2.in`. The window
accelerating away as you leave is a large part of the feel.

---

### 2.3 Frame lines that track a clip window

**Where.** Hero (§2.1, white or beige lines) and diptychs (§2.13, always
`bg-white/30`). Frames: `F/home-late-14100.png`, where the lines run edge to
edge through the purple window.

**Mechanics.** Four 1px divs fill a sticky layer the same size as the clipped
element. They are translated by the current inset fraction times the layer size
(maths in §2.1). The window is clipped with `inset()` in percent, and the lines
are translated in px from the same fractions, so they always land exactly on the
window edges. Because each line spans the full layer, the window looks like a
cell cut out of a full-bleed grid. Daylight writes the lines every rAF while in
view. Writing them in `onUpdate` of the same tweens is equivalent.

**Softcom:** use this wherever there is a clip window: the hero, the closing CTA
panel and the heading/intro/image split. Line colour: `white/30` on photos, the
hairline token on light surfaces.

---

### 2.4 Masked chip and label rise (the `R` / `j` helper)

**Where.** Hero data chips (Home, Product, Partners, About) and the diptych
logo, subtitle and CTA.

**Mechanics.**

```jsx
const Mask = ({ as: T = "p", className, innerClassName, children }) =>
  <T className={cx("relative overflow-clip", className)}>
    <span className={cx("relative inline-block", innerClassName)}>{children}</span>
  </T>
// then: gsap.fromTo(".intro-info-top", { y: "100%" }, { y: "0%", duration: 0.5, ease: "expo.out", stagger: 0.04 })
```

A progress bar sits beside the chips. It is `.intro-info-right-bar`
(`h-10 w-100 origin-left bg-beige/40`) with an inner `scaleX(0)` fill.
`scaleX 0 → 1` then the inner `0 → 0.4` reads as "loading".

**Softcom mapping.**

- **Sector cards' tag chips:** apply this rise to the chips after the card
  lands, stagger 0.04.
- **Stats block:** small mono labels under each number.
- **Article rows:** date and category labels.

---

### 2.5 SplitText masked line rise (the house reveal)

**Where.**

- Home: How-it-works intro (`F/` n/a; `S/home-s03-2800.png`), Network
  (`F/home-late-12700.png`), diptych body.
- Product: every eyebrow and title (`.product-section-eyebrow/-title/-sub`).
- Product: Network text.
- Brand: every section.

**Mechanics** (`HowItWorksIntro`, module 1806):

```js
useGSAP(() => {
  new SplitText(".fb-surtitle", { type: "words, lines", mask: "lines", linesClass: "fb-surtitle-line", autoSplit: true,
    onSplit: (e) => gsap.fromTo(e.lines, { yPercent: 100 }, { yPercent: 0, duration: 0.4, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top center" } }) });
  new SplitText(".fb-title", { …, linesClass: "fb-title-line",
    onSplit: (e) => gsap.fromTo(e.lines, { yPercent: 100 }, { yPercent: 0, duration: 0.66, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top center" } }) });
  new SplitText(".fb-text", { …, linesClass: "fb-text-line",
    onSplit: (e) => gsap.fromTo(e.lines, { yPercent: 100 }, { yPercent: 0, duration: 0.66, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 35%" } }) });   // body waits until the section is well in
}, { scope: section, revertOnUpdate: true });
```

Variants:

| Where | Eyebrow | Title | Body | Trigger | toggleActions |
|---|---|---|---|---|---|
| Home HIW intro | 0.4 / 0.1 / power3.out | 0.66 / 0.15 | 0.66 / 0.15 | `top center`, body `top 35%` | default (play once) |
| Product sections | 0.4, `top 88%` | 0.66 / **0.12**, `top 88%` | `.product-section-sub`: `opacity 0, y 14 → 1, 0`, 0.65 power3.out, `top 90%` | | **`"play none none reverse"`** (re-hides when scrolling back above) |
| Product network text | 0.4 / 0.1 | 0.66 / 0.15 | 0.66 / 0.15 | `top 85%`, body `top 65%` | default |
| Home Network (`.nw-text`) | 0.8 / 0.1 / **power4.out** (all text) | | | `top 90%` | default |
| Diptych body | 0.8 / 0.1 / power4.out | | | `top 15%` desktop, `top center` mobile, `once: true` | |

Measured: `.nw-text-line` sits at `translateY(18px)` (a partial rise) before its
trigger at scroll 11,900, and at 0 after.

**Recipe.** One reusable component.

```tsx
"use client"
import * as React from "react"
import { gsap, SplitText, useGSAP, REDUCE } from "@/lib/motion"

type Props = { as?: React.ElementType; className?: string; children: React.ReactNode
  start?: string; duration?: number; stagger?: number; ease?: string; delay?: number
  trigger?: React.RefObject<HTMLElement | null>; reverse?: boolean }

export function SplitReveal({ as: Tag = "p", className, children, start = "top 85%", duration = 0.66,
  stagger = 0.15, ease = "power3.out", delay = 0, trigger, reverse = false }: Props) {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    const el = ref.current!
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      SplitText.create(el, {
        type: "words, lines", mask: "lines", linesClass: "split-line", autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.lines, { yPercent: 100 }, {
          yPercent: 0, duration, stagger, ease, delay,
          scrollTrigger: { trigger: trigger?.current ?? el, start,
            toggleActions: reverse ? "play none none reverse" : "play none none none" },
        }),
      })
    })
  }, { scope: ref })
  return <Tag ref={ref} className={className}>{children}</Tag>
}
```

```css
/* globals.css: keep descenders inside the mask */
.split-line { padding-bottom: 0.18em; margin-bottom: -0.18em; }
```

Use it as an eyebrow (`duration={0.4} stagger={0.1}`), a title (defaults) or
body copy (`start="top 70%"`). Pass a shared `trigger` ref so all three key off
the section, as Daylight does.

Above-the-fold headings need a FOUC guard: render with `invisible`, then
`gsap.set(el, { visibility: "visible" })` right before the `fromTo`, as
WhyDaylight does. Below-the-fold headings don't need one.

**Softcom mapping:**

- every section heading and eyebrow
- the two-column text section (left heading, right body with `start` 15% later)
- subpage heroes (title only)
- FAQ and timeline headings

Do **not** split long-form article body text. Use §2.20 for paragraphs.

---

### 2.6 Scrubbed statement lines (`FullscreenBannerMotion`)

**Where.** Home "Daylight is creating the power we all need…" over the aerial
sunset video. Frame: `F/home-late-11900.png`.

**Mechanics** (module 9770). One timeline scrubbed through the section; lines
are set to `yPercent: 100` inside `onSplit`.

```js
const tl = gsap.timeline({ paused: true,
  scrollTrigger: { trigger: section, start: "top 70%", end: "bottom 100%", scrub: 1, invalidateOnRefresh: true } });
const sur  = new SplitText(".fb-surtitle", { type: "words, lines", mask: "lines", linesClass: "fb-surtitle-line", onSplit: (s) => tl.set(s.lines, { yPercent: 100 }, 0) });
const head = new SplitText(".fb-title",    { …same, linesClass: "fb-title-line" });
const body = new SplitText(".fb-text",     { …same, linesClass: "fb-text-line" });
tl.to(sur.lines,  { yPercent: 0, duration: 0.25, stagger: 0.1,  ease: "power3.out" }, 0.001)
  .to(head.lines, { yPercent: 0, duration: 0.4,  stagger: 0.15, ease: "power3.out" }, 0.05)
  .to(body.lines, { yPercent: 0, duration: 0.4,  stagger: 0.1,  ease: "power3.out" }, 0.35);
// resize: tl.scrollTrigger.refresh()
```

| Timeline position | Element | yPercent | Dur | Stagger |
|---|---|---|---|---|
| 0.001 | eyebrow lines | 100 → 0 | 0.25 | 0.1 |
| 0.05 | title lines | 100 → 0 | 0.4 | 0.15 |
| 0.35 | body lines | 100 → 0 | 0.4 | 0.1 |

The scroll distance runs from the section top at 70% of the viewport to the
section bottom at the viewport bottom, which is about 0.7 vh for a 100 vh
section. Lines therefore rise **with the scroll**: drag back and they sink.

**Recipe.**

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia()
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
    const split = (sel: string) => SplitText.create(q(sel), { type: "words, lines", mask: "lines", linesClass: "split-line" })
    const [e, t, b] = [split(".st-eyebrow"), split(".st-title"), split(".st-body")]
    tl.from(e.lines, { yPercent: 100, duration: 0.25, stagger: 0.1,  ease: "power3.out" }, 0)
      .from(t.lines, { yPercent: 100, duration: 0.4,  stagger: 0.15, ease: "power3.out" }, 0.05)
      .from(b.lines, { yPercent: 100, duration: 0.4,  stagger: 0.1,  ease: "power3.out" }, 0.35)
  })
}, { scope: root })
```

Here `q = gsap.utils.selector(root)`. No `autoSplit`, because the timeline owns
the lines. Re-run on width change by passing `dependencies: [width]` together
with `revertOnUpdate: true`, or accept the split at load time.

**Softcom mapping: the long statement paragraph.** This is its natural home. If
the paragraph is longer than about 6 lines, raise the title stagger to 0.06 so
the last line lands before the section ends. Over a full-bleed image it also
fits the closing CTA panel.

---

### 2.7 USP rows: fixed text through clipped grid cells (`UspMotion`)

**Where.**

- Home §2 ("Save / Protect / Control"): `F/home-usp-{580,880,1230,1530,1880,2280}.png`.
- About §2 on black, with `white/20` rules: `S/about-s01-1600.png`.

This is the most "Daylight" effect on the site.

**DOM** (from `home.html`):

```html
<ul class="relative flex flex-col lg:pt-180 lg:pb-180
           before:span-w-6 before:margin-left-1 before:absolute before:inset-y-0 before:z-10 before:border-r lg:before:block
           after:span-w-6  after:margin-right-1 after:absolute after:inset-y-0 after:z-10 after:border-l lg:after:block">
  <li class="usp-item lg:grid lg:grid-cols-[calc(6*var(--column)+5*var(--gutter))_1fr_calc(6*var(--column)+5*var(--gutter))]
             lg:margin-px-1 lg:border-b lg:first:border-t">
    <div class="relative py-64 text-center lg:col-start-2 lg:row-start-1 lg:[clip-path:border-box]">   <!-- the cell -->
      <div class="usp-content-0 flex flex-col items-center justify-center gap-24 lg:fixed lg:inset-0">   <!-- fixed! -->
        <p class="usp-surtitle-0 overflow-clip font-mono text-12 uppercase lg:overflow-visible"><span class="usp-surtitle">save</span></p>
        <h2 class="usp-title-0 lg:*:!overflow-visible my-[-0.04em] py-[0.04em] text-35 lg:text-50">Cut your electric<br/>bill by 20% or more</h2>
      </div>
    </div>
    <figure class="relative overflow-clip lg:row-start-1 lg:col-start-3">   <!-- photo side alternates col 1 / col 3 -->
      <div class="usp-media-wrapper-0 span-w-8 lg:span-w-6 mx-auto h-full overflow-clip max-lg:aspect-[220/275]">
        <picture class="usp-media-0 block h-full w-full *:object-cover">…</picture>
      </div>
      <div class="usp-line-0-1 absolute top-0 h-full w-full border-t lg:hidden"></div>
      <div class="usp-line-0-2 absolute bottom-0 h-full w-full border-b lg:hidden"></div>
    </figure>
  </li>
  …
</ul>
```

**The trick.** The text block is `position: fixed; inset: 0`, so it is centred
on the **viewport**. Its parent cell has `clip-path: border-box`. Clip-path
clips descendants even when they are fixed, but unlike `transform` it does not
make itself their containing block. The text therefore stays still in the middle
of the screen, and you only see it through whichever row's centre cell is
currently passing behind it. Three rows mean three fixed layers stacked at the
same spot. A scrubbed timeline cross-fades them and drifts each one on `y`, so
as row 1's cell scrolls up, its text is wiped off by the cell edge while row 2's
fades in.

**Desktop timeline** (the dummy tween fixes the total length at 1.0, so
positions are fractions of scroll progress):

```js
gsap.timeline({ paused: true, scrollTrigger: { trigger: ul, start: "top 52%", end: "bottom 50%", scrub: true } })
  .to({}, { duration: 1 }, 0)
  .fromTo(".usp-content-0", { y: 150 }, { y: -50,  duration: 0.4, ease: "none" }, 0)
  .fromTo(".usp-content-1", { y: 50 },  { y: -150, duration: 0.4, ease: "none" }, 0.3)
  .fromTo(".usp-content-2", { y: -50 }, { y: -250, duration: 0.4, ease: "none" }, 0.6)
  .fromTo(".usp-content-0", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "power2.out" }, 0.06)
  .fromTo(surtitle.lines[0], { yPercent: 100 }, { yPercent: 0, duration: 0.15, ease: "power3.out" }, 0.06)
  .fromTo(title0.lines, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.15, ease: "power3.out", stagger: 0.012 }, 0.06)
  .to(".usp-content-0", { autoAlpha: 0, duration: 0.15, ease: "power2.in" }, 0.28)
  .fromTo(".usp-content-1", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "power2.out" }, 0.42)
  .fromTo(surtitle.lines[1], …, 0.42)
  .fromTo(title1.lines, { yPercent: 60, autoAlpha: 0 }, { …, duration: 0.2, stagger: 0.012 }, 0.42)
  .to(".usp-content-1", { autoAlpha: 0, duration: 0.15, ease: "power2.in" }, 0.57)
  .fromTo(".usp-content-2", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "power4.out" }, 0.72)
  .fromTo(surtitle.lines[2], …, 0.72)
  .fromTo(title2.lines, …, 0.72);
```

| Progress | Row 0 | Row 1 | Row 2 |
|---|---|---|---|
| 0.00–0.40 | y 150 → −50 (linear) | | |
| 0.06–0.21 | fade in, eyebrow and lines rise (60% → 0) | | |
| 0.28–0.43 | fade out (power2.in) | | |
| 0.30–0.70 | | y 50 → −150 | |
| 0.42–0.62 | | fade in, lines rise | |
| 0.57–0.72 | | fade out | |
| 0.60–1.00 | | | y −50 → −250 |
| 0.72–0.92 | | | fade in, stays |

Measured at 1440×900: at scroll 580 row 0 has `opacity .45` and `y 106`; at 880
it has `opacity 1` and `y 18`; at 1230 row 1 has `opacity .71` and `y −35`; at
1880 row 2 has `opacity 1` and `y −177`. All of these match the table.

**Mobile** (no fixed text; each row reveals itself, with a shared trigger per
item):

```js
gsap.fromTo(surtitle.lines[n], { yPercent: 100 }, { yPercent: 0, duration: 0.4,  ease: "expo.out", scrollTrigger: { trigger: item, start: "top 70%" } });
gsap.fromTo(title[n].lines,    { yPercent: 100 }, { yPercent: 0, duration: 0.66, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: item, start: "top 70%" } });
const st = { trigger: item, start: "top 60%" };
gsap.fromTo(`.usp-media-wrapper-${n}`, { clipPath: "inset(20% 0% 20% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", force3D: true, scrollTrigger: st });
gsap.fromTo(`.usp-media-${n}`, { scale: 1.8 }, { scale: 1, duration: 1.5, ease: "expo.out", force3D: true, scrollTrigger: st });
gsap.fromTo(`.usp-line-${n}-1`, { yPercent: 20 },  { yPercent: 0, duration: 1.5, ease: "expo.out", scrollTrigger: st });  // top rule slides up into place
gsap.fromTo(`.usp-line-${n}-2`, { yPercent: -20 }, { yPercent: 0, duration: 1.5, ease: "expo.out", scrollTrigger: st });  // bottom rule slides down
```

The mobile image reveal (clip `inset(20% 0)` opening while the picture
de-scales from 1.8, and the hairlines riding the clip edges) is the best cheap
**image reveal** on the site. Reuse it anywhere an image enters.

**Recipe** (desktop fixed-cell, generalised to N rows; mobile uses the image
reveal):

```tsx
useGSAP(() => {
  const q = gsap.utils.selector(root)
  const rows = q(".usp-content") as HTMLElement[]
  const n = rows.length
  const mm = gsap.matchMedia()
  mm.add({ desktop: DESKTOP, reduce: REDUCE }, (ctx) => {
    const { desktop, reduce } = ctx.conditions as Record<string, boolean>
    const titles = rows.map((r) => SplitText.create(r.querySelector("h2, h3")!, { type: "lines", linesClass: "usp-line" }))
    if (reduce) return
    if (desktop) {
      // Daylight's exact slots for n = 3; for other n, space DRIFT/IN evenly over 0..1 and keep OUT = IN + 0.22
      const DRIFT = [0, 0.3, 0.6], IN = [0.06, 0.42, 0.72], OUT = [0.28, 0.57]
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 52%", end: "bottom 50%", scrub: true } })
      tl.to({}, { duration: 1 }, 0)                       // fixes total length at 1, so positions = progress
      rows.forEach((row, i) => {
        tl.fromTo(row, { y: 150 - 100 * i }, { y: -50 - 100 * i, duration: 0.4, ease: "none" }, DRIFT[i])
          .fromTo(row, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: i === n - 1 ? "power4.out" : "power2.out" }, IN[i])
          .fromTo(titles[i].lines, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: i ? 0.2 : 0.15, stagger: 0.012, ease: "power3.out" }, IN[i])
        if (i < n - 1) tl.to(row, { autoAlpha: 0, duration: 0.15, ease: "power2.in" }, OUT[i])
      })
    } else {
      q(".usp-item").forEach((item, i) => {
        const st = { trigger: item, start: "top 60%" }
        gsap.fromTo(q(".usp-mediawrap")[i], { clipPath: "inset(20% 0% 20% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", scrollTrigger: st })
        gsap.fromTo(q(".usp-media")[i], { scale: 1.8 }, { scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger: st })
      })
    }
  })
}, { scope: root })
```

Required CSS: each centre cell gets `lg:[clip-path:border-box]`, and each
`.usp-content` gets `lg:fixed lg:inset-0 lg:flex lg:items-center lg:justify-center`.
Rows must be shorter than the viewport (Daylight's are about 510 px at 900 px tall).

Under reduced motion, drop `lg:fixed` with a `motion-reduce:lg:static` utility.
Otherwise all the fixed layers would stack on top of each other.

**Softcom mapping.**

- **The 3-column numbered card grid, as the flagship option.** Restructure it as
  three ruled rows: number and title fixed through the centre cell, with an
  image or illustration in an alternating side cell. Same content, far more
  presence.
- **Alternative:** the About values or principles list, or the timeline subpage.

---

### 2.8 Sticky stacked step cards with a fixed backdrop (`HowItWorksMotion`)

**Where.** Home "Steps 1–3": `F/home-hiw-{2700,3200,3477,3900,4500,5200,5800,6500,8100}.png`.

**DOM:**

```html
<div class="sticky top-0 z-1 h-lvh">…How-it-works intro (§2.14)…</div>      <!-- the intro is itself sticky -->
<div class="relative overflow-clip">                                         <!-- HowItWorksMotion root -->
  <div class="hiw-bg fixed inset-0 z-2 h-lvh w-full bg-beige opacity-0"></div>
  <ul class="relative z-3 flex flex-col gap-y-300 overflow-clip">
    <li class="hiw-item hiw-item-0 sticky top-0 h-[220lvh] px-6 pt-(--nav-height) pb-6 origin-top lg:margin-p-1">
      <article class="flex h-[calc(100lvh-2*var(--margin))] flex-col justify-center gap-48 overflow-clip rounded-md bg-beige-30 lg:span-pl-1-wide">
        …step copy… <div class="lg:absolute lg:top-0 lg:right-0 lg:left-1/2 lg:h-lvh lg:w-1/2">…visual…</div>
      </article>
    </li>
    <li class="hiw-item hiw-item-1 … origin-top">…</li>
    <li class="hiw-item hiw-item-2 … origin-center lg:origin-bottom">…</li>
  </ul>
</div>
```

**Why it stacks.**

- Each `li` is `sticky top-0` but **220 lvh tall**, with the card occupying only
  its top 100 lvh. A step therefore stays parked for about 1.2 vh of scroll plus
  the 300 px gap.
- The next `li` (later in the DOM, so painted on top) then slides up over it.
- The intro section above is also `sticky top-0 z-1`, so step 1 slides up over
  the intro photo too.

**Timeline:**

```js
gsap.timeline({ paused: true, scrollTrigger: { trigger: root, start: "top 35%", end: "bottom top", scrub: true } });
// desktop
.fromTo(".hiw-bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power4.out" }, 0)
items.forEach((_, i) => tl.fromTo(`.hiw-item-${i}`, { scale: 1, autoAlpha: 1 },
                                  { scale: 0.9, autoAlpha: 0, duration: 0.8, ease: "sine.in" }, i + 0.6));
// mobile: bg duration 0.5; scale to 0.7 at i + 0.8; the last item scales but does not fade
```

Measured:

| Scroll | `.hiw-bg` | `.hiw-item-0` | `.hiw-item-1` |
|---|---|---|---|
| 3,200 | opacity .28 | | |
| 3,477 | .97 | | |
| 4,500 | | scale .999, opacity .99 | |
| 5,200 | | scale .969, opacity .69 | |
| 5,800 | | scale .918, opacity .18 | |
| 6,500 | | scale .9, hidden | scale .999 |

The beige `fixed` backdrop fades in as the stack arrives, so whatever is behind
(the intro photo) turns into a flat surface for the cards.

**Recipe.**

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia()
  mm.add({ desktop: DESKTOP, reduce: REDUCE }, (ctx) => {
    const { desktop, reduce } = ctx.conditions as Record<string, boolean>
    if (reduce) return
    const items = gsap.utils.toArray<HTMLElement>(".stack-item", root.current)
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 35%", end: "bottom top", scrub: true } })
    tl.fromTo(".stack-bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: desktop ? 0.3 : 0.5, ease: "power4.out" }, 0)
    items.forEach((el, i) => tl.fromTo(el, { scale: 1, autoAlpha: 1 },
      { scale: desktop ? 0.9 : 0.7, autoAlpha: desktop || i < items.length - 1 ? 0 : 1, duration: 0.8, ease: "sine.in" }, i + (desktop ? 0.6 : 0.8)))
  })
}, { scope: root })
```

```html
<div ref={root} class="relative overflow-clip">
  <div class="stack-bg pointer-events-none fixed inset-0 z-2 bg-surface opacity-0"></div>
  <ul class="relative z-3 flex flex-col gap-y-[300px]">
    <li class="stack-item sticky top-0 h-[220lvh] origin-top px-6 pt-[var(--nav-height)]"><article class="h-[calc(100lvh-2*var(--margin))] rounded-md">…</article></li>
  </ul>
</div>
```

Caveat: the fixed backdrop stays at `opacity: 1` after the section. Daylight
relies on the next section painting over it **(inferred)**. In Softcom, either
give the next section a background and a stacking context, or fade the backdrop
out in the last 0.2 of the timeline.

**Softcom mapping.**

- **3-column numbered card grid ("how we work" steps), as the alternative to
  §2.7.** Each number becomes a full-viewport card, with Step 1-style visuals
  (§2.9) on the right.
- **Timeline subpage:** one card per era.
- On mobile it degrades to cards that shrink to 0.7 as the next one covers them.

---

### 2.9 Phone/app reveal from an icon (`Step1Motion`)

**Where.** Home Step 1, right half. Frames: `F/home-hiw-2700.png` (icon tile),
`F/home-hiw-3477.png` (opening), `F/home-hiw-3900.png` (open).

**Mechanics:**

```js
gsap.set(".step-logo", { scale: 3.1 });
const title = SplitText.create(".step-title", { type: "words, lines", mask: "lines", linesClass: "step-title-line",
  onSplit: (s) => gsap.set(s.lines, { yPercent: 100 }) });
// desktop
const tl = gsap.timeline({ paused: true,
  scrollTrigger: { trigger: visualWrapper, start: "top 50%", end: `+=${1.4 * innerHeight}`, scrub: true } });
tl.fromTo(phone, { clipPath: "inset(34.5% 12.29% 28% 12.29% round 1rem)" },
                 { clipPath: "inset(0% 0% 0% 0% round 1rem)", duration: 2, ease: "expo.inOut" }, 0)
  .fromTo(".step-logo", { y: "4.26rem", scale: 3.1 }, { y: "0rem", scale: 1, duration: 2, ease: "expo.inOut", force3D: true }, 0)
  .fromTo(title.lines, { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.2, ease: "power4.out" }, 0.8)
  .fromTo(".step-top",    { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power4.out" }, 1)
  .fromTo(".step-bottom", { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power4.out" }, 1.1)
  .fromTo(".step-bottom-rect", { xPercent: 0 }, { xPercent: 109, duration: 0.5, force3d: true, ease: "expo.inout" }, 1.35)   // sic
  .fromTo(".step-bottom-left",  { color: "#111111" }, { color: "#ffffff", duration: 0.1, ease: "power4.out" }, 1.45)
  .fromTo(".step-bottom-right", { color: "#ffffff" }, { color: "#111111", duration: 0.1, ease: "power4.in" }, 1.5);
// mobile: start "top 70%", the clip and logo use power4.out, title at 0.6 (dur 1.2), top 0.8, bottom 1.0, rect 1.3
```

The phone is `aspect-[175/380] max-h-[80lvh] overflow-hidden rounded-2xl`.

`"expo.inout"` and `"power4.inout"` are lowercase. GSAP registers `expo.inOut`,
so these probably fall through to CustomEase's parser and end up on a fallback
ease **(inferred)**. Use `expo.inOut`.

The clip measured `inset(34.5% 12.29% 28%)` at scroll 2,700, `32.1%…` at 3,477
and `0%` at 4,500.

| Position (of 2.0) | Element | Change | Ease |
|---|---|---|---|
| 0 → 2 | phone | clip from a centred tile to full | expo.inOut |
| 0 → 2 | logo | scale 3.1 → 1, y 4.26rem → 0 | expo.inOut |
| 0.8 → 1.8+ | title lines | rise, fade, stagger 0.2 | power4.out |
| 1.0 / 1.1 | status bar / bottom UI | yPercent 50 → 0, fade | power4.out |
| 1.35 → 1.85 | toggle pill | xPercent 0 → 109 | expo.inOut |
| 1.45 / 1.5 | labels | colours swap | |

**Recipe.** This is the §2.6 pattern with the table above as the tweens, plus a
trigger on the visual wrapper and `end: () => "+=" + innerHeight * 1.4`.

**Softcom mapping: any product or app moment**, for example a product subpage
showing a Softcom platform screen. The screen grows out of a brand-mark tile.
It also works for a single featured case study.

---

### 2.10 Scrubbed vector illustration (Rive `scrub`)

**Where.** Home Step 2 (isometric house; `F/home-hiw-5800.png`) and Home Network
map (`F/home-late-12700.png`, `F/home-late-13500.png`).

**Mechanics:**

```js
// Step2Motion
const tl = gsap.timeline({ paused: true, scrollTrigger: { trigger: wrap,
  start: innerWidth < 1024 ? "top 70%" : "top 25%", end: `+=${1.4 * innerHeight}`, scrub: true } });
tl.set(p, { current: 0 }, 0)
  .to(p, { current: 1.5, duration: 4, ease: "none", onUpdate: () => rive.scrub(p.current.toString()) }, 0);
// NetworkMotion: no end, so the default "bottom top"
gsap.fromTo(p, { current: 0 }, { current: 1.3, duration: 1, ease: "power3.out",
  onUpdate: () => rive.scrub(p.current.toString()),
  scrollTrigger: { trigger: section, start: "top center", scrub: true } });
```

**Softcom recipe** (no Rive needed): draw an SVG with **DrawSVGPlugin**, which
is free since 3.13, or with `stroke-dashoffset`.

```ts
gsap.registerPlugin(DrawSVGPlugin)
gsap.from(q(".net path"), { drawSVG: "0%", ease: "none", stagger: 0.05,
  scrollTrigger: { trigger: root.current, start: "top center", end: "+=120%", scrub: true } })
```

**Softcom mapping.**

- **Sector cards:** a small line illustration per sector draws as the grid
  enters. This fits the "Palantir subject art" figure style in memory.
- **Logo marquee** section header: a network of nodes.
- **Big stats block:** a map of countries served.

---

### 2.11 Scrubbed chart draw with a counter (`Step3Chart`)

**Where.** Home Step 3 ("Energy / Earnings" card).

**Mechanics:**

```js
gsap.set(clipRect, { attr: { width: 0 } }); gsap.set(ghostPath, { opacity: 0 }); gsap.set(todayLine, { opacity: 0 });
const n = { value: 0, percent: 0 };
gsap.timeline({ scrollTrigger: { trigger: card, start: innerWidth < 1024 ? "top 70%" : "top 25%", end: `+=${1.4 * innerHeight}`, scrub: true } })
  .to(clipRect, { attr: { width: 700 }, duration: 1, ease: "none" }, 0)          // <clipPath id="step3-reveal"><rect/></clipPath>
  .to(n, { value: 9.5, percent: 12.3, duration: 1, ease: "none",
           onUpdate: () => { valueEl.textContent = n.value.toFixed(1); pctEl.textContent = `${n.percent.toFixed(1)}%` } }, 0)
  .to(todayLine, { opacity: 1,   duration: 0.25, ease: "none" }, 0.45)
  .to(ghostPath, { opacity: 0.3, duration: 0.35, ease: "none" }, 0.55);
```

The SVG is `viewBox="0 0 700 320" preserveAspectRatio="none"` and the paths use
`vector-effect: non-scaling-stroke` with stroke-width 3. The curve is a
smoothed polyline. For each segment the control points are
`(x0 + 0.5Δx, y0)` and `(x1 − 0.5Δx, y1)`.

**Recipe** (counter only, for a stats block):

```ts
q(".stat-num").forEach((el) => {
  const to = Number(el.dataset.to), dp = Number(el.dataset.dp ?? 0), o = { v: 0 }
  gsap.to(o, { v: to, duration: 1.6, ease: "expo.out",
    onUpdate: () => (el.textContent = o.v.toLocaleString("en", { minimumFractionDigits: dp, maximumFractionDigits: dp })),
    scrollTrigger: { trigger: el, start: "top 85%", once: true } })
})
```

In reduced motion, set `el.textContent` to the final value. Server-render the
final value too and reset it to 0 only in the motion branch, so the number is
correct without JS.

**Softcom mapping: the big accent-colour stats block.** Count up on enter
(`once`). For a scroll-tied feel, use the scrubbed version (`scrub: true`,
`ease: "none"`) and pair it with a thin underline bar `scaleX 0 → 1`.

---

### 2.12 Statement over video: scale-in plus staircase lines (`WhyDaylight`)

**Where.** Home "Today's grid was built for yesterday's world" and "The risks".
Frame: `F/home-late-10400.png` (the first article leaving and the second
entering).

**Mechanics:**

```js
// first article only: the video grows into the frame
gsap.timeline({ scrollTrigger: { trigger: article0, end: "center center", scrub: true } })   // default start "top bottom"
  .fromTo(article0.querySelector(".js-video"), { scale: 0.8 }, { scale: 1, duration: 1, ease: "none" });
// desktop titles, on enter (not scrubbed)
const lines = layout === "left" ? [...article.querySelectorAll(".js-line")]                 // 3 manual <span class="block"> lines
                                : new SplitText(title, { type: "lines" }).lines;             // no mask
gsap.set(title, { visibility: "visible" });                                                  // was lg:invisible
gsap.timeline({ scrollTrigger: { trigger: article, start: "top center" } })
  .fromTo(lines, { xPercent: (i) => layout === "center" ? 0 : [-15, 15, -15][i] ?? -15,
                   yPercent: layout === "center" ? 150 : 0, autoAlpha: 0 },
                 { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out", stagger: 0.1 });
```

Each `article` is `grid h-(--screen-height-max) overflow-clip`, which is
`100lvh` on desktop. The background video is wrapped in
`Parallax distance={0.75} useViewportRatio` (±0.75 vh drift) with a 50%
overlay. Measured `.js-video` scale: 0.885 at 9,500 and 1 at 10,017.

In the `left` layout the three lines are aligned left, right and centre (a
"staircase"). Each slides in from the opposite side (−15%, +15%, −15%) and
fades in over a long 1.6 s expo.out.

**Recipe:**

```ts
gsap.fromTo(q(".stair-line"), { xPercent: (i) => (i % 2 ? 15 : -15), autoAlpha: 0 },
  { xPercent: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: root.current, start: "top center" } })
gsap.fromTo(q(".bg-media"), { scale: 0.8 }, { scale: 1, ease: "none",
  scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } })
```

**Softcom mapping.**

- **Closing image CTA panel (a strong option):** the image or video scales
  0.8 → 1 as it arrives and the CTA headline staircases in.
- **Long statement:** if it is split into 2–3 short sentences, staircase them.

---

### 2.13 Diptych with a scrubbed window and mouse parallax (`DiptychAnimatedMask` / `AboutDiptychSection`)

**Where.**

- Home "Step into Daylight" (purple): `F/home-late-14100.png`.
- About "A new kind of energy company" (yellow) and "Financing the electrified
  world" (blue, mirrored): `S/about-s05-4800.png`, `S/about-s06-5600.png`.
- Partners "The offer" (yellow, uses `AboutDiptychSection`): `S/partners-s04-4000.png`.

Live state on Partners and About: the window is at
`inset(7.5% 9.57% 65.8% 42.67%)` and the lines are at `translate(0, 67.5px)` and
similar (measured).

**DOM:**

```html
<section class="grid h-fit grid-cols-1 overflow-clip bg-purple lg:h-lvh lg:grid-cols-2">
  <div ref=textCol class="margin-px-1 flex flex-col justify-between py-48 lg:pt-65 lg:pb-60">
    <h2 class="font-serif text-40 lg:text-120 lg:leading-[1.22]">
      <Mask as="span" ref=titleLine[i] class="m-[-0.04em] inline-block w-full p-[0.04em]">Step into</Mask> …
    </h2>
    <Mask as="figure" ref=meta[0]>logo</Mask> <Mask as="h3" ref=meta[1]>THE FUTURE IS BRIGHT</Mask>
    <p ref=body>…</p> <Mask ref=meta[3]>CTA</Mask>
  </div>
  <div ref=mediaCol class="relative isolate overflow-clip" onMouseMove onMouseLeave>
    <Parallax distance={200} class="sticky top-0 h-475 w-full lg:h-lvh">{photo}</Parallax>
    <div class="absolute inset-0 z-1 grid">
      <div ref=win class="sticky top-0 z-2 h-475 will-change-[clip-path] lg:h-lvh" style="clip-path: inset(7.5% 9.57% 65.8% 42.67%)">{gradient video}</div>
      <div aria-hidden class="sticky top-0 z-1 h-475 lg:h-lvh">{4 × frame line, bg-white/30, will-change-transform}</div>
    </div>
  </div>
</section>
```

**Window keyframes** (module 6454; `[t, r, b, l]` %):

| | Desktop `ft` | Mobile `Ln` |
|---|---|---|
| k0 | `[7.5, 9.57, 65.8, 42.67]` (top right) | `[8.42, 10.6, 72.2, 41.3]` |
| k1 | `[31.6, 29.15, 39.3, 15.36]` (wide, middle) | `[37.68, 29.6, 40.42, 17.6]` |
| k2 | `[52.5, 16.33, 10.7, 46.9]` (bottom right) | `[54.52, 24.26, 9.86, 46.4]` |
| k3 | none | `[8.42, 10.6, 72.2, 41.3]` (back to k0) |

**Timeline** (`scrub: 0.5`, one second per keyframe hop):

```js
const tl = gsap.timeline({ paused: true, scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 25%", scrub: 0.5 } });
tl.set(state, k0, 0); tl.set(lineState, fractions(k0), 0);
keyframes.slice(1).forEach((k, i) => {
  tl.to(state, { top: k[0], right: k[1], bottom: k[2], left: k[3], duration: 1, ease: "sine.inOut" }, i)
    .to(win,   { clipPath: inset(k), duration: 1, ease: "sine.inOut" }, i)
    .to(lineState, { ...fractions(k), duration: 1, ease: "sine.inOut" }, i);
});
```

**Mouse parallax** (desktop ≥1024, runs every rAF while in view):

```js
onMouseMove: ({ clientX, clientY }) => {
  const nx = (clientX - mediaCol.left) / winW, ny = clientY / winH;
  const x = (nx - 0.5) * 50, y = (ny - 0.5) * 50;               // ±25 px
  target = { x, y, xPercent: x / winW * 100, yPercent: y / winH * 100 };
}
raf: cur = lerp(cur, target, 0.1);
  win.style.clipPath = `inset(${state.top + cur.yPercent}% ${state.right - cur.xPercent}% ${state.bottom - cur.yPercent}% ${state.left + cur.xPercent}%)`;
  lines: top/bottom translateY += cur.y, left/right translateX += cur.x
```

The window and its grid lines drift together toward the cursor while the photo
stays still.

**Text** (`once: true` everywhere):

| Element | From → to | Dur / stagger / ease | Trigger (text column) |
|---|---|---|---|
| title lines (Home) | yPercent 100 → 0 | 0.8 / 0.1 / power4.out | `top 75%` |
| logo, eyebrow, CTA (Home) | yPercent 100 → 0 | 0.8 / 0.1 / power4.out | `top 20%` desktop, `top center` mobile |
| body (SplitText words,lines, mask) | yPercent 100 → 0 | 0.8 / 0.1 / power4.out | `top 15%` desktop, `top center` mobile |
| whole text column (About/Partners) | yPercent 15, autoAlpha 0 → 0, 1 | 0.8 / power4.out | `top 75%` |

**Recipe:**

```tsx
const K = { desktop: [[7.5, 9.57, 65.8, 42.67], [31.6, 29.15, 39.3, 15.36], [52.5, 16.33, 10.7, 46.9]],
            mobile:  [[8.42, 10.6, 72.2, 41.3], [37.68, 29.6, 40.42, 17.6], [54.52, 24.26, 9.86, 46.4]] }

useGSAP(() => {
  const q = gsap.utils.selector(root)
  const win = q(".dp-win")[0] as HTMLElement, lines = q(".dp-line") as HTMLElement[]
  const s = { t: 0, r: 0, b: 0, l: 0 }, m = { x: 0, y: 0 }, mt = { x: 0, y: 0 }
  const paint = () => {
    const { width: W, height: H } = win.getBoundingClientRect()
    const xp = (m.x / W) * 100, yp = (m.y / H) * 100
    win.style.clipPath = `inset(${s.t + yp}% ${s.r - xp}% ${s.b - yp}% ${s.l + xp}%)`
    gsap.set(lines[0], { y: (s.t / 100) * H + m.y }); gsap.set(lines[1], { x: -(s.r / 100) * W + m.x })
    gsap.set(lines[2], { y: -(s.b / 100) * H + m.y }); gsap.set(lines[3], { x: (s.l / 100) * W + m.x })
  }
  const mm = gsap.matchMedia()
  mm.add({ desktop: DESKTOP, reduce: REDUCE }, (ctx) => {
    const { desktop, reduce } = ctx.conditions as Record<string, boolean>
    const ks = desktop ? K.desktop : K.mobile
    Object.assign(s, { t: ks[0][0], r: ks[0][1], b: ks[0][2], l: ks[0][3] }); paint()
    if (reduce) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 25%", scrub: 0.5 } })
    ks.slice(1).forEach((k, i) => tl.to(s, { t: k[0], r: k[1], b: k[2], l: k[3], duration: 1, ease: "sine.inOut", onUpdate: paint }, i))
    gsap.fromTo(q(".dp-text"), { yPercent: 15, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out",
      scrollTrigger: { trigger: q(".dp-text")[0], start: "top 75%", once: true } })
    if (!desktop) return
    const media = q(".dp-media")[0] as HTMLElement
    const onMove = (e: PointerEvent) => { const r = media.getBoundingClientRect()
      mt.x = ((e.clientX - r.left) / r.width - 0.5) * 50; mt.y = ((e.clientY - r.top) / r.height - 0.5) * 50 }
    const onLeave = () => { mt.x = 0; mt.y = 0 }                   // Daylight freezes in place on leave; recentring is nicer
    const tick = () => { m.x += (mt.x - m.x) * 0.1; m.y += (mt.y - m.y) * 0.1; paint() }
    media.addEventListener("pointermove", onMove); media.addEventListener("pointerleave", onLeave)
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); media.removeEventListener("pointermove", onMove); media.removeEventListener("pointerleave", onLeave) }
  })
}, { scope: root })
```

For performance, only tick while the section is in view: wrap `tick` in a
`ScrollTrigger.create({ trigger, onToggle })` guard.

**Softcom mapping.**

- **Closing image CTA panel (best fit):** the brand-colour window drifts over
  the photo with grid lines, with the CTA on the coloured half.
- **Heading+intro+image split section:** same component with a lighter window
  colour, or `window = null` to keep only the lines and parallax.
- **Two-column text section:** use only the text half's reveals.

---

### 2.14 Sticky intro with layered parallax (`HowItWorksIntro`)

**Where.** Home "A new way to power your home" (warm hands-and-sun photo).
Frame: `S/home-s03-2800.png`.

**Mechanics.**

- The wrapper is `sticky top-0 z-1 h-lvh`, so the section **does not scroll
  away**. The next section (the stack in §2.8) slides over it.
- The background is a `Parallax distance=200 scaleToFit` wrapper, with
  `lg:*:h-[calc(100lvh+300px)]`. A custom transform maps the ratio −1 → 1 to
  0 → −300 px (clamped).
- The text is a `ScrollAnimation` that maps the ratio 0 → 1 to 0 → −200 px.
- The text lines use the §2.5 reveal.

**Recipe:**

```ts
gsap.to(q(".intro-bg"), { y: -300, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } })
gsap.to(q(".intro-copy"), { y: -200, ease: "none", scrollTrigger: { trigger: root.current, start: "center center", end: "bottom top", scrub: true } })
```

```html
<section class="sticky top-0 z-0 h-lvh overflow-clip">…</section>
<section class="relative z-10">…next section slides over…</section>
```

**Softcom mapping: the heading+intro+image split section** in a "cover" variant,
where the image section sticks and the numbered cards slide up over it.
Subpage heroes can use the same "next section covers it" trick.

---

### 2.15 Scrubbed card rise (Product)

**Where.**

- Product hardware cards: `S/product-s02-2400.png`.
- "Pros" cards.
- Process cards over the canvas: `S/product-s07-6400.png`.
- Testimonials: `S/product-s09-8000.png`.

**Mechanics** (`ProductAnimations`):

```js
gsap.utils.toArray(".product-hw-card").forEach((el) =>
  gsap.fromTo(el, { opacity: 0, y: 48, scale: 0.94, transformOrigin: "bottom center" },
    { opacity: 1, y: 0, scale: 1, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", end: "top 38%", scrub: 0.8 } }));
// pros cards: y 40, scale 0.95, end "top 45%"
gsap.timeline({ scrollTrigger: { trigger: ".product-testimonials-grid", start: "top 88%", end: "top 25%", scrub: 0.8 } })
  .fromTo(".product-testimonial-card", { opacity: 0, y: 56, scale: 0.93, transformOrigin: "bottom center" },
           { opacity: 1, y: 0, scale: 1, ease: "power2.out", stagger: 0.14 });
// process cards: y 48, scale 0.94, grid trigger "top 88%" → "top 30%", stagger 0.14
```

**Recipe:**

```ts
gsap.timeline({ scrollTrigger: { trigger: grid, start: "top 88%", end: "top 30%", scrub: 0.8 } })
  .fromTo(q(".card"), { autoAlpha: 0, y: 48, scale: 0.94, transformOrigin: "50% 100%" },
           { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", stagger: 0.14 })
```

With a grid trigger, row-major order gives a left-to-right cascade. On mobile
(one column), use a per-card trigger instead, as the hardware cards do.

**Softcom mapping.**

- **3-column numbered card grid** (the simple version)
- **3-card sector grid**, followed by §2.4 on the tags
- **team and people grids**
- **job listing cards**

---

### 2.16 Row slide-in for tables and lists (Product comparison)

**Where.** Product "Daylight or cash purchase" table: `S/product-s05-4800.png`.

**Mechanics:**

```js
gsap.fromTo(".product-comparison-row", { opacity: 0, x: -10 },
  { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: "power3.out",
    scrollTrigger: { trigger: ".product-comparison-table", start: "top 85%", toggleActions: "play none none reverse" } });
```

**Recipe:** the same call, plus a hairline draw for ruled lists **(inferred
addition, in the spirit of the USP `usp-line` rules)**:

```ts
const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 85%" } })
tl.from(q(".row-rule"), { scaleX: 0, transformOrigin: "0 50%", duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0)
  .from(q(".row"), { autoAlpha: 0, x: -10, duration: 0.45, ease: "power3.out", stagger: 0.06 }, 0.1)
```

**Softcom mapping.**

- **Ruled list of article rows** (Home insights)
- **job listings**
- the **timeline** in compact form
- **licences or partners tables**

Add a hover on each row: the title gets an underline grow (§2.24), and an arrow
moves `x: 4` over 0.3 s expo.out.

---

### 2.17 Pinned horizontal track (Product "How Daylight works for you", vanilla)

**Where.** Product §2 (yellow): `S/product-s01-1600.png`. Desktop only; stacked
on mobile.

**Mechanics:**

```js
overflow = Math.max(0, track.scrollWidth - innerWidth);
section.style.height = `calc(100vh + ${1.5 * overflow}px)`;            // 1.5 px of scroll per px of travel
// <div style="position:sticky; top:0; height:100vh; overflow:hidden; display:flex; flex-direction:column; justify-content:center">
onScroll: p = clamp(-section.getBoundingClientRect().top / (section.offsetHeight - innerHeight), 0, 1);
          track.style.transform = `translateX(-${p * overflow}px)`;
```

**Recipe** (GSAP and sticky, no pin spacer):

```ts
const travel = () => track.scrollWidth - innerWidth
gsap.set(section, { height: () => innerHeight + travel() * 1.5 })
gsap.to(track, { x: () => -travel(), ease: "none",
  scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true,
                   onRefreshInit: () => gsap.set(section, { height: innerHeight + travel() * 1.5 }) } })
```

**Softcom mapping.**

- **Timeline subpage** (eras across)
- the **sector grid** if it grows past 3 items
- **case studies**

---

### 2.18 Scroll-driven image sequence (Product "A simple path to Daylight")

**Where.** Product §6: `S/product-s07-6400.png`.

**Mechanics.**

- 121 JPGs (`/frames/frame-0001.jpg` …) are preloaded into `Image` objects.
- The section is `calc(100vh + 2000px)` tall with a sticky 100vh stage holding a
  `<canvas>`.
- On scroll (rAF-throttled), the frame is
  `min(120, floor(121 * clamp((innerHeight - top) / height, 0, 1)))`. Note that
  this progress starts when the section **enters** the viewport, not when it
  pins.
- Each frame is drawn cover-fit: `scale = max(cw / iw, ch / ih)`, centred.
- If the first wheel event has `deltaMode !== 0` or `|deltaY| ≥ 80` (a coarse
  mouse wheel), the section is shortened to `+800px`.
- Mobile shows frame 1 as a static `<img>`.

**Softcom mapping:** optional. It needs a rendered sequence, for example a drone
pass over a Softcom deployment. Skip it unless such footage exists. The canvas
recipe is trivial, and the cost is in the asset.

---

### 2.19 FAQ accordion (Product, CSS only)

**Where.** Product FAQ: `S/product-s08-7200.png`.

**Mechanics:**

```js
// answer wrapper
{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)" }
//   > span { overflow: hidden } > answer
{ opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(-6px)",
  transition: "opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.05s" }
// index "01" colour → orange when open (0.2s); plus → minus: vertical bar transform: translate(-50%,-50%) scaleY(open ? 0 : 1) (0.3s)
```

Only one item is open at a time (`useState(0)` index). Rows are separated by
`1px solid rgba(76,40,6,.15)` borders.

**Softcom mapping: the FAQ subpage.** Copy as is with Tailwind:
`grid-rows-[0fr] data-[open]:grid-rows-[1fr] transition-[grid-template-rows] duration-350`.

---

### 2.20 `ScrollReveal` fade-up (IntersectionObserver, no GSAP)

**Where.** Product headers inside the horizontal and process sections, and a few
Brand blocks.

**Mechanics:**

```js
if (el.getBoundingClientRect().top < 0.95 * innerHeight) return;        // already visible: never hide it
el.style.opacity = "0"; el.style.transform = "translateY(20px)";
new IntersectionObserver(([e]) => { if (!e.isIntersecting) return;
  el.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
  el.style.opacity = "1"; el.style.transform = "translateY(0)"; io.disconnect(); }, { threshold: 0.1 }).observe(el);
```

The "already above 95% of the viewport" guard means nothing that is already
visible ever blinks.

**Softcom mapping.** This is the right tool for content you can't split nicely:

- **long-form article paragraphs**, figures and pull quotes
- **form fields** (stagger them with `delay = i * 0.05`)
- **footer columns**

Prefer it over GSAP on text-heavy subpages. It's cheaper and has no SplitText
reflow.

---

### 2.21 Logo marquee (About investors, vanilla rAF)

**Where.** About "Backed by the industry's leading investors": `S/about-s02-2400.png`.

**Mechanics:**

```js
const w = firstCopy.offsetWidth; let x = 0, last = 0, paused = false;
const loop = (t) => { if (!paused && last && (x -= 0.04 * (t - last)) <= -w) x += w;    // 0.04 px/ms = 40 px/s
                      last = t; track.style.transform = `translateX(${x}px)`; raf = requestAnimationFrame(loop) };
track.addEventListener("mouseenter", () => paused = true); track.addEventListener("mouseleave", () => paused = false);
```

The track holds the logo set twice. It pauses dead on hover.

**Recipe** (GSAP, with an eased pause):

```ts
const tween = gsap.to(q(".mq-track"), { xPercent: -50, ease: "none", duration: () => q(".mq-track")[0].scrollWidth / 2 / 40, repeat: -1 })
const slow = (to: number) => gsap.to(tween, { timeScale: to, duration: 0.6, ease: "power2.out", overwrite: true })
root.current!.addEventListener("pointerenter", () => slow(0)); root.current!.addEventListener("pointerleave", () => slow(1))
// reduce: tween.pause(0) and let the row wrap / scroll horizontally
```

**Softcom mapping: the logo marquee.** Use 40 px/s, a duplicated set,
`mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)`
for soft edges, and an eased pause on hover.

---

### 2.22 In-view video play/pause (About)

**Mechanics:**

```js
new IntersectionObserver(([e]) => e.isIntersecting ? video.play().catch(() => {}) : (video.pause(), video.currentTime = 0),
                         { threshold: 0.25 })
```

The video is 100svh and muted, with a glass "SOUND OFF/ON" pill.

**Softcom mapping:** any background video (hero, closing CTA). Combine it with
`preload="metadata"` and a poster.

---

### 2.23 Nav drop-in

**Mechanics.** The header starts at `-translate-y-[150%]`.

- Home: `gsap.to(nav, { y: 0, duration: 1.2, ease: "expo.out", force3D: true })`
  when `introPlayed` flips, about 2 s into the intro.
- Other routes: the same tween with `delay: 0.5`.

It never hides on scroll. Frame: `S/probe-hover-nav-product-150.png`.

**Softcom mapping:** the header. Tie it to the hero intro's lock release on Home
and to `delay: 0.5` elsewhere. Under reduced motion, render it in place.

---

### 2.24 Micro-interactions (CSS and ScrambleText)

**Rotated-fill button** (Tailwind classes from source):

```html
<a class="group relative inline-flex h-50 items-center overflow-hidden rounded-sm px-24 text-12 font-medium bg-black text-white
          duration-1000 hover:duration-100 ease-expo-out">
  <span class="relative z-2 transition-[transform,color] duration-300 ease-expo-out group-hover:-translate-y-1 group-hover:text-black">Label</span>
  <div class="absolute inset-0 origin-center translate-y-[200%] rotate-[15deg] scale-[1.8] rounded-lg bg-white
              transition-transform duration-1000 ease-expo-out group-hover:translate-y-0 group-hover:rotate-8"></div>
</a>
```

The Partners form submit uses a simpler fill:
`translate-y-full → 0, duration-500 ease-expo-out, bg-[#F66F00]`.

**Underline links:** `after:scale-x-0 hover:after:scale-x-100 after:origin-left`
over 500 ms expo-out.

The `solidUnderlined` variant uses two lines. The `before` line collapses to the
right (1000 ms, with a 75 ms delay when leaving hover) while the `after` line
grows from the left (1000 ms, `hover:delay-75`).

**Footer `[ LABEL ]` scramble:**

```js
onEnter: gsap.to(".btn-text", { duration: 0.5, scrambleText: label });
         gsap.to(".bracket-l", { x: 5,  duration: 0.4, ease: "expo.out" }); gsap.to(".bracket-r", { x: -5, duration: 0.4, ease: "expo.out" });
onLeave: gsap.to([".bracket-l", ".bracket-r"], { x: 0, duration: 0.4, ease: "power4.out" });
```

(`ScrambleTextPlugin` is free since 3.13.)

**Softcom mapping.**

- Every primary and secondary button gets the rotated fill.
- Footer links and the article-row "Read" link get the scramble with brackets.
- Inline links get the solid underline.

---

### 2.25 Not animated (so don't invent motion for them)

- **About:**
  - "The grid has… no master": static split-corner typography.
  - "The future is Bright": a static 600 px word cropped by the section edge.
  - CEO letter: canvas text laid out after `document.fonts.ready`, no motion.
  - Ghost "More / Power" words at 3% opacity: static.
- **Partners:**
  - "Why partners choose Daylight", the "Not all PPAs" comparison and the
    partner form are **all static**. A live probe found no pending reveal
    states on them.
  - Only the hero and "The offer" diptych move.
- **Product:** the "Your home supports a more reliable grid" video section
  animates only its text (§2.5).

---

## 3. Softcom section → effect map

| Softcom section | Primary effect | Secondary | Notes |
|---|---|---|---|
| Full-height hero (headline + 2 buttons over image) | §2.1 intro mask with frame lines | §2.2 scroll-out, §2.23 nav | Window = brand blue or dither, continuing the page transition. Full version once per session. |
| Long statement paragraph | §2.6 scrubbed lines | §2.12 staircase if ≤3 sentences | Scrub 1, start `top 70%`. Over an image, add the §2.12 scale-in. |
| Heading + intro + image split | §2.13 diptych (window, lines, mouse) | §2.14 sticky cover, §2.7 mobile image reveal | Lighter window colour so it doesn't compete with the hero |
| 3-column numbered card grid | §2.7 USP fixed-in-cell rows (flagship) | §2.8 sticky stack, or §2.15 card rise (simple) | Choose one. §2.7 needs a no-transform ancestor chain. |
| 3-card sector grid with tags | §2.15 scrubbed card rise | §2.4 tag chips, §2.10 line art | Stagger 0.14, scrub 0.8 |
| Logo marquee | §2.21 | | 40 px/s, eased hover pause |
| Big accent-colour stats block | §2.11 counter | §2.5 title, §2.4 labels | `once`, 1.6 s expo.out. Server-render final values. |
| Two-column text section | §2.5 SplitReveal on both columns | | Body starts about 15% later than the heading |
| Ruled list of article rows | §2.16 rows + rule draw | §2.24 hover | `toggleActions: "play none none reverse"` is optional |
| Closing image CTA panel | §2.13 diptych window, or §2.12 scale-in | §2.6 lines | Pick §2.13 if the split section doesn't already use it |
| Footer | §2.24 scramble links | §2.20 columns | |
| Page hero (subpages) | §2.1 short variant (no lock, clip 0 → 1.4 s) | §2.14 sticky cover | |
| Long-form article text | §2.20 ScrollReveal on blocks | §2.5 on H2s only | Never split body copy |
| Team / people grid | §2.15 | §2.7 mobile image reveal on portraits | |
| Job listings | §2.16 | §2.24 | |
| Forms | §2.20 staggered fields | §2.24 submit fill | |
| FAQ | §2.19 | §2.5 heading | |
| Timeline | §2.8 sticky stack, or §2.17 horizontal | §2.16 compact | |

---

## 4. Priority list: most Daylight feel for least complexity

1. **House reveal: SplitText masked line rise (§2.5).** One `SplitReveal`
   component with eyebrow, title and body presets (0.4/0.1, 0.66/0.15,
   power3.out) and the descender fix. It touches every section and it is the
   single biggest contributor to the feel. *Complexity: low.*
2. **Rotated-fill buttons, underline links and footer scramble (§2.24).** Pure
   CSS plus one ScrambleText call. You feel it on every hover. *Low.*
3. **Hero intro mask with frame lines (§2.1 to §2.2, without Rive).** The
   signature moment. It ties into the existing blue page transition. *Medium:
   one component, one session flag.*
4. **Scrubbed card rise (§2.15)** for the numbered, sector, team and job grids.
   Use `scrub: 0.8`, `scale 0.94`, `y 48` and `stagger 0.14`. *Low.*
5. **Image reveal: clip `inset(20% 0)` → 0 with scale 1.8 → 1, 1.5 s expo.out
   (§2.7 mobile), plus `Parallax distance 200` on large images (§1.8).** Apply
   it to every inline image. *Low.*
6. **Scrubbed statement lines (§2.6)** for the long paragraph. *Low.*
7. **Diptych window with sine scrub and mouse parallax (§2.13)** for the closing
   CTA panel. *Medium.*
8. **Row slide-in and rule draw (§2.16)** for the insights list and job
   listings. *Low.*
9. **Counter plus marquee (§2.11, §2.21).** Stats block and logos. *Low.*
10. **USP fixed-in-cell rows (§2.7 desktop) or the sticky step stack (§2.8)**
    for the numbered grid. This is the most distinctive scroll moment, but it
    needs careful layout and the no-transform rule. Build it last, once 1–9
    give the baseline. *Medium-high.*

Shared rules for all of them:

- Wrap every effect in `gsap.matchMedia()` with a `REDUCE` branch that sets
  final states.
- Desktop and mobile get separate choreography where Daylight has it (hero,
  USP, diptych).
- Use `once` or default toggle actions for reveals and `scrub` only for things
  that should feel physically tied to the scroll (hero exit, statement, window
  travel, stacks).
