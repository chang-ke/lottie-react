# Codebase Improvements Plan for lottie-react v3

This document outlines specific improvements identified in the current codebase to achieve state-of-the-art standards while maintaining performance optimizations.

## 🔴 Critical Issues (Must Fix for v3)

### 1. Type Safety Violations

**File:** [`src/utils/SubscriptionManager.ts`](src/utils/SubscriptionManager.ts)

**Issues:**
```typescript
// Line 30 - Multiple @ts-ignore breaks type safety
// @ts-ignore
this.subscriptionManager.on(String(type), action as unknown as () => void);

// Line 52-53 - Another type safety bypass
// @ts-ignore
eventListenerRemovers.push(this.subscribe(type, subscriptions[type]));

// Line 72-74 - Generic type casting
// @ts-ignore
payload: Parameters<Subscriptions[Type]>[0],
```

**Impact:** Complete loss of type safety for the core event system

**Solution:** Implement proper generic constraints and typed event system

---

### 2. Bundle Size & Tree-Shaking Blockers

**File:** [`src/index.ts`](src/index.ts)

**Issues:**
```typescript
// Line 6-7 - Barrel exports prevent tree-shaking
export * from "./components/player";  // Exports 8+ components
export * from "./@types";             // Exports all types
```

**Impact:** Consumers forced to import entire library even for basic usage

**Solution:** Replace with explicit named exports and create separate entry points

---

### 3. EventEmitter Dependency Bloat

**File:** [`src/utils/SubscriptionManager.ts`](src/utils/SubscriptionManager.ts)

**Issues:**
```typescript
// Line 1 - Node.js EventEmitter in browser context
import { EventEmitter } from "events";
```

**Impact:** Adds ~13KB to bundle for simple event handling

**Solution:** Implement lightweight, typed event emitter

---

## 🟠 High Priority Issues

### 4. Memory Management in Subscription Lifecycle

**File:** [`src/hooks/useLottieFactory.tsx`](src/hooks/useLottieFactory.tsx)

**Issues:**
```typescript
// Line 63-66 - SubscriptionManager never recreated
const subscriptionManager = useMemo(
  () => new SubscriptionManager<LottieSubscriptions>(),
  [], // Empty deps = never garbage collected
);
```

**Potential Impact:** Memory leaks in long-running applications

**Solution:** Ensure proper cleanup and consider subscription manager lifecycle

---

### 5. Silent Error Swallowing

**File:** [`src/hooks/useLottieFactory.tsx`](src/hooks/useLottieFactory.tsx)

**Issues:**
```typescript
// Line 233-239 - Silent error handling
try {
  _animationItem?.addEventListener(listener.name, listener.handler);
} catch (e) {
  // * There might be cases... - No logging or handling
}
```

**Impact:** Debugging difficulties, hidden failures

**Solution:** Implement proper error logging and handling strategy

---

### 6. Component Coupling in HOC Pattern

**File:** [`src/components/lottieHoc.tsx`](src/components/lottieHoc.tsx)

**Issues:**
```typescript
// Line 78-118 - Monolithic component structure
return (
  <PlayerContainer ref={fullscreenElementRef}>
    <PlayerLoading />
    <PlayerFailure />
    <PlayerDisplay />
    <PlayerControls />
  </PlayerContainer>
);
```

**Impact:** Components can't be used independently, violates separation of concerns

**Solution:** Implement compound component pattern for composability

---

## 🟡 Medium Priority Issues

### 7. CSS-in-JS Type Safety

**File:** [`src/components/player/PlayerControlsProgressBar/PlayerControlsProgressBar.tsx`](src/components/player/PlayerControlsProgressBar/PlayerControlsProgressBar.tsx)

**Issues:**
```typescript
// Line 81-82 - @ts-ignore for CSS custom properties
// @ts-ignore
"--min": 0,
```

**Solution:** Implement proper CSS custom property types

