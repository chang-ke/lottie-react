import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useCallbackRef from "./useCallbackRef";

describe("useCallbackRef", () => {
  it("starts with ref.current as null", () => {
    const { result } = renderHook(() => useCallbackRef<HTMLDivElement>());
    expect(result.current.ref.current).toBeNull();
  });

  it("setRef updates ref.current to the provided element", () => {
    const { result } = renderHook(() => useCallbackRef<HTMLDivElement>());
    const el = document.createElement("div");

    act(() => {
      result.current.setRef(el);
    });

    expect(result.current.ref.current).toBe(el);
  });

  it("setRef is referentially stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useCallbackRef<HTMLDivElement>());
    const firstSetRef = result.current.setRef;

    rerender();

    expect(result.current.setRef).toBe(firstSetRef);
  });

  it("setRef with null resets ref.current", () => {
    const { result } = renderHook(() => useCallbackRef<HTMLDivElement>());
    const el = document.createElement("div");

    act(() => { result.current.setRef(el); });
    // setRef is typed as RefCallback<T | null> and accepts null per React's RefCallback contract
    act(() => { result.current.setRef(null); });

    expect(result.current.ref.current).toBeNull();
  });
});
