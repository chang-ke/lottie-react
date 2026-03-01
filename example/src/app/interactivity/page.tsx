"use client";

import {
  ChainExample,
  ClickExample,
  CursorExample,
  HoverExample,
  ImperativeHookExample,
  ScrollExample,
} from "@/components/InteractivityExamples";

export default function InteractivityPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ color: "#6366f1", marginBottom: "0.5rem" }}>
          🎮 Interactivity Examples
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#64748b" }}>
          Five interaction modes — scroll, cursor, hover, click, chain — all
          driven by{" "}
          <code>useLottieInteractivity</code> with zero re-renders on frame
          updates.
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
          <strong style={{ color: "#334155" }}>Quick start:</strong>
          <pre
            style={{
              margin: "0.5rem 0 0",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >{`// Declarative (via <Lottie> prop)
<Lottie src={src} interactivity={{ mode: "hover", reverseOnLeave: true }} />

// Imperative (standalone hook)
const lottie = useLottie({ src });
useLottieInteractivity(lottie, { mode: "hover", reverseOnLeave: true });`}</pre>
        </div>
      </div>

      <ScrollExample />
      <CursorExample />
      <HoverExample />
      <ClickExample />
      <ChainExample />
      <ImperativeHookExample />
    </div>
  );
}
