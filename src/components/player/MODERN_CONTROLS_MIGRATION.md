# Modern Player Controls Migration Guide

This guide explains how to migrate from the legacy `PlayerControls` to the new `ModernPlayerControls` component that features YouTube-inspired design, better responsiveness, and improved user experience.

## Key Improvements

### 🎨 **Visual Design**
- **Compact Size**: Buttons are 24px-40px instead of fixed 30px
- **Better Hierarchy**: Primary controls (play/pause) are larger than secondary controls
- **Smooth Animations**: Hover states, focus indicators, and transitions
- **YouTube-Inspired**: Modern, clean aesthetic that works well on all screen sizes

### 📱 **Responsive Design**
- **Smart Hiding**: Non-essential controls hide on small screens
- **Touch-Friendly**: Minimum 20px touch targets on mobile
- **Flexible Layout**: Progress bar adapts to available space

### ♿ **Accessibility**
- **Proper ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Indicators**: Clear visual focus states
- **Semantic HTML**: Proper roles and structure

### 🔧 **Performance**
- **Optimized Re-renders**: Better React optimization
- **Smaller Bundle**: More efficient icon system
- **GPU Acceleration**: Hardware-accelerated animations

## Migration Examples

### Basic Migration

**Before (Legacy):**
```tsx
import { PlayerControls } from '@lottiefiles/lottie-react';

<PlayerControls
  show={true}
  state={state}
  totalFrames={totalFrames}
  direction={direction}
  loop={loop}
  play={play}
  pause={pause}
  stop={stop}
  seek={seek}
  changeDirection={changeDirection}
  toggleLoop={toggleLoop}
  speed={speed}
  changeSpeed={changeSpeed}
  subscribe={subscribe}
  fullscreenElementRef={containerRef}
/>
```

**After (Modern):**
```tsx
import { ModernPlayerControls } from '@lottiefiles/lottie-react';

<ModernPlayerControls
  show={true}
  state={state}
  totalFrames={totalFrames}
  direction={direction}
  loop={loop}
  play={play}
  pause={pause}
  stop={stop}
  seek={seek}
  changeDirection={changeDirection}
  toggleLoop={toggleLoop}
  speed={speed}
  changeSpeed={changeSpeed}
  subscribe={subscribe}
  fullscreenElementRef={containerRef}
  // New optional props:
  compact={false}  // Enable compact mode for small containers
/>
```

### Responsive/Mobile Optimized

```tsx
import { ModernPlayerControls } from '@lottiefiles/lottie-react';

// Automatically adapts to screen size
<ModernPlayerControls
  {...controlProps}
  compact={isMobile} // You can control this manually
/>
```

### Custom Control Selection

```tsx
import { ModernPlayerControls, PlayerControlsElement } from '@lottiefiles/lottie-react';

// Only show essential controls
<ModernPlayerControls
  {...controlProps}
  elements={[
    PlayerControlsElement.Play,
    PlayerControlsElement.Pause,
    PlayerControlsElement.ProgressBar,
    PlayerControlsElement.Fullscreen,
  ]}
/>
```

### Using Individual Modern Components

```tsx
import { 
  ModernPlayButton, 
  ModernPauseButton, 
  ModernProgressBar,
  PlayerControlsTheme 
} from '@lottiefiles/lottie-react';

// Build your own custom layout
<div style={{ 
  display: 'flex', 
  gap: PlayerControlsTheme.sizes.gapMedium,
  padding: PlayerControlsTheme.sizes.controlsPadding 
}}>
  {state !== LottieState.Playing ? (
    <ModernPlayButton onClick={play} />
  ) : (
    <ModernPauseButton onClick={pause} />
  )}
  
  <ModernProgressBar
    subscribe={subscribe}
    totalFrames={totalFrames}
    onChange={seek}
  />
</div>
```

## Customization

### Theme Customization

```tsx
import { PlayerControlsTheme } from '@lottiefiles/lottie-react';

// Access theme values for custom styling
const customButtonStyle = {
  backgroundColor: PlayerControlsTheme.colors.buttonHover,
  borderRadius: PlayerControlsTheme.sizes.borderRadius,
  padding: PlayerControlsTheme.sizes.gapSmall,
};
```

### Responsive Breakpoints

```tsx
import { PlayerControlsTheme, getResponsiveSize } from '@lottiefiles/lottie-react';

// Use responsive sizing utilities
const buttonSize = getResponsiveSize(32, window.innerWidth);

// Access breakpoints
if (window.innerWidth < PlayerControlsTheme.breakpoints.mobile) {
  // Mobile-specific logic
}
```

## Breaking Changes

### Props Changes
- No breaking changes to existing props
- New optional props: `compact`, `controlGroups`

### Style Changes
- Controls are now more compact by default
- Background has blur effect (`backdrop-filter`)
- Button sizes are variable based on importance

### Behavior Changes
- **Responsive Hiding**: Some controls hide automatically on small screens
- **Improved Touch**: Better touch target sizes on mobile
- **Smooth Animations**: Hover and focus states have transitions

## Backwards Compatibility

The legacy `PlayerControls` component remains available and unchanged. You can migrate gradually:

```tsx
// Both can coexist during migration
import { PlayerControls, ModernPlayerControls } from '@lottiefiles/lottie-react';

// Use legacy for existing implementations
<PlayerControls {...legacyProps} />

// Use modern for new implementations
<ModernPlayerControls {...modernProps} />
```

## Performance Notes

### Bundle Size Impact
- **Icons**: New optimized SVG icons (~2KB smaller)
- **Components**: Slightly larger due to responsive logic (~3KB)
- **Net Effect**: Approximately +1KB total

### Runtime Performance
- **Better**: Fewer re-renders due to optimized state handling
- **Better**: Hardware-accelerated animations
- **Better**: Efficient responsive calculations

## Migration Checklist

- [ ] Import `ModernPlayerControls` instead of `PlayerControls`
- [ ] Test on different screen sizes
- [ ] Verify all controls work as expected
- [ ] Check accessibility with screen readers
- [ ] Test keyboard navigation
- [ ] Validate touch interactions on mobile
- [ ] Consider using `compact` prop for small containers
- [ ] Update any custom styling to use theme values

## Need Help?

- Check the TypeScript definitions for complete prop documentation
- Look at the theme file (`PlayerControlsTheme.ts`) for customization options
- Use browser dev tools to inspect the component structure
- Test with accessibility tools for screen reader compatibility