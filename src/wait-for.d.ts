/**
 * Options for {@link waitFor}.
 */
export interface WaitForOptions {
  /**
   * Rejects the wait with an `Error` after this many milliseconds.
   * No timeout when omitted.
   */
  timeout?: number;
  /**
   * The polling period in milliseconds. Default: `50`.
   */
  interval?: number;
  /**
   * An abort signal: rejects the wait with `signal.reason` when aborted.
   */
  signal?: AbortSignal;
}

/**
 * Polls a predicate until it returns a truthy value.
 *
 * The predicate can be synchronous or asynchronous. It is called immediately,
 * then every `interval` milliseconds after the previous check settles, until
 * the result is truthy. A thrown exception (or a rejected promise) rejects
 * the wait with that error.
 *
 * @param predicate The condition to poll. May return a promise.
 * @param options Timeout, polling interval, and abort signal.
 * @returns A promise that resolves with the first truthy predicate result.
 */
export declare function waitFor<T>(
  predicate: () => T | Promise<T>,
  options?: WaitForOptions
): Promise<T>;

export default waitFor;
