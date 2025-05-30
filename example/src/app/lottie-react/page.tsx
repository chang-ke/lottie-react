"use client";
import { useState, useRef } from "react";
import { Lottie, LottieRef } from "lottie-react";
import { Direction } from "lottie-react";

export default function LottieReactPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [loop, setLoop] = useState(true);
  const lottieRef = useRef<LottieRef>(null);

  const togglePlayPause = () => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.pause();
      } else {
        lottieRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (lottieRef.current) {
      lottieRef.current.changeSpeed(newSpeed);
    }
  };

  const changeDirection = () => {
    const newDirection =
      direction === Direction.Right ? Direction.Left : Direction.Right;
    setDirection(newDirection);
    if (lottieRef.current) {
      lottieRef.current.changeDirection(newDirection);
    }
  };

  const restart = () => {
    if (lottieRef.current) {
      lottieRef.current.seek(0, false);
      lottieRef.current.play();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (lottieRef.current) {
      lottieRef.current.stop();
      setIsPlaying(false);
    }
  };

  const toggleLoop = () => {
    setLoop(!loop);
    // Note: Loop needs to be set during initialization, not dynamically changed
    // This is a limitation we might want to address in v3
  };

  // Animation event handlers
  const handleComplete = () => {
    console.log("Animation completed via lottie-react");
    setIsPlaying(false);
  };

  const handleLoopComplete = () => {
    console.log("Loop completed via lottie-react");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#dc3545" }}>⚛️ Lottie React v3 Implementation</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
        This page demonstrates the lottie-react wrapper. Compare the API and
        behavior with the raw lottie-web implementation.
      </p>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        {/* Animation Display */}
        <div>
          <h2>Animation Display</h2>
          <div
            style={{
              width: "400px",
              height: "400px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              overflow: "hidden",
            }}
          >
            <Lottie
              ref={lottieRef}
              // src="/assets/groovyWalk.json"
              src="https://raw.githubusercontent.com/Gamote/lottie-react/refs/heads/v3/example/public/assets/groovyWalk.json"
              // object works too
              enableReinitialize={true}
              initialValues={{
                autoplay: true,
                // TODO: Should we allow changing loop dynamically? `setLoop` is not available
                loop: loop,
                speed: speed,
                direction: direction,
              }}
              // Loading controls
              // disableLoading={true}
              LoadingOverlay={<>Something</>}
              // Subscriptions
              subscriptions={{
                complete: handleComplete,
                loop_completed: handleLoopComplete,
              }}
            />
          </div>

          {/* React-style Controls */}
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={togglePlayPause}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                backgroundColor: isPlaying ? "#dc3545" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </button>

            <button
              onClick={stop}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ⏹️ Stop
            </button>

            <button
              onClick={restart}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Restart
            </button>

            <button
              onClick={changeDirection}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                backgroundColor: "#fd7e14",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {direction === Direction.Right ? "⏪ Reverse" : "⏩ Forward"}
            </button>
          </div>

          {/* Speed Controls */}
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Speed: {speed}x
            </label>
            <button
              onClick={() => changeSpeed(0.5)}
              style={{
                padding: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
            >
              0.5x
            </button>
            <button
              onClick={() => changeSpeed(1)}
              style={{
                padding: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
            >
              1x
            </button>
            <button
              onClick={() => changeSpeed(2)}
              style={{
                padding: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
            >
              2x
            </button>
          </div>

          {/* Loop Toggle */}
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={loop}
                onChange={toggleLoop}
                style={{ marginRight: "0.5rem" }}
              />
              Loop Animation (requires restart to take effect)
            </label>
          </div>
        </div>

        {/* API Comparison */}
        <div>
          <h2>React API Examples</h2>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
          >
            <h4>Basic Usage:</h4>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              {`<Lottie
  src="/animation.json"
  initialValues={{
    autoplay: true,
    loop: true,
    speed: 1
  }}
/>`}
            </pre>

            <h4 style={{ marginTop: "1rem" }}>With Ref & Events:</h4>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              {`<Lottie
  ref={lottieRef}
  src="/animation.json"
  onComplete={handleComplete}
  onLoopComplete={handleLoop}
  onEnterFrame={handleFrame}
/>`}
            </pre>

            <h4 style={{ marginTop: "1rem" }}>Imperative Controls:</h4>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              {`// Via ref
lottieRef.current.play()
lottieRef.current.pause()
lottieRef.current.stop()
lottieRef.current.setSpeed(2)`}
            </pre>
          </div>

          <h3 style={{ marginTop: "2rem" }}>Current Props Available:</h3>
          <div
            style={{
              backgroundColor: "#f1f3f4",
              padding: "1rem",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
              <li>
                <code>src</code> - Animation JSON path/URL
              </li>
              <li>
                <code>initialValues</code> - Initial configuration
              </li>
              <li>
                <code>onComplete</code> - Animation complete callback
              </li>
              <li>
                <code>onLoopComplete</code> - Loop complete callback
              </li>
              <li>
                <code>onEnterFrame</code> - Frame change callback
              </li>
              <li>
                <code>style</code> - Custom styling
              </li>
              <li>
                <code>ref</code> - Access to animation controls
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "3rem",
          padding: "1rem",
          backgroundColor: "#fff3cd",
          borderRadius: "4px",
          border: "1px solid #ffeaa7",
        }}
      >
        <h3>🚀 v3 Improvements to Consider:</h3>
        <ul>
          <li>
            <strong>Dynamic Loop Toggle:</strong> Allow changing loop state
            without restart
          </li>
          <li>
            <strong>More Granular Events:</strong> Additional lifecycle
            callbacks
          </li>
          <li>
            <strong>Performance Metrics:</strong> Built-in performance
            monitoring
          </li>
          <li>
            <strong>Tree Shaking:</strong> Import only what you need
          </li>
          <li>
            <strong>Better TypeScript:</strong> Stronger typing for animation
            properties
          </li>
          <li>
            <strong>SSR Support:</strong> Better server-side rendering
            compatibility
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#d1ecf1",
          borderRadius: "4px",
          border: "1px solid #bee5eb",
        }}
      >
        <h3>📊 Performance Comparison:</h3>
        <p>
          Use browser dev tools to compare performance between the raw
          lottie-web implementation and this React wrapper. Check for:
        </p>
        <ul>
          <li>Bundle size differences</li>
          <li>Memory usage patterns</li>
          <li>Rendering performance</li>
          <li>Event handling overhead</li>
        </ul>
      </div>
    </div>
  );
}
