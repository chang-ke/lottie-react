import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Player } from "./Player";
import { PlayerActions, PlayerState, PlayerSubscriptions } from "./types";

const makeState = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  isPlaying: false,
  totalFrames: 100,
  direction: 1,
  loop: false,
  speed: 1,
  isLoading: false,
  hasError: false,
  ...overrides,
});

const makeSubscriptions = (): PlayerSubscriptions => ({
  frame: vi.fn().mockReturnValue(vi.fn()),
  state: vi.fn().mockReturnValue(vi.fn()),
});

const makeActions = (): PlayerActions => ({
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  seek: vi.fn(),
  changeSpeed: vi.fn(),
  changeDirection: vi.fn(),
  toggleLoop: vi.fn(),
});

describe("Player", () => {
  it("returns null when show is false", () => {
    const { container } = render(
      <Player
        show={false}
        state={makeState()}
        subscriptions={makeSubscriptions()}
        actions={makeActions()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders without controls when controls=false", () => {
    const { queryByRole } = render(
      <Player
        state={makeState()}
        subscriptions={makeSubscriptions()}
        actions={makeActions()}
        controls={false}
      />,
    );
    expect(queryByRole("toolbar")).toBeNull();
  });

  it("renders toolbar when controls=true and state is not loading", () => {
    const { getByRole } = render(
      <Player
        state={makeState()}
        subscriptions={makeSubscriptions()}
        actions={makeActions()}
        controls={true}
      />,
    );
    expect(getByRole("toolbar")).toBeInTheDocument();
  });

  it("hides toolbar when state.isLoading is true", () => {
    const { queryByRole } = render(
      <Player
        state={makeState({ isLoading: true })}
        subscriptions={makeSubscriptions()}
        actions={makeActions()}
        controls={true}
      />,
    );
    expect(queryByRole("toolbar")).toBeNull();
  });

  it("keyboard k calls play when not playing", () => {
    const actions = makeActions();
    const { container } = render(
      <Player
        state={makeState({ isPlaying: false })}
        subscriptions={makeSubscriptions()}
        actions={actions}
      />,
    );
    // Focus the player container so keyboard shortcuts are active
    const playerEl = container.firstElementChild as HTMLElement;
    fireEvent.focus(playerEl);
    fireEvent.keyDown(document, { key: "k" });
    expect(actions.play).toHaveBeenCalledOnce();
  });

  it("keyboard k calls pause when playing", () => {
    const actions = makeActions();
    const { container } = render(
      <Player
        state={makeState({ isPlaying: true })}
        subscriptions={makeSubscriptions()}
        actions={actions}
      />,
    );
    const playerEl = container.firstElementChild as HTMLElement;
    fireEvent.focus(playerEl);
    fireEvent.keyDown(document, { key: "k" });
    expect(actions.pause).toHaveBeenCalledOnce();
  });

  it("keyboard l calls toggleLoop", () => {
    const actions = makeActions();
    const { container } = render(
      <Player
        state={makeState()}
        subscriptions={makeSubscriptions()}
        actions={actions}
      />,
    );
    const playerEl = container.firstElementChild as HTMLElement;
    fireEvent.focus(playerEl);
    fireEvent.keyDown(document, { key: "l" });
    expect(actions.toggleLoop).toHaveBeenCalledOnce();
  });
});
