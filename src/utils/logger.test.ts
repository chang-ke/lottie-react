import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createLogger } from "./logger";

describe("createLogger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when debug is false", () => {
    it("log does not call console.log", () => {
      createLogger(false).log("msg");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("warn does not call console.warn", () => {
      createLogger(false).warn("msg");
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("error does not call console.error", () => {
      createLogger(false).error("msg");
      expect(console.error).not.toHaveBeenCalled();
    });

    it("info does not call console.info", () => {
      createLogger(false).info("msg");
      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe("when debug is true", () => {
    it("log calls console.log with [lottie-react] prefix", () => {
      createLogger(true).log("hello");
      expect(console.log).toHaveBeenCalledWith("[lottie-react] hello");
    });

    it("warn calls console.warn with prefix", () => {
      createLogger(true).warn("bad");
      expect(console.warn).toHaveBeenCalledWith("[lottie-react] bad");
    });

    it("error calls console.error with prefix", () => {
      createLogger(true).error("oops");
      expect(console.error).toHaveBeenCalledWith("[lottie-react] oops");
    });

    it("info calls console.info with prefix", () => {
      createLogger(true).info("fyi");
      expect(console.info).toHaveBeenCalledWith("[lottie-react] fyi");
    });

    it("forwards extra arguments after the message", () => {
      createLogger(true).log("msg", { extra: 1 }, "more");
      expect(console.log).toHaveBeenCalledWith("[lottie-react] msg", { extra: 1 }, "more");
    });

    it("uses only the prefix when message is omitted", () => {
      createLogger(true).log();
      expect(console.log).toHaveBeenCalledWith("[lottie-react]");
    });
  });
});
