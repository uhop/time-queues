/**
 * A counter that can be used to track the number of pending tasks.
 */
export declare class Counter {
  /**
   * The current count.
   */
  count: number;

  /**
   * Creates a new counter.
   * @param initial The initial count. Default: 0
   */
  constructor(initial?: number);

  /**
   * Gets the current value of the counter.
   */
  get value(): number;

  /**
   * Sets the counter to a specific value.
   * @param value The new value for the counter.
   */
  set value(value: number);

  /**
   * Increments the counter.
   */
  increment(): void;

  /**
   * Decrements the counter.
   */
  decrement(): void;

  /**
   * Advances the counter by a given amount.
   * @param amount The amount to advance. Default: 1
   */
  advance(amount?: number): void;

  /**
   * Waits for the counter to reach zero. If the counter is already zero, the promise is resolved immediately.
   * Resolves with `0` on a normal wait, or with `NaN` if `clearWaiters()` is called before the counter reaches zero.
   * @returns A promise that resolves when the counter reaches zero.
   */
  waitForZero(): Promise<number>;

  /**
   * Waits for the counter to reach a specific value. If the counter is already at the desired value, the promise is resolved immediately.
   * Resolves with the matching count, or with `NaN` if `clearWaiters()` is called before the predicate matches.
   * @param fn A function that returns `true` when the counter reaches the desired value.
   * @returns A promise that resolves when the counter reaches the desired value.
   */
  waitFor(fn: (count: number) => boolean): Promise<number>;

  /**
   * Clears all pending waiters by resolving them with `NaN`.
   * Use `Number.isNaN(value)` to distinguish "queue cleared" from a real count of zero.
   * Most consumers `await` the result without inspecting it; checking is only needed
   * when you both clear waiters during teardown and have downstream arithmetic that
   * shouldn't be NaN-poisoned.
   */
  clearWaiters(): void;
}

export default Counter;
