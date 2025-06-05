import React from "react";
import { Lottie } from "lottie-react";

/**
 * Example demonstrating the new V3 Player architecture
 *
 * Key benefits:
 * - No re-renders on frame updates (performance optimized)
 * - Controls are OFF by default (clean API)
 * - Subscription-based updates for performance-critical components
 * - Complete player solution with display + controls
 */

// Common animation used across examples
const SAMPLE_ANIMATION =
  "https://raw.githubusercontent.com/Gamote/lottie-react/refs/heads/v3/example/public/assets/groovyWalk.json";

// Example 1: Basic usage (no controls)
export const BasicLottieV3 = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Lottie
        src={SAMPLE_ANIMATION}
        // No controls by default - just the animation display
      />
    </div>
  );
};

// Example 2: With custom player configuration
export const CustomPlayerV3 = () => {
  return (
    <div style={{ width: 600, height: 500 }}>
      <Lottie
        src={SAMPLE_ANIMATION}
        player={{
          theme: {
            colors: {
              primary: "#6366f1",
              secondary: "#94a3b8",
              background: "rgba(15, 23, 42, 0.9)",
              accent: "#f59e0b",
            },
            sizing: {
              height: 60,
              buttonSize: 36,
              borderRadius: 8,
            },
            effects: {
              backdropBlur: true,
              shadows: true,
              transitions: true,
            },
          },
          elements: {
            playPause: true,
            stop: true,
            progressBar: true,
            frameIndicator: true,
            speed: true,
            direction: true,
            loop: true,
            fullscreen: true,
          },
          responsive: {
            enabled: true,
            breakpoint: 640,
            hideOnMobile: {
              stop: true,
              direction: true,
              speed: true,
            },
          },
          overlays: {
            loading: (
              <div style={{ color: "#6366f1" }}>Loading animation...</div>
            ),
            error: <div style={{ color: "#ef4444" }}>Failed to load</div>,
          },
        }}
      />
    </div>
  );
};

// Example 3: Minimal controls
export const MinimalPlayerV3 = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Lottie
        src={SAMPLE_ANIMATION}
        player={{
          elements: {
            playPause: true,
            progressBar: true,
          },
          theme: {
            colors: {
              primary: "#ffffff",
              background: "rgba(0, 0, 0, 0.7)",
            },
          },
        }}
      />
    </div>
  );
};

// Example 4: Mobile-optimized
export const MobilePlayerV3 = () => {
  return (
    <div style={{ width: 320, height: 240 }}>
      <Lottie
        src={SAMPLE_ANIMATION}
        player={{
          elements: {
            playPause: true,
            progressBar: true,
            frameIndicator: false, // Hidden on mobile
          },
          responsive: {
            enabled: true,
            compact: true,
            breakpoint: 480,
          },
          theme: {
            sizing: {
              height: 48,
              buttonSize: 32,
            },
          },
        }}
      />
    </div>
  );
};
