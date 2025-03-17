/**
 * Audits a function by ensuring it is not called more often than the specified interval.
 * The first call starts a timeout. At the end of the timeout, the last seen arguments are passed to the function.
 * This function is similar to `throttle()`, but the last seen arguments are passed to the function.
 *
 * @param fn The function to audit.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns An audited version of the function.
 */
export declare function audit(
  fn: (...args: unknown[]) => void,
  ms: number
): (...args: unknown[]) => void;

export default audit;
