import { describe, expect, it, vi } from "vitest";

import { SubscriptionManager } from "./SubscriptionManager";

interface TestSubs {
  frame: (e: { currentFrame: number }) => void;
  ready: () => void;
}

describe("SubscriptionManager", () => {
  it("delivers the payload to a subscriber", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const handler = vi.fn();

    mgr.subscribe("frame", handler);
    mgr.notify("frame", { currentFrame: 42 });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ currentFrame: 42 });
  });

  it("returns an unsubscribe function that stops delivery", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const handler = vi.fn();

    const unsub = mgr.subscribe("frame", handler);
    unsub();
    mgr.notify("frame", { currentFrame: 1 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("unsubscribing one handler does not affect others on the same type", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const a = vi.fn();
    const b = vi.fn();

    const unsubA = mgr.subscribe("frame", a);
    mgr.subscribe("frame", b);
    unsubA();
    mgr.notify("frame", { currentFrame: 5 });

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledOnce();
  });

  it("calls all handlers registered for a type", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const a = vi.fn();
    const b = vi.fn();

    mgr.subscribe("frame", a);
    mgr.subscribe("frame", b);
    mgr.notify("frame", { currentFrame: 10 });

    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it("notify for an unregistered type is a no-op", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    expect(() => { mgr.notify("ready", undefined); }).not.toThrow();
  });

  it("does not call a handler registered for a different type", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const handler = vi.fn();

    mgr.subscribe("ready", handler);
    mgr.notify("frame", { currentFrame: 1 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("addSubscriptions registers multiple handlers at once", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const frameHandler = vi.fn();
    const readyHandler = vi.fn();

    mgr.addSubscriptions({ frame: frameHandler, ready: readyHandler });
    mgr.notify("frame", { currentFrame: 1 });
    mgr.notify("ready", undefined);

    expect(frameHandler).toHaveBeenCalledOnce();
    expect(readyHandler).toHaveBeenCalledOnce();
  });

  it("addSubscriptions returns a composite unsubscribe that removes all", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const frameHandler = vi.fn();
    const readyHandler = vi.fn();

    const unsub = mgr.addSubscriptions({ frame: frameHandler, ready: readyHandler });
    unsub();
    mgr.notify("frame", { currentFrame: 1 });
    mgr.notify("ready", undefined);

    expect(frameHandler).not.toHaveBeenCalled();
    expect(readyHandler).not.toHaveBeenCalled();
  });

  it("addSubscriptions(undefined) returns a no-op unsubscribe", () => {
    const mgr = new SubscriptionManager<TestSubs>();
    const unsub = mgr.addSubscriptions(undefined);
    expect(() => { unsub(); }).not.toThrow();
  });
});
