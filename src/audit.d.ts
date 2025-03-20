/**
 * Audits a function by ensuring it is not called more often than the specified interval.
 * The first call starts a timeout. At the end of the timeout, the last seen arguments are passed to the function.
 * This function is similar to `throttle()`, but the last seen arguments are passed to the function.
 *
 * @param fn The function to audit.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns An audited version of the function.
 */
export declare function audit<T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void;

export default audit;
