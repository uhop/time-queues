/**
 * Delays the execution of a function until the next available time.
 * It will use available system functions in the following order:
 * - `requestIdleCallback()`
 * - `setImmediate()`
 * - `setTimeout()`
 *
 * @param fn The function to delay.
 */
export declare function defer(fn: () => void): void;

/**
 * Schedules a function to be called at the next available time.
 *
 * @param fn The function to schedule.
 * @returns A promise that resolves when the function is called.
 */
export declare function scheduleDefer<R extends unknown>(fn: () => R): Promise<Awaited<R>>;

/**
 * Schedules a function to be called at the next available time.
 *
 * @param fn The function to schedule.
 * @returns A promise that resolves when the function is called.
 */
export declare function scheduleDefer(fn: null | undefined): Promise<void>;

export default defer;
