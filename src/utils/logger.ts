import isFunction from "./isFunction";

const prefix = "[lottie-react]";

const noop = () => undefined;

const makeMethod =
  (active: boolean, consoleFn: typeof console.log) =>
  (message?: string, ...rest: unknown[]) => {
    if (active && isFunction(consoleFn)) {
      consoleFn(
        `${prefix}${message !== undefined ? ` ${message}` : ""}`,
        ...rest,
      );
    }
  };

/**
 * Creates a scoped logger for the animation instance.
 * Logging is disabled by default and only active when `debug: true` is passed.
 */
export const createLogger = (debug = false) => ({
  log: debug ? makeMethod(true, console.log) : noop,
  warn: debug ? makeMethod(true, console.warn) : noop,
  error: debug ? makeMethod(true, console.error) : noop,
  info: debug ? makeMethod(true, console.info) : noop,
});

export type Logger = ReturnType<typeof createLogger>;
