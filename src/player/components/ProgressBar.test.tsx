import { act, fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProgressBar } from "./ProgressBar";

let subscribeCallback: ((frame: number) => void) | undefined;
const subscribeToFrame = vi.fn((cb: (frame: number) => void) => {
  subscribeCallback = cb;
  return vi.fn();
});

beforeEach(() => {
  subscribeToFrame.mockClear();
  subscribeCallback = undefined;
});

describe("ProgressBar", () => {
  it("renders a range slider", () => {
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} />,
    );
    expect(getByRole("slider")).toBeInTheDocument();
  });

  it("calls onChange with isDraggingEnded=false on input change", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} onChange={onChange} />,
    );
    fireEvent.change(getByRole("slider"), { target: { value: "50" } });
    expect(onChange).toHaveBeenCalledWith(50, false);
  });

  it("calls onChange with isDraggingEnded=true on mouseUp", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} onChange={onChange} />,
    );
    fireEvent.mouseUp(getByRole("slider"));
    expect(onChange).toHaveBeenCalledWith(expect.any(Number), true);
  });

  it("calls onChange with isDraggingEnded=true on touchEnd", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} onChange={onChange} />,
    );
    fireEvent.touchEnd(getByRole("slider"));
    expect(onChange).toHaveBeenCalledWith(expect.any(Number), true);
  });

  it("mutates input value via subscribeToFrame callback", () => {
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} />,
    );
    act(() => { subscribeCallback?.(75); });
    expect((getByRole("slider") as HTMLInputElement).value).toBe("75");
  });

  it("is disabled when disabled prop is true", () => {
    const { getByRole } = render(
      <ProgressBar totalFrames={100} subscribeToFrame={subscribeToFrame} disabled={true} />,
    );
    expect(getByRole("slider")).toBeDisabled();
  });
});
