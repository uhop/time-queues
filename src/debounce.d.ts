/**
 * Debounces a function by using the last seen arguments after the specified time interval.
 * Every call to the debounced function will reset the timeout.
 *
 * @param fn The function to debounce.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns A debounced version of the function.
 */
export declare function debounce(
  fn: (...args: unknown[]) => void,
  ms: number
): (...args: unknown[]) => void;

export default debounce;
