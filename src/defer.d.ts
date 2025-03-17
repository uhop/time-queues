/**
 * Delays the execution of a function until the next available time.
 * It will use available system functions in the following order:
 * - `requestIdleCallback()`
 * - `setImmediate()`
 * - `setTimeout()`
 *
 * @param fn The function to delay.
 * @returns A function that, when called, will execute the provided function.
 */
export declare function defer(fn: () => void): () => void;

export default defer;
