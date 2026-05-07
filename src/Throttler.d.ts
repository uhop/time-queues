/**
 * Options for the throttler.
 */
export declare type ThrottlerOptions = {
  /**
   * The throttle timeout.
   */
  throttleTimeout?: number;
  /**
   * The timeout for keys that have never been seen.
   */
  neverSeenTimeout?: number;
  /**
   * The vacuum period.
   */
  vacuumPeriod?: number;
};

/**
 * A throttler that paces the execution of work based on a key.
 *
 * Despite the name, this is **rate-limiting / pacing**, not classical
 * "drop excess" throttle. `Throttler` does not execute functions; it
 * exposes `wait(key)` and the caller decides what to do once awaited.
 * Because there is nothing for `Throttler` to drop, every call is honored
 * — N rapid calls produce delays roughly `0, throttleTimeout,
 * 2*throttleTimeout, …`, spacing the work out across time. Use it when
 * you need every operation to run but no faster than `throttleTimeout`
 * apart per key.
 *
 * If you want React/Lodash-style "fire-leading-edge-only-then-drop"
 * semantics, wrap your callback with `throttle()` from this package
 * instead.
 */
export declare class Throttler implements ThrottlerOptions {
  /**
   * The throttle timeout.
   */
  throttleTimeout: number;

  /**
   * The timeout for keys that have never been seen.
   */
  neverSeenTimeout: number;

  /**
   * The vacuum period.
   */
  vacuumPeriod: number;

  /**
   * The last seen times for keys.
   */
  lastSeen: Map<unknown, number>;

  /**
   * Creates a new throttler.
   * @param options The options for the throttler.
   */
  constructor(options?: ThrottlerOptions);

  /**
   * Retrieves the last seen time for a key as a timestamp in milliseconds.
   * @param key The key to retrieve the last seen time for.
   * @returns The last seen time for the key or `0` if the key has never been seen.
   */
  getLastSeen(key: unknown): number;

  /**
   * Retrieves the delay for a key and reserves the next slot.
   * Each call extends the per-key queue: stored state advances by the returned
   * delay, so the next call for the same key waits at least `throttleTimeout`
   * past the slot just allocated. Returns the delay in milliseconds.
   * @param key The key to retrieve the delay for.
   * @returns The delay before this caller's slot opens, in milliseconds.
   */
  getDelay(key: unknown): number;

  /**
   * Waits until this caller's slot for `key` opens. See class docs for the
   * pacing semantics — every call is queued, none are dropped.
   * @param key The key to wait for.
   * @returns A promise that resolves when the slot is available.
   */
  wait(key: unknown): Promise<void>;

  /**
   * Removes expired keys from the last seen map.
   */
  vacuum(): void;

  /**
   * Retrieves the vacuuming state.
   * @returns `true` if the vacuuming is active, `false` otherwise.
   */
  get isVacuuming(): boolean;

  /**
   * Starts the vacuum process.
   * The vacuum process removes expired keys.
   * @returns The throttler object.
   */
  startVacuum(): this;

  /**
   * Stops the vacuum process.
   * The vacuum process removes expired keys.
   * @returns The throttler object.
   */
  stopVacuum(): this;
}

export default Throttler;
