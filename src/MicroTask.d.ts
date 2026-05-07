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
   * Creates the promise lazily. Idempotent — subsequent calls return `this`
   * without changing state. If the task was already canceled (via `cancel()`
   * before `makePromise()` ran), the freshly-created promise is settled
   * immediately as a `CancelTaskError` rejection, carrying any `cancelError`
   * stored from the earlier `cancel()` call as `cause`.
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
   * The error supplied to the first `cancel(error)` call, or `null` if the task
   * has not been canceled with a reason. Useful for inspecting why a non-promised
   * task was canceled (when there is no rejection to carry the cause).
   */
  get cancelError(): Error | null;

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
   * The first `error` passed is stored on the instance and accessible via
   * `cancelError`. If `cancel(error)` runs before `makePromise()`, the stored
   * error is replayed when the promise is later created — `makePromise()` will
   * settle the fresh promise with `CancelTaskError(cause: error)` immediately.
   * It can be overridden in subclasses.
   * @param error The optional error to use as the cause of the cancellation.
   * @returns The microtask.
   */
  cancel(error?: Error): this;
}

export default MicroTask;
