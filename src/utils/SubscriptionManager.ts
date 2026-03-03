/**
 * Lightweight typed event emitter used internally by the animation factory.
 *
 * Design rationale:
 * - Avoids the Node.js `events` polyfill (~13 KB in browser bundles)
 * - Preserves full TypeScript type safety at every call site
 * - Subscriptions is a record where each key maps to a typed event handler,
 *   e.g. `{ frame: (e: { currentFrame: number }) => void }`
 *
 * Internals use `as unknown as` casts to store heterogeneous handlers in a
 * uniform Map — type safety is enforced at the public API boundaries.
 */

type AnyHandler = (payload: unknown) => void;

export class SubscriptionManager<Subscriptions> {
  private readonly listeners = new Map<string, Set<AnyHandler>>();

  /**
   * Subscribe to a single event type.
   * Returns an unsubscribe function.
   */
  public subscribe = <Type extends keyof Subscriptions>(
    type: Type,
    handler: Subscriptions[Type],
  ): (() => void) => {
    const key = String(type);
    let set = this.listeners.get(key);
    if (!set) {
      set = new Set<AnyHandler>();
      this.listeners.set(key, set);
    }
    // Store as a uniform AnyHandler; type safety is at the subscribe/notify
    // call sites through the Subscriptions generic.
    const stored = handler as unknown as AnyHandler;
    set.add(stored);

    return () => {
      this.listeners.get(key)?.delete(stored);
    };
  };

  /**
   * Subscribe to multiple event types at once.
   * Returns a single unsubscribe function that removes all of them.
   */
  public addSubscriptions = (
    subscriptions?: Partial<Subscriptions>,
  ): (() => void) => {
    if (!subscriptions) return () => undefined;

    const unsubscribers: (() => void)[] = [];

    for (const key in subscriptions) {
      const handler = subscriptions[key as keyof Subscriptions];
      if (handler !== undefined) {
        unsubscribers.push(this.subscribe(key as keyof Subscriptions, handler));
      }
    }

    return () => {
      unsubscribers.forEach((fn) => {
        fn();
      });
    };
  };

  /**
   * Emit an event to all current subscribers.
   */
  public notify = <Type extends keyof Subscriptions>(
    type: Type,
    payload: Subscriptions[Type] extends (arg: infer P) => void ? P : never,
  ): void => {
    this.listeners.get(String(type))?.forEach((handler) => {
      handler(payload as unknown);
    });
  };
}
