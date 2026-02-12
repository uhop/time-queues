/**
 * Suspends the execution for a specified time.
 *
 * @param ms The time to suspend the execution for, in milliseconds or a Date as an absolute time.
 * @returns A promise that resolves after the specified time.
 */
export declare function sleep(ms: number | Date): Promise<void>;

export default sleep;
