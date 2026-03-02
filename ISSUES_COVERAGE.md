# lottie-react v3 — Issues Coverage Audit

**Date:** 2026-03-02
**Branch:** `v3`
**Issues audited:** 40 open GitHub issues (some with duplicate/related entries share a detailed section)

This document audits every open issue against the v3 codebase before stable release. Each issue is
classified by its resolution status, with a concrete proposed solution for anything not yet addressed.

---

## Summary Table

| # | Title | Status |
|---|-------|--------|
| [#15](#15) | Parse lottie json from network | ✅ Fixed |
| [#16](#16) | animationData shouldn't be required | ✅ Fixed |
| [#27](#27) | _(legacy placeholder)_ | ℹ️ N/A |
| [#33](#33) | Decrease bundle size via lottie light | ✅ Fixed |
| [#38](#38) | Change animation quality (setQuality) | ⚠️ Partial |
| [#40](#40) | Enabling Container param on useLottieInteractivity | ✅ Fixed |
| [#50](#50) | Interactive scroll animation stops (sticky) | ✅ Fixed |
| [#55](#55) | Change preserveAspectRatio property of SVG | ℹ️ N/A |
| [#56](#56) | Animation Hover Support | ✅ Fixed |
| [#67](#67) | Help with playSegments | ⚠️ Partial |
| [#69](#69) | Is chain mode available? | ✅ Fixed |
| [#71](#71) | Animation runs repeatedly in interactive mode with loop=false | ✅ Fixed |
| [#72](#72) | Change color of icon dynamically | ⚠️ Partial |
| [#73](#73) | How to set Speed? | ✅ Fixed |
| [#74](#74) | How to set className prop? | ✅ Fixed |
| [#83](#83) | Very high CPU usage (multiple animations) | ❌ Not Addressed |
| [#84](#84) | Change color of icon dynamically (duplicate) | ⚠️ Partial |
| [#87](#87) | How to set full width/height on resize | ℹ️ N/A |
| [#89](#89) | TS Definitions for SVG rendererSettings missing | ✅ Fixed |
| [#92](#92) | goToAndStop takes time position in seconds not frames | ✅ Fixed |
| [#94](#94) | Add support for dotLottie format | ❌ Not Addressed |
| [#96](#96) | Animation doesn't work inside a Modal | ✅ Fixed |
| [#98](#98) | Lottie React build failure (eval is deprecated) | ℹ️ N/A |
| [#101](#101) | SSR: document is not defined | ⚠️ Partial |
| [#107](#107) | Slow/janky in Safari | ❌ Not Addressed |
| [#108](#108) | Lottie disappears after Vite build | ❌ Not Addressed |
| [#109](#109) | Props renderer missing canvas property | ✅ Fixed |
| [#110](#110) | Custom container element (as prop) + validateDOMNesting warning | ❌ Not Addressed |
| [#115](#115) | Allow injecting SVG children | ❌ Not Addressed |
| [#117](#117) | Unique identifier conflict (setIDPrefix) | ❌ Not Addressed |
| [#119](#119) | How to use interactivity scroll in div scroll | ✅ Fixed |
| [#120](#120) | validateDOMNesting warning (duplicate of #110) | ❌ Not Addressed |
| [#122](#122) | Upgrade to support React v19 | ✅ Fixed |
| [#123](#123) | SSR: document is not defined (duplicate of #101) | ⚠️ Partial |
| [#124](#124) | lottie-react/light version | ✅ Fixed |
| [#125](#125) | Upgrade lottie-web dependency to ^5.13.0 | ✅ Fixed |
| [#126](#126) | Module not found with Next.js Turbopack | ❌ Not Addressed |
| [#127](#127) | Type error when passing canvas or html to renderer prop | ✅ Fixed |
| [#128](#128) | Lottie files in /public failing (URL as src) | ⚠️ Partial |
| [#129](#129) | Why are there two lottie libraries with the same name? | ℹ️ N/A |

---

## ✅ Fixed in v3 (19 issues)

---

### <a id="15"></a>#15 — Parse lottie json from network

**Link:** https://github.com/Gamote/lottie-react/issues/15

**Problem:** v2 only accepted a pre-loaded `animationData` object. There was no way to pass a URL and
have the library fetch and load the animation automatically.

**Status:** ✅ Fixed

`normalizeAnimationSource` in `src/hooks/useLottieFactory.tsx` accepts any non-empty string as a URL
path. When `src` is a string, the factory fetches it and passes the parsed JSON to lottie-web as
`animationData`. The `src` prop is the unified entry point for all animation sources.

---

### <a id="16"></a>#16 — animationData shouldn't be required

**Link:** https://github.com/Gamote/lottie-react/issues/16

**Problem:** v2 required `animationData` and had no URL loading support, forcing consumers to
manually fetch and parse animations before passing them to the component.

**Status:** ✅ Fixed

The v2 `animationData` prop is replaced by `src` (accepts `string | object`). Both URL strings and
inline JSON objects are accepted. Neither is required at mount time — the factory handles loading
state gracefully until data is available.

---

### <a id="33"></a>#33 — Decrease bundle size via lottie light

**Link:** https://github.com/Gamote/lottie-react/issues/33

**Problem:** lottie-web ships two builds: the full renderer (Canvas + SVG + HTML) and a lighter
SVG-only build. v2 only exposed the full renderer, adding ~150 KB to bundles that only needed SVG.

**Status:** ✅ Fixed

`LottieLight` component and `useLottieLight` hook are exported from the main entry point. Both use
`lottie-web/build/player/lottie_light` internally. Usage is identical to `Lottie` / `useLottie`.

---

### <a id="40"></a>#40 — Enabling Container param on useLottieInteractivity

**Link:** https://github.com/Gamote/lottie-react/issues/40

**Problem:** The interactivity hook's scroll mode had no way to specify which scrollable element to
observe — it always used the window, breaking layouts where the animation was inside a scrollable div.

**Status:** ✅ Fixed

`ScrollContainer` type (`"self" | "window" | HTMLElement | RefObject<HTMLElement | null>`) is
accepted on scroll-mode actions. `"self"` uses the animation's own container element; `"window"` uses
the viewport; an element ref targets any arbitrary scrollable ancestor.

---

### <a id="50"></a>#50 — Interactive scroll animation stops (sticky)

**Link:** https://github.com/Gamote/lottie-react/issues/50

**Problem:** When an animation is in a sticky-positioned container, the scroll listener tracked the
wrong element's scroll offset, causing the animation to freeze at a fixed frame.

**Status:** ✅ Fixed

Same fix as #40. The `container` option on scroll actions lets consumers specify the correct
scrollable ancestor (`"self"` / `"window"` / element ref). The scroll handler reads `.scrollTop`
from the specified container rather than always using `window.scrollY`.

---

### <a id="56"></a>#56 — Animation Hover Support

**Link:** https://github.com/Gamote/lottie-react/issues/56

**Problem:** v2 had no built-in hover interaction. Consumers had to wire up `onMouseEnter` /
`onMouseLeave` event handlers manually and call the ref API.

**Status:** ✅ Fixed

`hover` mode in `useLottieInteractivity` plays the animation on `mouseenter` and stops (or reverses)
on `mouseleave`. Configurable via `InteractivityActionType.play`, `.stop`, `.seek`, `.loop`.

---

### <a id="69"></a>#69 — Is chain mode available?

**Link:** https://github.com/Gamote/lottie-react/issues/69

**Problem:** v2 had no state-machine / chained segments mode. Consumers needed external state
management to sequence animation segments.

**Status:** ✅ Fixed

`chain` mode is fully implemented in `src/interactivity/modes/chain.ts`. Supports 9 transition
types via `ChainTransitionType`: `autoplay`, `click`, `hover`, `scroll`, `loop`, `loopOnce`,
`endFrame`, `startFrame`, and `custom`. Full example in `example/src/pages/Interactivity.tsx`.

---

### <a id="71"></a>#71 — Animation runs repeatedly in interactive mode with loop=false

**Link:** https://github.com/Gamote/lottie-react/issues/71

**Problem:** In scroll mode, once the scroll threshold was crossed the animation played, but on
re-crossing the threshold it played again — even when the consumer expected a single playthrough.

**Status:** ✅ Fixed

`InteractivityActionType.playOnce` in scroll mode plays the animation once and never replays it,
regardless of subsequent scroll events. The `played` flag is tracked per-action in scroll mode.

---

### <a id="73"></a>#73 — How to set Speed?

**Link:** https://github.com/Gamote/lottie-react/issues/73

**Problem:** v2 didn't document or expose a first-class speed API. Consumers had to know about
`animationItem.setSpeed()` on the underlying lottie-web instance.

**Status:** ✅ Fixed

`speed` is an option on `useLottie` / `useLottieLight` / `useLottieFactory` (applied on init via
`animationItem.setSpeed()`). `changeSpeed(speed)` is also exposed on the ref API for runtime
changes. Documented in the ref API section of the README.

---

### <a id="74"></a>#74 — How to set className prop?

**Link:** https://github.com/Gamote/lottie-react/issues/74

**Problem:** v2 had no `className` prop, making it awkward to style the animation container with
utility-class frameworks like Tailwind CSS.

**Status:** ✅ Fixed

`LottieProps` extends `React.HTMLAttributes<HTMLDivElement>` (via the `containerProps` spread), so
`className`, `style`, `id`, `aria-*`, and all other standard HTML div attributes are accepted
directly on `<Lottie>`. Needs a clear mention in documentation.

---

### <a id="89"></a>#89 — TS Definitions for SVG rendererSettings missing

**Link:** https://github.com/Gamote/lottie-react/issues/89

**Problem:** v2's `rendererSettings` prop was typed as `object`, giving no IntelliSense for SVG,
Canvas, or HTML renderer-specific configuration keys.

**Status:** ✅ Fixed

`rendererSettings` is typed as a discriminated union in `src/types/types.ts`:
`SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig`. TypeScript narrows the type based
on which `renderer` value is in scope, providing full IntelliSense for each renderer's specific options.

---

### <a id="92"></a>#92 — goToAndStop takes time position in seconds not frames

**Link:** https://github.com/Gamote/lottie-react/issues/92

**Problem:** lottie-web's `goToAndStop(value, isFrame)` defaults `isFrame` to `false`, meaning it
treats the value as a time-in-seconds. v2 passed values without the flag, causing unexpected
behavior when consumers expected frame-based positioning.

**Status:** ✅ Fixed

v3's `seek()` implementation always passes `true` as the second argument to `goToAndStop` and
`goToAndPlay`, ensuring frame-based positioning consistently. The `FrameSpecifier` type (number |
`"50%"` | marker name) is resolved to an absolute frame number before the call.

---

### <a id="96"></a>#96 — Animation doesn't work inside a Modal

**Link:** https://github.com/Gamote/lottie-react/issues/96

**Problem:** Modals render into portals — the DOM node doesn't exist at component mount time, so
`loadAnimation` was called with a `null` container and silently failed.

**Status:** ✅ Fixed

`useCallbackRef` in `src/hooks/useLottieFactory.tsx` uses a callback ref instead of `useRef`. When
React attaches the DOM node (even asynchronously, as with portals and modals), the callback fires
and triggers re-initialization of the animation with the now-valid container element.

---

### <a id="109"></a>#109 — Props renderer missing canvas property

**Link:** https://github.com/Gamote/lottie-react/issues/109

**Status:** ✅ Fixed

`LottieRenderer` const enum (`src/types/enums.ts`) exports `.svg`, `.canvas`, and `.html`. The
`renderer` prop on `LottieProps` is typed as `LottieRenderer` (which is `"svg" | "canvas" | "html"`
via the const+type pattern). All three values are valid and type-safe.

---

### <a id="119"></a>#119 — How to use interactivity scroll in div scroll

**Link:** https://github.com/Gamote/lottie-react/issues/119

**Status:** ✅ Fixed

Same as #40 and #50. The `container` option on scroll actions accepts `"self"` / `"window"` /
`HTMLElement` / `RefObject`. Pass a ref to the scrollable div as the container.

---

### <a id="122"></a>#122 — Upgrade to support React v19

**Link:** https://github.com/Gamote/lottie-react/issues/122

**Problem:** v2's `peerDependencies` capped React at `^18`, causing peer conflict warnings when
consumers upgraded to React 19.

**Status:** ✅ Fixed

`peerDependencies` in `package.json` is `"react": "^18.2.0 || ^19.0.0"`. The library has been
tested and runs cleanly with React 19. No breaking API changes were required.

---

### <a id="124"></a>#124 — lottie-react/light version

**Link:** https://github.com/Gamote/lottie-react/issues/124

**Problem:** There was no way to use only the SVG renderer from lottie-react without importing the
full lottie-web bundle.

**Status:** ✅ Fixed

`LottieLight` and `useLottieLight` are exported from the main `lottie-react` entry point. No
separate package or sub-path import is needed — import destructuring lets bundlers tree-shake the
unused full renderer.

---

### <a id="125"></a>#125 — Upgrade lottie-web dependency to ^5.13.0

**Link:** https://github.com/Gamote/lottie-react/issues/125

**Problem:** v2 pinned `lottie-web` to an older version range, preventing consumers from benefiting
from newer lottie-web features and bug fixes.

**Status:** ✅ Fixed

`package.json` specifies `"lottie-web": "^5.13.0"` in `dependencies`.

---

### <a id="127"></a>#127 — Type error when passing canvas or html to renderer prop

**Link:** https://github.com/Gamote/lottie-react/issues/127

**Status:** ✅ Fixed

Same fix as #109. `LottieRenderer.canvas` and `LottieRenderer.html` are valid enum members and
accepted by the `renderer` prop type. TypeScript no longer errors on non-`"svg"` renderer values.

---

## ⚠️ Partially Addressed (5 issues)

---

### <a id="38"></a>#38 — Change animation quality (setQuality)

**Link:** https://github.com/Gamote/lottie-react/issues/38

**Problem:** Consumers want to call lottie-web's `setQuality()` to trade render quality for
performance on complex SVG animations.

**Status:** ⚠️ Partial

**What's done:** `animationItem` is exposed on the ref (`lottieRef.current.animationItem`), so
consumers can call `lottieRef.current.animationItem?.setQuality(value)` directly.

**What's missing:** `setQuality` is not exposed as a first-class method on the ref API. There is no
`quality` initialization prop. The escape hatch via `animationItem` is not documented.

**Proposed solution:** Add `quality` to the options interface (`LottieOptions`) as
`quality?: number | "high" | "medium" | "low"`, apply it via `animationItem.setQuality()` on init,
and add `changeQuality(quality)` to the ref API. Document in the API reference.

---

### <a id="67"></a>#67 — Help with playSegments

**Link:** https://github.com/Gamote/lottie-react/issues/67

**Problem:** Consumers want to play specific frame ranges (segments) without using the full
interactivity system.

**Status:** ⚠️ Partial

**What's done:** `animationItem` is exposed on the ref, so `lottieRef.current.animationItem?.playSegments([startFrame, endFrame], forceFlag)` works.

**What's missing:** `playSegments` is not on the ref API directly. It is undiscoverable without
reading lottie-web docs. There is no `segments` prop for declarative usage.

**Proposed solution (action item #3):** Add `playSegments(segments, force?)` to
`UseLottieFactoryResult` and `UseLottieResult`. This is a thin wrapper over
`animationItem.playSegments()`. Also add a `segments` initialization option for declarative
playback.

---

### <a id="72"></a>#72 / <a id="84"></a>#84 — Change color of icon dynamically

**Links:** https://github.com/Gamote/lottie-react/issues/72 · https://github.com/Gamote/lottie-react/issues/84

**Problem:** Consumers want to swap animation fill colors at runtime (e.g., for theming or dark
mode) without maintaining separate animation files.

**Status:** ⚠️ Partial

**What's done:** `animationItem` is exposed on the ref, giving full access to the underlying
lottie-web instance. Runtime JSON manipulation (`animationItem.renderer.elements`) can achieve
color changes — this is an advanced but possible technique.

**What's missing:** There is no built-in `colorFilters` or `colorReplace` prop. The escape hatch is
complex and requires deep knowledge of lottie-web internals and the Lottie JSON schema.

**Proposed solution:** Document the `animationItem` escape hatch with a code example showing how to
patch colors via `animationItem.renderer.elements`. A first-class `colorFilters` prop would require
significant complexity (lottie JSON parsing) and is deferred post-v3 stable. Export
`LottiePlayer` / `LottieLightPlayer` (action item #1) to make the lottie-web instance importable at
app level for global configuration.

---

### <a id="101"></a>#101 / <a id="123"></a>#123 — SSR: document is not defined

**Links:** https://github.com/Gamote/lottie-react/issues/101 · https://github.com/Gamote/lottie-react/issues/123

**Problem:** When lottie-react is imported in a Next.js App Router Server Component or used without
`"use client"`, lottie-web calls `document.createElement` during module initialization and throws
`ReferenceError: document is not defined`.

**Status:** ⚠️ Partial

**What's done:** The `Player` component has SSR guards (`typeof window !== "undefined"` checks).
`normalizeAnimationSource` is SSR-safe (no DOM access). `loadAnimation` is deferred until a DOM
node is available via the callback ref.

**What's missing:** lottie-web itself calls `document.createElement` at import time, which runs
during SSR module evaluation — before any guards fire. Consumers in Next.js App Router still need
`"use client"` on any component that imports `lottie-react`, or use `next/dynamic` with
`{ ssr: false }`.

**Proposed solution (action item #4):** Add a clear SSR section to the README explaining:
1. Any component using `<Lottie>` or `useLottie` must be a Client Component (`"use client"`).
2. For true SSR avoidance: `const Lottie = dynamic(() => import('lottie-react'), { ssr: false })`.
3. This is a lottie-web constraint, not a lottie-react bug.

---

### <a id="128"></a>#128 — Lottie files in /public failing (URL as src)

**Link:** https://github.com/Gamote/lottie-react/issues/128

**Problem:** Consumers pass a relative path like `src="/lottie-files/nodata.json"` and the
animation fails to load — often due to base URL resolution or ambiguous relative paths in different
serving environments.

**Status:** ⚠️ Partial

**What's done:** `normalizeAnimationSource` now accepts any non-empty string as a URL, triggering a
`fetch()` request. The path `/lottie-files/nodata.json` will correctly resolve to the origin root.

**What's missing:** Consumers using ambiguous relative paths (e.g., `src="nodata.json"` without a
leading `/`) may still encounter issues depending on their server's base path configuration. Error
reporting when `fetch()` fails could be clearer. No Next.js-specific documentation example.

**Proposed solution:** Document clearly in the README that `src` should be an absolute path (e.g.,
`/lottie/animation.json`) or a full URL. Add a Next.js example showing how to place files in
`/public` and reference them. Improve the error logged when `normalizeAnimationSource` fetch fails.

---

## ❌ Not Addressed in v3 (8 issues)

---

### <a id="94"></a>#94 — Add support for dotLottie format

**Link:** https://github.com/Gamote/lottie-react/issues/94

**Problem:** `.lottie` files are a zip-based format (JSON + assets) that is smaller and more
portable than raw Lottie JSON. Growing ecosystem adoption. Not supported in v2 or v3.

**Status:** ❌ Not Addressed

**Proposed solution (P1 before stable release):**
1. In `normalizeAnimationSource`, detect `.lottie` extension (or content-type `application/zip`).
2. Fetch the file as `ArrayBuffer`.
3. Use [`fflate`](https://github.com/101arrowz/fflate) (3 KB gzipped, tree-shakable) to unzip.
4. Parse the inner `animations/` directory, extract the first JSON file.
5. Pass the parsed JSON to lottie-web as `animationData`.
6. Assets (images) stored in `images/` can be extracted as Blob URLs and injected into lottie-web's
   `assetsPath` or directly into the `animationData.assets` array.

This is already tracked as a P1 item in the v3 plan.

---

### <a id="110"></a>#110 / <a id="120"></a>#120 — Custom container element / validateDOMNesting warning

**Links:** https://github.com/Gamote/lottie-react/issues/110 · https://github.com/Gamote/lottie-react/issues/120

**Problem:** lottie-react always renders a `<div>` as the animation container. When placed inside a
`<p>`, `<button>`, `<span>`, or other inline elements, React emits a `validateDOMNesting` warning
because `<div>` is not a valid child. Consumers have no way to change the container element type.

**Status:** ❌ Not Addressed

**Proposed solution (action item #2):**
1. Add `as?: keyof JSX.IntrinsicElements` to `LottieProps` (default: `"div"`).
2. Thread `as` through `LottieHoc` → `useLottieFactory` → the rendered element via
   `React.createElement(as, containerProps, ...)`.
3. For `as="button"`, consumers can place Lottie inside a clickable element without DOM nesting
   warnings.

---

### <a id="115"></a>#115 — Allow injecting SVG children

**Link:** https://github.com/Gamote/lottie-react/issues/115

**Problem:** Consumers want to overlay elements (gradients, filters, custom paths) inside the SVG
that lottie-web renders, for visual effects not achievable through the animation data alone.

**Status:** ❌ Not Addressed

**Proposed solution:** Exposing the SVG element via a prop would require deep coupling to
lottie-web's internal renderer, which is undocumented and fragile. Instead, document the escape
hatch:

```ts
// After animation loads
const svgEl = lottieRef.current.animationItem?.renderer?.svgElement;
if (svgEl) {
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  // ... configure and append
  svgEl.appendChild(filter);
}
```

This uses the undocumented `renderer.svgElement` property (stable in practice since lottie-web
v5.x). Document this pattern in the advanced usage section. No library API change is needed.

---

### <a id="117"></a>#117 — Unique identifier conflict (setIDPrefix)

**Link:** https://github.com/Gamote/lottie-react/issues/117

**Problem:** lottie-web generates internal IDs for SVG `<defs>` elements (clip paths, gradients).
When multiple animations share the same source file, these IDs conflict and cause visual glitches.
lottie-web provides `setIDPrefix(prefix)` at the player level to namespace them, but the raw
lottie-web instance is not accessible from lottie-react.

**Status:** ❌ Not Addressed

**Proposed solution (action item #1):** Export the raw lottie-web instances from `src/index.ts`:

```ts
export { default as LottiePlayer } from 'lottie-web';
export { default as LottieLightPlayer } from 'lottie-web/build/player/lottie_light';
```

Consumers can then call `LottiePlayer.setIDPrefix('myapp-')` once at app startup. This mirrors v2's
`LottiePlayer` re-export pattern and also enables advanced use cases (#38, #84).

---

### <a id="126"></a>#126 — Module not found with Next.js Turbopack

**Link:** https://github.com/Gamote/lottie-react/issues/126

**Problem:** Next.js's Turbopack bundler uses a different module resolution algorithm than webpack
and may fail to resolve lottie-react's exports, especially the ESM build.

**Status:** ❌ Not Addressed

**Proposed solution (action item #5):**
1. Investigate whether the `exports` map in `package.json` is Turbopack-compatible (Turbopack
   supports `"exports"` as of Next.js 14.1+).
2. Ensure the `"default"` fallback in the `exports` map points to the CJS build (most compatible).
3. If still failing: add a `"module"` field to `package.json` pointing to the ESM build as a
   Turbopack hint.
4. Until confirmed fixed, document the known issue with workaround: disable Turbopack for dev
   (`next dev --no-turbopack`) or add a webpack alias in `next.config.js`.

This needs a reproduction before a definitive fix can be implemented.

---

### <a id="83"></a>#83 — Very high CPU usage (multiple animations)

**Link:** https://github.com/Gamote/lottie-react/issues/83

**Problem:** Running many lottie animations simultaneously causes high CPU usage and frame drops,
especially on lower-powered devices.

**Status:** ❌ Not Addressed

**Notes:** The CPU cost of SVG path computation and animation interpolation is a lottie-web concern,
not a lottie-react concern. v3 already eliminates a class of React re-renders per frame (frame
updates bypass state via DOM mutation). Further reduction requires changes to lottie-web itself.

**Proposed solution:** Document best practices in the README:
- Use `LottieLight` (SVG-only renderer, no expressions) for simpler animations.
- Use `renderer="canvas"` for complex animations — Canvas compositing is significantly faster than
  SVG for high element counts.
- Pause off-screen animations using the `IntersectionObserver`-based scroll interactivity mode.
- Reduce animation complexity in After Effects (fewer layers, expressions, effects).
- Limit simultaneous playing animations; pause/stop animations not in the viewport.

---

### <a id="107"></a>#107 — Slow/janky in Safari

**Link:** https://github.com/Gamote/lottie-react/issues/107

**Problem:** Safari's SVG rendering engine is significantly slower than Chrome/Firefox for complex
animated SVGs, causing visible jank even on Apple hardware.

**Status:** ❌ Not Addressed

**Notes:** This is a browser-level limitation in WebKit's SVG rendering pipeline, not a lottie-react
or lottie-web bug.

**Proposed solution:** Document in the README:
- Use `renderer="canvas"` — Safari's Canvas 2D performance is on-par with other browsers.
- Avoid large SVG animations (high layer count, many gradients) on Safari.
- Use `LottieLight` to reduce lottie-web's JS overhead.

---

### <a id="108"></a>#108 — Lottie disappears after Vite build

**Link:** https://github.com/Gamote/lottie-react/issues/108

**Problem:** Animations that work in Vite dev mode disappear after `vite build`. Suspected cause:
Vite's tree-shaker removes lottie-web side effects, or the UMD bundle's global registration is
dropped.

**Status:** ❌ Not Addressed — *likely fixed, needs verification*

**Proposed solution:** The v3 `exports` field in `package.json` points to proper ESM builds,
eliminating the UMD global registration path that Vite's bundler historically struggled with. This
is likely fixed by default in v3. Steps to verify:
1. Build the example app with Vite (`pnpm --filter lottie-react-example build`).
2. Preview the built output and confirm animations render.
3. If confirmed working, document as "fixed in v3" with a note about the root cause.
4. If still failing, add `lottie-web` to `optimizeDeps.exclude` in Vite config as a workaround.

---

## ℹ️ Not Applicable / Support Questions (7 issues)

---

### <a id="129"></a>#129 — Why are there two lottie libraries with the same name?

**Link:** https://github.com/Gamote/lottie-react/issues/129

**Problem:** Community confusion between `lottie-react` (this library, npm package
`lottie-react`) and `@lottiefiles/react-lottie-player` (a separate library by LottieFiles).

**Status:** ℹ️ Not Applicable

No code change required. Address in the README v3 rewrite:
- Add a clear project name, npm badge, and maintainer section at the top.
- Add a "vs. alternatives" or "which library?" section clarifying the difference.
- The two libraries have different APIs, bundle sizes, and feature sets.

---

### <a id="98"></a>#98 — Lottie React build failure (eval is deprecated)

**Link:** https://github.com/Gamote/lottie-react/issues/98

**Problem:** Some CSP (Content Security Policy) configurations block `eval()`, which older versions
of lottie-web used internally for expression parsing.

**Status:** ℹ️ Not Applicable

The `eval()` usage is inside lottie-web, not lottie-react. Fixed in lottie-web ≥ 5.12.0, which
added a CSP-compatible build mode. v3 depends on `"lottie-web": "^5.13.0"`, so this is resolved
transitively by the dependency upgrade (#125).

---

### <a id="87"></a>#87 — How to set full width/height on resize

**Link:** https://github.com/Gamote/lottie-react/issues/87

**Problem:** Consumer asked how to make the animation fill its container responsively.

**Status:** ℹ️ Not Applicable

This is a CSS usage question, not a library bug. Answer: pass `style={{ width: "100%", height: "100%" }}`
(or a `className` with equivalent CSS) directly to `<Lottie>`. The container div will then fill its
parent, and lottie-web's SVG scales with `preserveAspectRatio` (configurable via `rendererSettings`).
Document with a snippet in the "Styling" section of the README.

---

### <a id="55"></a>#55 — Change preserveAspectRatio property of SVG

**Link:** https://github.com/Gamote/lottie-react/issues/55

**Problem:** Consumer wanted to control how the SVG scales within the container (crop vs. letterbox
vs. stretch).

**Status:** ℹ️ Not Applicable

Supported via `rendererSettings.preserveAspectRatio` pass-through (standard lottie-web option).
Example: `<Lottie src={src} rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }} />`.
Document this in the `rendererSettings` API reference.

---

### <a id="27"></a>#27 — _(legacy placeholder)_

**Status:** ℹ️ Not Applicable

This issue number was included in the original audit list but does not correspond to a current open
issue. No action required.

---

## New Action Items for v3

The following gaps were identified during this audit and should be addressed before stable release:

| # | Action | Fixes |
|---|--------|-------|
| 1 | **Export `LottiePlayer` / `LottieLightPlayer`** from `src/index.ts` | #117, #38, #84 |
| 2 | **Add `as` prop** to `LottieProps` for custom container element type | #110, #120 |
| 3 | **Add `playSegments` to ref API** in `UseLottieFactoryResult` | #67 |
| 4 | **Document SSR usage** (Next.js App Router, `"use client"`, `dynamic`) | #101, #123 |
| 5 | **Investigate Turbopack compatibility** and document workaround | #126 |
| 6 | **dotLottie support** (`.lottie` format decompression via `fflate`) | #94 |

---

*Generated during v3 pre-release audit — 2026-03-02.*
