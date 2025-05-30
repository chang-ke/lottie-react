/**
 * Keep the state of the logger
 */
import isFunction from "./isFunction";

let isLoggerActive = true;

/**
 * Set if the logs should appear or not
 * @param isActive
 */
export const setLogger = (isActive: boolean) => {
  isLoggerActive = isActive;
};

/**
 * Prefix a message with a custom message
 * @param message
 */
const prefixMessage = (message?: string) =>
  `[lottie-react]${message !== undefined ? ` ${message}` : ""}`;

/**
 * Method to wrap console's log methods
 * @param isEnabled
 * @param method
 */
const customLogger =
  (isEnabled: boolean, method: typeof console.log) =>
  (message?: string, ...optionalParams: unknown[]) => {
    if (isEnabled && isFunction(method)) {
      method(prefixMessage(message), ...optionalParams);
    }
  };

/**
 * Custom Logger
 */
const logger = {
  log: customLogger(isLoggerActive, console.log),

  error: customLogger(isLoggerActive, console.error),

  warn: customLogger(isLoggerActive, console.warn),

  info: customLogger(isLoggerActive, console.info),
};

export default logger;
