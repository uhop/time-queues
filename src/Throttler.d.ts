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
 * A throttler that throttles the execution of tasks based on a key.
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
  constructor({
    throttleTimeout = 1_000,
    neverSeenTimeout = 0,
    vacuumPeriod = throttleTimeout * 3
  }: ThrottlerOptions = {});

  /**
   * Retrieves the last seen time for a key as a timestamp in milliseconds.
   * @param key The key to retrieve the last seen time for.
   * @returns The last seen time for the key or `0` if the key has never been seen.
   */
  getLastSeen(key: unknown): number;

  /**
   * Retrieves the delay for a key.
   * @param key The key to retrieve the delay for.
   * @returns The delay for the key in milliseconds.
   */
  getDelay(key: unknown): number;

  /**
   * Waits for a key to be available.
   * @param key The key to wait for.
   * @returns A promise that resolves when the key is available.
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
