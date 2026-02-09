/**
 * A microtask that will be executed when scheduled.
 */
export declare class MicroTask {
  /**
   * The function to execute when the microtask is scheduled.
   */
  fn: () => unknown;

  /**
   * Whether the microtask has been canceled.
   */
  isCanceled: boolean;

  /**
   * Creates a new microtask.
   * @param fn The function to execute when the microtask is scheduled.
   */
  constructor(fn: () => unknown);

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
   * Resolves the microtask, if a promise is created.
   * @param value The value to resolve the microtask with.
   * @returns The microtask.
   */
  resolve(value: unknown): this;

  /**
   * Cancels the microtask, if a promise is created.
   * If the microtask is canceled, the promise will be rejected with a CancelTaskError.
   * It can be overridden in subclasses.
   * @param error The optional error to use as the cause of the cancellation.
   * @returns The microtask.
   */
  cancel(error?: Error): this;
}

export default MicroTask;
