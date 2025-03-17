/**
 * Options for the throttler.
 */
export declare type ThrottlerOptions = {
  /**
   * The throttling timeout.
   */
  throttlingTimeout: number;
  /**
   * The timeout for keys that have never been seen.
   */
  neverSeenTimeout: number;
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
   * Creates a new throttler.
   * @param options The options for the throttler.
   */
  constructor({
    throttlingTimeout = 1_000,
    neverSeenTimeout = 0,
    vacuumPeriod = throttlingTimeout * 3
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
   * Starts the vacuum process.
   * The vacuum process removes keys that expired.
   * @returns The throttler object.
   */
  startVacuum(): this;

  /**
   * Stops the vacuum process.
   * The vacuum process removes keys that expired.
   * @returns The throttler object.
   */
  stopVacuum(): this;
}
