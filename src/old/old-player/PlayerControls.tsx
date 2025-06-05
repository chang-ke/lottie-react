// import { FC, RefObject, useCallback, useState, useEffect } from "react";
// import {
//   UseLottieFactoryResult,
//   Direction,
//   LottieState,
//   PlayerControlsElement,
// } from "../../@types";
// import { useFullscreen } from "../../hooks/useFullscreen";
// import { PlayerControlsTheme } from "./styles/PlayerControlsTheme";
//
// // Modern button components
// import { ModernPlayButton } from "./buttons/ModernPlayButton";
// import { ModernPauseButton } from "./buttons/ModernPauseButton";
// import { ModernStopButton } from "./buttons/ModernStopButton";
// import { ModernLoopButton } from "./buttons/ModernLoopButton";
// import { ModernDirectionButton } from "./buttons/ModernDirectionButton";
// import { ModernSpeedButton } from "./buttons/ModernSpeedButton";
// import { ModernFullscreenButton } from "./buttons/ModernFullscreenButton";
//
// // Modern other components
// import { ModernProgressBar } from "./ModernProgressBar/ModernProgressBar";
// import { ModernFramesIndicator } from "./ModernFramesIndicator";
//
// export type PlayerControlsProps = Pick<
//   UseLottieFactoryResult,
//   | "state"
//   | "totalFrames"
//   | "direction"
//   | "loop"
//   | "play"
//   | "pause"
//   | "stop"
//   | "seek"
//   | "changeDirection"
//   | "toggleLoop"
//   | "speed"
//   | "changeSpeed"
//   | "subscribe"
// > & {
//   show: boolean;
//   fullscreenElementRef?: RefObject<HTMLDivElement | null>;
//   elements?: PlayerControlsElement[];
//   compact?: boolean; // New optional prop for responsive design
// };
//
// /**
//  * Modern, YouTube-inspired PlayerControls component (v3 implementation)
//  *
//  * This component has been upgraded with:
//  * - Responsive design with smart element hiding
//  * - Better visual hierarchy and compact sizing
//  * - Improved touch targets and accessibility
//  * - Smooth animations and hover states
//  * - YouTube-inspired aesthetics
//  *
//  * All existing props are backwards compatible.
//  */
// export const PlayerControls: FC<PlayerControlsProps> = (props) => {
//   const {
//     fullscreenElementRef,
//     show,
//     elements,
//     compact = false,
//     state,
//     totalFrames,
//     direction,
//     loop,
//     play,
//     pause,
//     stop,
//     seek,
//     toggleLoop,
//     speed,
//     changeSpeed,
//     changeDirection,
//     subscribe,
//   } = props;
//
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const { isFullscreen, toggleFullscreen } = useFullscreen(fullscreenElementRef);
//
//   // Handle window resize for responsive behavior
//   useEffect(() => {
//     const handleResize = () => setScreenWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//
//   /**
//    * Checks if an element should be shown based on user preferences and responsive logic
//    */
//   const shouldShowElement = useCallback(
//     (element: PlayerControlsElement) => {
//       // If specific elements were specified, respect that preference
//       if (elements && Array.isArray(elements)) {
//         return elements.includes(element);
//       }
//
//       // Responsive logic for small screens
//       if (compact || screenWidth < PlayerControlsTheme.breakpoints.mobile) {
//         const hiddenOnMobile: PlayerControlsElement[] = [
//           PlayerControlsElement.FramesIndicator,
//           PlayerControlsElement.Stop,
//         ];
//
//         if (screenWidth < PlayerControlsTheme.breakpoints.mobile - 100) {
//           hiddenOnMobile.push(PlayerControlsElement.Direction);
//         }
//
//         return !hiddenOnMobile.includes(element);
//       }
//
//       // Show all elements on larger screens
//       return true;
//     },
//     [elements, compact, screenWidth],
//   );
//
//   /**
//    * Handle direction toggle
//    */
//   const handleDirectionClick = useCallback(() => {
//     changeDirection(
//       direction === Direction.Right ? Direction.Left : Direction.Right,
//     );
//   }, [direction, changeDirection]);
//
//   if (!show) {
//     return null;
//   }
//
//   const containerStyle: React.CSSProperties = {
//     position: 'relative', // Ensure proper stacking context
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: PlayerControlsTheme.sizes.controlsHeight,
//     padding: `0 ${PlayerControlsTheme.sizes.controlsPadding}px`,
//     backgroundColor: PlayerControlsTheme.colors.controlsBackground,
//     borderRadius: compact ? 0 : PlayerControlsTheme.sizes.borderRadius,
//     backdropFilter: 'blur(8px)',
//     gap: PlayerControlsTheme.sizes.gapMedium,
//     flexWrap: 'nowrap',
//     overflow: 'visible', // Allow dropdowns to extend outside
//     transition: `all ${PlayerControlsTheme.transitions.normal}`,
//     zIndex: 100, // Base z-index for controls
//   };
//
//   const progressContainerStyle: React.CSSProperties = {
//     flex: 1,
//     minWidth: 0, // Allow shrinking
//     display: 'flex',
//     alignItems: 'center',
//   };
//
//   const controlGroupStyle: React.CSSProperties = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: PlayerControlsTheme.sizes.gapSmall,
//   };
//
//   const dividerStyle: React.CSSProperties = {
//     width: 1,
//     height: 16,
//     backgroundColor: PlayerControlsTheme.colors.buttonIdle,
//     opacity: 0.3,
//   };
//
//   return (
//     <div style={containerStyle} role="toolbar" aria-label="Animation controls">
//       {/* Primary playback controls */}
//       <div style={controlGroupStyle}>
//         {shouldShowElement(PlayerControlsElement.Play) &&
//           state !== LottieState.Playing && (
//             <ModernPlayButton onClick={play} />
//           )}
//
//         {shouldShowElement(PlayerControlsElement.Pause) &&
//           state === LottieState.Playing && (
//             <ModernPauseButton onClick={pause} />
//           )}
//
//         {shouldShowElement(PlayerControlsElement.Stop) &&
//           state !== LottieState.Stopped && (
//             <ModernStopButton onClick={stop} />
//           )}
//       </div>
//
//       {/* Progress bar - always flexible */}
//       {shouldShowElement(PlayerControlsElement.ProgressBar) && (
//         <>
//           <div style={dividerStyle} />
//           <div style={progressContainerStyle}>
//             <ModernProgressBar
//               subscribe={subscribe}
//               totalFrames={totalFrames}
//               onChange={(progress, isDraggingEnded) => {
//                 seek(progress, !!isDraggingEnded);
//               }}
//             />
//           </div>
//           <div style={dividerStyle} />
//         </>
//       )}
//
//       {/* Secondary controls */}
//       <div style={controlGroupStyle}>
//         {shouldShowElement(PlayerControlsElement.FramesIndicator) && (
//           <ModernFramesIndicator
//             subscribe={subscribe}
//             totalFrames={totalFrames || 0}
//             decimals={0}
//             showTotal={!compact}
//           />
//         )}
//
//         {shouldShowElement(PlayerControlsElement.Loop) && (
//           <ModernLoopButton isOn={!!loop} onClick={toggleLoop} />
//         )}
//
//         {shouldShowElement(PlayerControlsElement.Direction) && (
//           <ModernDirectionButton
//             direction={direction}
//             onClick={handleDirectionClick}
//           />
//         )}
//
//         {shouldShowElement(PlayerControlsElement.PlaybackSpeed) && (
//           <ModernSpeedButton
//             speed={speed}
//             speeds={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]}
//             onClick={changeSpeed}
//           />
//         )}
//
//         {shouldShowElement(PlayerControlsElement.Fullscreen) && (
//           <ModernFullscreenButton
//             isFullscreen={isFullscreen}
//             onClick={() => toggleFullscreen?.()}
//           />
//         )}
//       </div>
//     </div>
//   );
// };
