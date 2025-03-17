/**
 * Throttles a function by ensuring it is not called more often than the specified interval.
 * The first call calls the function and starts a timeout. Until the timeout expires, any subsequent calls are ignored.
 * This function is similar to `audit()`, but the first seen arguments are passed to the function.
 *
 * @param fn The function to throttle.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns A throttled version of the function.
 */
export declare function throttle(
  fn: (...args: unknown[]) => void,
  ms: number
): (...args: unknown[]) => void;

export default throttle;
