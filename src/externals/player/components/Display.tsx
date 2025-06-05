import React, { forwardRef, ForwardRefRenderFunction } from "react";

import { PlayerTheme } from "../types";

export interface DisplayProps {
  theme?: PlayerTheme;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Display component for rendering content
 */
const DisplayWithRef: ForwardRefRenderFunction<HTMLDivElement, DisplayProps> = (
  { className, style },
  ref,
) => {
  const displayStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
    ...style,
  };

  return <div ref={ref} className={className} style={displayStyle} />;
};

export const Display = forwardRef(DisplayWithRef);
