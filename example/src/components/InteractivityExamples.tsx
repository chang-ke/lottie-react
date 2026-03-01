"use client";

import {
  Lottie,
  InteractivityMode,
  InteractivityActionType,
  useLottie,
  useLottieInteractivity,
} from "lottie-react";
import { useRef } from "react";

const SRC = "/assets/groovyWalk.json";

const sectionStyle: React.CSSProperties = {
  marginBottom: "3rem",
  padding: "1.5rem",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  backgroundColor: "#fafafa",
};

const labelStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "0.25rem 0.6rem",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: "0.75rem",
};

const codeStyle: React.CSSProperties = {
  display: "block",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  backgroundColor: "#1e1e2e",
  color: "#cdd6f4",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  lineHeight: 1.6,
  overflowX: "auto",
  whiteSpace: "pre",
  marginTop: "0.75rem",
};

// Wrapper that gives the Lottie animation a visible size.
// Player uses height:100% so we provide an explicit height.
const animBox: React.CSSProperties = {
  width: 280,
  height: 280,
};

// ─────────────────────────────────────────────────────────────────────────────
// Scroll example
// ─────────────────────────────────────────────────────────────────────────────

export function ScrollExample() {
  // Pass this ref to `container` so the scroll listener attaches to the
  // right element and computeScrollProgress uses its viewport bounds.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
        scroll
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Scroll-linked animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Scroll down inside the box. The animation seeks forward as the
        character scrolls through the visible area.
      </p>

      {/* Outer scrollable container */}
      <div
        ref={scrollRef}
        style={{
          height: 500,
          overflowY: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        {/* Tall inner — animation sits naturally in the flow */}
        <div style={{ padding: "1rem 1rem 2rem", textAlign: "center", color: "#94a3b8" }}>
          ↓ Scroll down
        </div>

        {/* Spacer so animation starts below the fold */}
        <div style={{ height: 300 }} />

        {/* Animation in natural flow — moves through the container viewport */}
        <div style={{ ...animBox, margin: "0 auto" }}>
          <Lottie
            src={SRC}
            interactivity={{
              mode: InteractivityMode.scroll,
              actions: [
                {
                  visibility: [0, 1],
                  type: InteractivityActionType.seek,
                },
              ],
              container: scrollRef,
            }}
          />
        </div>

        {/* Spacer below */}
        <div style={{ height: 400, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "1rem", color: "#94a3b8" }}>
          ↑ Scroll back up
        </div>
      </div>

      <code style={codeStyle}>{`const scrollRef = useRef(null);

<div ref={scrollRef} style={{ height: 500, overflowY: "auto" }}>
  {/* tall content + spacer */}
  <Lottie
    src={src}
    interactivity={{
      mode: InteractivityMode.scroll,
      actions: [
        { visibility: [0, 1], type: InteractivityActionType.seek },
      ],
      container: scrollRef, // tracks scroll inside this element
    }}
  />
</div>`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cursor example
// ─────────────────────────────────────────────────────────────────────────────

export function CursorExample() {
  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#fef9c3", color: "#854d0e" }}>
        cursor
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Cursor-driven animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Move your mouse left/right over the animation. The frame advances as
        you move right.
      </p>

      <div style={{ ...animBox, cursor: "crosshair" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.cursor,
            actions: [
              {
                position: { x: [0, 1] },
                type: InteractivityActionType.seek,
              },
            ],
          }}
        />
      </div>

      <code style={codeStyle}>{`<Lottie
  src={src}
  interactivity={{
    mode: InteractivityMode.cursor,
    actions: [
      {
        position: { x: [0, 1] },
        type: InteractivityActionType.seek,
      },
    ],
  }}
/>`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hover example
// ─────────────────────────────────────────────────────────────────────────────

export function HoverExample() {
  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#dcfce7", color: "#15803d" }}>
        hover
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Hover-triggered animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Mouse over the animation to play it. When you leave, it reverses back
        to the start.
      </p>

      <div style={{ ...animBox, cursor: "pointer" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.hover,
            reverseOnLeave: true,
          }}
        />
      </div>

      <code style={codeStyle}>{`<Lottie
  src={src}
  interactivity={{
    mode: InteractivityMode.hover,
    reverseOnLeave: true,
  }}
/>`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Click example
// ─────────────────────────────────────────────────────────────────────────────

export function ClickExample() {
  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#fce7f3", color: "#9d174d" }}>
        click
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Click to toggle animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Click the animation to play/pause.
      </p>

      <div style={{ ...animBox, cursor: "pointer" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.click,
            type: InteractivityActionType.play,
            toggle: true,
          }}
        />
      </div>

      <code style={codeStyle}>{`<Lottie
  src={src}
  interactivity={{
    mode: InteractivityMode.click,
    type: InteractivityActionType.play,
    toggle: true, // alternates play/pause on each click
  }}
/>`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain example
// ─────────────────────────────────────────────────────────────────────────────

export function ChainExample() {
  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}>
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain state machine</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Animation starts looping. <strong>Click</strong> to freeze it, then
        click again to loop. Uses{" "}
        <code>InteractivityMode.chain</code> with click transitions.
      </p>

      <div style={{ ...animBox, cursor: "pointer" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.chain,
            loop: true,
            states: [
              {
                // Start playing immediately so the animation is visible
                name: "looping",
                type: InteractivityActionType.loop,
                loop: true,
                transition: { type: "click", target: "frozen" },
              },
              {
                name: "frozen",
                type: InteractivityActionType.stop,
                transition: { type: "click", target: "looping" },
              },
            ],
          }}
        />
      </div>

      <code style={codeStyle}>{`<Lottie
  src={src}
  interactivity={{
    mode: InteractivityMode.chain,
    loop: true,
    states: [
      {
        name: "looping",
        type: InteractivityActionType.loop,
        loop: true,
        transition: { type: "click", target: "frozen" },
      },
      {
        name: "frozen",
        type: InteractivityActionType.stop,
        transition: { type: "click", target: "looping" },
      },
    ],
  }}
/>`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Imperative hook example
// ─────────────────────────────────────────────────────────────────────────────

export function ImperativeHookExample() {
  const lottie = useLottie({ src: SRC });
  const { isActive, disable, enable } = useLottieInteractivity(lottie, {
    mode: InteractivityMode.hover,
    reverseOnLeave: true,
  });

  return (
    <section style={sectionStyle}>
      <span style={{ ...labelStyle, backgroundColor: "#f1f5f9", color: "#475569" }}>
        imperative
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Standalone hook usage</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Same hover behaviour, driven via <code>useLottieInteractivity</code>{" "}
        directly. You can <code>disable()</code> / <code>enable()</code>{" "}
        interactivity at runtime.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <button
          onClick={disable}
          disabled={!isActive}
          style={{ padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer" }}
        >
          Disable
        </button>
        <button
          onClick={enable}
          disabled={isActive}
          style={{ padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer" }}
        >
          Enable
        </button>
        <span
          style={{
            alignSelf: "center",
            color: isActive ? "#16a34a" : "#dc2626",
            fontWeight: 600,
          }}
        >
          {isActive ? "active" : "disabled"}
        </span>
      </div>

      <div style={{ ...animBox, cursor: "pointer" }} ref={lottie.setContainerRef} />

      <code style={codeStyle}>{`const lottie = useLottie({ src });
const { isActive, disable, enable } = useLottieInteractivity(lottie, {
  mode: InteractivityMode.hover,
  reverseOnLeave: true,
});

// mount the animation manually
return <div ref={lottie.setContainerRef} />;`}</code>
    </section>
  );
}
