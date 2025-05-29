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
 * @param method
 */
const customLogger =
  (method: typeof console.log) =>
  (message?: string, ...optionalParams: unknown[]) => {
    isLoggerActive &&
      isFunction(method) &&
      method(prefixMessage(message), ...optionalParams);
  };

/**
 * Custom Logger
 */
const logger = {
  log: customLogger(console.log),

  error: customLogger(console.error),

  warn: customLogger(console.warn),

  info: customLogger(console.info),
};

export default logger;
