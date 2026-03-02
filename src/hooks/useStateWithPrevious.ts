import { useEffect, useLayoutEffect, useReducer, useRef } from "react";

export interface UseStateWithPrevious<State = unknown> {
  initialState: State;
  onChange?: (previousState: undefined | State, newState: State) => void;
}

/**
 * Hook that tracks state and remembers the previous value.
 *
 * Previous state is captured atomically in the reducer, so reading
 * `previousState` during render is always safe — no ref access needed.
 *
 * `onChange` is held in a ref so callers can pass inline callbacks without
 * causing spurious effect fires on every render.
 */
const useStateWithPrevious = <State = unknown>(
  options: UseStateWithPrevious<State>,
) => {
  const { initialState, onChange } = options;

  const [{ state, previousState }, dispatch] = useReducer(
    (
      prev: { state: State; previousState: State | undefined },
      action: State | ((prevState: State) => State),
    ) => {
      const newState =
        typeof action === "function"
          ? (action as (prevState: State) => State)(prev.state)
          : action;
      // Match useState bail-out semantics: returning the same object reference
      // tells React there is nothing to re-render.
      if (Object.is(newState, prev.state)) return prev;
      return { state: newState, previousState: prev.state };
    },
    undefined,
    () => ({ state: initialState, previousState: undefined }),
  );

  // Keep the latest onChange in a ref so the effect below only re-runs when
  // state changes — not whenever the caller passes a new inline callback.
  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    onChangeRef.current?.(previousState, state);
  }, [state, previousState]);

  return {
    previousState,
    state,
    setState: dispatch,
  };
};

export default useStateWithPrevious;
