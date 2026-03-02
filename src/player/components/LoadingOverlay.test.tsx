import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LoadingOverlay } from "./LoadingOverlay";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("LoadingOverlay", () => {
  it("renders when show is true", () => {
    const { container } = render(<LoadingOverlay show={true} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("returns null when show is false", () => {
    const { container } = render(<LoadingOverlay show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a custom component when provided in config", () => {
    const { getByText } = render(
      <LoadingOverlay show={true} config={{ component: <span>Loading…</span> }} />,
    );
    expect(getByText("Loading…")).toBeInTheDocument();
  });
});
