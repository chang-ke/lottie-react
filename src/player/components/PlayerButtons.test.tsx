import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  PlayButton,
  PauseButton,
  StopButton,
  LoopButton,
  DirectionButton,
  SpeedButton,
  FullscreenButton,
} from "./PlayerButtons";

describe("PlayButton", () => {
  it("renders with aria-label Play", () => {
    render(<PlayButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: /play/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("PauseButton", () => {
  it("renders with aria-label Pause", () => {
    render(<PauseButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });
});

describe("StopButton", () => {
  it("renders with aria-label Stop", () => {
    render(<StopButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });
});

describe("LoopButton", () => {
  it("shows 'Enable loop' aria-label when loop is off", () => {
    render(<LoopButton onClick={vi.fn()} isOn={false} />);
    expect(screen.getByRole("button", { name: /enable loop/i })).toBeInTheDocument();
  });

  it("shows 'Disable loop' aria-label when loop is on", () => {
    render(<LoopButton onClick={vi.fn()} isOn />);
    expect(screen.getByRole("button", { name: /disable loop/i })).toBeInTheDocument();
  });
});

describe("DirectionButton", () => {
  it("shows 'Reverse direction' when direction is 1 (forward)", () => {
    render(<DirectionButton onClick={vi.fn()} direction={1} />);
    expect(screen.getByRole("button", { name: /reverse direction/i })).toBeInTheDocument();
  });

  it("shows 'Forward direction' when direction is -1 (reverse)", () => {
    render(<DirectionButton onClick={vi.fn()} direction={-1} />);
    expect(screen.getByRole("button", { name: /forward direction/i })).toBeInTheDocument();
  });
});

describe("SpeedButton", () => {
  it("renders with current speed in aria-label", () => {
    render(<SpeedButton speed={1} onSpeedChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /playback speed: 1x/i })).toBeInTheDocument();
  });

  it("calls onSpeedChange with selected speed from dropdown", () => {
    const onSpeedChange = vi.fn();
    render(<SpeedButton speed={1} speeds={[0.5, 1, 2]} onSpeedChange={onSpeedChange} />);
    // Open dropdown
    fireEvent.click(screen.getByRole("button", { name: /playback speed/i }));
    // Select 2x
    fireEvent.click(screen.getByText("2x"));
    expect(onSpeedChange).toHaveBeenCalledWith(2);
  });
});

describe("FullscreenButton", () => {
  it("shows 'Enter fullscreen' when not in fullscreen", () => {
    render(<FullscreenButton onClick={vi.fn()} isFullscreen={false} />);
    expect(screen.getByRole("button", { name: /enter fullscreen/i })).toBeInTheDocument();
  });

  it("shows 'Exit fullscreen' when in fullscreen", () => {
    render(<FullscreenButton onClick={vi.fn()} isFullscreen />);
    expect(screen.getByRole("button", { name: /exit fullscreen/i })).toBeInTheDocument();
  });
});
