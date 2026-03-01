# lottie-react v3 — Comprehensive Plan

> **Date:** February 2026
> **Branch:** `v3`
> **Current version tag:** `3.0.0-beta.0`
> **Production (v2) version:** `2.4.1`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Where We Are Coming From (v2 Baseline)](#2-where-we-are-coming-from-v2-baseline)
3. [Current v3 Progress Audit](#3-current-v3-progress-audit)
4. [Existing Features (What We Already Have)](#4-existing-features-what-we-already-have)
5. [New Features to Add](#5-new-features-to-add)
6. [Core Functionality Assessment](#6-core-functionality-assessment)
7. [Player Assessment — Issues & Remediation](#7-player-assessment--issues--remediation)
8. [Interactivity API Design](#8-interactivity-api-design)
9. [Testing Strategy](#9-testing-strategy)
10. [Documentation & Website Plan](#10-documentation--website-plan)
11. [Files to Clean Up](#11-files-to-clean-up)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Competitive Landscape](#13-competitive-landscape)
14. [Progress](#14-progress)

---

## 1. Executive Summary

lottie-react v2 has **~79k dependents** and **~950 GitHub stars**. It is one of the most popular React wrappers for lottie-web. However, v2 has fundamental architectural limitations:

- **No tree-shaking** — importing `Lottie` pulls in the full 237 KB lottie-web bundle
- **No light version** — no way to use `lottie_light` (SVG-only, ~150 KB smaller)
- **Re-render storm** — frame updates cause React re-renders
- **No built-in Player** — no controls UI out of the box
- **Interactivity is clunky** — `useLottieInteractivity` requires wrapping in a div, doesn't compose well
- **No remote URL support** — must import JSON inline, can't point to a URL
- **Stale API** — `animationData` naming is verbose; `useLottie` returns `{ View }` which is unusual in React

The v3 rewrite addresses all of these. The core hook (`useLottieFactory`) and both components (`Lottie`, `LottieLight`) are already **substantially complete**. The Player UI is **80% complete** but has structural issues. Interactivity is **0% complete** (old code is entirely commented out). Testing is **0%** — no tests exist. Documentation is **incomplete** — README still shows v2 content.

**The path forward is clear:** fix the Player architecture, implement interactivity, add tests, clean up dead code, and ship.

---

## 2. Where We Are Coming From (v2 Baseline)

### v2 Exports
| Export | Type | Description |
|--------|------|-------------|
| `Lottie` | Component (default) | Renders animation, accepts div HTML props |
| `useLottie` | Hook | Returns `{ View, play, stop, pause, ... }` |
| `useLottieInteractivity` | Hook | Scroll/cursor-driven animation control |
| `LottiePlayer` | Re-export | The raw lottie-web instance |
| Types | `LottieOptions`, `LottieComponentProps`, `LottieRefCurrentProps`, `Action`, etc. |

### v2 API Surface (Lottie Component)
```tsx
<Lottie
  animationData={json}         // Required — JSON object only, no URL
  loop={true}                  // boolean | number
  autoplay={true}              // boolean
  initialSegment={[0, 60]}     // [start, end]
  style={{ width: 300 }}       // CSSProperties
  lottieRef={ref}              // MutableRefObject
  // Event callbacks:
  onComplete, onLoopComplete, onEnterFrame, onSegmentStart,
  onConfigReady, onDataReady, onDataFailed, onLoadedImages,
  onDOMLoaded, onDestroy
  // Plus all HTMLDivElement props (className, id, onClick, etc.)
/>
```

### v2 Ref Methods (via `lottieRef`)
`play()`, `stop()`, `pause()`, `setSpeed()`, `goToAndStop()`, `goToAndPlay()`, `setDirection()`, `playSegments()`, `setSubframe()`, `getDuration()`, `destroy()`, `animationContainerRef`, `animationLoaded`, `animationItem`

### v2 Interactivity
```tsx
const lottieObj = useLottie(options);
const Interactivity = useLottieInteractivity({
  lottieObj,
  mode: "scroll" | "cursor",
  actions: [{ type: "seek", frames: [0, 100], visibility: [0, 1] }]
});
return Interactivity; // Returns a ReactElement wrapping the animation
```

### v2 Limitations
1. No tree-shaking (barrel exports, full lottie-web always bundled)
2. No lottie-light variant
3. Frame updates cause React re-renders (performance problem)
4. No Player/controls component
5. Interactivity requires awkward wrapping pattern
6. No remote URL animation loading
7. No TypeScript strict mode
8. Monolithic — everything imported together
9. Event callbacks are props (not subscriptions — causes re-renders)
10. `useLottie` returns `{ View }` which is non-standard React pattern

---

## 3. Current v3 Progress Audit

### What's Done (Working)
| Feature | Status | Files |
|---------|--------|-------|
| `useLottieFactory` hook | **Complete** | `src/hooks/useLottieFactory.tsx` |
| `Lottie` component (full) | **Complete** | `src/components/Lottie.tsx` |
| `LottieLight` component | **Complete** | `src/components/LottieLight.tsx` |
| HOC pattern (`lottieHoc`) | **Complete** | `src/components/lottieHoc.tsx` |
| Subscription system | **Functional** (needs improvement) | `src/utils/SubscriptionManager.ts` |
| Normalize animation source | **Complete** | `src/utils/normalizeAnimationSource.ts` |
| State management with previous | **Complete** | `src/hooks/useStateWithPrevious.ts` |
| Callback ref hook | **Complete** | `src/hooks/useCallbackRef.ts` |
| Logger utility | **Complete** | `src/utils/logger.ts` |
| Type system (enums, types) | **Complete** | `src/@types/` |
| Rollup build config | **Complete** | `rollup.config.mts` |
| ESLint + Prettier | **Complete** | Config files |
| Example app (Next.js) | **Functional** | `example/` |
| Player — Basic layout | **Functional** | `src/externals/player/Player.tsx` |
| Player — All buttons | **Complete** | `src/externals/player/components/PlayerButtons.tsx` |
| Player — Progress bar | **Functional** | `src/externals/player/components/ProgressBar.tsx` |
| Player — Frame indicator | **Complete** | `src/externals/player/components/FrameIndicator.tsx` |
| Player — Theme system | **Complete** | `src/externals/player/utils/PlayerTheme.ts` |
| Player — Fullscreen | **Complete** | `src/externals/player/utils/useFullscreen.ts` |
| Player — Loading overlay | **Functional** (with issues) | `src/externals/player/components/LoadingOverlay.tsx` |
| Player — Icons (SVG) | **Complete** | `src/externals/player/components/PlayerIcons.tsx` |

### What's Not Done
| Feature | Status | Notes |
|---------|--------|-------|
| Interactivity API | **Not started** | Old code commented out in `src/old/` |
| Tests | **Not started** | `"test": "echo TBI"` |
| README / Documentation | **Not started** | Still shows v2 content |
| Website/docs redesign | **Not started** | Current site at lottiereact.com is v2 |
| dotLottie support | **Not started** | Tracked in GitHub issue #94 |
| Keyboard shortcuts (Player) | **Not implemented** | Tooltips hint at `k`, `l`, `f` shortcuts |
| Audio factory support | **Not started** | TODO in types |
| `initialSegment` dynamic changes | **Not started** | Commented out in useLottieFactory |
| Clean API exports | **Partial** | Player internals are exported |

### What's Broken / Problematic
| Issue | Severity | Location |
|-------|----------|----------|
| Player/HOC responsibility confusion | **High** | `lottieHoc.tsx` + `Player.tsx` |
| Dual `controls` + `player` props on Lottie | **High** | `@types/types.ts` LottieProps |
| Two duplicate `useFade` hooks | **Medium** | `src/hooks/useFade.ts` + `src/externals/player/utils/useFade.ts` |
| SubscriptionManager uses Node EventEmitter | **Medium** | `src/utils/SubscriptionManager.ts` |
| @ts-ignore directives in SubscriptionManager | **Medium** | Lines 30, 52, 74 |
| Loading overlay commented out in examples | **Medium** | `PlayerV3Example.tsx:43-46` |
| `normalizeAnimationSource` too restrictive | **Medium** | Only checks `.json` suffix |
| Logger always active in production | **Low** | `src/utils/logger.ts` |
| FrameIndicator causes re-renders via useState | **Low** | `FrameIndicator.tsx:26` |
| `controls` prop on LottieProps is dead code | **Low** | Never wired to anything |

---

## 4. Existing Features (What We Already Have)

### Core
- [x] **Lottie component** — drop-in animation component
- [x] **LottieLight component** — SVG-only renderer (smaller bundle)
- [x] **URL animation source** — pass a string URL (`.json`) as `src`
- [x] **Object animation source** — pass a JSON object as `src`
- [x] **Subscription-based events** — `frame`, `complete`, `loopComplete`, `ready`, `play`, `pause`, `stop`, `failure`, `newState`
- [x] **State machine** — `Loading`, `Playing`, `Paused`, `Stopped`, `Frozen`, `Failure`
- [x] **Imperative API via ref** — `play()`, `pause()`, `stop()`, `toggleLoop()`, `changeDirection()`, `changeSpeed()`, `seek()`
- [x] **`animationItem` access** — raw lottie-web instance exposed via ref
- [x] **Multiple renderers** — SVG, Canvas, HTML (full version only)
- [x] **Renderer settings** — pass through to lottie-web
- [x] **Direction control** — forward/reverse
- [x] **Speed control** — arbitrary playback speed
- [x] **Loop control** — boolean or loop count
- [x] **Autoplay** — play on mount
- [x] **Initial segment** — define start/end frame range
- [x] **Assets path** — custom path for external assets
- [x] **Enable reinitialize** — react to prop changes dynamically
- [x] **Debug mode** — logger with `[lottie-react]` prefix

### Player
- [x] **Play/Pause button**
- [x] **Stop button**
- [x] **Progress bar** — drag to seek, subscription-based (no re-renders)
- [x] **Frame indicator** — current/total frame display
- [x] **Loop toggle** — on/off
- [x] **Direction toggle** — forward/reverse
- [x] **Speed selector** — dropdown with configurable presets
- [x] **Fullscreen** — vendor-prefixed support
- [x] **Theme system** — colors, sizing, spacing, effects
- [x] **Responsive** — breakpoint-based, mobile hide rules
- [x] **Loading overlay** — with spinner, minimum display time, fade out
- [x] **Error overlay** — custom error content
- [x] **Accessibility** — ARIA labels, keyboard focus, semantic buttons

### Build
- [x] **ESM output**
- [x] **CJS output**
- [x] **Minified variants** (`.min.js`)
- [x] **TypeScript declarations** (`.d.ts`)
- [x] **External dependencies** — lottie-web and react not bundled
- [x] **Source maps** — for minified builds

---

## 5. New Features to Add

### Must Have (v3.0)
| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Interactivity API** | P0 | High | Scroll and cursor-driven animation control |
| **Test suite** | P0 | High | Unit + integration tests |
| **Clean public API** | P0 | Medium | Remove internal exports, finalize prop names |
| **README rewrite** | P0 | Medium | Complete documentation of v3 API |
| **`useLottie` hook** | P0 | Low | Consumer-facing hook (wraps `useLottieFactory`) |
| **dotLottie support** | P1 | Medium | `.lottie` file format support |
| **Remote URL support (non-.json)** | P1 | Low | Support `.lottie`, arbitrary URLs |
| **Keyboard shortcuts** | P1 | Low | `k`=play/pause, `l`=loop, `f`=fullscreen in Player |
| **SSR safety** | P1 | Low | Ensure no crashes in SSR/RSC environments |

### Nice to Have (v3.1+)
| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Audio factory** | P2 | Medium | Sound support for animations with audio |
| **Marker support** | P2 | Medium | Named markers for segment navigation |
| **`onReady` callback prop** | P2 | Low | Convenience prop (sugar over subscriptions) |
| **Compound component pattern** | P2 | Medium | `<Lottie.Player>`, `<Lottie.Controls>` |
| **CSS class API** | P2 | Low | `classNames` prop for styling hooks |
| **`playSegments` API** | P2 | Low | Expose on ref |
| **Dynamic renderer switching** | P3 | High | Switch between SVG/Canvas at runtime |
| **Animation preloading** | P3 | Medium | Prefetch JSON before mount |
| **Multi-animation Player** | P3 | High | Playlist/sequence support |

---

## 6. Core Functionality Assessment

### `useLottieFactory` (`src/hooks/useLottieFactory.tsx` — 557 lines)

This is the heart of the library. It's **well-structured** overall but has several issues:

#### Issues to Fix

**1. SubscriptionManager uses Node's `EventEmitter` (CRITICAL)**
```
src/utils/SubscriptionManager.ts:1
import { EventEmitter } from "events";
```
- `EventEmitter` is a Node.js built-in. It adds ~13 KB polyfill to the browser bundle.
- **Fix:** Replace with a tiny custom implementation (~30 lines). The SubscriptionManager only uses `.on()`, `.off()`, and `.emit()`.

**2. SubscriptionManager has @ts-ignore directives (HIGH)**
- 3 `@ts-ignore` comments bypass type safety for the core event system.
- **Fix:** Use a properly typed `Map<string, Set<Function>>` approach.

**3. `eslint-disable-next-line react-hooks/exhaustive-deps` on initialization effect (MEDIUM)**
```tsx
// Line 282 — dependency on containerRef.current + src
[containerRef.current, src]
```
- This works but is fragile. The comment says "DON'T CHANGE" which signals a footgun.
- **Assessment:** This is actually correct behavior — we intentionally reinitialize when the container or source changes. The `eslint-disable` is justified here but should have a better comment explaining _why_.

**4. Subscription re-registration bug (MEDIUM)**
```tsx
// Line 392 — TODO(fix)
// This gets triggered every time the options change, no matter if
// the subscriptions are the same
```
- The `isEqual` check (`react-fast-compare`) tries to deep-compare functions, which always returns `false` for new function references.
- **Fix:** Use `useRef` to store subscriptions and compare by reference identity, or use `useCallback`/stable references pattern.

**5. `stateBeforeSeeking` in seek closure (MEDIUM)**
- `seek` depends on `stateBeforeSeeking` state which creates a new callback on every seek state change. This is generally fine but could cause stale closure issues.
- **Fix:** Use a ref for `stateBeforeSeeking` instead of state.

**6. Commented-out segment handling (LOW)**
```tsx
// Lines 353-383 — TODO: handle initialSegment change
```
- Dynamic segment changes are not implemented.
- **Decision needed:** Implement for v3.0 or defer to v3.1?

**7. Logger always active (LOW)**
```tsx
// src/utils/logger.ts — isLoggerActive defaults to true
let isLoggerActive = true;
```
- In production, consumers will see `[lottie-react] 🪄 Trying to (re)initialize...` in their console.
- **Fix:** Default to `false`. Only enable when `debug: true` is passed as an option. The `debug` prop already exists in `UseLottieFactoryOptions` but is never connected to the logger.

**8. `normalizeAnimationSource` is too restrictive (LOW)**
```tsx
// Only checks for .json suffix for string URLs
if (source && typeof source === "string" && source.endsWith(".json")) {
```
- Fails for URLs like `https://example.com/animation` (no extension), `.lottie` files, or URLs with query parameters (`animation.json?v=2`).
- **Fix:** Treat any non-empty string as a path (let lottie-web handle validation).

### `useCallbackRef` (`src/hooks/useCallbackRef.ts`)
- Uses `useState` to store a DOM node, which triggers re-render on mount. This is correct and intentional — it's how the factory knows the container is ready.
- The TODO asking "can't we just use useState?" is already answered: this IS useState, wrapped with a callback setter.
- **Verdict:** Keep as-is, remove the TODO.

### `useStateWithPrevious` (`src/hooks/useStateWithPrevious.ts`)
- Clean implementation. Uses `useNonReactiveState` to remember previous value without re-render.
- **Verdict:** Keep as-is.

### `useNonReactiveState` (`src/hooks/useNonReactiveState.ts`)
- Simple ref-based "state" that doesn't trigger renders. Used correctly.
- **Verdict:** Keep as-is.

### `getNumberFromNumberOrPercentage` (`src/utils/getNumberFromNumberOrPercentage.ts`)
- Parses `"50%"` or `42` for seek operations. Clean utility.
- **Verdict:** Keep as-is.

### Overall Core Verdict
The core is **solid**. The main work items are:
1. Replace `EventEmitter` with custom implementation
2. Fix SubscriptionManager type safety
3. Connect `debug` prop to logger
4. Fix subscription re-registration bug
5. Improve `normalizeAnimationSource` for broader URL support

---

## 7. Player Assessment — Issues & Remediation

The Player is the area with the most issues. Here's a comprehensive breakdown:

### Issue 1: Architecture / Responsibility Confusion (CRITICAL)

**The Problem:**
The `lottieHoc` creates an `ExternalPlayer` and passes it the animation container ref. The Player then renders a `<Display ref={ref} />` which is just an empty div that lottie-web renders into. But the Player also wraps this with controls, overlays, etc. The HOC does **all the state conversion** from internal types (`LottieState`, `Direction`) to Player types (`PlayerState`, `1 | -1`).

This creates a confusing situation:
- `LottieProps` has both `controls?: boolean | PlayerControlsElement[]` AND `player?: PlayerConfig`
- The `controls` prop on `LottieProps` is **dead code** — it's never passed to anything
- The `PlayerConfig` type in `@types/types.ts` duplicates the `PlayerConfig` in `externals/player/types.ts`
- The Player has its own `PlayerActions` interface that differs from the ref API (`seek(frame, isDraggingEnded)` vs `seek(value, isSeekingEnded)`)

**The Fix:**
1. Remove the dead `controls` prop from `LottieProps`
2. Remove `PlayerControlsElement` enum (replaced by `PlayerElements` interface)
3. The Player should be a pure presentation component — the HOC correctly adapts the API
4. Clean up the dual `PlayerConfig` types (keep only the one in `externals/player/types.ts`)
5. Rename `player` prop to something clearer or keep it but remove all legacy `controls` references

**Proposed Clean API:**
```tsx
// Simple usage — no controls
<Lottie src={animation} />

// With player controls
<Lottie
  src={animation}
  player={{
    controls: true, // or { playPause: true, progressBar: true }
    theme: { colors: { accent: "#ff0000" } },
  }}
/>

// Hook usage for maximum control
const lottie = useLottie({ src: animation });
return (
  <div ref={lottie.setContainerRef} style={{ width: 400, height: 400 }} />
);
```

### Issue 2: Two Duplicate `useFade` Hooks (HIGH)

**The Problem:**
- `src/hooks/useFade.ts` — the original, with 5 TODOs and buggy edge cases
- `src/externals/player/utils/useFade.ts` — a cleaner rewrite used by `LoadingOverlay`

They have the same name and similar API but different implementations. The original uses `useStateWithPrevious` and `useTimeout` hooks (which also have edge cases). The Player version is self-contained and simpler.

**The Fix:**
1. Delete `src/hooks/useFade.ts` (the buggy original)
2. Delete `src/hooks/useTimeout.ts` (only used by the deleted useFade)
3. Keep `src/externals/player/utils/useFade.ts` as the single implementation
4. If other code needs fade, import from the Player utils or move it to a shared location

### Issue 3: Loading Overlay Not Working in Examples (MEDIUM)

**The Problem:**
In `PlayerV3Example.tsx`, the loading overlay is commented out:
```tsx
overlays: {
  // Not working
  // loading: { minDisplayTime: 3000, fadeOutTime: 3000 },
}
```

**Root Cause Analysis:**
The `LoadingOverlay` component uses the Player's `useFade` hook, which should work. The issue is likely that:
1. The animation loads too fast (locally), so loading state transitions from `true` to `false` before React finishes a render cycle
2. The `processLoadingConfig` function returns a default config even when no `loading` prop is provided, meaning the loading overlay renders by default with 0ms minimum display time

**The Fix:**
1. Default `overlays.loading` to `null` (disabled) instead of showing a default spinner
2. Only show loading overlay when explicitly configured
3. Test with slow network conditions to verify the fade transition works

### Issue 4: FrameIndicator Causes Re-renders (MEDIUM)

**The Problem:**
```tsx
// FrameIndicator.tsx:26
const [currentFrame, setCurrentFrame] = useState(0);
// Line 30 — subscribes and calls setState on every frame
return subscribeToFrame(setCurrentFrame);
```
This calls `setState` on every frame (~60fps), causing the FrameIndicator to re-render 60 times per second. While isolated to this component (it doesn't cascade to parents thanks to subscriptions), it's still wasteful.

**The Fix:**
Use a ref + direct DOM manipulation like the ProgressBar does:
```tsx
const frameRef = useRef<HTMLSpanElement>(null);
useEffect(() => {
  return subscribeToFrame((frame) => {
    if (frameRef.current) {
      frameRef.current.textContent = frame.toFixed(decimals);
    }
  });
}, [subscribeToFrame, decimals]);
```

### Issue 5: Every BaseButton Has Its Own Resize Listener (LOW)

**The Problem:**
Each `BaseButton` instance registers its own `window.addEventListener("resize", ...)` to track `screenWidth` for responsive sizing. With 7 buttons visible, that's 7 resize listeners.

**The Fix:**
- Move resize tracking to the Player level (it already has one)
- Pass `screenWidth` or `isMobile` as a prop to buttons
- Or use a shared context/hook with a single listener

### Issue 6: Inline `<style>` Tags in Multiple Components (LOW)

**The Problem:**
- `ProgressBar.tsx` injects `<style>` tags for `::-webkit-slider-thumb` and `::-moz-range-thumb`
- `LoadingOverlay.tsx` injects `<style>` for `@keyframes`
- `DefaultLoadingSpinner` injects `<style>` for its rotation keyframe
- These are injected into the DOM on every render

**The Fix:**
- Consider using a single `<style>` block at the Player level
- Or generate stable CSS and inject once (use `useInsertionEffect` in React 18+)
- For v3.0, this is acceptable — optimize in v3.1

### Issue 7: Player `style` Prop Applied Twice (LOW)

**The Problem:**
In `Player.tsx`, the `style` prop is spread into both the outer wrapper div (line 207) AND the controls container (line 176). This means consumer styles like `border` or `background` would appear on both the container and the controls bar.

**The Fix:**
Only apply `style` to the outer wrapper. The controls bar should only use theme-derived styles.

### Summary of Player Action Items
| # | Issue | Priority | Action |
|---|-------|----------|--------|
| 1 | Architecture/responsibility confusion | P0 | Remove dead `controls` prop, clean dual types |
| 2 | Duplicate `useFade` hooks | P0 | Delete original, keep Player version |
| 3 | Loading overlay not working | P1 | Default to disabled, fix timing |
| 4 | FrameIndicator re-renders | P1 | Use ref + DOM manipulation |
| 5 | Per-button resize listeners | P2 | Move to Player level |
| 6 | Inline `<style>` tags | P2 | Consolidate or use `useInsertionEffect` |
| 7 | Style prop applied twice | P2 | Apply only to outer wrapper |

---

## 8. Interactivity API Design

### Background
The v2 `useLottieInteractivity` hook supports two modes:
- **Scroll mode** — animation plays/seeks based on scroll position relative to the container
- **Cursor mode** — animation plays/seeks based on cursor position over the container

The old implementation (in `src/old/useLottieInteractivity.tsx`) is entirely commented out (249 lines). It had fundamental design issues:
- Returns a `ReactElement` instead of props/values (non-composable)
- Requires wrapping the animation in a new div
- Tightly coupled to the old `useLottie` hook API
- No TypeScript strict compliance

### v3 Interactivity API Design

**Design Principles:**
1. Hook-based — composable with any Lottie instance
2. Declarative — configure via props on the `<Lottie>` component too
3. No wrapper divs — observe the container ref directly
4. Use `IntersectionObserver` instead of scroll event for better performance
5. Support both ref API (imperative) and prop API (declarative)

**Proposed API:**

#### Hook Usage (Advanced)
```tsx
import { useLottie, useLottieInteractivity } from "lottie-react";

const MyComponent = () => {
  const lottie = useLottie({ src: animation });

  useLottieInteractivity(lottie, {
    mode: "scroll",
    actions: [
      {
        visibility: [0, 0.5],
        type: "seek",
        frames: [0, 120],
      },
      {
        visibility: [0.5, 1],
        type: "loop",
        frames: [120, 240],
      },
    ],
  });

  return <div ref={lottie.setContainerRef} style={{ height: 500 }} />;
};
```

#### Declarative Usage (Simple)
```tsx
<Lottie
  src={animation}
  interactivity={{
    mode: "scroll",
    actions: [
      { visibility: [0, 1], type: "seek", frames: [0, 120] },
    ],
  }}
/>
```

#### Cursor Mode
```tsx
<Lottie
  src={animation}
  interactivity={{
    mode: "cursor",
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: "seek",
        frames: [0, 120],
      },
    ],
  }}
/>
```

**Types:**
```tsx
type InteractivityMode = "scroll" | "cursor";

type InteractivityAction = {
  type: "seek" | "play" | "stop" | "loop";
  frames: [number] | [number, number];
  visibility?: [number, number];   // scroll mode — 0..1 viewport visibility
  position?: {                     // cursor mode — 0..1 relative to container
    x: number | [number, number];
    y: number | [number, number];
  };
};

interface InteractivityOptions {
  mode: InteractivityMode;
  actions: InteractivityAction[];
}
```

**Implementation Notes:**
- Use `IntersectionObserver` for scroll visibility detection (much better than scroll events)
- Use `requestAnimationFrame` for throttling cursor position calculations
- The hook should use the `animationItem` from `useLottie` result, not manage its own
- Clean up all listeners on unmount via return function
- Handle edge cases: element not in viewport, cursor leaves container, multiple actions matching

**Implementation Steps:**
1. Create `src/hooks/useLottieInteractivity.ts`
2. Implement scroll mode with `IntersectionObserver` + scroll listener for precise position
3. Implement cursor mode with `mousemove` + `mouseout` listeners
4. Add `interactivity` prop to `LottieProps`
5. Wire up in `lottieHoc.tsx`
6. Write tests for both modes

---

## 9. Testing Strategy

### Stack Selection

| Tool | Purpose | Why |
|------|---------|-----|
| **Vitest** | Test runner | Fast, ESM-native, works with TypeScript out of the box, compatible with Jest API |
| **React Testing Library** | Component testing | Standard for React, tests behavior not implementation |
| **@testing-library/react-hooks** | Hook testing | or use `renderHook` from RTL directly (v14+) |
| **jsdom** | DOM environment | Default for Vitest, sufficient for our needs |
| **MSW** (Mock Service Worker) | Network mocking | For testing remote URL animation loading |

**Why Vitest over Jest:**
- Native ESM support (our project is `"type": "module"`)
- Faster execution (uses Vite's transform pipeline)
- Compatible Jest API (easy migration path)
- Built-in TypeScript support
- Built-in coverage via `v8` or `istanbul`

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Lottie.test.tsx
│   │   └── LottieLight.test.tsx
│   ├── hooks/
│   │   ├── useLottieFactory.test.tsx
│   │   ├── useLottieInteractivity.test.ts
│   │   ├── useCallbackRef.test.ts
│   │   └── useStateWithPrevious.test.ts
│   ├── player/
│   │   ├── Player.test.tsx
│   │   ├── ProgressBar.test.tsx
│   │   ├── FrameIndicator.test.tsx
│   │   ├── BaseButton.test.tsx
│   │   ├── LoadingOverlay.test.tsx
│   │   └── useFullscreen.test.ts
│   ├── utils/
│   │   ├── SubscriptionManager.test.ts
│   │   ├── normalizeAnimationSource.test.ts
│   │   └── getNumberFromNumberOrPercentage.test.ts
│   └── __fixtures__/
│       └── sampleAnimation.json
```

### What to Test

**Unit Tests (Utilities):**
- `SubscriptionManager` — subscribe, unsubscribe, notify, multiple subscribers, cleanup
- `normalizeAnimationSource` — JSON objects, `.json` URLs, invalid inputs, edge cases
- `getNumberFromNumberOrPercentage` — numbers, percentages, invalid strings
- `isFunction` — functions, non-functions
- `logger` — calls console methods, respects active flag

**Hook Tests:**
- `useLottieFactory` — initialization, state transitions, play/pause/stop, loop toggle, direction change, speed change, seek, cleanup on unmount, error handling, subscription management
- `useCallbackRef` — ref setting, re-render on change
- `useStateWithPrevious` — state changes, previous value tracking, onChange callback
- `useLottieInteractivity` — scroll mode actions, cursor mode actions, cleanup

**Component Tests:**
- `Lottie` — renders container div, passes through ref, plays animation, handles errors
- `LottieLight` — same as Lottie but uses light player
- `Player` — renders controls based on config, responsive behavior, theme application
- `ProgressBar` — subscription updates, drag interaction, seek calls
- `FrameIndicator` — displays current frame, subscription updates
- `LoadingOverlay` — show/hide, fade animation, minimum display time
- `BaseButton` — click handling, hover states, dropdown, disabled state

**Integration Tests:**
- Full Lottie + Player render and interaction cycle
- Animation load → play → pause → seek → stop flow
- Remote URL loading (with MSW)
- Error state handling

### Setup Steps
1. `yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw`
2. Create `vitest.config.ts` with jsdom environment
3. Create test fixtures (small animation JSON)
4. Mock `lottie-web` for unit tests (avoid loading real animations)
5. Add `"test": "vitest"` and `"test:coverage": "vitest --coverage"` to package.json

---

## 10. Documentation & Website Plan

### README.md (Immediate)

The README needs a complete rewrite for v3. Structure:

```
# lottie-react

> Lightweight React library for Lottie animations

## Features
- Tree-shakable — import only what you need
- LottieLight — SVG-only variant, 150KB smaller
- Zero re-renders — subscription-based frame updates
- Built-in Player — controls, theming, responsive
- URL & JSON — load from file or remote URL
- Interactivity — scroll and cursor-driven animations
- TypeScript — full type safety

## Installation
## Quick Start
  - Basic animation
  - With player controls
  - Using the hook
## API Reference
  - Lottie component props
  - LottieLight component props
  - useLottie hook
  - useLottieInteractivity hook
  - Player configuration
  - Theme customization
  - Ref methods
## Migration from v2
  - Breaking changes
  - Prop mapping table
  - Before/after examples
## Examples
## Contributing
```

### Website / Documentation Site (Post-Launch)

**Current state:** lottiereact.com uses Docusaurus, shows v2 docs, examples section says "Soon :)".

**Recommended approach:**

| Aspect | Recommendation |
|--------|---------------|
| **Framework** | **Nextra** (Next.js-based) or **Starlight** (Astro-based) |
| **Hosting** | Vercel (free for OSS) or GitHub Pages |
| **Content** | MDX for interactive examples |
| **Structure** | See below |

**Site Structure:**
```
/ — Landing page with hero animation, feature highlights, quick install
/docs/getting-started — Installation, quick start, first animation
/docs/components/lottie — Lottie component API
/docs/components/lottie-light — LottieLight component API
/docs/hooks/use-lottie — useLottie hook API
/docs/hooks/use-lottie-interactivity — Interactivity hook API
/docs/player — Player configuration
/docs/player/theme — Theme customization with live preview
/docs/player/controls — Control elements configuration
/docs/player/responsive — Responsive behavior
/docs/player/overlays — Loading & error overlays
/docs/interactivity — Scroll & cursor modes with live demos
/docs/advanced/tree-shaking — Bundle optimization guide
/docs/advanced/ssr — Server-side rendering
/docs/advanced/migration — v2 to v3 migration guide
/examples — Interactive playground with editable code
/examples/basic — Simple animation
/examples/player — Full player demo
/examples/scroll — Scroll-driven animation
/examples/cursor — Cursor-driven animation
```

**Key Pages to Prioritize:**
1. Landing page with live demo
2. Getting Started
3. Component API (Lottie + LottieLight)
4. Player configuration
5. Migration guide from v2

---

## 11. Files to Clean Up

### Delete Entirely

| File/Directory | Reason |
|----------------|--------|
| `src/old/` (entire directory) | Old player, old HOC, commented-out interactivity, old config — 24 files, all dead code |
| `src/hooks/useFade.ts` | Replaced by `src/externals/player/utils/useFade.ts` |
| `src/hooks/useTimeout.ts` | Only used by the deleted `useFade.ts` |
| `src/hooks/useNonReactiveState.ts` | Only used by `useStateWithPrevious` which can inline the `useRef` pattern |
| `CODEBASE_IMPROVEMENTS.md` | Will be superseded by this plan; contains outdated references |
| `build/` (directory) | Build artifacts checked into git — should be in `.gitignore` |
| `.DS_Store` | macOS artifact — add to `.gitignore` |

### Modify

| File | Change |
|------|--------|
| `src/index.ts` | Add `useLottie` export, add `useLottieInteractivity` export, remove `export *` barrel if possible |
| `src/@types/types.ts` | Remove dead `controls` prop from `LottieProps`, remove `PlayerConfig` duplicate, remove `PlayerControlsElement` import |
| `src/@types/enums.ts` | Remove `PlayerControlsElement` enum (replaced by `PlayerElements`) |
| `src/components/lottieHoc.tsx` | Remove `controls` destructure, clean up PlayerState conversion |
| `src/utils/SubscriptionManager.ts` | Replace `EventEmitter`, fix types |
| `src/utils/logger.ts` | Default `isLoggerActive` to `false`, wire up `debug` prop |
| `src/utils/normalizeAnimationSource.ts` | Accept any string as path, not just `.json` |
| `src/externals/player/index.ts` | Review what's exported — most internal components shouldn't be public |
| `src/externals/player/Player.tsx` | Fix `style` double-application, remove `controls` default handling |
| `src/externals/player/components/FrameIndicator.tsx` | Use ref+DOM instead of setState |
| `README.md` | Full rewrite for v3 |
| `package.json` | Add test script, review dependencies |

### Review (Maybe Delete)

| File | Notes |
|------|-------|
| `src/utils/isFunction.ts` | Only used in `useStateWithPrevious` — could inline `typeof fn === "function"` |
| `src/hooks/useCallbackRef.ts` | Remove TODO comment. Evaluate if `useState` + `useCallback` could replace |
| `react-fast-compare` dependency | Only used for subscription comparison which is buggy anyway |
| `postcss`, `autoprefixer`, `less` dev deps | No CSS files in v3 source — are these needed? |
| `rollup-plugin-postcss` | Same as above |

---

## 12. Implementation Roadmap

### Phase 0: Cleanup (Day 1-2)
> Remove dead weight so we have a clean working surface.

- [ ] Delete `src/old/` directory entirely
- [ ] Delete `src/hooks/useFade.ts` and `src/hooks/useTimeout.ts`
- [ ] Delete `CODEBASE_IMPROVEMENTS.md`
- [ ] Add `build/`, `.DS_Store` to `.gitignore`
- [ ] Remove `PlayerControlsElement` enum from `@types/enums.ts`
- [ ] Remove dead `controls` prop from `LottieProps`
- [ ] Remove duplicate `PlayerConfig` from `@types/types.ts`
- [ ] Clean up `lottieHoc.tsx` to remove legacy references
- [ ] Review and clean `src/externals/player/index.ts` exports
- [ ] Verify build still works: `yarn build`

### Phase 1: Core Fixes (Day 3-5)
> Fix the critical issues in the core engine.

- [ ] Replace `EventEmitter` in `SubscriptionManager` with custom typed implementation
- [ ] Fix `@ts-ignore` directives with proper types
- [ ] Wire `debug` prop to logger (default logger to off)
- [ ] Fix `normalizeAnimationSource` to accept any string URL
- [ ] Fix subscription re-registration bug (stable references)
- [ ] Fix `stateBeforeSeeking` closure issue (use ref)
- [ ] Remove `react-fast-compare` dependency if no longer needed after subscription fix
- [ ] Remove `less`, `postcss`, `autoprefixer`, `rollup-plugin-postcss` if unused

### Phase 2: Player Polish (Day 6-8)
> Fix all Player issues to make it production-ready.

- [ ] Fix `FrameIndicator` to use ref + DOM manipulation (no re-renders)
- [ ] Fix `style` prop double-application in Player
- [ ] Consolidate resize listeners (move to Player level)
- [ ] Default loading overlay to disabled (only show when explicitly configured)
- [ ] Test loading overlay with `minDisplayTime` and `fadeOutTime`
- [ ] Add keyboard shortcuts (`k`=play/pause, `l`=loop, `f`=fullscreen)
- [ ] Review inline `<style>` tags — consolidate where possible
- [ ] Make Player's `controls` prop behavior unambiguous

### Phase 3: Public API (Day 9-10)
> Create the consumer-facing hooks and finalize exports.

- [ ] Create `useLottie` hook — the primary consumer hook (wraps `useLottieFactory`)
- [ ] Design `useLottie` return type to be clean and documented
- [ ] Finalize `src/index.ts` exports:
  ```tsx
  // Components
  export { Lottie, LottieLight };
  export default Lottie;
  // Hooks
  export { useLottie, useLottieInteractivity };
  // Types (only public-facing)
  export type { LottieProps, LottieRef, UseLottieOptions, UseLottieResult, ... };
  // Enums
  export { LottieState, LottieRenderer, LottieVersion, Direction };
  ```
- [ ] Ensure Player internals are NOT exported from main index
- [ ] Add separate entry point for Player if needed: `lottie-react/player`
- [ ] Verify tree-shaking: importing `Lottie` alone should not pull in Player code

### Phase 4: Interactivity (Day 11-14)
> Implement the new interactivity API.

- [ ] Create `src/hooks/useLottieInteractivity.ts`
- [ ] Implement scroll mode:
  - `IntersectionObserver` for viewport detection
  - Scroll listener for precise position calculation
  - Action matching based on visibility ranges
  - `seek`, `play`, `stop`, `loop` action types
- [ ] Implement cursor mode:
  - `mousemove` and `mouseout` listeners on container
  - Position normalization (0..1 relative to container)
  - Action matching based on position ranges
  - Same action types as scroll mode
- [ ] Add `interactivity` prop to `LottieProps`
- [ ] Wire up in `lottieHoc.tsx`
- [ ] Handle cleanup on unmount
- [ ] Handle edge cases (SSR, no container, animation not loaded)

### Phase 5: Testing (Day 15-20)
> Build comprehensive test suite.

- [ ] Set up Vitest with jsdom, React Testing Library
- [ ] Create test fixtures (small animation JSON)
- [ ] Create lottie-web mock
- [ ] Write utility tests (SubscriptionManager, normalizeAnimationSource, etc.)
- [ ] Write hook tests (useLottieFactory, useCallbackRef, useStateWithPrevious)
- [ ] Write component tests (Lottie, LottieLight)
- [ ] Write Player component tests
- [ ] Write interactivity tests
- [ ] Write integration tests
- [ ] Achieve >80% coverage
- [ ] Set up CI (GitHub Actions) to run tests on PR

### Phase 6: Documentation (Day 21-25)
> Write docs and prepare for launch.

- [ ] Rewrite README.md for v3
- [ ] Write v2 → v3 migration guide
- [ ] Update example app with comprehensive demos
- [ ] Create JSDoc comments on all public API surfaces
- [ ] Set up documentation site (Nextra or Starlight)
- [ ] Write Getting Started guide
- [ ] Write API reference pages
- [ ] Write Player customization guide
- [ ] Write Interactivity guide
- [ ] Deploy documentation site

### Phase 7: Pre-Launch (Day 26-28)
> Final verification and release.

- [ ] Full manual testing of all features
- [ ] Bundle size analysis (compare to v2)
- [ ] Performance benchmarking (frame rate, re-render count)
- [ ] SSR testing (Next.js, Remix)
- [ ] Peer review of public API
- [ ] Write CHANGELOG.md
- [ ] Publish `3.0.0-rc.1` to npm
- [ ] Gather community feedback
- [ ] Fix any reported issues
- [ ] Publish `3.0.0` to npm

---

## 13. Competitive Landscape

For reference, here's how lottie-react compares to alternatives:

| Library | Weekly Downloads | Approach | Strengths | Weaknesses |
|---------|-----------------|----------|-----------|------------|
| **lottie-react** (this) | ~400K | React wrapper for lottie-web | Most popular, simple API, active development | Bundle size (lottie-web), no Player (v2) |
| **@lottiefiles/react-lottie-player** | ~273K | React component with Player | Built-in Player, dotLottie support | LottieFiles ecosystem lock-in |
| **react-lottie-player** | ~148K | Declarative hooks-based | Fully declarative, easy prop changes | No tree-shaking, no light version |
| **@lottiefiles/dotlottie-react** | Growing | WASM-based dotLottie player | Smallest bundle, dotLottie native | New, less community adoption |

**Our differentiators for v3:**
1. Tree-shaking + LottieLight variant (bundle size wins)
2. Subscription-based architecture (performance wins)
3. Fully customizable Player with theme system
4. Both component and hook API
5. Interactivity built-in (scroll + cursor)
6. Zero lock-in to any ecosystem
7. Most popular package in the space with large existing user base

---

## Appendix: Quick Reference

### v3 Source File Map
```
src/
├── @types/
│   ├── enums.ts              — LottieState, LottieSubscription, LottieVersion, LottieRenderer, Direction
│   ├── types.ts              — All TypeScript interfaces and types
│   └── index.ts              — Re-exports
├── components/
│   ├── Lottie.tsx            — Full lottie-web component
│   ├── LottieLight.tsx       — Light (SVG-only) component
│   └── lottieHoc.tsx         — HOC factory connecting hook to Player
├── externals/
│   └── player/
│       ├── Player.tsx        — Main Player component
│       ├── types.ts          — Player-specific types
│       ├── index.ts          — Player exports
│       ├── components/
│       │   ├── BaseButton.tsx
│       │   ├── Display.tsx
│       │   ├── FrameIndicator.tsx
│       │   ├── LoadingOverlay.tsx
│       │   ├── PlayerButtons.tsx
│       │   └── PlayerIcons.tsx
│       │   └── ProgressBar.tsx
│       └── utils/
│           ├── PlayerTheme.ts
│           ├── useFade.ts
│           └── useFullscreen.ts
├── hooks/
│   ├── useCallbackRef.ts     — Ref that triggers re-render on change
│   ├── useLottieFactory.tsx  — Core animation factory hook
│   ├── useStateWithPrevious.ts — State with previous value tracking
│   ├── useNonReactiveState.ts — Ref-based non-reactive state
│   ├── useFade.ts            — ⚠️ DELETE (duplicate)
│   └── useTimeout.ts         — ⚠️ DELETE (only used by old useFade)
├── utils/
│   ├── SubscriptionManager.ts — Event subscription system
│   ├── normalizeAnimationSource.ts — URL/JSON source normalization
│   ├── getNumberFromNumberOrPercentage.ts — Seek value parser
│   ├── isFunction.ts         — Type guard utility
│   └── logger.ts             — Debug logger
├── old/                      — ⚠️ DELETE ENTIRELY
└── index.ts                  — Public API exports
```

### npm Dependencies to Review
```
dependencies:
  lottie-web: ^5.13.0          — ✅ Keep (core dependency)
  react-fast-compare: ^3.2.2   — ❓ Review (may not be needed after subscription fix)

peerDependencies:
  react: ^18.2.0 || ^19.0.0    — ✅ Keep
  react-dom: ^18.2.0 || ^19.0.0 — ✅ Keep

devDependencies (to add):
  vitest                        — Test runner
  @testing-library/react        — Component testing
  @testing-library/jest-dom     — DOM assertions
  @testing-library/user-event   — User interaction simulation
  jsdom                         — DOM environment for tests

devDependencies (to review/remove):
  less                          — No .less files in v3 src
  postcss, autoprefixer         — No CSS processing needed
  rollup-plugin-postcss         — Same as above
```

---

## 14. Progress

> Last updated: March 2026
> Phases completed: **0, 1, 2, 3, Feedback** (of 7)

---

### Phase 0 — Cleanup ✅

**Deleted files:**
- `src/old/` — entire directory (~24 files). Contained: old player, old HOC (`oldLottieHoc.tsx`), old config, and the entirely-commented-out `useLottieInteractivity.tsx`.
- `src/hooks/useFade.ts` — duplicate of `src/externals/player/utils/useFade.ts` with 5 unresolved TODOs.
- `src/hooks/useTimeout.ts` — only used by the now-deleted `useFade.ts`.
- `CODEBASE_IMPROVEMENTS.md` — superseded by this plan.

**`.gitignore`:**
- Added `.DS_Store` entry.

**`src/@types/enums.ts`:**
- Removed `PlayerControlsElement` enum. It was dead code — the Player already used `PlayerElements` (interface-based, granular control config).

**`src/@types/types.ts`:**
- Removed dead `controls?: boolean | PlayerControlsElement[]` prop from `LottieProps`.
- Removed `PlayerControlsElement` import.
- Removed duplicate `PlayerConfig` interface. Replaced with `LottiePlayerConfig` which imports `PlayerTheme`, `PlayerElements`, `PlayerResponsive`, `PlayerOverlays` directly from the player module.
- Removed unused `UseLottieStateOptions` interface.
- Changed `LottieSubscriptionAction<T = unknown>` → `LottieSubscriptionAction<T = void>`.

**`src/components/lottieHoc.tsx`:**
- Removed legacy `controls` destructuring and all related references.
- Cleaned up HOC structure with clear comments about design decisions.
- `player` prop now typed as `LottiePlayerConfig`.

**`example/src/components/PlayerV3Example.tsx`:**
- Removed `PlayerControlsElement` import and all usages.
- Updated all examples to use the clean v3 `player` prop API.
- Re-enabled loading overlay config (was commented out as "Not working").

---

### Phase 1 — Core Fixes ✅

**`src/utils/SubscriptionManager.ts` — Major rewrite:**
- Replaced Node.js `EventEmitter` (which pulled in a ~13 KB browser polyfill) with a custom 65-line typed implementation.
- Uses `Map<string, Set<AnyHandler>>` internally.
- Full type safety at the public API (`subscribe`, `notify`). Internal storage uses `as unknown as AnyHandler` double-cast (no `any`).
- No `@ts-ignore` directives.

**`src/utils/logger.ts` — Rewrite:**
- Logging now defaults to **OFF**. The old code had `let isLoggerActive = true` — production consumers saw debug logs in their console.
- `createLogger(debug = false)` factory — returns scoped logger. Returns no-op functions when `debug` is false (zero overhead).

**`src/utils/normalizeAnimationSource.ts` — Rewrite:**
- Now accepts **any non-empty string** as a `path` (previously only strings ending in `.json`).
- Supports query-string URLs (`animation.json?v=2`), `.lottie` files, extensionless CDN URLs, etc.
- Explicitly rejects arrays (previously could incorrectly accept them as objects).

**`src/hooks/useLottieFactory.tsx` — Significant changes:**
- Wired `debug` prop to `createLogger(debug)` via `useMemo`.
- **Fixed subscription re-registration bug.** Old code used `isEqual` (deep comparison) on subscription objects that include functions — function equality is referential so this always returned `false`, re-registering on every render. Fixed with ref-forwarding: `_subscriptionsRef.current = options.subscriptions` is assigned synchronously in the render body. Stable "forwarding" handlers are registered once via `useEffect`, and the `subscriptionTypesKey` (sorted event type keys joined) is the only dependency. Re-registration only happens when the _set_ of subscribed event types changes.
- **Fixed `stateBeforeSeeking` stale closure.** Changed from `useState` to `useRef<LottieState | null>`. State-based version could capture stale values inside the nested `setState` callback.
- `autoplay` and `initialSegment` no longer wrapped in `useState` (they are not dynamic — the animation must be reloaded to change them).

**`src/externals/player/utils/PlayerTheme.ts`:**
- Fixed TypeScript narrowing error in `processLoadingConfig` — the fall-through case now correctly casts to `ReactNode`.

---

### Phase 2 — Player Polish ✅

**`src/externals/player/components/FrameIndicator.tsx` — Rewrite:**
- **Critical performance fix.** Old code used `useState(0)` + `setCurrentFrame` — this fired `setState` 60 times per second, causing 60 re-renders/second from this one component.
- New code: `useRef<HTMLSpanElement>` + direct `.textContent` mutation. Component **never re-renders during playback**.
- Initial value `{(0).toFixed(decimals)}` renders on mount; the frame subscription updates the DOM directly from there.

**`src/externals/player/components/ProgressBar.tsx` — Touch support:**
- Added `onTouchEnd` handler mirroring `onMouseUp`. Seeking now works on mobile/touch devices.
- Extracted `commitSeek()` helper shared by both handlers.

**`src/externals/player/components/BaseButton.tsx` — Resize listener removed:**
- Removed `window.addEventListener("resize", ...)` (there were up to 7 of these — one per control button).
- Added `screenWidth?: number` prop (default `1024`) — the parent Player passes the single tracked value down.

**`src/externals/player/components/PlayerButtons.tsx`:**
- Added `screenWidth?: number` to all 7 button prop interfaces.
- All buttons now thread `screenWidth` through to `<BaseButton>`.

**`src/externals/player/Player.tsx` — Multiple fixes:**
- **`style` double-application fixed.** The `style` prop was previously spread into both the outer wrapper div AND the controls bar's `containerStyle`. Consumer styles (e.g. `border`, `background`) were appearing on the controls bar. Now `style` is applied only to the outer wrapper; the controls bar uses purely theme-derived styles.
- **Single resize listener.** One `window.addEventListener("resize")` at the Player level sets `screenWidth` state, which is passed as a prop to all buttons. Eliminates N per-button listeners.
- **Keyboard shortcuts.** `k`=play/pause, `l`=loop, `f`=fullscreen. Implemented via a document-level `keydown` listener (registered once via `useEffect`) gated by player focus state tracked with `onFocus`/`onBlur` on the container div. No `tabIndex` or ARIA role manipulation needed — keyboard shortcuts activate whenever any focusable element inside the player (toolbar buttons, progress bar) has focus.
- **Loading overlay is now opt-in.** Previously `processLoadingConfig(undefined)` returned a default config, so the spinner showed by default. Now it returns `null` — the overlay is disabled unless the consumer explicitly passes `overlays={{ loading: {} }}` or a custom component/config.

**`src/externals/player/utils/PlayerTheme.ts`:**
- `processLoadingConfig(undefined)` now returns `null` instead of a default config.

---

### Phase 3 — Public API ✅

**`src/hooks/useLottie.ts` — New file:**
- Consumer-facing hook for the full lottie-web build.
- Thin wrapper: calls `useLottieFactory(lottie, options)` with the full lottie-web player instance already bound.
- Signature: `useLottie(options: UseLottieFactoryOptions): UseLottieFactoryResult`

**`src/hooks/useLottieLight.ts` — New file:**
- Consumer-facing hook for the `lottie_light` build (SVG-only, ~150 KB smaller bundle).
- Signature: `useLottieLight(options: UseLottieFactoryOptions<LottieVersion.Light>): UseLottieFactoryResult`

**`src/index.ts` — Clean public API:**
- Replaced `export * from "./@types"` (leaky barrel) with explicit named exports.
- `InternalListener` is no longer part of the public API.
- New exports: `useLottie`, `useLottieLight`, player types (`LoadingOverlayConfig`, `LoadingOverlayOptions`, `PlayerElements`, `PlayerOverlays`, `PlayerResponsive`, `PlayerTheme`).

**`src/externals/player/entry.ts` — New file:**
- Clean entry point for the `lottie-react/player` sub-path.
- Exports: `Player`, player types, `DEFAULT_PLAYER_ELEMENTS`, `DEFAULT_PLAYER_RESPONSIVE`.

**`rollup.config.mts`:**
- Added 3 new build configurations for the player sub-path:
  - `build/player.js` + `build/player.min.js` (CJS)
  - `build/player.esm.js` + `build/player.esm.min.js` (ESM)
  - `build/player.d.ts` (TypeScript declarations)

**`package.json`:**
- Added `exports` field:
  ```json
  {
    ".":        { "import": "./build/index.esm.js",  "require": "./build/index.js",  "types": "./build/index.d.ts"  },
    "./player": { "import": "./build/player.esm.js", "require": "./build/player.js", "types": "./build/player.d.ts" }
  }
  ```

**Build outputs (all passing):**
| File | Format | Entry |
|------|--------|-------|
| `build/index.js` | CJS | `src/index.ts` |
| `build/index.esm.js` | ESM | `src/index.ts` |
| `build/index.d.ts` | Types | `src/index.ts` |
| `build/player.js` | CJS | `src/externals/player/entry.ts` |
| `build/player.esm.js` | ESM | `src/externals/player/entry.ts` |
| `build/player.d.ts` | Types | `src/externals/player/entry.ts` |

**Public API surface (`build/index.d.ts`):**
```ts
// Components
export { Lottie, LottieLight }
export default Lottie

// Hooks
export { useLottie, useLottieLight }

// Enums
export { Direction, LottieRenderer, LottieState, LottieSubscription, LottieVersion }

// Types
export type { LottiePlayerConfig, LottieProps, LottieRef, LottieSubscriptionAction,
              LottieSubscriptions, UseLottieFactoryOptions, UseLottieFactoryResult,
              LoadingOverlayConfig, LoadingOverlayOptions, PlayerElements, PlayerOverlays,
              PlayerResponsive, PlayerTheme }
```

---

### Known Issues / Tech Debt (Post-Phase 3)

| Item | Severity | Notes |
|------|----------|-------|
| `react-fast-compare` still a dependency | Low | Used in `useLottieFactory` for `initialValues` deep comparison with `enableReinitialize`. Still valid for that use case. Could be replaced with a shallow compare for the limited object shape, but low priority. |
| `src/hooks/useNonReactiveState.ts` still exists | Low | Listed for deletion in §11. Used only by `useStateWithPrevious`. Could be inlined as a plain `useRef`. |
| `src/utils/isFunction.ts` still exists | Low | Listed for review in §11. Used only in `useStateWithPrevious`. Could be inlined as `typeof fn === "function"`. |
| `src/externals/player/index.ts` exports too many internals | Low | Still re-exports everything (BaseButton, ProgressBar, FrameIndicator, PlayerTheme utils, etc.). This is the _internal_ index used within the package; the public player sub-path entry (`entry.ts`) is already clean. |
| `build/` directory may be tracked in git | Low | Should be in `.gitignore`. Check with `git status`. |
| `postcss`, `less`, `autoprefixer`, `rollup-plugin-postcss` in devDeps | Low | No `.less` or `.css` files in v3 source. Postcss plugin is configured in rollup but processes nothing. Safe to remove — verify build still passes after removal. |
| Inline `<style>` tags in components | Low | `ProgressBar`, `LoadingOverlay`, and `DefaultLoadingSpinner` each inject `<style>` blocks. Fine for v3.0; consider `useInsertionEffect` consolidation in v3.1. |

---

### Phase 4 (Feedback Addressal) — Enums, Structure, API, Divider Bug ✅

Six pre-v3.0 feedback items addressed. Build and ESLint both pass.

**Enums → `const` + `type` pattern (`src/types/enums.ts`):**
- All 5 enums (`LottieState`, `LottieSubscription`, `LottieVersion`, `LottieRenderer`, `Direction`) converted from native TypeScript `enum` to `const` object + union type alias.
- Keys are lowercase and match their string values (`LottieState.playing`, `Direction.right`, etc.) — single source of truth; no case-mapping overhead.
- Removed dead members: `LottieSubscription.Load` and `LottieSubscription.Freeze` (never emitted by the factory hook).
- Build output changed from IIFE-compiled `enum` blocks to plain `declare const` objects — fully tree-shakable.
- `LottieSubscriptions` interface uses computed property names (`[LottieSubscription.frame]: ...`) — keys are derived directly from the const values, so renaming a value automatically updates the interface key too.
- All internal usages updated: `useLottieFactory.tsx`, `LottieHoc.tsx` — no raw string literals.
- Generic parameter defaults and conditionals use `typeof LottieVersion.full` (extracts the literal type `"full"` from the const value, necessary because const object members are values, not types).

**`lottie-react/player` sub-path removed:**
- `src/player/entry.ts` deleted — the Player requires `state`, `subscriptions`, and `actions` that only `useLottieFactory` can provide; no realistic consumer would build their own.
- 3 player build configs removed from `rollup.config.mts`.
- `"./player"` entry removed from `package.json` `exports` field.
- All player types consumers need (`PlayerTheme`, `PlayerElements`, etc.) remain exported from the main `lottie-react` entry.

**Directory and file renames:**
- `src/@types/` → `src/types/` — `@` prefix is the npm scoped-package convention, not a source directory convention.
- `src/externals/player/` → `src/player/` — "externals" was misleading; the Player is a first-class part of this library.
- `src/components/lottieHoc.tsx` → `src/components/LottieHoc.tsx` — all component files are PascalCase; the HOC factory was the odd one out.
- `src/player/index.ts` slimmed to a minimal barrel (only `Player`, `PlayerState`, `PlayerSubscriptions`, `PlayerActions`, `PlayerProps`) — internal component/util exports no longer leak out.
- All import paths updated across the codebase; old directories deleted.

**`LoadingOverlayOptions` type extended (`src/player/types.ts`, `src/player/utils/PlayerTheme.ts`):**
- Added `true` as a valid value: `overlays={{ loading: true }}` enables the default spinner with default timings.
- Added `false` as an explicit alias for disabled (alongside the existing `null`).
- `processLoadingConfig` updated: `true` → `{ minDisplayTime: 0, fadeOutTime: 600 }`.

**Trailing divider bug fixed (`src/player/Player.tsx`):**
- Root cause: the right-side divider was unconditionally rendered inside the `progressBar` block, leaving a trailing `|` when no secondary controls were visible.
- Fix: two computed booleans — `hasPrimaryControls` (`playPause || stop`) and `hasSecondaryControls` (`frameIndicator || loop || direction || speed || fullscreen`).
- Left divider: only renders when `progressBar && hasPrimaryControls`.
- Right divider: only renders when `progressBar && hasSecondaryControls`.
- Primary and secondary control group `<div>` wrappers only render when their group has visible content (eliminates empty flex items affecting spacing).

**`FullRes` example updated (`example/src/components/PlayerV3Example.tsx`):**
- Was a copy of `MobilePlayerV3` (compact mode, minimal controls) with `width/height: "100%"`.
- Replaced with a fluid `aspectRatio: "4/3"` layout using `controls: true` (full default control set).

---

### What's Next

The remaining phases from the roadmap (in order of priority):

**Phase 4 — Interactivity** (highest value, not started)
- `src/hooks/useLottieInteractivity.ts` — scroll mode + cursor mode
- Add `interactivity` prop to `LottieProps` and wire up in `LottieHoc.tsx`
- See §8 for the full API design

**Phase 5 — Testing** (blocking for release confidence)
- Set up Vitest + React Testing Library
- Unit tests for utilities, hooks, and components
- See §9 for full strategy and file structure

**Phase 6 — Documentation**
- README rewrite, migration guide, JSDoc on public API
- See §10 for site structure and content plan

**Phase 7 — Pre-Launch**
- Bundle size analysis, SSR testing, publish RC