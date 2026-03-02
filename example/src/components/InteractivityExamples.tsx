"use client";

import {
  ChainTransitionType,
  InteractivityActionType,
  InteractivityMode,
  Lottie,
  useLottie,
  useLottieInteractivity,
} from "lottie-react";
import React, { useRef } from "react";

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

const variantLabel: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 0.4rem",
};

// Fixed-size wrapper so the Lottie SVG has an explicit viewport
const animBox: React.CSSProperties = { width: 240, height: 240 };

// ─────────────────────────────────────────────────────────────────────────────
// Scroll
// ─────────────────────────────────────────────────────────────────────────────

export function ScrollExample() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#dbeafe", color: "#1d4ed8" }}
      >
        scroll
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Scroll-linked animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Scroll inside the box. The first animation <strong>seeks</strong>{" "}
        continuously with scroll position; the second{" "}
        <strong>plays once</strong> the first time it enters the viewport, then
        never again.
      </p>

      <div
        ref={scrollRef}
        style={{
          height: 520,
          overflowY: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{ padding: "0.75rem", textAlign: "center", color: "#94a3b8" }}
        >
          ↓ Scroll down
        </div>
        <div style={{ height: 220 }} />

        <p style={{ textAlign: "center", ...variantLabel }}>
          seek — tracks scroll
        </p>
        <div style={{ ...animBox, margin: "0 auto" }}>
          <Lottie
            src={SRC}
            interactivity={{
              mode: InteractivityMode.scroll,
              actions: [
                { visibility: [0, 1], type: InteractivityActionType.seek },
              ],
              container: scrollRef,
            }}
          />
        </div>

        <div style={{ height: 260 }} />

        <p style={{ textAlign: "center", ...variantLabel }}>
          playOnce — fires once on entry
        </p>
        <div style={{ ...animBox, margin: "0 auto" }}>
          <Lottie
            src={SRC}
            interactivity={{
              mode: InteractivityMode.scroll,
              actions: [
                {
                  visibility: [0.1, 0.9],
                  type: InteractivityActionType.playOnce,
                },
              ],
              container: scrollRef,
            }}
          />
        </div>

        <div
          style={{
            height: 280,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "1rem",
            color: "#94a3b8",
          }}
        >
          ↑ Scroll back up
        </div>
      </div>

      <code style={codeStyle}>{`const scrollRef = useRef(null);

<div ref={scrollRef} style={{ height: 520, overflowY: "auto" }}>
  {/* seek — frame is tied to scroll position */}
  <Lottie src={src} interactivity={{
    mode: InteractivityMode.scroll,
    actions: [{ visibility: [0, 1], type: InteractivityActionType.seek }],
    container: scrollRef,
  }} />

  {/* playOnce — plays once the first time [10%–90%] of the viewport is reached */}
  <Lottie src={src} interactivity={{
    mode: InteractivityMode.scroll,
    actions: [{ visibility: [0.1, 0.9], type: InteractivityActionType.playOnce }],
    container: scrollRef,
  }} />
</div>

// Multiple visibility ranges — different action per scroll depth (first match wins)
actions: [
  { visibility: [0,   0.5], type: InteractivityActionType.seek },
  { visibility: [0.5, 1  ], type: InteractivityActionType.play },
]

// container options: "window" (default) | "self" | HTMLElement | React ref`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cursor
// ─────────────────────────────────────────────────────────────────────────────

export function CursorExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#fef9c3", color: "#854d0e" }}
      >
        cursor
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Cursor-driven animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Position actions fire when the cursor is inside the specified X/Y range
        (0–1 relative to the container). Multiple actions create zones — first
        match wins.
      </p>

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
        <div>
          <p style={variantLabel}>seek — X axis</p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
            }}
          >
            move left/right to scrub
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
        </div>

        <div>
          <p style={variantLabel}>play / stop zones</p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
            }}
          >
            right half → play &nbsp;·&nbsp; left half → stop
          </p>
          <div style={{ ...animBox, cursor: "crosshair" }}>
            <Lottie
              src={SRC}
              interactivity={{
                mode: InteractivityMode.cursor,
                actions: [
                  {
                    position: { x: [0, 0.45] },
                    type: InteractivityActionType.stop,
                  },
                  {
                    position: { x: [0.55, 1] },
                    type: InteractivityActionType.play,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>

      <code
        style={codeStyle}
      >{`// Seek: X position (0→1) maps to animation frames
{ position: { x: [0, 1] }, type: InteractivityActionType.seek }

// Zones: different action per region (first matching action wins)
actions: [
  { position: { x: [0,    0.45] }, type: InteractivityActionType.stop },
  { position: { x: [0.55, 1   ] }, type: InteractivityActionType.play },
]

// 2D: X and Y ranges combined — action fires only inside the rectangle
{ position: { x: [0.25, 0.75], y: [0.25, 0.75] }, type: InteractivityActionType.play }

// FrameSpecifier for seek target: number | "50%" | "markerName"
{ position: { x: [0, 1] }, type: InteractivityActionType.seek, frames: [0, "100%"] }`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hover
// ─────────────────────────────────────────────────────────────────────────────

export function HoverExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#dcfce7", color: "#15803d" }}
      >
        hover
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Hover-triggered animation</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        <code>mouseenter</code> / <code>mouseleave</code> (and touch
        equivalents) control playback. Customise entry/exit behaviour with{" "}
        <code>onEnter</code>, <code>onLeave</code>, <code>reverseOnLeave</code>,
        and <code>loop</code>.
      </p>

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
        <div>
          <p style={variantLabel}>reverseOnLeave</p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
            }}
          >
            plays forward, reverses on leave
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
        </div>

        <div>
          <p style={variantLabel}>loop while hovering</p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
            }}
          >
            loops while hovered, stops on leave
          </p>
          <div style={{ ...animBox, cursor: "pointer" }}>
            <Lottie
              src={SRC}
              interactivity={{
                mode: InteractivityMode.hover,
                loop: true,
              }}
            />
          </div>
        </div>
      </div>

      <code
        style={codeStyle}
      >{`// Reverse on leave — plays backward to frame 0 when mouse exits
{ mode: InteractivityMode.hover, reverseOnLeave: true }

// Loop while hovered — stops (not reverses) on leave
{ mode: InteractivityMode.hover, loop: true }

// Constrain playback to a sub-range of the animation
{ mode: InteractivityMode.hover, frames: ["25%", "75%"], reverseOnLeave: true }

// Override entry/exit actions explicitly
{ mode: InteractivityMode.hover, onEnter: "play", onLeave: "stop" }`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Click
// ─────────────────────────────────────────────────────────────────────────────

export function ClickExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#fce7f3", color: "#9d174d" }}
      >
        click
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Click interaction</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        A single click triggers play, segment playback, or a toggle. Use{" "}
        <code>count</code> to lock after N completions.
      </p>

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
        <div>
          <p style={variantLabel}>toggle play / pause</p>
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
        </div>

        <div>
          <p style={variantLabel}>play — stop after 2</p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
            }}
          >
            click to play — locks after 2 completions
          </p>
          <div style={{ ...animBox, cursor: "pointer" }}>
            <Lottie
              src={SRC}
              interactivity={{
                mode: InteractivityMode.click,
                type: InteractivityActionType.play,
                count: 2,
              }}
            />
          </div>
        </div>
      </div>

      <code style={codeStyle}>{`// Toggle play/pause on each click
{ mode: InteractivityMode.click, type: InteractivityActionType.play, toggle: true }

// Play on click — automatically locks after N completions
{ mode: InteractivityMode.click, type: InteractivityActionType.play, count: 2 }

// Play a specific segment on each click
{
  mode: InteractivityMode.click,
  type: InteractivityActionType.playSegments,
  frames: ["25%", "75%"],
}`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain — click transitions
// ─────────────────────────────────────────────────────────────────────────────

export function ChainExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}
      >
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain — click transitions</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        A state machine where each state has an animation action and a
        transition rule. <strong>Click</strong> to toggle between looping and
        frozen. <code>forceFlag: true</code> always restarts the animation from
        the beginning when re-entering a state.
      </p>

      <div style={{ ...animBox, cursor: "pointer" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.chain,
            loop: true,
            states: [
              {
                name: "looping",
                type: InteractivityActionType.loop,
                transition: {
                  type: ChainTransitionType.click,
                  target: "frozen",
                },
              },
              {
                name: "frozen",
                type: InteractivityActionType.stop,
                forceFlag: true,
                transition: {
                  type: ChainTransitionType.click,
                  target: "looping",
                },
              },
            ],
          }}
        />
      </div>

      <code style={codeStyle}>{`states: [
  {
    name: "looping",
    type: InteractivityActionType.loop,
    transition: { type: ChainTransitionType.click, target: "frozen" },
  },
  {
    name: "frozen",
    type: InteractivityActionType.stop,
    forceFlag: true, // always restart from frame 0 when re-entering this state
    transition: { type: ChainTransitionType.click, target: "looping" },
  },
]

// Require N clicks/hovers before advancing
transition: { type: ChainTransitionType.click, count: 3, target: "next" }
transition: { type: ChainTransitionType.hover, count: 2, target: "next" }`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain — auto-sequence
// ─────────────────────────────────────────────────────────────────────────────

export function ChainAutoExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}
      >
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain — auto-sequence</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        No interaction required — transitions fire automatically on animation
        events. <code>onComplete</code> advances when the animation finishes;{" "}
        <code>delay</code> advances after a timeout.
      </p>

      <div style={animBox}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.chain,
            states: [
              {
                name: "playing",
                type: InteractivityActionType.play,
                transition: {
                  type: ChainTransitionType.onComplete,
                  target: "resting",
                },
              },
              {
                name: "resting",
                type: InteractivityActionType.stop,
                transition: {
                  type: ChainTransitionType.delay,
                  delay: 1500,
                  target: "playing",
                },
              },
            ],
          }}
        />
      </div>

      <code style={codeStyle}>{`states: [
  {
    name: "playing",
    type: InteractivityActionType.play,
    // advance as soon as the animation completes
    transition: { type: ChainTransitionType.onComplete, target: "resting" },
  },
  {
    name: "resting",
    type: InteractivityActionType.stop,
    // advance after 1.5 s
    transition: { type: ChainTransitionType.delay, delay: 1500, target: "playing" },
  },
]

// repeat: advance after N loop completions
transition: { type: ChainTransitionType.repeat, count: 3 }`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain — hold to pause
// ─────────────────────────────────────────────────────────────────────────────

export function ChainHoldExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}
      >
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain — hold to pause</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Animation loops automatically. Press and hold to pause it; release to
        resume. <code>ChainTransitionType.pauseHold</code> wires
        mousedown→pause, mouseup→play. The inverse (<code>hold</code>) wires
        mousedown→play, mouseup→pause for "hold-to-play" behaviour.
      </p>

      <div style={{ ...animBox, cursor: "pointer", userSelect: "none" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.chain,
            states: [
              {
                name: "loop-hold",
                type: InteractivityActionType.loop,
                transition: { type: ChainTransitionType.pauseHold },
              },
            ],
          }}
        />
      </div>

      <code
        style={codeStyle}
      >{`// pauseHold — loops by default, hold to pause, release to resume
states: [
  {
    name: "loop-hold",
    type: InteractivityActionType.loop,
    transition: { type: ChainTransitionType.pauseHold },
    // mousedown → pause()   mouseup → play()
  },
]

// hold is the inverse — play one pass first so the frame is visible, then hold controls it
states: [
  {
    name: "hold-to-play",
    type: InteractivityActionType.play, // renders a frame immediately
    transition: { type: ChainTransitionType.hold },
    // mousedown → play()   mouseup → pause()
  },
]`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain — cursor sync
// ─────────────────────────────────────────────────────────────────────────────

export function ChainCursorSyncExample() {
  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}
      >
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain — cursor sync</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Cursor X position (0→1) maps to animation frames within the state.
        Useful when you want to enter cursor-driven scrubbing as one step in a
        larger state machine and exit it via <code>goToChainState()</code>.
      </p>

      <div style={{ ...animBox, cursor: "crosshair" }}>
        <Lottie
          src={SRC}
          interactivity={{
            mode: InteractivityMode.chain,
            states: [
              {
                name: "scrub",
                type: InteractivityActionType.seek,
                transition: { type: ChainTransitionType.cursorSync },
              },
            ],
          }}
        />
      </div>

      <code style={codeStyle}>{`states: [
  {
    name: "scrub",
    type: InteractivityActionType.seek,
    transition: { type: ChainTransitionType.cursorSync },
    // cursor X (0→1) maps to frames — constrainable with frames: ["25%", "75%"]
    // state stays active until goToChainState() is called
  },
]

// Combine with other states: loop → click → cursor-sync → programmatic exit
states: [
  { name: "loop",  type: "loop", transition: { type: "click",      target: "scrub" } },
  { name: "scrub", type: "seek", transition: { type: "cursorSync"               } },
]
// Call goToChainState("loop") to exit the scrub state from a button or event`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain — programmatic control
// ─────────────────────────────────────────────────────────────────────────────

export function ChainProgrammaticExample() {
  const lottie = useLottie({ src: SRC });
  const { currentChainState, goToChainState } = useLottieInteractivity(lottie, {
    mode: InteractivityMode.chain,
    // "looping" is first → becomes the default initial state (animation visible on load)
    states: [
      {
        name: "looping",
        type: InteractivityActionType.loop,
        transition: { type: ChainTransitionType.none },
      },
      {
        name: "playing",
        type: InteractivityActionType.play,
        // automatically returns to looping when the animation finishes
        transition: { type: ChainTransitionType.onComplete, target: "looping" },
      },
      {
        name: "idle",
        type: InteractivityActionType.stop,
        transition: { type: ChainTransitionType.none },
      },
    ],
  });

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.4rem 1rem",
    borderRadius: 6,
    cursor: "pointer",
    border: `2px solid ${active ? "#6d28d9" : "#e2e8f0"}`,
    backgroundColor: active ? "#ede9fe" : "#fff",
    fontWeight: active ? 600 : 400,
    color: active ? "#6d28d9" : "#374151",
  });

  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#ede9fe", color: "#6d28d9" }}
      >
        chain
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Chain — programmatic control</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        States use <code>none</code> (stay forever) or <code>onComplete</code>{" "}
        (auto-return) transitions. Drive the machine from outside with{" "}
        <code>goToChainState()</code>. <code>currentChainState</code> is
        reactive and re-renders when the state changes.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          style={btnStyle(currentChainState === "looping")}
          onClick={() => {
            goToChainState("looping");
          }}
        >
          Loop
        </button>
        <button
          style={btnStyle(currentChainState === "playing")}
          onClick={() => {
            goToChainState("playing");
          }}
        >
          Play once
        </button>
        <button
          style={btnStyle(currentChainState === "idle")}
          onClick={() => {
            goToChainState("idle");
          }}
        >
          Idle
        </button>
        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
          state:{" "}
          <strong style={{ color: "#6d28d9" }}>{currentChainState}</strong>
        </span>
      </div>

      <div style={animBox} ref={lottie.setContainerRef} />

      <code style={codeStyle}>{`const lottie = useLottie({ src });
const { currentChainState, goToChainState } = useLottieInteractivity(lottie, {
  mode: InteractivityMode.chain,
  // first state is the default initial state — put a visible/playing state first
  states: [
    {
      name: "looping",
      type: InteractivityActionType.loop,
      transition: { type: ChainTransitionType.none }, // stay until told to leave
    },
    {
      name: "playing",
      type: InteractivityActionType.play,
      transition: { type: ChainTransitionType.onComplete, target: "looping" }, // auto-return
    },
    {
      name: "idle",
      type: InteractivityActionType.stop,
      transition: { type: ChainTransitionType.none },
    },
  ],
});

goToChainState("idle");      // drive the machine externally
currentChainState;            // reactive — causes re-render on state change

return <div ref={lottie.setContainerRef} />;`}</code>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Imperative hook
// ─────────────────────────────────────────────────────────────────────────────

export function ImperativeHookExample() {
  const lottie = useLottie({ src: SRC });
  const { isActive, disable, enable } = useLottieInteractivity(lottie, {
    mode: InteractivityMode.hover,
    reverseOnLeave: true,
  });

  return (
    <section style={sectionStyle}>
      <span
        style={{ ...labelStyle, backgroundColor: "#f1f5f9", color: "#475569" }}
      >
        imperative
      </span>
      <h2 style={{ margin: "0 0 0.5rem" }}>Standalone hook</h2>
      <p style={{ color: "#64748b", marginBottom: "1rem" }}>
        Use <code>useLottieInteractivity</code> directly when you need full
        control: mount the animation manually via <code>setContainerRef</code>,
        and toggle interactivity at runtime with <code>disable()</code> /{" "}
        <code>enable()</code>.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
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
          style={{ color: isActive ? "#16a34a" : "#dc2626", fontWeight: 600 }}
        >
          {isActive ? "active" : "disabled"}
        </span>
      </div>

      <div
        style={{ ...animBox, cursor: "pointer" }}
        ref={lottie.setContainerRef}
      />

      <code style={codeStyle}>{`const lottie = useLottie({ src });
const { isActive, disable, enable } = useLottieInteractivity(lottie, {
  mode: InteractivityMode.hover,
  reverseOnLeave: true,
});

// Mount the animation manually
return <div ref={lottie.setContainerRef} />;`}</code>
    </section>
  );
}
