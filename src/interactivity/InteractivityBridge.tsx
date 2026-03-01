import { InteractivityConfig, InteractivityTarget } from "./types";
import { useLottieInteractivity } from "./useLottieInteractivity";

interface InteractivityBridgeProps {
  target: InteractivityTarget;
  config: InteractivityConfig;
}

/**
 * Null-rendering bridge that calls useLottieInteractivity inside the HOC.
 *
 * Rendering conditionally means bundlers can tree-shake the entire
 * interactivity module when the `interactivity` prop is never used.
 */
export const InteractivityBridge = ({
  target,
  config,
}: InteractivityBridgeProps): null => {
  useLottieInteractivity(target, config);
  return null;
};
