import { FC, JSX, useEffect, useRef, useState, useCallback } from "react";
import { PlayerControlsTheme, ButtonVariant, ButtonSize, getResponsiveSize } from "../player/styles/PlayerControlsTheme";

export interface ModernBaseButtonProps {
  children: JSX.Element;
  onClick?: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isActive?: boolean;
  ariaLabel?: string;
  tooltip?: string;
  DropdownContent?: (setIsMenuOpen: (state: boolean) => void) => JSX.Element;
}

/**
 * Modern button component inspired by YouTube's player controls
 * Features:
 * - Responsive sizing
 * - Proper hover/focus states
 * - Accessibility support
 * - Smooth transitions
 * - Touch-friendly targets
 */
export const ModernBaseButton: FC<ModernBaseButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  isActive = false,
  ariaLabel,
  tooltip,
  DropdownContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle window resize for responsive sizing
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close dropdown
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [DropdownContent, isMenuOpen]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (DropdownContent) {
      setIsMenuOpen(!isMenuOpen);
    }
    onClick?.();
  }, [disabled, DropdownContent, isMenuOpen, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [disabled, handleClick]);

  // Get responsive button size
  const buttonSize = getResponsiveSize(
    PlayerControlsTheme.sizes[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof PlayerControlsTheme.sizes] as number,
    screenWidth
  );

  // Get icon size based on button size
  const iconSize = size === 'small' 
    ? PlayerControlsTheme.sizes.iconSmall
    : size === 'large' 
    ? PlayerControlsTheme.sizes.iconLarge
    : PlayerControlsTheme.sizes.iconMedium;

  // Determine button colors based on state
  const getButtonColor = () => {
    if (disabled) return PlayerControlsTheme.colors.buttonDisabled;
    if (isActive) return PlayerControlsTheme.colors.buttonActive;
    if (isHovered || isFocused || isMenuOpen) return PlayerControlsTheme.colors.buttonHover;
    return PlayerControlsTheme.colors.buttonIdle;
  };

  const getIconColor = () => {
    if (disabled) return PlayerControlsTheme.colors.iconDisabled;
    if (variant === 'accent' || isActive) return PlayerControlsTheme.colors.iconAccent;
    if (variant === 'primary') return PlayerControlsTheme.colors.iconPrimary;
    return PlayerControlsTheme.colors.iconSecondary;
  };

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: buttonSize,
    height: buttonSize,
    minWidth: buttonSize, // Ensure minimum touch target
    minHeight: buttonSize,
    padding: 0,
    margin: 0,
    border: 'none',
    borderRadius: PlayerControlsTheme.sizes.borderRadius,
    backgroundColor: getButtonColor(),
    color: getIconColor(),
    cursor: disabled ? 'default' : 'pointer',
    transition: `all ${PlayerControlsTheme.transitions.fast}`,
    outline: 'none',
    // Ensure proper focus visibility
    boxShadow: isFocused && !disabled ? `0 0 0 2px ${PlayerControlsTheme.colors.iconAccent}` : 'none',
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    zIndex: isMenuOpen ? 9999 : 1, // High z-index when menu is open
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: PlayerControlsTheme.sizes.gapSmall,
    backgroundColor: PlayerControlsTheme.colors.dropdownBackground,
    borderRadius: PlayerControlsTheme.sizes.borderRadius,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    minWidth: 120,
    overflow: 'hidden',
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? 'translateY(0)' : 'translateY(4px)',
    transition: `all ${PlayerControlsTheme.transitions.normal}`,
    pointerEvents: isMenuOpen ? 'auto' : 'none',
    zIndex: 10000, // Ensure dropdown is always on top
  };

  return (
    <div ref={containerRef} style={containerStyle} title={tooltip}>
      {/* Dropdown menu */}
      {DropdownContent && (
        <div style={dropdownStyle}>
          {DropdownContent(setIsMenuOpen)}
        </div>
      )}

      {/* Button */}
      <button
        style={buttonStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        aria-label={ariaLabel}
        type="button"
      >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </button>
    </div>
  );
};