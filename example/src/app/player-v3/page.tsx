"use client";

import {
  BasicLottieV3,
  CustomPlayerV3,
  MinimalPlayerV3,
  MobilePlayerV3,
} from "@/components/PlayerV3Example";

export default function PlayerV3Page() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ color: "#6366f1", marginBottom: "1rem" }}>
          🎮 Player V3 Examples
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#64748b" }}>
          Demonstrating the new V3 Player architecture with subscription-based
          updates, no re-renders on frame changes, and complete display +
          controls solution.
        </p>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ color: "#334155", margin: "0 0 0.5rem 0" }}>
            🚀 Key V3 Features:
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#475569" }}>
            <li>
              <strong>Performance Optimized:</strong> No re-renders on frame
              updates
            </li>
            <li>
              <strong>Controls Off by Default:</strong> Clean API, opt-in
              controls
            </li>
            <li>
              <strong>Subscription-based:</strong> Components subscribe only to
              what they need
            </li>
            <li>
              <strong>Complete Solution:</strong> Display + controls in one
              component
            </li>
            <li>
              <strong>Highly Customizable:</strong> Themes, responsive behavior,
              overlays
            </li>
          </ul>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {/* Example 1: Basic Usage */}
        <section>
          <h2 style={{ color: "#1e293b", marginBottom: "1rem" }}>
            1. Basic Usage (No Controls)
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
            By default, V3 shows only the animation display - no controls.
            Perfect for decorative animations.
          </p>
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "2rem",
              backgroundColor: "#fafafa",
            }}
          >
            <BasicLottieV3 />
          </div>
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", color: "#6366f1" }}>
              View Code
            </summary>
            <pre
              style={{
                backgroundColor: "#1e293b",
                color: "#e2e8f0",
                padding: "1rem",
                borderRadius: "4px",
                fontSize: "0.875rem",
                overflow: "auto",
              }}
            >
              {`<Lottie
  src={SAMPLE_ANIMATION}
  // No controls by default - just the animation display
/>`}
            </pre>
          </details>
        </section>

        {/*        /!* Example 2: Custom Player *!/*/}
        {/*        <section>*/}
        {/*          <h2 style={{ color: "#1e293b", marginBottom: "1rem" }}>*/}
        {/*            2. Full-Featured Player*/}
        {/*          </h2>*/}
        {/*          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>*/}
        {/*            Complete player with all controls, custom theme, responsive*/}
        {/*            behavior, and overlays.*/}
        {/*          </p>*/}
        {/*          <div*/}
        {/*            style={{*/}
        {/*              border: "1px solid #e2e8f0",*/}
        {/*              borderRadius: "8px",*/}
        {/*              padding: "2rem",*/}
        {/*              backgroundColor: "#fafafa",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <CustomPlayerV3 />*/}
        {/*          </div>*/}
        {/*          <details style={{ marginTop: "1rem" }}>*/}
        {/*            <summary style={{ cursor: "pointer", color: "#6366f1" }}>*/}
        {/*              View Code*/}
        {/*            </summary>*/}
        {/*            <pre*/}
        {/*              style={{*/}
        {/*                backgroundColor: "#1e293b",*/}
        {/*                color: "#e2e8f0",*/}
        {/*                padding: "1rem",*/}
        {/*                borderRadius: "4px",*/}
        {/*                fontSize: "0.875rem",*/}
        {/*                overflow: "auto",*/}
        {/*              }}*/}
        {/*            >*/}
        {/*              {`<Lottie*/}
        {/*  src={SAMPLE_ANIMATION}*/}
        {/*  player={{*/}
        {/*    theme: {*/}
        {/*      colors: {*/}
        {/*        primary: '#6366f1',*/}
        {/*        secondary: '#94a3b8',*/}
        {/*        background: 'rgba(15, 23, 42, 0.9)',*/}
        {/*        accent: '#f59e0b',*/}
        {/*      },*/}
        {/*      sizing: {*/}
        {/*        height: 60,*/}
        {/*        buttonSize: 36,*/}
        {/*        borderRadius: 8,*/}
        {/*      },*/}
        {/*      effects: {*/}
        {/*        backdropBlur: true,*/}
        {/*        shadows: true,*/}
        {/*        transitions: true,*/}
        {/*      },*/}
        {/*    },*/}
        {/*    controls: {*/}
        {/*      playPause: true,*/}
        {/*      stop: true,*/}
        {/*      progressBar: true,*/}
        {/*      frameIndicator: true,*/}
        {/*      speed: true,*/}
        {/*      direction: true,*/}
        {/*      loop: true,*/}
        {/*      fullscreen: true,*/}
        {/*    },*/}
        {/*    responsive: {*/}
        {/*      enabled: true,*/}
        {/*      breakpoint: 640,*/}
        {/*      hideOnMobile: {*/}
        {/*        stop: true,*/}
        {/*        direction: true,*/}
        {/*        speed: true,*/}
        {/*      },*/}
        {/*    },*/}
        {/*  }}*/}
        {/*/>`}*/}
        {/*            </pre>*/}
        {/*          </details>*/}
        {/*        </section>*/}

        {/*        /!* Example 3: Minimal Player *!/*/}
        {/*        <section>*/}
        {/*          <h2 style={{ color: "#1e293b", marginBottom: "1rem" }}>*/}
        {/*            3. Minimal Controls*/}
        {/*          </h2>*/}
        {/*          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>*/}
        {/*            Simple player with just play/pause and progress bar - perfect for*/}
        {/*            most use cases.*/}
        {/*          </p>*/}
        {/*          <div*/}
        {/*            style={{*/}
        {/*              border: "1px solid #e2e8f0",*/}
        {/*              borderRadius: "8px",*/}
        {/*              padding: "2rem",*/}
        {/*              backgroundColor: "#fafafa",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <MinimalPlayerV3 />*/}
        {/*          </div>*/}
        {/*          <details style={{ marginTop: "1rem" }}>*/}
        {/*            <summary style={{ cursor: "pointer", color: "#6366f1" }}>*/}
        {/*              View Code*/}
        {/*            </summary>*/}
        {/*            <pre*/}
        {/*              style={{*/}
        {/*                backgroundColor: "#1e293b",*/}
        {/*                color: "#e2e8f0",*/}
        {/*                padding: "1rem",*/}
        {/*                borderRadius: "4px",*/}
        {/*                fontSize: "0.875rem",*/}
        {/*                overflow: "auto",*/}
        {/*              }}*/}
        {/*            >*/}
        {/*              {`<Lottie*/}
        {/*  src={SAMPLE_ANIMATION}*/}
        {/*  player={{*/}
        {/*    controls: {*/}
        {/*      playPause: true,*/}
        {/*      progressBar: true,*/}
        {/*    },*/}
        {/*    theme: {*/}
        {/*      colors: {*/}
        {/*        primary: '#ffffff',*/}
        {/*        background: 'rgba(0, 0, 0, 0.7)',*/}
        {/*      },*/}
        {/*    },*/}
        {/*  }}*/}
        {/*/>`}*/}
        {/*            </pre>*/}
        {/*          </details>*/}
        {/*        </section>*/}

        {/*        /!* Example 4: Mobile Optimized *!/*/}
        {/*        <section>*/}
        {/*          <h2 style={{ color: "#1e293b", marginBottom: "1rem" }}>*/}
        {/*            4. Mobile-Optimized*/}
        {/*          </h2>*/}
        {/*          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>*/}
        {/*            Compact player optimized for mobile devices with responsive*/}
        {/*            behavior.*/}
        {/*          </p>*/}
        {/*          <div*/}
        {/*            style={{*/}
        {/*              border: "1px solid #e2e8f0",*/}
        {/*              borderRadius: "8px",*/}
        {/*              padding: "2rem",*/}
        {/*              backgroundColor: "#fafafa",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <MobilePlayerV3 />*/}
        {/*          </div>*/}
        {/*          <details style={{ marginTop: "1rem" }}>*/}
        {/*            <summary style={{ cursor: "pointer", color: "#6366f1" }}>*/}
        {/*              View Code*/}
        {/*            </summary>*/}
        {/*            <pre*/}
        {/*              style={{*/}
        {/*                backgroundColor: "#1e293b",*/}
        {/*                color: "#e2e8f0",*/}
        {/*                padding: "1rem",*/}
        {/*                borderRadius: "4px",*/}
        {/*                fontSize: "0.875rem",*/}
        {/*                overflow: "auto",*/}
        {/*              }}*/}
        {/*            >*/}
        {/*              {`<Lottie*/}
        {/*  src={SAMPLE_ANIMATION}*/}
        {/*  player={{*/}
        {/*    controls: {*/}
        {/*      playPause: true,*/}
        {/*      progressBar: true,*/}
        {/*      frameIndicator: false, // Hidden on mobile*/}
        {/*    },*/}
        {/*    responsive: {*/}
        {/*      enabled: true,*/}
        {/*      compact: true,*/}
        {/*      breakpoint: 480,*/}
        {/*    },*/}
        {/*    theme: {*/}
        {/*      sizing: {*/}
        {/*        height: 48,*/}
        {/*        buttonSize: 32,*/}
        {/*      },*/}
        {/*    },*/}
        {/*  }}*/}
        {/*/>`}*/}
        {/*            </pre>*/}
        {/*          </details>*/}
        {/*        </section>*/}
        {/*      </div>*/}

        {/*      <div*/}
        {/*        style={{*/}
        {/*          marginTop: "4rem",*/}
        {/*          padding: "2rem",*/}
        {/*          backgroundColor: "#f0f9ff",*/}
        {/*          borderRadius: "8px",*/}
        {/*          border: "1px solid #0ea5e9",*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <h3 style={{ color: "#0c4a6e", margin: "0 0 1rem 0" }}>*/}
        {/*          🎯 Performance Benefits*/}
        {/*        </h3>*/}
        {/*        <div*/}
        {/*          style={{*/}
        {/*            display: "grid",*/}
        {/*            gridTemplateColumns: "1fr 1fr",*/}
        {/*            gap: "1.5rem",*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          <div>*/}
        {/*            <h4 style={{ color: "#075985", margin: "0 0 0.5rem 0" }}>*/}
        {/*              Before (V2):*/}
        {/*            </h4>*/}
        {/*            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#0c4a6e" }}>*/}
        {/*              <li>Re-renders on every frame update</li>*/}
        {/*              <li>Controls always visible by default</li>*/}
        {/*              <li>Monolithic player components</li>*/}
        {/*              <li>State passed as props</li>*/}
        {/*            </ul>*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <h4 style={{ color: "#075985", margin: "0 0 0.5rem 0" }}>*/}
        {/*              After (V3):*/}
        {/*            </h4>*/}
        {/*            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#0c4a6e" }}>*/}
        {/*              <li>Zero re-renders on frame updates</li>*/}
        {/*              <li>Controls off by default</li>*/}
        {/*              <li>Subscription-based architecture</li>*/}
        {/*              <li>Direct DOM updates for performance</li>*/}
        {/*            </ul>*/}
        {/*          </div>*/}
        {/*        </div>*/}
      </div>
    </div>
  );
}
