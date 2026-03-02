import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  LoopIcon,
  DirectionRightIcon,
  DirectionLeftIcon,
  SpeedIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from "./PlayerIcons";

const icons = [
  { name: "PlayIcon", Component: PlayIcon },
  { name: "PauseIcon", Component: PauseIcon },
  { name: "StopIcon", Component: StopIcon },
  { name: "LoopIcon", Component: LoopIcon },
  { name: "DirectionRightIcon", Component: DirectionRightIcon },
  { name: "DirectionLeftIcon", Component: DirectionLeftIcon },
  { name: "SpeedIcon", Component: SpeedIcon },
  { name: "FullscreenIcon", Component: FullscreenIcon },
  { name: "ExitFullscreenIcon", Component: ExitFullscreenIcon },
] as const;

describe("PlayerIcons", () => {
  for (const { name, Component } of icons) {
    it(`${name} renders an SVG element`, () => {
      const { container } = render(<Component />);
      expect(container.querySelector("svg")).not.toBeNull();
    });

    it(`${name} accepts custom size and color`, () => {
      const { container } = render(<Component size={24} color="#ff0000" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("24");
      expect(svg?.getAttribute("height")).toBe("24");
    });

    it(`${name} accepts className prop`, () => {
      const { container } = render(<Component className="icon-test" />);
      expect(container.querySelector("svg")?.classList.contains("icon-test")).toBe(true);
    });
  }
});
