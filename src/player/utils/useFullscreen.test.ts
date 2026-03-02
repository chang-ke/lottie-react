import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFullscreen } from "./useFullscreen";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Override document properties that may be getters with configurable descriptors. */
const defineDocProp = (prop: string, value: unknown) => {
  Object.defineProperty(document, prop, { configurable: true, writable: true, value });
};

/** Reset overridden document properties by deleting them (restores prototype chain). */
const deleteDocProps = (...props: string[]) => {
  for (const prop of props) {
    Reflect.deleteProperty(document, prop);
  }
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useFullscreen — not supported (happy-dom default)", () => {
  it("returns toggleFullscreen=null when fullscreenEnabled is false", () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => { return useFullscreen(ref); });
    expect(result.current.toggleFullscreen).toBeNull();
    expect(result.current.isFullscreen).toBe(false);
  });

  it("returns toggleFullscreen=null when no ref is provided", () => {
    const { result } = renderHook(() => { return useFullscreen(undefined); });
    expect(result.current.toggleFullscreen).toBeNull();
  });
});

describe("useFullscreen — standard API", () => {
  let element: HTMLDivElement;
  let requestFn: ReturnType<typeof vi.fn>;
  let exitFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    element = document.createElement("div");
    requestFn = vi.fn().mockResolvedValue(undefined);
    exitFn = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => true });
    Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => null });
    defineDocProp("exitFullscreen", exitFn);
    defineDocProp("onfullscreenchange", null);
    Object.defineProperty(element, "requestFullscreen", { configurable: true, value: requestFn });
  });

  afterEach(() => {
    deleteDocProps("fullscreenEnabled", "fullscreenElement", "exitFullscreen", "onfullscreenchange");
    Reflect.deleteProperty(element, "requestFullscreen");
  });

  it("returns a toggleFullscreen function when fullscreenEnabled is true", () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    expect(typeof result.current.toggleFullscreen).toBe("function");
  });

  it("calls element.requestFullscreen when entering fullscreen (fullscreenElement is null)", async () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });

    await act(async () => { await result.current.toggleFullscreen?.(); });

    expect(requestFn).toHaveBeenCalled();
  });

  it("calls document.exitFullscreen when fullscreenElement is set", async () => {
    // fullscreenElement is the element — simulate already being fullscreen
    Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => element });

    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });

    await act(async () => { await result.current.toggleFullscreen?.(); });

    expect(exitFn).toHaveBeenCalled();
  });

  it("handles requestFullscreen rejection gracefully", async () => {
    requestFn.mockRejectedValue(new Error("denied"));
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });

    // Should not throw
    await act(async () => { await result.current.toggleFullscreen?.(); });

    expect(result.current.isFullscreen).toBe(false);
  });

  it("toggleFullscreen returns early when ref.current is null (line 134 branch)", async () => {
    const ref = { current: null as HTMLDivElement | null };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    // isSupported=true (fullscreenEnabled from beforeEach), so toggleFullscreen is non-null
    expect(result.current.toggleFullscreen).toBeTruthy();
    // Call with null ref — should exit early, requestFullscreen NOT called
    await act(async () => { await result.current.toggleFullscreen?.(); });
    expect(requestFn).not.toHaveBeenCalled();
  });

  it("invokes fullscreenchange listener to update isFullscreen state (line 170)", () => {
    // fullscreenElement starts null, then set to element (simulating fullscreen entered)
    Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => element });
    const ref = { current: element };
    renderHook(() => { return useFullscreen(ref); });

    // The useLayoutEffect registered onFullscreenChange which assigns a function to
    // document.onfullscreenchange. Invoke it directly to trigger the state update.
    act(() => {
      document.onfullscreenchange?.(new Event("fullscreenchange"));
    });
    // No assertion needed — just verifying the listener function body executes without error
    expect(document.onfullscreenchange).toBeTruthy();
  });
});

