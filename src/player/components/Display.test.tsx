import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Display } from "./Display";

describe("Display", () => {
  it("renders a div", () => {
    const { container } = render(<Display />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("forwards ref to the root div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Display ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("applies default layout styles", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Display ref={ref} />);
    const el = ref.current;
    expect(el?.style.position).toBe("relative");
    expect(el?.style.width).toBe("100%");
    expect(el?.style.height).toBe("100%");
    expect(el?.style.overflow).toBe("hidden");
  });

  it("merges custom style props (custom override wins)", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Display ref={ref} style={{ backgroundColor: "red", overflow: "visible" }} />);
    const el = ref.current;
    expect(el?.style.backgroundColor).toBe("red");
    expect(el?.style.overflow).toBe("visible");
  });

  it("passes className to the div", () => {
    const { container } = render(<Display className="my-class" />);
    expect(container.firstElementChild?.classList.contains("my-class")).toBe(true);
  });
});
