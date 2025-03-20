/**
 * Debounces a function by using the last seen arguments after the specified time interval.
 * Every call to the debounced function will reset the timeout.
 *
 * @param fn The function to debounce.
 * @param ms The minimum time interval between function calls, in milliseconds.
 * @returns A debounced version of the function.
 */
export declare function debounce<T extends (...args: any[]) => void>  (
  fn: T,
  ms: number
): (...args: Parameters<T>) => void;

export default debounce;