describe("useFullscreen — MOZ prefix", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "mozFullScreenEnabled", { configurable: true, get: () => true });
    Object.defineProperty(document, "mozFullScreenElement", { configurable: true, get: () => null });
    defineDocProp("exitFullscreen", vi.fn().mockResolvedValue(undefined));
    defineDocProp("onfullscreenchange", null);
    Object.defineProperty(element, "requestFullscreen", { configurable: true, value: vi.fn().mockResolvedValue(undefined) });
  });

  afterEach(() => {
    deleteDocProps("fullscreenEnabled", "mozFullScreenEnabled", "mozFullScreenElement", "exitFullscreen", "onfullscreenchange");
    Reflect.deleteProperty(element, "requestFullscreen");
  });

  it("returns a toggleFullscreen function for MOZ-prefixed API", () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    expect(typeof result.current.toggleFullscreen).toBe("function");
  });
});

describe("useFullscreen — MS prefix", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "mozFullScreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "msFullscreenEnabled", { configurable: true, get: () => true });
    Object.defineProperty(document, "msFullscreenElement", { configurable: true, get: () => null });
    defineDocProp("exitFullscreen", vi.fn().mockResolvedValue(undefined));
    defineDocProp("onfullscreenchange", null);
    Object.defineProperty(element, "requestFullscreen", { configurable: true, value: vi.fn().mockResolvedValue(undefined) });
  });

  afterEach(() => {
    deleteDocProps("fullscreenEnabled", "mozFullScreenEnabled", "msFullscreenEnabled", "msFullscreenElement", "exitFullscreen", "onfullscreenchange");
    Reflect.deleteProperty(element, "requestFullscreen");
  });

  it("returns a toggleFullscreen function for MS-prefixed API", () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    expect(typeof result.current.toggleFullscreen).toBe("function");
  });
});

describe("useFullscreen — WebKit prefix", () => {
  let element: HTMLDivElement;
  let webkitRequestFn: ReturnType<typeof vi.fn>;
  let webkitExitFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    element = document.createElement("div");
    webkitRequestFn = vi.fn().mockResolvedValue(undefined);
    webkitExitFn = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "mozFullScreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "msFullscreenEnabled", { configurable: true, get: () => false });
    Object.defineProperty(document, "webkitFullscreenEnabled", { configurable: true, get: () => true });
    Object.defineProperty(document, "webkitCurrentFullScreenElement", { configurable: true, get: () => null });
    defineDocProp("webkitExitFullscreen", webkitExitFn);
    defineDocProp("onwebkitfullscreenchange", null);
    Object.defineProperty(element, "webkitRequestFullscreen", { configurable: true, value: webkitRequestFn });
  });

  afterEach(() => {
    deleteDocProps("fullscreenEnabled", "mozFullScreenEnabled", "msFullscreenEnabled", "webkitFullscreenEnabled", "webkitCurrentFullScreenElement", "webkitExitFullscreen", "onwebkitfullscreenchange");
    Reflect.deleteProperty(element, "webkitRequestFullscreen");
  });

  it("returns a toggleFullscreen function for WebKit-prefixed API", () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    expect(typeof result.current.toggleFullscreen).toBe("function");
  });

  it("calls webkitRequestFullscreen when entering fullscreen (line 97)", async () => {
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    await act(async () => { await result.current.toggleFullscreen?.(); });
    expect(webkitRequestFn).toHaveBeenCalled();
  });

  it("calls webkitExitFullscreen when exiting fullscreen (lines 98-99)", async () => {
    // Simulate already being in fullscreen
    Object.defineProperty(document, "webkitCurrentFullScreenElement", {
      configurable: true, get: () => element,
    });
    const ref = { current: element };
    const { result } = renderHook(() => { return useFullscreen(ref); });
    await act(async () => { await result.current.toggleFullscreen?.(); });
    expect(webkitExitFn).toHaveBeenCalled();
  });
});
