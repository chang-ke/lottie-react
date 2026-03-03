import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useStateWithPrevious from "./useStateWithPrevious";

describe("useStateWithPrevious", () => {
  it("initializes with the provided state and undefined previousState", () => {
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: "loading" }),
    );
    expect(result.current.state).toBe("loading");
    expect(result.current.previousState).toBeUndefined();
  });

  it("updates state and tracks previousState on setState", () => {
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: "loading" }),
    );

    act(() => {
      result.current.setState("playing");
    });

    expect(result.current.state).toBe("playing");
    expect(result.current.previousState).toBe("loading");
  });

  it("tracks each transition's previous value independently", () => {
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: "loading" }),
    );

    act(() => {
      result.current.setState("playing");
    });
    act(() => {
      result.current.setState("paused");
    });

    expect(result.current.state).toBe("paused");
    expect(result.current.previousState).toBe("playing");
  });

  it("supports functional updaters", () => {
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: 0 }),
    );

    act(() => {
      result.current.setState((prev) => prev + 1);
    });

    expect(result.current.state).toBe(1);
    expect(result.current.previousState).toBe(0);
  });

  it("bails out when the new value equals current (previousState stays unchanged)", () => {
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: "stable" }),
    );

    act(() => {
      result.current.setState("stable");
    });

    // State did not change, so previousState stays undefined
    expect(result.current.state).toBe("stable");
    expect(result.current.previousState).toBeUndefined();
  });

  it("calls onChange whenever state transitions", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useStateWithPrevious({ initialState: "loading", onChange }),
    );

    // Clear any initial mount call before testing transitions
    onChange.mockClear();

    act(() => {
      result.current.setState("playing");
    });

    expect(onChange).toHaveBeenCalledWith("loading", "playing");
  });

  it("always uses the latest onChange callback (ref-forwarding)", () => {
    const first = vi.fn();
    const second = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useStateWithPrevious({ initialState: "a", onChange: cb }),
      { initialProps: { cb: first } },
    );

    // Clear calls from initial mount
    first.mockClear();
    second.mockClear();

    rerender({ cb: second });

    act(() => {
      result.current.setState("b");
    });

    // The transition should use the latest callback (second), not first
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("a", "b");
  });
});
