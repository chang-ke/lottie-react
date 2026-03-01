import React, {
  FC,
  JSX,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { PlayerTheme } from "../types";
import {
  mergeTheme,
  getResponsiveSize,
  getButtonColors,
} from "../utils/PlayerTheme";

export interface BaseButtonProps {
  children: JSX.Element;
  onClick?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isActive?: boolean;
  ariaLabel?: string;
  tooltip?: string;
  theme?: PlayerTheme;
  /** Screen width passed from the Player — avoids per-button resize listeners. */
  screenWidth?: number;
  DropdownContent?: (setIsMenuOpen: (open: boolean) => void) => JSX.Element;
}

/**
 * Base button used by all Player controls.
 *
 * - Screen width is received as a prop from the parent Player (single source of
 *   truth for responsive sizing, no individual resize listeners).
 * - Dropdown closes on outside click via a document mousedown listener.
 */
export const BaseButton: FC<BaseButtonProps> = ({
  children,
  onClick,
  variant = "secondary",
  size = "medium",
  disabled = false,
  isActive = false,
  ariaLabel,
  tooltip,
  theme,
  screenWidth = 1024,
  DropdownContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const mergedTheme = mergeTheme(theme);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!DropdownContent || !isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [DropdownContent, isMenuOpen]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (DropdownContent) setIsMenuOpen((prev) => !prev);
    void onClick?.();
  }, [disabled, DropdownContent, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [disabled, handleClick],
  );

  const buttonSize = getResponsiveSize(
    mergedTheme.sizing.buttonSize,
    screenWidth,
    480,
  );

  const iconSize =
    size === "small"
      ? Math.round(buttonSize * 0.6)
      : size === "large"
        ? Math.round(buttonSize * 0.7)
        : Math.round(buttonSize * 0.65);

  const { backgroundColor, iconColor } = getButtonColors(mergedTheme, {
    disabled,
    isActive,
    isHovered,
    isFocused,
    isMenuOpen,
    variant,
  });

  const buttonStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: buttonSize,
    height: buttonSize,
    minWidth: buttonSize,
    minHeight: buttonSize,
    padding: 0,
    margin: 0,
    border: "none",
    borderRadius: mergedTheme.sizing.borderRadius,
    backgroundColor,
    color: iconColor,
    cursor: disabled ? "default" : "pointer",
    transition: mergedTheme.effects.transitions ? "all 150ms ease" : "none",
    outline: "none",
    boxShadow:
      isFocused && !disabled ? `0 0 0 2px ${mergedTheme.colors.accent}` : "none",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    zIndex: isMenuOpen ? 9999 : 1,
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: mergedTheme.spacing.gap,
    backgroundColor: mergedTheme.colors.background,
    border: `1px solid ${mergedTheme.colors.border}`,
    borderRadius: mergedTheme.sizing.borderRadius,
    boxShadow: mergedTheme.effects.shadows ? "0 4px 12px rgba(0,0,0,0.4)" : "none",
    backdropFilter: mergedTheme.effects.backdropBlur ? "blur(8px)" : "none",
    minWidth: 120,
    overflow: "hidden",
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? "translateY(0)" : "translateY(4px)",
    transition: mergedTheme.effects.transitions ? "all 200ms ease" : "none",
    pointerEvents: isMenuOpen ? "auto" : "none",
    zIndex: 10000,
  };

  return (
    <div ref={containerRef} style={containerStyle} title={tooltip}>
      {DropdownContent && (
        <div style={dropdownStyle}>{DropdownContent(setIsMenuOpen)}</div>
      )}
      <button
        style={buttonStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => { setIsHovered(true); }}
        onMouseLeave={() => { setIsHovered(false); }}
        onFocus={() => { setIsFocused(true); }}
        onBlur={() => { setIsFocused(false); }}
        disabled={disabled}
        aria-label={ariaLabel}
        type="button"
      >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </button>
    </div>
  );
};
