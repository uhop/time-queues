/**
 * Samples a function by ensuring it is not called more often than the specified interval.
 * The last seen arguments are passed to the function after the specified time interval.
 * Unlike `audit()`, intervals are not reset by the function calls and never stops.
 * If no call was made to the sampled function within the specified time interval,
 * no calls are made after the specified time interval.
 *
 * @param fn The function to sample.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns A sampled version of the function.
 */
export declare function sample(
  fn: (...args: unknown[]) => void,
  ms: number
): (...args: unknown[]) => void;

export default sample;
