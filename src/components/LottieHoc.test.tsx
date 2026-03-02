import { act, render } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { createMockAnimationItem, createMockLottie } from "../test/mocks/lottie";
import { LottieRef } from "../types";

import { lottieHoc } from "./LottieHoc";

import type { LottiePlayer } from "lottie-web";

// Stable src — must not be inline in render to avoid re-initialization loops
const SRC = { v: "5.0" };

describe("LottieHoc", () => {
  let mockItem: ReturnType<typeof createMockAnimationItem>;
  let Lottie: ReturnType<typeof lottieHoc>;

  beforeEach(() => {
    mockItem = createMockAnimationItem();
    Lottie = lottieHoc(createMockLottie(mockItem) as unknown as LottiePlayer);
  });

  it("renders without crashing", () => {
    const { container } = render(<Lottie src={SRC} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("shows toolbar with controls=true after animation loads", () => {
    const { getByRole } = render(<Lottie src={SRC} player={{ controls: true }} />);
    act(() => { mockItem._fireEvent("DOMLoaded"); });
    expect(getByRole("toolbar")).toBeInTheDocument();
  });

  it("exposes the imperative handle via ref", () => {
    const ref = createRef<LottieRef>();
    render(<Lottie src={SRC} ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.play).toBe("function");
    expect(typeof ref.current?.pause).toBe("function");
  });

  it("renders InteractivityBridge when interactivity prop is provided", () => {
    // Smoke test: providing the interactivity prop should not throw
    const { container } = render(
      <Lottie
        src={SRC}
        interactivity={{ mode: "hover" as const }}
      />,
    );
    expect(container).toBeDefined();
  });
});
