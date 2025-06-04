import "./ModernProgressBar.less";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
} from "react";

import { UseLottieFactoryResult, LottieSubscription } from "../../../@types";
import isFunction from "../../../utils/isFunction";

export type ModernProgressBarProps = Pick<
  UseLottieFactoryResult,
  "totalFrames" | "subscribe"
> & {
  disabled?: boolean;
  onChange?: (progress: number, isDraggingEnded?: boolean) => void;
};

/**
 * Modern Progress Bar component - exact copy of original PlayerControlsProgressBar
 * with only updated styling. All positioning and functionality logic is identical.
 */
export const ModernProgressBar = (props: ModernProgressBarProps) => {
  const containerRef = useRef<HTMLInputElement>(null);
  const { totalFrames, subscribe, disabled, onChange } = props;
  const isListeningForChanges = isFunction(onChange);

  /**
   * Listen for event regarding the `currentFrame`
   */
  useEffect(() => {
    return subscribe(LottieSubscription.Frame, ({ currentFrame }) => {
      if (containerRef.current) {
        // Update the `value` of the input range
        containerRef.current.value = String(currentFrame);
        // Set the `--value` CSS value so the styling can adapt
        containerRef.current.style.setProperty("--value", String(currentFrame));
      }
    });
  }, [subscribe]);

  /**
   * Handle any changes of the progress bar
   * @param event
   */
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFrame = Number(event.target.value);

    if (isListeningForChanges) {
      onChange(newFrame);
    }
  };

  /**
   * Handle mouse up on the progress bar
   */
  const onMouseUpHandler: MouseEventHandler<HTMLInputElement> = () => {
    if (isListeningForChanges && containerRef.current) {
      onChange(Number(containerRef.current.value), true);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <input
        ref={containerRef}
        disabled={disabled ?? !totalFrames}
        className={"modern-progress-bar"}
        type="range"
        style={{
          /**
           * Set the current progress percentage as a CSS var, so it can be used in the style
           * to properly customize the input range styling across browsers
           *
           * Source: https://toughengineer.github.io/demo/slider-styler/slider-styler.html
           */
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          "--min": 0,
          "--max": totalFrames,
          // "--value": 0,
        }}
        onChange={onChangeHandler}
        onMouseUp={onMouseUpHandler}
        min={0}
        max={totalFrames}
        step={0.001}
      />
    </div>
  );
};