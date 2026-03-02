"use client";

import {
  ChainAutoExample,
  ChainCursorSyncExample,
  ChainExample,
  ChainHoldExample,
  ChainProgrammaticExample,
  ClickExample,
  CursorExample,
  HoverExample,
  ImperativeHookExample,
  ScrollExample,
} from "@/components/InteractivityExamples";

export default function InteractivityPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ color: "#6366f1", marginBottom: "0.5rem" }}>
          Interactivity Examples
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#64748b", marginBottom: "1rem" }}>
          Five modes — <strong>scroll</strong>, <strong>cursor</strong>,{" "}
          <strong>hover</strong>, <strong>click</strong>, <strong>chain</strong> —
          all driven by <code>useLottieInteractivity</code> with zero re-renders
          on frame updates.
        </p>

        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <strong style={{ color: "#334155" }}>Quick start</strong>
          <pre
            style={{
              margin: "0.5rem 0 0",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "#475569",
              overflowX: "auto",
            }}
          >{`// Declarative — via <Lottie> prop
<Lottie src={src} interactivity={{ mode: "hover", reverseOnLeave: true }} />

// Imperative — standalone hook (full control, same features)
const lottie = useLottie({ src });
const { isActive, currentChainState, goToChainState, disable, enable } =
  useLottieInteractivity(lottie, { mode: "hover", reverseOnLeave: true });
return <div ref={lottie.setContainerRef} />;`}</pre>
        </div>
      </div>

      {/* ── Scroll ─────────────────────────────────────────────────────────── */}
      <ScrollExample />

      {/* ── Cursor ─────────────────────────────────────────────────────────── */}
      <CursorExample />

      {/* ── Hover ──────────────────────────────────────────────────────────── */}
      <HoverExample />

      {/* ── Click ──────────────────────────────────────────────────────────── */}
      <ClickExample />

      {/* ── Chain ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ color: "#6d28d9", margin: "0 0 0.25rem" }}>Chain mode</h2>
        <p style={{ color: "#64748b", margin: 0 }}>
          A declarative state machine. Each state defines what the animation
          does and how to transition to the next state — from clicks and hover
          events to automatic timers and cursor position.
        </p>
      </div>
      <ChainExample />
      <ChainAutoExample />
      <ChainHoldExample />
      <ChainCursorSyncExample />
      <ChainProgrammaticExample />

      {/* ── Imperative hook ────────────────────────────────────────────────── */}
      <ImperativeHookExample />
    </div>
  );
}
