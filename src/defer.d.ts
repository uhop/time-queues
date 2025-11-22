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
export declare function defer<A extends unknown[]>(fn: (...args: A) => void): (...args: A) => void;

/**
 * Schedules a function to be called when the next available time.
 *
 * @param fn The function to schedule.
 * @returns A promise that resolves when the function is called.
 */
export declare function scheduleDefer<R extends unknown>(fn: () => R): Promise<Awaited<R>>;

/**
 * Schedules a function to be called when the next available time.
 *
 * @param fn The function to schedule.
 * @returns A promise that resolves when the function is called.
 */
export declare function scheduleDefer(fn: null | undefined): Promise<void>;

export default defer;
