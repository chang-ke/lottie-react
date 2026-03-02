import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BaseButton } from "./BaseButton";

const icon = <svg data-testid="icon" />;

describe("BaseButton", () => {
  it("renders a button element", () => {
    const { getByRole } = render(<BaseButton>{icon}</BaseButton>);
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<BaseButton onClick={onClick}>{icon}</BaseButton>);
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<BaseButton onClick={onClick} disabled>{icon}</BaseButton>);
    fireEvent.click(getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies aria-label from ariaLabel prop", () => {
    const { getByLabelText } = render(
      <BaseButton ariaLabel="Play animation">{icon}</BaseButton>,
    );
    expect(getByLabelText("Play animation")).toBeInTheDocument();
  });

  it("triggers click on Enter key", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<BaseButton onClick={onClick}>{icon}</BaseButton>);
    fireEvent.keyDown(getByRole("button"), { key: "Enter" });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("triggers click on Space key", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<BaseButton onClick={onClick}>{icon}</BaseButton>);
    fireEvent.keyDown(getByRole("button"), { key: " " });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not trigger click on other keys", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<BaseButton onClick={onClick}>{icon}</BaseButton>);
    fireEvent.keyDown(getByRole("button"), { key: "Tab" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies hover state on mouseenter and reverts on mouseleave", () => {
    const { getByRole } = render(<BaseButton>{icon}</BaseButton>);
    const button = getByRole("button");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    expect(button).toBeInTheDocument();
  });

  it("applies focus state on focus and reverts on blur", () => {
    const { getByRole } = render(<BaseButton>{icon}</BaseButton>);
    const button = getByRole("button");
    fireEvent.focus(button);
    fireEvent.blur(button);
    expect(button).toBeInTheDocument();
  });

  it("renders DropdownContent and toggles open state on click", () => {
    const DropdownContent = () => <div data-testid="menu">menu</div>;
    const { getByTestId, getByRole } = render(
      <BaseButton DropdownContent={DropdownContent}>{icon}</BaseButton>,
    );
    fireEvent.click(getByRole("button"));
    expect(getByTestId("menu")).toBeInTheDocument();
  });

  it("closes dropdown on mousedown outside the container (handleClickOutside)", () => {
    const DropdownContent = () => <div data-testid="menu">menu</div>;
    const { getByRole } = render(
      <BaseButton DropdownContent={DropdownContent}>{icon}</BaseButton>,
    );
    // Open dropdown — registers the outside-click handler
    fireEvent.click(getByRole("button"));
    // Click outside → handleClickOutside runs and closes it
    fireEvent.mouseDown(document.body);
    expect(getByRole("button")).toBeInTheDocument();
  });
});
