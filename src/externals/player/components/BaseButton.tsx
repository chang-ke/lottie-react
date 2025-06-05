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
  DropdownContent?: (setIsMenuOpen: (state: boolean) => void) => JSX.Element;
}

/**
 * Isolated base button component for the external player
 * No external dependencies - everything is passed via props
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
  DropdownContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  const mergedTheme = mergeTheme(theme);

  // Handle window resize for responsive sizing
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle click outside to close the dropdown
  useEffect(() => {
    if (!DropdownContent || !isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [DropdownContent, isMenuOpen]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (DropdownContent) {
      setIsMenuOpen(!isMenuOpen);
    }
    void onClick?.();
  }, [disabled, DropdownContent, isMenuOpen, onClick]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [disabled, handleClick],
  );

  // Get responsive button size
  const buttonSize = getResponsiveSize(
    mergedTheme.sizing.buttonSize,
    screenWidth,
    480,
  );

  // Get icon size based on button size
  const iconSize =
    size === "small"
      ? Math.round(buttonSize * 0.6)
      : size === "large"
        ? Math.round(buttonSize * 0.7)
        : Math.round(buttonSize * 0.65);

  // Get button colors
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
    minWidth: buttonSize, // Ensure a minimum touch target
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
    // Ensure proper focus visibility
    boxShadow:
      isFocused && !disabled
        ? `0 0 0 2px ${mergedTheme.colors.accent}`
        : "none",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    zIndex: isMenuOpen ? 9999 : 1, // High z-index when a menu is open
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: mergedTheme.spacing.gap,
    backgroundColor: `${mergedTheme.colors.background}f0`, // High opacity
    borderRadius: mergedTheme.sizing.borderRadius,
    boxShadow: mergedTheme.effects.shadows
      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
      : "none",
    backdropFilter: mergedTheme.effects.backdropBlur ? "blur(8px)" : "none",
    minWidth: 120,
    overflow: "hidden",
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? "translateY(0)" : "translateY(4px)",
    transition: mergedTheme.effects.transitions ? "all 200ms ease" : "none",
    pointerEvents: isMenuOpen ? "auto" : "none",
    zIndex: 10000, // Ensure the dropdown is always on top
  };

  return (
    <div ref={containerRef} style={containerStyle} title={tooltip}>
      {/* Dropdown menu */}
      {DropdownContent && (
        <div style={dropdownStyle}>{DropdownContent(setIsMenuOpen)}</div>
      )}

      {/* Button */}
      <button
        style={buttonStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
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
