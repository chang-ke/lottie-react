import { RefObject, useLayoutEffect, useState } from "react";

/**
 * Extended version of the {@link Document} that includes the
 * prefixed full screen properties from all the vendors
 */
type ExtendedDocument = Document & {
  mozFullScreenEnabled?: boolean;
  mozFullScreenElement?: Element | null;
  msFullscreenEnabled?: boolean;
  msFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitCurrentFullScreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  onwebkitfullscreenchange?: ((event: Event) => void) | null;
};

/**
 * Extended version of the {@link Element} that includes the
 * prefixed full-screen properties from all the vendors
 */
type ExtendedElement = Element & {
  webkitRequestFullscreen?: () => Promise<void>;
};

type FullscreenInfo = null | {
  fullscreenElement: Element | null;
  requestFullscreen: () => Promise<void> | undefined;
  exitFullscreen: () => Promise<void>;
  onFullscreenChange: (listener: ((event: Event) => void) | null) => void;
};

export interface UseFullscreenResult {
  isFullscreen: boolean;
  toggleFullscreen: null | (() => Promise<void>);
}

/**
 * Get extended document with vendor prefixes
 */
const getExtendedDocument = (): ExtendedDocument | null => {
  if (typeof document === "undefined") {
    return null;
  }
  return document;
};

/**
 * Get fullscreen info with vendor prefix support
 */
const getFullscreenInfo = (
  ref?: RefObject<ExtendedElement | null>,
): FullscreenInfo => {
  if (!ref?.current) {
    return null;
  }

  const extendedDocument = getExtendedDocument();
  if (!extendedDocument) {
    return null;
  }

  switch (true) {
    // Standard properties
    case extendedDocument.fullscreenEnabled:
      return {
        fullscreenElement: extendedDocument.fullscreenElement,
        requestFullscreen: () => ref.current?.requestFullscreen(),
        exitFullscreen: () => extendedDocument.exitFullscreen(),
        onFullscreenChange: (listener) =>
          (extendedDocument.onfullscreenchange = listener),
      };
    // MOZ
    case extendedDocument.mozFullScreenEnabled:
      return {
        fullscreenElement: extendedDocument.mozFullScreenElement ?? null,
        requestFullscreen: () => ref.current?.requestFullscreen(),
        exitFullscreen: () => extendedDocument.exitFullscreen(),
        onFullscreenChange: (listener) =>
          (extendedDocument.onfullscreenchange = listener),
      };
    // MS
    case extendedDocument.msFullscreenEnabled:
      return {
        fullscreenElement: extendedDocument.msFullscreenElement ?? null,
        requestFullscreen: () => ref.current?.requestFullscreen(),
        exitFullscreen: () => extendedDocument.exitFullscreen(),
        onFullscreenChange: (listener) =>
          (extendedDocument.onfullscreenchange = listener),
      };
    // WebKit
    case extendedDocument.webkitFullscreenEnabled:
      return {
        fullscreenElement:
          extendedDocument.webkitCurrentFullScreenElement ?? null,
        requestFullscreen: () => ref.current?.webkitRequestFullscreen?.(),
        exitFullscreen: async () =>
          await extendedDocument.webkitExitFullscreen?.(),
        onFullscreenChange: (listener) =>
          (extendedDocument.onwebkitfullscreenchange = listener),
      };
    // Not supported
    default:
      return null;
  }
};

/**
 * Isolated fullscreen hook for external player
 * No external dependencies - all functionality is self-contained
 */
export const useFullscreen = (
  ref?: RefObject<Element | null>,
): UseFullscreenResult => {
  const [isFullscreen, setIsFullscreen] = useState(
    !!getFullscreenInfo(ref)?.fullscreenElement,
  );

  const toggleFullscreen = async () => {
    // Skip if no reference
    if (!ref?.current) {
      return;
    }

    // Skip if there is no browser support
    if (!getFullscreenInfo(ref)) {
      return;
    }

    // If it's full screen already, exit
    if (getFullscreenInfo(ref)?.fullscreenElement) {
      await getFullscreenInfo(ref)?.exitFullscreen();
      setIsFullscreen(false);
      return;
    }

    // Try to make it full screen
    try {
      await getFullscreenInfo(ref)?.requestFullscreen();
      setIsFullscreen(!!getFullscreenInfo(ref)?.fullscreenElement);
    } catch (e) {
      console.error(`Failed to enter fullscreen mode: ${String(e)}`);
      setIsFullscreen(false);
    }
  };

  /**
   * Listen for changes and update the local state
   */
  useLayoutEffect(() => {
    // Skip if there is no browser support
    if (!getFullscreenInfo(ref)) {
      return;
    }

    // Add listener
    getFullscreenInfo(ref)?.onFullscreenChange(() => {
      setIsFullscreen(!!getFullscreenInfo(ref)?.fullscreenElement);
    });

    // Remove the listener on unmounting
    return () => {
      getFullscreenInfo(ref)?.onFullscreenChange(null);
    };
  });

  // Checks if the browser is compatible
  if (!getFullscreenInfo(ref)) {
    console.warn(`Fullscreen API is not supported by this browser.`);

    return {
      isFullscreen,
      toggleFullscreen: null,
    };
  }

  return { isFullscreen, toggleFullscreen };
};
