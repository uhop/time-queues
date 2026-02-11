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
  set value(value: number): void;

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
   * @returns A promise that resolves when the counter reaches zero.
   */
  waitForZero(): Promise<number>;

  /**
   * Waits for the counter to reach a specific value. If the counter is already at the desired value, the promise is resolved immediately.
   * @param fn A function that returns `true` when the counter reaches the desired value.
   * @returns A promise that resolves when the counter reaches the desired value.
   */
  waitFor(fn: (count: number) => boolean): Promise<number>;

  /**
   * Clears all waiters.
   */
  clearWaiters(): void;
}

export default Counter;
