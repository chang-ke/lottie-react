import { vi } from "vitest";

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

/**
 * Minimal IntersectionObserver mock for jsdom environments.
 * Call `MockIntersectionObserver.getLast()` to get the latest instance,
 * then `instance.trigger(el, isIntersecting)` to simulate viewport changes.
 */
export class MockIntersectionObserver {
  private static _instances: MockIntersectionObserver[] = [];

  static getLast(): MockIntersectionObserver | undefined {
    return MockIntersectionObserver._instances.at(-1);
  }

  static getLastOrFail(): MockIntersectionObserver {
    const instance = MockIntersectionObserver._instances.at(-1);
    if (!instance)
      throw new Error("No MockIntersectionObserver instances created");
    return instance;
  }

  static reset() {
    MockIntersectionObserver._instances = [];
  }

  readonly callback: IOCallback;
  readonly observed = new Set<Element>();
  readonly observe = vi.fn((el: Element) => {
    this.observed.add(el);
  });
  readonly unobserve = vi.fn((el: Element) => {
    this.observed.delete(el);
  });
  readonly disconnect = vi.fn(() => {
    this.observed.clear();
  });
  readonly takeRecords = vi.fn(() => []);

  constructor(callback: IOCallback) {
    this.callback = callback;
    MockIntersectionObserver._instances.push(this);
  }

  trigger(el: Element, isIntersecting: boolean) {
    this.callback([
      { target: el, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 },
    ]);
  }
}