---

### 8. Incomplete Feature Implementation

**File:** [`src/hooks/useLottieFactory.tsx`](src/hooks/useLottieFactory.tsx)

**Issues:**
```typescript
// Line 354-385 - Commented TODO for initialSegment handling
// TODO: handle initialSegment change
// TODO: handle assetsPath change
// TODO: handle rendererSettings change
```

**Impact:** Incomplete dynamic property updates

**Solution:** Complete implementation or remove incomplete features

---

### 9. Configuration Management

**File:** [`src/config.ts`](src/config.ts) *(not examined yet)*

**Potential Issues:** Centralized config may not support tree-shaking

**Solution:** Audit and ensure modular configuration system

---

## 🟢 Low Priority Improvements

### 10. Dead Code Removal

**File:** [`src/hooks/old/useLottieInteractivity.tsx`](src/hooks/old/useLottieInteractivity.tsx)

**Issues:** 249 lines of commented-out code

**Solution:** Remove or properly refactor for v3

---

### 11. TODO Comments Cleanup

**Multiple Files:**
- [`src/hooks/useCallbackRef.ts:13`](src/hooks/useCallbackRef.ts) - "TODO: check if it's the MOST efficient way"
- [`src/hooks/useLottieFactory.tsx:53`](src/hooks/useLottieFactory.tsx) - "TODO: can't we just use `useState()`?"
- [`src/utils/SubscriptionManager.ts:12-14`](src/utils/SubscriptionManager.ts) - "TODO: Should we use eventemitter3?"

**Solution:** Review and resolve all TODO comments

---

## ✅ Performance Patterns (Keep & Enhance)

### Excellent Patterns to Preserve:

1. **Direct DOM Manipulation for Frame Updates**
   ```typescript
   // PlayerControlsProgressBar.tsx:35-41
   subscribe(LottieSubscription.Frame, ({ currentFrame }) => {
     if (containerRef.current) {
       containerRef.current.value = String(currentFrame);
       containerRef.current.style.setProperty("--value", `${currentFrame}`);
     }
   });
   ```

2. **useCallbackRef for Container Management**
   ```typescript
   // useLottieFactory.tsx:54-55
   const { ref: containerRef, setRef: setContainerRef } = useCallbackRef<HTMLDivElement>();
   ```

3. **Subscription Pattern for Event Handling**
   ```typescript
   // Core subscription system prevents re-render storms
   ```

4. **useNonReactiveState for Performance**
   ```typescript
   // Stores values without triggering re-renders
   ```

---

## 🎯 Implementation Priority

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix SubscriptionManager type safety
- [ ] Replace EventEmitter with lightweight alternative
- [ ] Audit and fix memory leaks

### Phase 2: Tree-Shaking (Week 2)
- [ ] Replace barrel exports
- [ ] Create modular entry points
- [ ] Split player components

### Phase 3: Architecture (Week 3)
- [ ] Implement compound component pattern
- [ ] Complete TODO implementations
- [ ] Improve error handling

### Phase 4: Polish (Week 4)
- [ ] Remove dead code
- [ ] Enhance TypeScript strictness
- [ ] Performance testing and optimization

---

## 📊 Success Metrics

- **Bundle Size**: Reduce by 30%+ through tree-shaking
- **Type Safety**: Zero `@ts-ignore` comments
- **Memory**: No memory leaks in long-running apps
- **Modularity**: Components usable independently
- **Performance**: Maintain 60fps animation performance

---

## 🛡️ Risk Mitigation

**Low Risk Changes:**
- Type safety fixes
- Dead code removal
- Error handling improvements

**Medium Risk Changes:**
- Tree-shaking exports (requires testing)
- Memory management (needs careful validation)

**High Risk Changes:**
- Component architecture (extensive testing needed)
- Subscription system changes (could break performance)

**Recommendation:** Implement in phases with comprehensive testing at each stage.