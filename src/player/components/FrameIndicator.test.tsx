import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FrameIndicator } from "./FrameIndicator";

let subscribeCallback: ((frame: number) => void) | undefined;
const subscribeToFrame = vi.fn((cb: (frame: number) => void) => {
  subscribeCallback = cb;
  return vi.fn();
});

beforeEach(() => {
  subscribeToFrame.mockClear();
  subscribeCallback = undefined;
});

describe("FrameIndicator", () => {
  it("renders initial current frame as 0", () => {
    const { container } = render(
      <FrameIndicator totalFrames={100} subscribeToFrame={subscribeToFrame} />,
    );
    const spans = container.querySelectorAll("span");
    expect(spans[0].textContent).toBe("0");
  });

  it("shows total frames when showTotal is true", () => {
    const { getByText } = render(
      <FrameIndicator totalFrames={100} subscribeToFrame={subscribeToFrame} showTotal={true} />,
    );
    expect(getByText("100")).toBeInTheDocument();
  });

  it("hides total frames when showTotal is false", () => {
    const { queryByText } = render(
      <FrameIndicator totalFrames={100} subscribeToFrame={subscribeToFrame} showTotal={false} />,
    );
    expect(queryByText("100")).not.toBeInTheDocument();
  });

  it("mutates DOM via subscribeToFrame callback without re-rendering", () => {
    const { getByLabelText } = render(
      <FrameIndicator totalFrames={100} subscribeToFrame={subscribeToFrame} />,
    );
    act(() => { subscribeCallback?.(42); });
    const currentSpan = getByLabelText("Animation frame indicator").querySelector("span");
    expect(currentSpan?.textContent).toBe("42");
  });

  it("formats frames with specified decimal places", () => {
    const { container } = render(
      <FrameIndicator totalFrames={100} subscribeToFrame={subscribeToFrame} decimals={2} />,
    );
    expect(container.querySelectorAll("span")[0].textContent).toBe("0.00");
  });
});
