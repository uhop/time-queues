/**
 * A microtask that will be executed when scheduled.
 */
export declare class MicroTask {
  /**
   * The function to execute when the microtask is scheduled.
   */
  fn: (...args: any[]) => unknown;

  /**
   * Whether the microtask has been canceled.
   */
  isCanceled: boolean;

  /**
   * Creates a new microtask.
   * @param fn The function to execute when the microtask is scheduled.
   */
  constructor(fn: (...args: any[]) => unknown);

  /**
   * Makes a promise that will be resolved when the microtask is executed.
   * @returns The microtask.
   */
  makePromise(): this;

  /**
   * The promise that could be resolved when the microtask is executed.
   * This is a queue-specific promise. It may be created when there is an associated asynchronous task.
   * If the microtask is canceled, the promise will be rejected with a CancelTaskError.
   */
  get promise(): Promise<unknown> | null;

  /**
   * Whether the microtask has been settled (resolved or canceled).
   */
  get settled(): boolean;

  /**
   * Resolves the microtask. The promise must already exist — call `makePromise()`
   * first, or invoke this only from inside a `schedule()`-wrapped callback (which
   * makes the promise eagerly).
   * @param value The value to resolve the microtask with.
   * @returns The microtask.
   * @throws If `makePromise()` has not been called — without a promise to resolve,
   *   the value would be silently dropped, which previously caused subscribers to
   *   hang on `task.makePromise().promise` calls made afterwards.
   */
  resolve(value: unknown): this;

  /**
   * Cancels the microtask. Always sets `isCanceled = true` so queues skip the task.
   * Additionally rejects the promise with a `CancelTaskError` if `makePromise()`
   * has been called.
   * Note: when called pre-`makePromise()`, the optional `error` argument is dropped
   * (no promise rejection to attach `cause` to). Pass `error` only after the
   * promise has been created if you need it preserved.
   * It can be overridden in subclasses.
   * @param error The optional error to use as the cause of the cancellation.
   * @returns The microtask.
   */
  cancel(error?: Error): this;
}

export default MicroTask;
