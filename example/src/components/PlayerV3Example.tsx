import React from "react";
import { Lottie } from "lottie-react";

// Remote animation used across all examples
const SAMPLE_ANIMATION =
  "https://raw.githubusercontent.com/Gamote/lottie-react/refs/heads/v3/example/public/assets/groovyWalk.json";

// ─────────────────────────────────────────────
// Example 1: Basic usage (no controls)
// ─────────────────────────────────────────────
export const BasicLottieV3 = () => (
  <div style={{ width: 400, height: 400 }}>
    <Lottie
      src={SAMPLE_ANIMATION}
      initialValues={{ loop: true, autoplay: true }}
    />
  </div>
);

// ─────────────────────────────────────────────
// Example 2: Full-featured player with all controls and a custom theme
// ─────────────────────────────────────────────
export const CustomPlayerV3 = () => (
  <div style={{ width: 600, height: 500 }}>
    <Lottie
      src={SAMPLE_ANIMATION}
      initialValues={{ loop: true, autoplay: true }}
      player={{
        controls: {
          playPause: true,
          stop: true,
          progressBar: true,
          frameIndicator: true,
          speed: true,
          direction: true,
          loop: true,
          fullscreen: true,
        },
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
          loading: {
            minDisplayTime: 500,
            fadeOutTime: 600,
          },
          error: (
            <div style={{ color: "#ef4444" }}>Failed to load animation</div>
          ),
        },
      }}
    />
  </div>
);

// ─────────────────────────────────────────────
// Example 3: Minimal controls
// ─────────────────────────────────────────────
export const MinimalPlayerV3 = () => (
  <div style={{ width: 400, height: 400 }}>
    <Lottie
      src={SAMPLE_ANIMATION}
      initialValues={{ loop: true, autoplay: true }}
      player={{
        controls: {
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

// ─────────────────────────────────────────────
// Example 4: Mobile-optimised compact player
// ─────────────────────────────────────────────
export const MobilePlayerV3 = () => (
  <div style={{ width: 320, height: 240 }}>
    <Lottie
      src={SAMPLE_ANIMATION}
      initialValues={{ loop: true, autoplay: true }}
      player={{
        controls: {
          playPause: true,
          progressBar: true,
          frameIndicator: false,
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

// ─────────────────────────────────────────────
// Example 5: Fluid / fill-container layout
// ─────────────────────────────────────────────
export const FullRes = () => (
  <div style={{ width: "100%", aspectRatio: "4/3", minHeight: 300 }}>
    <Lottie
      src={SAMPLE_ANIMATION}
      initialValues={{ loop: true, autoplay: true }}
      player={{
        controls: true,
      }}
    />
  </div>
);
